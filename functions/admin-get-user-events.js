const { db } = require("./lib/firebase");
const { handler, json, parseJsonBody, requireAdmin, requireMethod } = require("./lib/http");

exports.handler = handler(async (event) => {
  const method = requireMethod(event, "POST");
  if (method) return method;

  const admin = requireAdmin(event);
  if (!admin.ok) return admin.response;

  const body = parseJsonBody(event);
  const userId = String(body.userId || "").trim();
  const limit = Math.min(Number(body.limit || 50), 100);
  if (!userId) {
    return json(400, { ok: false, reason: "missing_user_id" });
  }

  const snapshot = await db()
    .collection("events")
    .where("userId", "==", userId)
    .get();

  const events = snapshot.docs
    .map((doc) => ({ eventId: doc.id, ...doc.data() }))
    .sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() || 0;
      const bTime = b.createdAt?.toMillis?.() || 0;
      return bTime - aTime;
    })
    .slice(0, limit);
  return json(200, { ok: true, events });
});
