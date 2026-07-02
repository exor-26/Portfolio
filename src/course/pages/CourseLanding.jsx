import { Link } from "react-router-dom";
import { useSession } from "../context/SessionContext";

export default function CourseLanding() {
  const { active } = useSession();

  return (
    <main className="min-h-screen bg-[#080810] px-5 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col justify-center">
        <p className="text-sm uppercase tracking-[0.35em] text-orange-300">Protected AI course</p>
        <h1 className="mt-5 max-w-4xl text-5xl font-black tracking-[-0.06em] sm:text-7xl">
          Learn AI through simple, interactive lessons.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
          This private course area is locked to manually created access accounts. Lessons are visual,
          beginner-friendly, time-limited, and protected by access controls.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            to={active ? "/course/lesson" : "/course/login"}
            className="rounded-full bg-orange-500 px-6 py-3 text-center font-semibold text-white shadow-lg shadow-orange-500/20"
          >
            {active ? "Continue current session" : "Access login"}
          </Link>
          <Link
            to="/"
            className="rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-center font-semibold text-white/85"
          >
            Back to portfolio
          </Link>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            ["One device", "First successful login locks the account to that device."],
            ["Two sessions/day", "Only two total sessions per IST calendar day."],
            ["45 minutes", "Server-side timer never pauses or refunds lost time."]
          ].map(([title, copy]) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <h2 className="font-bold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-white/60">{copy}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
