const { logBatch } = require("./lib/events-log");
const { handler, json, parseJsonBody, requireMethod } = require("./lib/http");
const { validateFromRequest } = require("./lib/request-session");

exports.handler = handler(async (event) => {
  const method = requireMethod(event, "POST");
  if (method) return method;

  const body = parseJsonBody(event);
  const result = await validateFromRequest(event, body);
  if (!result.ok) {
    return json(200, { ok: false, active: false, reason: result.reason });
  }

  const outcome = await logBatch({
    userId: result.session.userId,
    sessionId: result.sessionRef.id,
    events: body.events || []
  });

  return json(200, { ok: true, ...outcome });
});
