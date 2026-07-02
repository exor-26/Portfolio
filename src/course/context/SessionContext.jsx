import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { apiFetch } from "../lib/api";

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [blurred, setBlurred] = useState(false);
  const [lastEndReason, setLastEndReason] = useState(null);

  const applySession = useCallback((data) => {
    if (data?.active && data.session) {
      setSession(data.session);
      setUser(data.user || null);
      setLastEndReason(null);
      return true;
    }
    setSession(null);
    setUser(null);
    if (data?.reason) {
      setLastEndReason(data.reason);
    }
    return false;
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch("session-status");
      applySession(data);
      return data;
    } finally {
      setLoading(false);
    }
  }, [applySession]);

  useEffect(() => {
    if (!location.pathname.startsWith("/course")) {
      setLoading(false);
      return;
    }
    refresh().catch(() => {
      setSession(null);
      setUser(null);
      setLoading(false);
    });
  }, [location.pathname, refresh]);

  const login = useCallback(async ({ userId, password, deviceFingerprint }) => {
    const data = await apiFetch("login", {
      body: { userId, password, deviceFingerprint }
    });
    applySession({ active: true, session: data.session, user: data.user });
    return data;
  }, [applySession]);

  const endSession = useCallback(async (reason = "manual_logout") => {
    const current = session;
    if (current) {
      const data = await apiFetch("end-session", {
        body: {
          userId: current.userId,
          sessionId: current.sessionId,
          reason
        }
      });
      if (data.active) {
        return data;
      }
    }
    setSession(null);
    setUser(null);
    setLastEndReason(reason);
    return { ok: true, active: false, reason };
  }, [session]);

  const syncHeartbeat = useCallback((data) => {
    setSession((current) => current ? {
      ...current,
      expiresAtMs: data.expiresAtMs ?? current.expiresAtMs,
      unlockedSlot: data.unlockedSlot ?? current.unlockedSlot,
      module: data.module || current.module
    } : current);
    setUser((current) => current ? {
      ...current,
      unlockedSlot: data.unlockedSlot ?? current.unlockedSlot,
      devtoolsWarnings: data.devtoolsWarnings ?? current.devtoolsWarnings
    } : current);
  }, []);

  const value = useMemo(() => ({
    active: Boolean(session),
    blurred,
    endSession,
    lastEndReason,
    loading,
    login,
    refresh,
    session,
    setBlurred,
    syncHeartbeat,
    user
  }), [blurred, endSession, lastEndReason, loading, login, refresh, session, syncHeartbeat, user]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) {
    throw new Error("useSession must be used inside SessionProvider");
  }
  return value;
}
