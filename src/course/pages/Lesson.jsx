import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BlurGuard from "../components/BlurGuard";
import DevToolsGuard from "../components/DevToolsGuard";
import ModuleRenderer from "../components/ModuleRenderer";
import SessionTimer from "../components/SessionTimer";
import { useSession } from "../context/SessionContext";
import { apiFetch } from "../lib/api";
import { createEventQueue } from "../lib/event-queue";
import { startHeartbeat } from "../lib/heartbeat";

export default function Lesson() {
  const navigate = useNavigate();
  const {
    active,
    blurred,
    endSession,
    loading,
    session,
    setBlurred,
    syncHeartbeat,
    user
  } = useSession();
  const [modulePayload, setModulePayload] = useState(null);
  const [moduleError, setModuleError] = useState("");
  const queueRef = useRef(null);
  const moduleRequestRef = useRef("");
  const sessionId = session?.sessionId || "";
  const moduleId = session?.module?.moduleId || "";
  const userId = session?.userId || "";

  const queue = useMemo(() => {
    const created = createEventQueue();
    queueRef.current = created;
    return created;
  }, []);

  useEffect(() => {
    queue.setSessionGetter(() => session);
  }, [queue, session]);

  const finish = useCallback(async (reason) => {
    queue.stop();
    await queue.flush().catch(() => {});
    if (reason === "timer_expired") {
      setBlurred(false);
    }
    navigate("/course/session-over", { replace: true, state: { reason } });
  }, [navigate, queue, setBlurred]);

  const forceEnd = useCallback(async (reason) => {
    const result = await endSession(reason);
    if (result?.active) {
      return;
    }
    await finish(reason);
  }, [endSession, finish]);

  useEffect(() => {
    if (!loading && !active) {
      navigate("/course/login", { replace: true });
    }
  }, [active, loading, navigate]);

  useEffect(() => {
    if (!sessionId || !session) {
      return undefined;
    }

    const activeSession = session;
    queue.start();
    const stopHeartbeat = startHeartbeat({
      session: activeSession,
      queue,
      onBlurChange: setBlurred,
      onSync: syncHeartbeat,
      onSessionEnd: finish
    });

    return () => {
      stopHeartbeat();
      queue.stop();
    };
  }, [finish, queue, sessionId, setBlurred, syncHeartbeat]);

  useEffect(() => {
    if (!sessionId || !userId) {
      return undefined;
    }

    let cancelled = false;
    const requestKey = `${sessionId}:${moduleId || "current"}`;
    if (moduleRequestRef.current === requestKey && modulePayload?.jsx) {
      return undefined;
    }
    moduleRequestRef.current = requestKey;
    setModuleError("");
    if (!modulePayload?.jsx) {
      setModulePayload(null);
    }

    apiFetch("get-module", {
      body: {
        userId,
        sessionId,
        ...(moduleId ? { moduleId } : {})
      }
    })
      .then((data) => {
        if (!cancelled) {
          setModulePayload(data);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setModuleError(error.data?.reason || error.message);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [moduleId, modulePayload?.jsx, sessionId, userId]);

  const blockEvent = (type) => (event) => {
    event.preventDefault();
    event.stopPropagation();
    queue.push(type, { target: event.target?.tagName || "unknown" });
  };

  const onKeyDown = useCallback((event) => {
    const key = event.key.toUpperCase();
    const modifierPressed = event.ctrlKey || event.metaKey;
    const printScreen = key === "PRINTSCREEN" || event.code === "PrintScreen";
    const blocked =
      printScreen ||
      (modifierPressed && ["C", "X", "S", "P", "A", "U"].includes(key)) ||
      (modifierPressed && event.shiftKey && ["I", "J", "C", "K", "S"].includes(key));
    if (blocked) {
      event.preventDefault();
      event.stopPropagation();
      if (printScreen && navigator.clipboard?.writeText) {
        navigator.clipboard.writeText("Protected course content - Aditya Kumar | github.com/exor-26").catch(() => {});
      }
      queue.push("blocked_shortcut", { key: event.key, code: event.code });
    }
  }, [queue]);

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [onKeyDown]);

  if (loading || !session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080810] text-white">
        Checking protected session...
      </main>
    );
  }

  return (
    <main
      className="min-h-screen select-none bg-[#080810] px-5 py-6 text-white sm:px-6 lg:px-8"
      onCopy={blockEvent("copy_attempt")}
      onCut={blockEvent("cut_attempt")}
      onContextMenu={blockEvent("context_menu_attempt")}
      onDragStart={blockEvent("drag_attempt")}
      onDrop={blockEvent("drop_attempt")}
      onPaste={blockEvent("paste_attempt")}
      onSelect={blockEvent("select_attempt")}
      onKeyDown={onKeyDown}
    >
      <DevToolsGuard session={session} queue={queue} onForceEnd={forceEnd} />

      <header className="sticky top-0 z-50 mx-auto flex max-w-6xl items-center justify-between gap-4 border-b border-white/10 bg-[#080810]/85 py-4 backdrop-blur-xl">
        <div>
          <Link to="/course" className="text-sm font-semibold text-orange-300">Protected course</Link>
          <h1 className="mt-1 text-xl font-bold">{modulePayload?.module?.title || session.module?.title || "Lesson"}</h1>
          <p className="text-sm text-white/45">User: {user?.displayName || session.userId} | Session {session.daySessionNumber}</p>
        </div>
        <div className="flex items-center gap-3">
          <SessionTimer expiresAtMs={session.expiresAtMs} onExpired={() => forceEnd("timer_expired")} />
          <button
            type="button"
            className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white/75"
            onClick={() => forceEnd("manual_logout")}
          >
            Logout
          </button>
        </div>
      </header>

      <BlurGuard blurred={blurred}>
        <section className="mx-auto max-w-4xl py-10">
          {moduleError ? (
            <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-6 text-red-100">
              <h2 className="text-xl font-semibold">Unable to load module</h2>
              <p className="mt-2 text-sm">{moduleError}</p>
            </div>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 leading-8 shadow-2xl sm:p-8">
              <ModuleRenderer jsx={modulePayload?.jsx} module={modulePayload?.module} session={session} />
            </div>
          )}
        </section>
      </BlurGuard>

      <footer className="mx-auto max-w-4xl border-t border-white/10 py-6 text-center text-xs font-semibold uppercase tracking-[0.24em] text-white/35">
        © {new Date().getFullYear()} Aditya Kumar. All rights reserved.
      </footer>
    </main>
  );
}
