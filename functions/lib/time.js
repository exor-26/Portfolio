const SESSION_MINUTES = Number(process.env.COURSE_SESSION_MINUTES || 45);
const DAILY_SESSION_LIMIT = Number(process.env.DAILY_SESSION_LIMIT || 2);
const DEVTOOLS_WARNING_LIMIT = Number(process.env.DEVTOOLS_WARNING_LIMIT || 2);

function nowMs() {
  return Date.now();
}

function expiryMsFromNow() {
  return nowMs() + SESSION_MINUTES * 60 * 1000;
}

function getIstDateKey(date = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
  return formatter.format(date);
}

module.exports = {
  DAILY_SESSION_LIMIT,
  DEVTOOLS_WARNING_LIMIT,
  SESSION_MINUTES,
  expiryMsFromNow,
  getIstDateKey,
  nowMs
};
