export default function BlurGuard({ blurred, children }) {
  return (
    <div className="relative">
      <div className={blurred ? "pointer-events-none select-none blur-xl" : ""}>
        {children}
      </div>
      {blurred ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 px-5 text-center backdrop-blur-md">
          <div className="max-w-xl rounded-2xl border border-orange-400/30 bg-[#10101a] p-8 shadow-2xl">
            <p className="text-sm uppercase tracking-[0.35em] text-orange-300">Connection paused</p>
            <h2 className="mt-4 text-3xl font-bold text-white">Content is locked until connection returns.</h2>
            <p className="mt-4 leading-7 text-white/70">
              Your 45-minute session timer is still running. Reconnecting does not extend the session.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
