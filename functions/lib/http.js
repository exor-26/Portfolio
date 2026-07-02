function json(statusCode, body, extraHeaders = {}) {
  return {
    statusCode,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...extraHeaders
    },
    body: JSON.stringify(body)
  };
}

function text(statusCode, body, extraHeaders = {}) {
  return {
    statusCode,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
      ...extraHeaders
    },
    body
  };
}

function parseJsonBody(event) {
  if (!event.body) {
    return {};
  }
  const raw = event.isBase64Encoded
    ? Buffer.from(event.body, "base64").toString("utf8")
    : event.body;
  return JSON.parse(raw);
}

function getHeader(event, name) {
  const target = name.toLowerCase();
  const headers = event.headers || {};
  const key = Object.keys(headers).find((item) => item.toLowerCase() === target);
  return key ? headers[key] : "";
}

function getClientIp(event) {
  const forwarded = getHeader(event, "x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return event?.requestContext?.identity?.sourceIp || "unknown";
}

function requireMethod(event, method) {
  if (event.httpMethod === "OPTIONS") {
    return json(204, {});
  }
  if (event.httpMethod !== method) {
    return json(405, { ok: false, reason: "method_not_allowed" });
  }
  return null;
}

function requireAdmin(event) {
  const expected = process.env.ADMIN_SECRET;
  if (!expected) {
    return { ok: false, response: json(500, { ok: false, reason: "admin_secret_missing" }) };
  }
  const provided = getHeader(event, "x-admin-secret");
  if (!provided || provided !== expected) {
    return { ok: false, response: json(401, { ok: false, reason: "admin_secret_invalid" }) };
  }
  return { ok: true };
}

function handler(fn) {
  return async (event, context) => {
    try {
      return await fn(event, context);
    } catch (error) {
      console.error(error);
      return json(500, {
        ok: false,
        reason: "internal_error",
        message: process.env.NODE_ENV === "development" ? error.message : undefined
      });
    }
  };
}

module.exports = {
  getClientIp,
  getHeader,
  handler,
  json,
  parseJsonBody,
  requireAdmin,
  requireMethod,
  text
};
