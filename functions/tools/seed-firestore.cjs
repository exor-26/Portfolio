const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");

const CHUNK_SIZE = 700000;

function readJson(filePath) {
  if (filePath.endsWith(".cjs") || filePath.endsWith(".js")) {
    delete require.cache[require.resolve(filePath)];
    return require(filePath);
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function init(serviceAccountPath) {
  if (admin.apps.length) {
    return admin.firestore();
  }

  const encoded = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  const serviceAccount = serviceAccountPath
    ? readJson(serviceAccountPath)
    : encoded
      ? JSON.parse(Buffer.from(encoded, "base64").toString("utf8"))
      : raw
        ? JSON.parse(raw)
        : null;

  if (!serviceAccount) {
    throw new Error("Provide a service account path as arg 2 or set FIREBASE_SERVICE_ACCOUNT_BASE64.");
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id
  });

  return process.env.FIRESTORE_DATABASE_ID
    ? getFirestore(admin.app(), process.env.FIRESTORE_DATABASE_ID)
    : getFirestore(admin.app());
}

function chunkText(text) {
  const chunks = [];
  for (let index = 0; index < text.length; index += CHUNK_SIZE) {
    chunks.push(text.slice(index, index + CHUNK_SIZE));
  }
  return chunks.length ? chunks : [""];
}

async function upsertModule(db, module) {
  const moduleRef = db.collection("modules").doc(module.moduleId);
  const oldChunks = await moduleRef.collection("chunks").get();
  const batch = db.batch();
  oldChunks.forEach((doc) => batch.delete(doc.ref));

  const chunks = chunkText(module.jsx);
  chunks.forEach((chunk, index) => {
    batch.set(moduleRef.collection("chunks").doc(String(index).padStart(4, "0")), {
      index,
      jsx: chunk,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });

  batch.set(moduleRef, {
    title: module.title,
    slot: Number(module.slot || 1),
    order: Number(module.order || 1),
    active: module.active !== false,
    chunkCount: chunks.length,
    contentHash: crypto.createHash("sha256").update(module.jsx).digest("hex"),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });

  await batch.commit();
  console.log(`module ${module.moduleId}: ${chunks.length} chunk(s)`);
}

async function createUser(db, user) {
  const ref = db.collection("users").doc(user.userId);
  const existing = await ref.get();
  if (existing.exists) {
    console.log(`user ${user.userId}: exists, skipped`);
    return;
  }
  const passwordHash = await bcrypt.hash(user.password, 12);
  await ref.set({
    displayName: user.displayName || user.userId,
    passwordHash,
    deviceFingerprint: null,
    banned: false,
    banReason: null,
    suspended: false,
    suspendedReason: null,
    termsAcceptedAt: null,
    termsAcceptedIpHash: null,
    anomalyScore: 0,
    devtoolsWarnings: 0,
    unlockedSlot: Number(user.unlockedSlot || 1),
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
  console.log(`user ${user.userId}: created`);
}

async function main() {
  const dataPath = process.argv[2]
    ? path.resolve(process.argv[2])
    : path.resolve(__dirname, "..", "..", "scripts", "sample-course-data.json");
  const servicePath = process.argv[3] ? path.resolve(process.argv[3]) : null;
  const data = readJson(dataPath);
  const db = init(servicePath);

  for (const module of data.modules || []) {
    await upsertModule(db, module);
  }
  for (const user of data.users || []) {
    await createUser(db, user);
  }
}

main()
  .then(() => {
    console.log("seed complete");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
