const { db, FieldValue } = require("./lib/firebase");
const { logEvent } = require("./lib/events-log");
const { handler, json, parseJsonBody, requireMethod } = require("./lib/http");
const { endSession } = require("./lib/session");
const { validateFromRequest } = require("./lib/request-session");
const { DEVTOOLS_WARNING_LIMIT } = require("./lib/time");

exports.handler = handler(async (event) => {
  const method = requireMethod(event, "POST");
  if (method) return method;

  const body = parseJsonBody(event);
  const result = await validateFromRequest(event, body);
  if (!result.ok) {
    return json(200, { ok: false, active: false, reason: result.reason });
  }

  const userRef = db().collection("users").doc(result.session.userId);
  const nextCount = await db().runTransaction(async (tx) => {
    const snap = await tx.get(userRef);
    const current = snap.data().devtoolsWarnings || 0;
    tx.update(userRef, {
      devtoolsWarnings: FieldValue.increment(1),
      updatedAt: FieldValue.serverTimestamp()
    });
    return current + 1;
  });

  await logEvent({
    userId: result.session.userId,
    sessionId: result.sessionRef.id,
    type: "devtools_detected",
    metadata: { source: body.source || "unknown", count: nextCount }
  });

  if (nextCount > DEVTOOLS_WARNING_LIMIT) {
    await endSession(result.sessionRef, "devtools_violation");
    return json(200, {
      ok: true,
      active: false,
      forceLogout: true,
      reason: "devtools_violation",
      warningCount: nextCount,
      warningsRemaining: 0
    });
  }

  return json(200, {
    ok: true,
    active: true,
    showCountdown: true,
    warningCount: nextCount,
    warningsRemaining: DEVTOOLS_WARNING_LIMIT - nextCount
  });
});
