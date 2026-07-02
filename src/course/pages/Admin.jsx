import { useState } from "react";
import { apiFetch } from "../lib/api";

export default function Admin() {
  const [adminSecret, setAdminSecret] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [events, setEvents] = useState([]);
  const [createForm, setCreateForm] = useState({ userId: "", displayName: "", password: "" });
  const [moduleForm, setModuleForm] = useState({
    moduleId: "module-01",
    title: "Module 1",
    slot: 1,
    order: 1,
    jsx: "export default function CourseModule(){ return <p>Replace this module content.</p>; }"
  });
  const [message, setMessage] = useState("");

  const adminOptions = { adminSecret };

  const loadUsers = async () => {
    setMessage("");
    const data = await apiFetch("admin-get-users", adminOptions);
    setUsers(data.users || []);
  };

  const loadEvents = async (userId) => {
    setSelectedUser(userId);
    const data = await apiFetch("admin-get-user-events", {
      ...adminOptions,
      body: { userId, limit: 50 }
    });
    setEvents(data.events || []);
  };

  const createUser = async (event) => {
    event.preventDefault();
    const data = await apiFetch("admin-create-user", {
      ...adminOptions,
      body: createForm
    });
    setMessage(`Created ${data.userId}`);
    setCreateForm({ userId: "", displayName: "", password: "" });
    await loadUsers();
  };

  const banUser = async (userId) => {
    await apiFetch("admin-ban-user", {
      ...adminOptions,
      body: { userId, reason: "admin_dashboard" }
    });
    setMessage(`Banned ${userId}`);
    await loadUsers();
  };

  const upsertModule = async (event) => {
    event.preventDefault();
    const data = await apiFetch("admin-upsert-module", {
      ...adminOptions,
      body: {
        ...moduleForm,
        slot: Number(moduleForm.slot),
        order: Number(moduleForm.order)
      }
    });
    setMessage(`Saved ${data.moduleId} in ${data.chunkCount} chunk(s)`);
  };

  return (
    <main className="min-h-screen bg-[#080810] px-5 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-orange-300">Owner only</p>
            <h1 className="mt-2 text-4xl font-black tracking-[-0.05em]">Course admin</h1>
          </div>
          <label className="block md:w-96">
            <span className="text-sm text-white/60">Admin secret</span>
            <input
              value={adminSecret}
              onChange={(event) => setAdminSecret(event.target.value)}
              type="password"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none"
            />
          </label>
        </div>

        {message ? <p className="mt-4 rounded-2xl bg-emerald-500/15 p-3 text-emerald-100">{message}</p> : null}

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <form onSubmit={createUser} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <h2 className="text-xl font-bold">Create access account</h2>
            {["userId", "displayName", "password"].map((field) => (
              <input
                key={field}
                placeholder={field}
                value={createForm[field]}
                onChange={(event) => setCreateForm((current) => ({ ...current, [field]: event.target.value }))}
                className="mt-3 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none"
                type={field === "password" ? "password" : "text"}
              />
            ))}
            <button className="mt-4 rounded-full bg-orange-500 px-5 py-3 font-semibold">Create</button>
          </form>

          <form onSubmit={upsertModule} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 lg:col-span-2">
            <h2 className="text-xl font-bold">Upsert Firestore module</h2>
            <div className="grid gap-3 md:grid-cols-4">
              {["moduleId", "title", "slot", "order"].map((field) => (
                <input
                  key={field}
                  placeholder={field}
                  value={moduleForm[field]}
                  onChange={(event) => setModuleForm((current) => ({ ...current, [field]: event.target.value }))}
                  className="mt-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none"
                />
              ))}
            </div>
            <textarea
              value={moduleForm.jsx}
              onChange={(event) => setModuleForm((current) => ({ ...current, jsx: event.target.value }))}
              className="mt-3 h-44 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-sm outline-none"
            />
            <button className="mt-4 rounded-full bg-orange-500 px-5 py-3 font-semibold">Save module</button>
          </form>
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold">Access accounts</h2>
            <button className="rounded-full border border-white/10 px-4 py-2 font-semibold" onClick={loadUsers}>Refresh</button>
          </div>
          <div className="mt-4 overflow-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-white/45">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Warnings</th>
                  <th className="p-3">Score</th>
                  <th className="p-3">Unlocked</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.userId} className="border-t border-white/10">
                    <td className="p-3 font-semibold">{user.displayName}<br /><span className="text-white/45">{user.userId}</span></td>
                    <td className="p-3">{user.banned ? "Banned" : user.suspended ? "Suspended" : "Active"}</td>
                    <td className="p-3">{user.devtoolsWarnings}</td>
                    <td className="p-3">{user.anomalyScore}</td>
                    <td className="p-3">Slot {user.unlockedSlot}</td>
                    <td className="p-3">
                      <button className="mr-2 rounded-full border border-white/10 px-3 py-2" onClick={() => loadEvents(user.userId)}>Events</button>
                      <button className="rounded-full bg-red-500/80 px-3 py-2" onClick={() => banUser(user.userId)}>Ban</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <h2 className="text-xl font-bold">Events {selectedUser ? `for ${selectedUser}` : ""}</h2>
          <div className="mt-4 max-h-96 overflow-auto space-y-3">
            {events.map((event) => (
              <pre key={event.eventId} className="whitespace-pre-wrap rounded-2xl bg-black/30 p-3 text-xs text-white/65">
                {JSON.stringify(event, null, 2)}
              </pre>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
