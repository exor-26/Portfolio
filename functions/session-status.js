const { clearSessionCookie } = require("./lib/cookie");
const { handler, json } = require("./lib/http");
const { publicUser } = require("./lib/security");
const { pickCurrentModule } = require("./lib/session");
const { validateFromRequest } = require("./lib/request-session");

exports.handler = handler(async (event) => {
  if (event.httpMethod !== "GET" && event.httpMethod !== "POST") {
    return json(405, { ok: false, reason: "method_not_allowed" });
  }

  const result = await validateFromRequest(event);
  if (!result.ok) {
    return json(200, { ok: false, active: false, reason: result.reason }, {
      "set-cookie": clearSessionCookie()
    });
  }

  const module = await pickCurrentModule(result.user.unlockedSlot || 1);
  return json(200, {
    ok: true,
    active: true,
    user: publicUser(result.session.userId, result.user),
    session: {
      userId: result.session.userId,
      sessionId: result.sessionRef.id,
      expiresAtMs: result.session.expiresAtMs,
      daySessionNumber: result.session.daySessionNumber,
      unlockedSlot: result.user.unlockedSlot || 1,
      module
    }
  });
});
