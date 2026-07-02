const { db } = require("./lib/firebase");
const { handler, json, requireAdmin } = require("./lib/http");
const { publicUser } = require("./lib/security");

exports.handler = handler(async (event) => {
  if (event.httpMethod !== "GET" && event.httpMethod !== "POST") {
    return json(405, { ok: false, reason: "method_not_allowed" });
  }

  const admin = requireAdmin(event);
  if (!admin.ok) return admin.response;

  const snapshot = await db().collection("users").orderBy("createdAt", "desc").limit(200).get();
  const users = snapshot.docs.map((doc) => publicUser(doc.id, doc.data()));
  return json(200, { ok: true, users });
});
