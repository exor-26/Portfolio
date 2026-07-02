const { db, FieldValue } = require("./firebase");

const EVENT_WEIGHTS = {
  copy_attempt: 1,
  cut_attempt: 1,
  context_menu_attempt: 1,
  select_attempt: 1,
  blocked_shortcut: 2,
  devtools_detected: 5,
  locked_module_attempt: 4,
  heartbeat_failed: 1,
  offline: 1
};

async function logEvent({ userId, sessionId = null, type, metadata = {} }) {
  const safeMetadata = JSON.parse(JSON.stringify(metadata || {}));
  await db().collection("events").add({
    userId,
    sessionId,
    type,
    metadata: safeMetadata,
    createdAt: FieldValue.serverTimestamp()
  });
}

async function logBatch({ userId, sessionId, events }) {
  const firestore = db();
  const batch = firestore.batch();
  const sanitized = Array.isArray(events) ? events.slice(0, 50) : [];
  let scoreDelta = 0;

  sanitized.forEach((event) => {
    const type = String(event.type || "unknown").slice(0, 80);
    const ref = firestore.collection("events").doc();
    scoreDelta += EVENT_WEIGHTS[type] || 0;
    batch.set(ref, {
      userId,
      sessionId,
      type,
      metadata: JSON.parse(JSON.stringify(event.metadata || {})),
      clientAt: event.clientAt || null,
      createdAt: FieldValue.serverTimestamp()
    });
  });

  if (scoreDelta > 0) {
    const suspendThreshold = Number(process.env.EVENT_SUSPEND_THRESHOLD || 18);
    const banThreshold = Number(process.env.EVENT_BAN_THRESHOLD || 35);
    const userRef = firestore.collection("users").doc(userId);
    const userSnap = await userRef.get();
    const currentScore = userSnap.exists ? userSnap.data().anomalyScore || 0 : 0;
    const nextScore = currentScore + scoreDelta;
    const update = {
      anomalyScore: FieldValue.increment(scoreDelta),
      updatedAt: FieldValue.serverTimestamp()
    };
    if (nextScore >= banThreshold) {
      update.banned = true;
      update.banReason = "anomaly_threshold";
      update.bannedAt = FieldValue.serverTimestamp();
    } else if (nextScore >= suspendThreshold) {
      update.suspended = true;
      update.suspendedReason = "anomaly_threshold";
      update.suspendedAt = FieldValue.serverTimestamp();
    }
    batch.update(userRef, update);
  }

  await batch.commit();
  return { count: sanitized.length, scoreDelta };
}

module.exports = {
  logBatch,
  logEvent
};
