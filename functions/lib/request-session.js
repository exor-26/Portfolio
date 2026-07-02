const { readSessionCookie } = require("./cookie");
const { parseJsonBody } = require("./http");
const { validateSession } = require("./session");

function getSessionIdentity(event, body = null) {
  const cookie = readSessionCookie(event);
  if (cookie?.userId && cookie?.sessionId) {
    return cookie;
  }

  const data = body || parseJsonBody(event);
  return {
    userId: data.userId,
    sessionId: data.sessionId
  };
}

async function validateFromRequest(event, body = null) {
  const identity = getSessionIdentity(event, body);
  return validateSession(identity);
}

module.exports = {
  getSessionIdentity,
  validateFromRequest
};
