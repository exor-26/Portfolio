const bcrypt = require("bcryptjs");
const { db, FieldValue } = require("./lib/firebase");
const { sessionCookie } = require("./lib/cookie");
const { logEvent } = require("./lib/events-log");
const { getClientIp, handler, json, parseJsonBody, requireMethod } = require("./lib/http");
const { hashIp, publicUser } = require("./lib/security");
const { endSession, pickCurrentModule } = require("./lib/session");
const { DAILY_SESSION_LIMIT, expiryMsFromNow, getIstDateKey, SESSION_MINUTES } = require("./lib/time");

exports.handler = handler(async (event) => {
  const method = requireMethod(event, "POST");
  if (method) return method;

  const body = parseJsonBody(event);
  const userId = String(body.userId || "").trim();
  const password = String(body.password || "");
  const deviceFingerprint = String(body.deviceFingerprint || "").trim();

  if (!userId || !password || !deviceFingerprint) {
    return json(400, { ok: false, reason: "missing_credentials" });
  }

  const firestore = db();
  const userRef = firestore.collection("users").doc(userId);
  const userSnap = await userRef.get();
  if (!userSnap.exists) {
    return json(401, { ok: false, reason: "wrong_credentials" });
  }

  const user = userSnap.data();
  if (user.banned) {
    return json(403, { ok: false, reason: "account_banned", banReason: user.banReason || null });
  }
  if (user.suspended) {
    return json(403, { ok: false, reason: "account_suspended" });
  }

  const passwordOk = await bcrypt.compare(password, user.passwordHash || "");
  if (!passwordOk) {
    await logEvent({ userId, type: "login_failed", metadata: { reason: "wrong_password" } });
    return json(401, { ok: false, reason: "wrong_credentials" });
  }

  const dateKey = getIstDateKey();
  const userSessions = await firestore
    .collection("sessions")
    .where("userId", "==", userId)
    .get();
  const todaysSessions = userSessions.docs.filter((doc) => doc.data().dateKey === dateKey);

  if (todaysSessions.length >= DAILY_SESSION_LIMIT) {
    await logEvent({ userId, type: "login_blocked", metadata: { reason: "daily_limit" } });
    return json(429, { ok: false, reason: "daily_limit_reached" });
  }

  if (user.deviceFingerprint && user.deviceFingerprint !== deviceFingerprint) {
    await userRef.update({
      banned: true,
      banReason: "device_mismatch",
      bannedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });
    await logEvent({ userId, type: "device_mismatch_ban" });
    return json(403, { ok: false, reason: "device_mismatch_banned" });
  }

  const activeSessions = userSessions.docs.filter((doc) => !doc.data().endReason);

  for (const doc of activeSessions) {
    const session = doc.data();
    if (Number(session.expiresAtMs) <= Date.now()) {
      await endSession(doc.ref, "timer_expired");
    } else {
      return json(409, { ok: false, reason: "session_already_active" });
    }
  }

  const module = await pickCurrentModule(user.unlockedSlot || 1);
  const sessionRef = firestore.collection("sessions").doc();
  const expiresAtMs = expiryMsFromNow();
  const daySessionNumber = todaysSessions.length + 1;

  await firestore.runTransaction(async (tx) => {
    const fresh = await tx.get(userRef);
    const freshUser = fresh.data();
    const updates = {
      updatedAt: FieldValue.serverTimestamp()
    };
    if (!freshUser.deviceFingerprint) {
      updates.deviceFingerprint = deviceFingerprint;
      updates.deviceLockedAt = FieldValue.serverTimestamp();
    }
    if (!freshUser.termsAcceptedAt) {
      updates.termsAcceptedAt = FieldValue.serverTimestamp();
      updates.termsAcceptedIpHash = hashIp(getClientIp(event));
    }
    tx.update(userRef, updates);
    tx.set(sessionRef, {
      userId,
      dateKey,
      daySessionNumber,
      startedAt: FieldValue.serverTimestamp(),
      startedAtMs: Date.now(),
      expiresAtMs,
      endReason: null,
      endedAt: null,
      endedAtMs: null,
      unlockedSlotAtStart: freshUser.unlockedSlot || 1,
      currentModuleId: module?.moduleId || null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });
  });

  await logEvent({ userId, sessionId: sessionRef.id, type: "login_success", metadata: { daySessionNumber } });
  const responseUser = {
    ...user,
    deviceFingerprint: user.deviceFingerprint || deviceFingerprint
  };

  return json(200, {
    ok: true,
    session: {
      userId,
      sessionId: sessionRef.id,
      expiresAtMs,
      sessionMinutes: SESSION_MINUTES,
      daySessionNumber,
      unlockedSlot: user.unlockedSlot || 1,
      module
    },
    user: publicUser(userId, responseUser)
  }, {
    "set-cookie": sessionCookie({ userId, sessionId: sessionRef.id }, SESSION_MINUTES * 60 + 120)
  });
});
