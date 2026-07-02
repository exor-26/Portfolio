const { db, FieldValue } = require("./firebase");
const { nowMs } = require("./time");

async function pickCurrentModule(unlockedSlot) {
  const snapshot = await db()
    .collection("modules")
    .where("active", "==", true)
    .get();

  if (snapshot.empty) {
    return null;
  }

  const modules = snapshot.docs
    .map((doc) => ({ moduleId: doc.id, ...doc.data() }))
    .filter((module) => Number(module.slot || 1) <= Number(unlockedSlot || 1))
    .sort((a, b) => {
      if (Number(a.slot || 1) !== Number(b.slot || 1)) {
        return Number(b.slot || 1) - Number(a.slot || 1);
      }
      return Number(a.order || 0) - Number(b.order || 0);
    });

  return modules[0] || null;
}

async function endSession(sessionRef, reason) {
  const updates = {
    endReason: reason,
    endedAtMs: nowMs(),
    endedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  };

  return db().runTransaction(async (tx) => {
    const sessionSnap = await tx.get(sessionRef);
    if (!sessionSnap.exists) {
      return { ok: false, reason: "session_not_found" };
    }

    const session = sessionSnap.data();
    if (session.endReason) {
      return { ok: true, alreadyEnded: true, session };
    }

    let unlockedSlot = null;
    if (reason === "timer_expired" && session.userId) {
      const userRef = db().collection("users").doc(session.userId);
      const userSnap = await tx.get(userRef);
      if (userSnap.exists) {
        const user = userSnap.data();
        const currentSlot = Number(user.unlockedSlot || 1);
        const completedSlot = Number(session.unlockedSlotAtStart || currentSlot || 1);
        const nextSlot = Math.max(currentSlot, completedSlot + 1);

        if (nextSlot > currentSlot) {
          unlockedSlot = nextSlot;
          tx.update(userRef, {
            unlockedSlot: nextSlot,
            updatedAt: FieldValue.serverTimestamp()
          });
        }
      }
    }

    tx.update(sessionRef, updates);

    return { ok: true, reason, unlockedSlot, session: { ...session, ...updates } };
  });
}

async function validateSession({ userId, sessionId, allowExpire = true }) {
  if (!userId || !sessionId) {
    return { ok: false, reason: "missing_session" };
  }

  const firestore = db();
  const [userSnap, sessionSnap] = await Promise.all([
    firestore.collection("users").doc(userId).get(),
    firestore.collection("sessions").doc(sessionId).get()
  ]);

  if (!userSnap.exists) {
    return { ok: false, reason: "user_not_found" };
  }
  if (!sessionSnap.exists) {
    return { ok: false, reason: "session_not_found" };
  }

  const user = userSnap.data();
  const session = sessionSnap.data();

  if (session.userId !== userId) {
    return { ok: false, reason: "session_user_mismatch" };
  }
  if (user.banned) {
    return { ok: false, reason: "account_banned", user, session };
  }
  if (user.suspended) {
    return { ok: false, reason: "account_suspended", user, session };
  }
  if (session.endReason) {
    return { ok: false, reason: session.endReason, user, session };
  }

  if (Number(session.expiresAtMs) <= nowMs()) {
    if (allowExpire) {
      await endSession(sessionSnap.ref, "timer_expired");
    }
    return { ok: false, reason: "timer_expired", user, session };
  }

  return {
    ok: true,
    user,
    userRef: userSnap.ref,
    session,
    sessionRef: sessionSnap.ref,
    remainingMs: Math.max(0, Number(session.expiresAtMs) - nowMs())
  };
}

module.exports = {
  endSession,
  pickCurrentModule,
  validateSession
};
