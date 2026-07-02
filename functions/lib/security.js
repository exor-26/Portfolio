const crypto = require("crypto");

function hashIp(ip) {
  const salt = process.env.IP_HASH_SALT || "local-development-salt";
  return crypto.createHmac("sha256", salt).update(ip || "unknown").digest("hex");
}

function publicUser(userId, data) {
  return {
    userId,
    displayName: data.displayName || userId,
    banned: Boolean(data.banned),
    suspended: Boolean(data.suspended),
    banReason: data.banReason || null,
    anomalyScore: data.anomalyScore || 0,
    devtoolsWarnings: data.devtoolsWarnings || 0,
    unlockedSlot: data.unlockedSlot || 1,
    deviceLocked: Boolean(data.deviceFingerprint)
  };
}

module.exports = {
  hashIp,
  publicUser
};
