const { db, FieldValue } = require("./lib/firebase");
const { logEvent } = require("./lib/events-log");
const { handler, json, parseJsonBody, requireAdmin, requireMethod } = require("./lib/http");

exports.handler = handler(async (event) => {
  const method = requireMethod(event, "POST");
  if (method) return method;

  const admin = requireAdmin(event);
  if (!admin.ok) return admin.response;

  const body = parseJsonBody(event);
  const userId = String(body.userId || "").trim();
  const reason = String(body.reason || "admin_ban").slice(0, 160);
  if (!userId) {
    return json(400, { ok: false, reason: "missing_user_id" });
  }

  const firestore = db();
  const userRef = firestore.collection("users").doc(userId);
  const userSnap = await userRef.get();
  if (!userSnap.exists) {
    return json(404, { ok: false, reason: "user_not_found" });
  }

  await userRef.update({
    banned: true,
    banReason: reason,
    bannedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  });

  const sessions = await firestore
    .collection("sessions")
    .where("userId", "==", userId)
    .get();
  const activeSessions = sessions.docs.filter((doc) => !doc.data().endReason);

  const batch = firestore.batch();
  activeSessions.forEach((doc) => {
    batch.update(doc.ref, {
      endReason: "admin_action",
      endedAt: FieldValue.serverTimestamp(),
      endedAtMs: Date.now(),
      updatedAt: FieldValue.serverTimestamp()
    });
  });
  await batch.commit();
  await logEvent({ userId, type: "admin_ban", metadata: { reason } });

  return json(200, { ok: true, userId, endedSessions: activeSessions.length });
});
