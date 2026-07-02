const { clearSessionCookie } = require("./lib/cookie");
const { logEvent } = require("./lib/events-log");
const { handler, json, parseJsonBody, requireMethod } = require("./lib/http");
const { endSession } = require("./lib/session");
const { validateFromRequest } = require("./lib/request-session");
const { nowMs } = require("./lib/time");

const ALLOWED_REASONS = new Set(["manual_logout", "devtools_violation", "admin_action", "timer_expired"]);

exports.handler = handler(async (event) => {
  const method = requireMethod(event, "POST");
  if (method) return method;

  const body = parseJsonBody(event);
  const reason = ALLOWED_REASONS.has(body.reason) ? body.reason : "manual_logout";
  const result = await validateFromRequest(event, body);
  if (!result.ok && result.reason !== "timer_expired") {
    return json(200, { ok: false, active: false, reason: result.reason }, {
      "set-cookie": clearSessionCookie()
    });
  }

  if (result.ok) {
    if (reason === "timer_expired" && Number(result.session.expiresAtMs) > nowMs()) {
      return json(409, {
        ok: false,
        active: true,
        reason: "timer_still_active",
        remainingMs: Number(result.session.expiresAtMs) - nowMs()
      });
    }
    await endSession(result.sessionRef, reason);
    await logEvent({ userId: result.session.userId, sessionId: result.sessionRef.id, type: "session_ended", metadata: { reason } });
  }

  return json(200, { ok: true, active: false, reason }, {
    "set-cookie": clearSessionCookie()
  });
});
