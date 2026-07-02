import { Link, useLocation } from "react-router-dom";
import { useSession } from "../context/SessionContext";

function explanation(reason) {
  const copy = {
    timer_expired: ["Session completed", "The timer reached zero naturally. If this was your first session today, the next content slot is now unlocked."],
    manual_logout: ["Session ended early", "This session has been consumed. Early logout does not unlock the next module."],
    devtools_violation: ["Session ended for security", "Developer tools activity exceeded the allowed warning flow. This session has been consumed."],
    account_banned: ["Account banned", "This account can no longer access the course."],
    daily_limit_reached: ["Daily limit reached", "Both sessions for the current IST day have already been used."]
  };
  return copy[reason] || ["Session ended", "The protected session is no longer active."];
}

export default function SessionOver() {
  const location = useLocation();
  const { lastEndReason } = useSession();
  const reason = location.state?.reason || lastEndReason || "session_ended";
  const [title, body] = explanation(reason);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080810] px-5 text-center text-white">
      <div className="max-w-2xl rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl">
        <p className="text-sm uppercase tracking-[0.35em] text-orange-300">{reason}</p>
        <h1 className="mt-4 text-4xl font-black tracking-[-0.05em]">{title}</h1>
        <p className="mt-5 leading-8 text-white/70">{body}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link className="rounded-full bg-orange-500 px-6 py-3 font-semibold" to="/course/login">Login again</Link>
          <Link className="rounded-full border border-white/10 px-6 py-3 font-semibold text-white/80" to="/course">Course home</Link>
        </div>
      </div>
    </main>
  );
}
