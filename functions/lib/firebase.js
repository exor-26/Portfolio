const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");

let app;
let firestore;

function readServiceAccount() {
  const encoded = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  if (encoded) {
    return JSON.parse(Buffer.from(encoded, "base64").toString("utf8"));
  }

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (raw) {
    return JSON.parse(raw);
  }

  return null;
}

function getApp() {
  if (app) {
    return app;
  }

  if (admin.apps.length) {
    app = admin.app();
    return app;
  }

  const serviceAccount = readServiceAccount();
  if (serviceAccount) {
    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id
    });
    return app;
  }

  app = admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID
  });
  return app;
}

function db() {
  if (firestore) {
    return firestore;
  }
  const databaseId = process.env.FIRESTORE_DATABASE_ID;
  firestore = databaseId ? getFirestore(getApp(), databaseId) : getFirestore(getApp());
  return firestore;
}

module.exports = {
  FieldValue: admin.firestore.FieldValue,
  Timestamp: admin.firestore.Timestamp,
  db,
  getApp
};
