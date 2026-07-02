const crypto = require("crypto");
const { db, FieldValue } = require("./lib/firebase");
const { handler, json, parseJsonBody, requireAdmin, requireMethod } = require("./lib/http");

const CHUNK_SIZE = 700000;

function chunkText(text) {
  const chunks = [];
  for (let index = 0; index < text.length; index += CHUNK_SIZE) {
    chunks.push(text.slice(index, index + CHUNK_SIZE));
  }
  return chunks.length ? chunks : [""];
}

exports.handler = handler(async (event) => {
  const method = requireMethod(event, "POST");
  if (method) return method;

  const admin = requireAdmin(event);
  if (!admin.ok) return admin.response;

  const body = parseJsonBody(event);
  const moduleId = String(body.moduleId || "").trim();
  const title = String(body.title || "").trim();
  const jsx = String(body.jsx || "");
  const slot = Number(body.slot || 1);
  const order = Number(body.order || 1);
  const active = body.active !== false;

  if (!/^[a-zA-Z0-9_-]{3,80}$/.test(moduleId)) {
    return json(400, { ok: false, reason: "invalid_module_id" });
  }
  if (!title || !jsx.trim()) {
    return json(400, { ok: false, reason: "missing_title_or_jsx" });
  }

  const chunks = chunkText(jsx);
  const firestore = db();
  const moduleRef = firestore.collection("modules").doc(moduleId);
  const existingChunks = await moduleRef.collection("chunks").get();
  const batch = firestore.batch();

  existingChunks.forEach((doc) => batch.delete(doc.ref));
  chunks.forEach((chunk, index) => {
    batch.set(moduleRef.collection("chunks").doc(String(index).padStart(4, "0")), {
      index,
      jsx: chunk,
      updatedAt: FieldValue.serverTimestamp()
    });
  });

  batch.set(moduleRef, {
    title,
    slot,
    order,
    active,
    chunkCount: chunks.length,
    contentHash: crypto.createHash("sha256").update(jsx).digest("hex"),
    updatedAt: FieldValue.serverTimestamp(),
    createdAt: FieldValue.serverTimestamp()
  }, { merge: true });

  await batch.commit();
  return json(200, { ok: true, moduleId, chunkCount: chunks.length });
});
