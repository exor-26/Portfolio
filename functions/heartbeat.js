const { handler, json, requireMethod } = require("./lib/http");
const { pickCurrentModule } = require("./lib/session");
const { validateFromRequest } = require("./lib/request-session");

exports.handler = handler(async (event) => {
  const method = requireMethod(event, "POST");
  if (method) return method;

  const result = await validateFromRequest(event);
  if (!result.ok) {
    return json(200, { ok: false, active: false, reason: result.reason });
  }

  const module = await pickCurrentModule(result.user.unlockedSlot || 1);
  return json(200, {
    ok: true,
    active: true,
    remainingMs: result.remainingMs,
    expiresAtMs: result.session.expiresAtMs,
    unlockedSlot: result.user.unlockedSlot || 1,
    devtoolsWarnings: result.user.devtoolsWarnings || 0,
    module
  });
});
