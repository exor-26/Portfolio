const crypto = require("crypto");

const COOKIE_NAME = "course_session";

function getSecret() {
  const secret = process.env.SESSION_COOKIE_SECRET;
  if (!secret) {
    throw new Error("SESSION_COOKIE_SECRET is missing");
  }
  return secret;
}

function base64Url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromBase64Url(input) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (normalized.length % 4)) % 4);
  return Buffer.from(normalized + padding, "base64").toString("utf8");
}

function sign(payload) {
  const data = base64Url(JSON.stringify(payload));
  const sig = crypto.createHmac("sha256", getSecret()).update(data).digest("base64url");
  return `${data}.${sig}`;
}

function verify(value) {
  if (!value || !value.includes(".")) {
    return null;
  }
  const [data, sig] = value.split(".");
  const expected = crypto.createHmac("sha256", getSecret()).update(data).digest("base64url");
  if (Buffer.byteLength(sig) !== Buffer.byteLength(expected)) {
    return null;
  }
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    return null;
  }
  return JSON.parse(fromBase64Url(data));
}

function parseCookies(header = "") {
  return header.split(";").reduce((acc, part) => {
    const index = part.indexOf("=");
    if (index === -1) {
      return acc;
    }
    const key = part.slice(0, index).trim();
    acc[key] = decodeURIComponent(part.slice(index + 1).trim());
    return acc;
  }, {});
}

function readSessionCookie(event) {
  const header = event.headers?.cookie || event.headers?.Cookie || "";
  const cookies = parseCookies(header);
  return verify(cookies[COOKIE_NAME]);
}

function sessionCookie(payload, maxAgeSeconds) {
  const secure = process.env.NODE_ENV === "development" ? "" : "; Secure";
  return `${COOKIE_NAME}=${encodeURIComponent(sign(payload))}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${maxAgeSeconds}${secure}`;
}

function clearSessionCookie() {
  const secure = process.env.NODE_ENV === "development" ? "" : "; Secure";
  return `${COOKIE_NAME}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${secure}`;
}

module.exports = {
  clearSessionCookie,
  readSessionCookie,
  sessionCookie
};
