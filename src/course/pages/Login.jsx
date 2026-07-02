import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import { computeDeviceFingerprint } from "../lib/fingerprint";

const TERMS = `
This course is private protected material. Your access account is manually created and belongs only to you.

Your first successful login locks this access account to the current device/browser fingerprint. Any later login from another device can permanently ban the account.

Each day allows a maximum of two sessions in the Asia/Kolkata calendar day. A session is consumed as soon as login succeeds.

Each session lasts exactly 45 minutes according to the server clock. The timer does not pause for disconnection, tab switching, logout, or any other interruption.

Manual logout or forced logout consumes the session and does not unlock future content. Only a natural timer expiry can advance the next content slot.

Developer tools, copying attempts, and suspicious behavior may be logged. Course content is protected and remains the copyrighted material of Aditya Kumar.
`;

function messageFor(reason) {
  const messages = {
    wrong_credentials: "The user ID or password is incorrect.",
    daily_limit_reached: "This account has already used both sessions for today.",
    session_already_active: "This account already has an active session.",
    account_banned: "This account is permanently banned.",
    account_suspended: "This account is suspended.",
    device_mismatch_banned: "A different device was detected. The account has been permanently banned."
  };
  return messages[reason] || "Login failed. Please check the details and try again.";
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useSession();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [termsRead, setTermsRead] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const termsRef = useRef(null);

  const onTermsScroll = () => {
    const node = termsRef.current;
    if (!node) return;
    const atBottom = node.scrollTop + node.clientHeight >= node.scrollHeight - 8;
    if (atBottom) {
      setTermsRead(true);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const deviceFingerprint = await computeDeviceFingerprint();
      await login({ userId, password, deviceFingerprint });
      navigate("/course/lesson", { replace: true });
    } catch (err) {
      setError(messageFor(err.data?.reason || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#080810] px-5 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <Link to="/course" className="text-sm font-semibold text-orange-300">Back to course</Link>
          <h1 className="mt-5 text-5xl font-black tracking-[-0.06em]">Access login</h1>
          <p className="mt-5 max-w-xl leading-8 text-white/65">
            Login starts the 45-minute server-side timer immediately. Make sure you are ready before continuing.
          </p>
        </div>

        <form onSubmit={submit} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <label className="block">
            <span className="text-sm font-semibold text-white/70">User ID</span>
            <input
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none ring-orange-400/40 focus:ring-4"
              autoComplete="username"
            />
          </label>
          <label className="mt-5 block">
            <span className="text-sm font-semibold text-white/70">Password</span>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none ring-orange-400/40 focus:ring-4"
              autoComplete="current-password"
            />
          </label>

          <div
            ref={termsRef}
            onScroll={onTermsScroll}
            className="mt-6 h-52 overflow-auto rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-7 text-white/65"
          >
            {TERMS.split("\n").filter(Boolean).map((line) => (
              <p key={line} className="mb-4">{line}</p>
            ))}
          </div>

          <p className="mt-3 text-sm text-white/45">
            {termsRead ? "Terms read gate complete." : "Scroll the terms block to the bottom to enable login."}
          </p>
          {error ? <p className="mt-4 rounded-2xl bg-red-500/15 p-3 text-sm text-red-100">{error}</p> : null}
          <button
            type="submit"
            disabled={!termsRead || !userId || !password || submitting}
            className="mt-6 w-full rounded-full bg-orange-500 px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? "Checking..." : "Start session"}
          </button>
        </form>
      </div>
    </main>
  );
}
