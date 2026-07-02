const bcrypt = require("bcryptjs");
const { db, FieldValue } = require("./lib/firebase");
const { handler, json, parseJsonBody, requireAdmin, requireMethod } = require("./lib/http");

exports.handler = handler(async (event) => {
  const method = requireMethod(event, "POST");
  if (method) return method;

  const admin = requireAdmin(event);
  if (!admin.ok) return admin.response;

  const body = parseJsonBody(event);
  const userId = String(body.userId || "").trim();
  const password = String(body.password || "");
  const displayName = String(body.displayName || userId).trim();

  if (!/^[a-zA-Z0-9_-]{3,64}$/.test(userId)) {
    return json(400, { ok: false, reason: "invalid_user_id" });
  }
  if (password.length < 8) {
    return json(400, { ok: false, reason: "password_too_short" });
  }

  const userRef = db().collection("users").doc(userId);
  const existing = await userRef.get();
  if (existing.exists) {
    return json(409, { ok: false, reason: "user_already_exists" });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await userRef.set({
    displayName,
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
    unlockedSlot: Number(body.unlockedSlot || 1),
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  });

  return json(200, { ok: true, userId, displayName });
});
