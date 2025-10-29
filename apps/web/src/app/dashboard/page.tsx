"use client";

import { useEffect, useMemo, useState } from "react";

type JobRow = {
  id: string;
  queueId: string;
  type: string;
  url: string;
  status: string;
  latencyMs: number | null;
  attempts: number;
  createdAt: string;
  startedAt: string | null;
  finishedAt: string | null;
};

export default function DashboardPage() {
  const [status, setStatus] = useState<string>("");
  const [q, setQ] = useState<string>("");
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [loading, setLoading] = useState(false);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (q) params.set("q", q);
    params.set("take", "50");
    return `/api/jobs/list?${params.toString()}`;
  }, [status, q]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetch(query, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => alive && setJobs(d.jobs ?? []))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [query]);

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Job Dashboard</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-2 md:items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm text-neutral-400">Status</label>
          <select
            className="border border-neutral-700 bg-neutral-900 text-neutral-100 px-2 py-1 rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All</option>
            <option value="waiting">waiting</option>
            <option value="active">active</option>
            <option value="completed">completed</option>
            <option value="failed">failed</option>
            <option value="delayed">delayed</option>
          </select>
        </div>
        <input
          className="border border-neutral-700 bg-neutral-900 text-neutral-100 px-3 py-2 rounded flex-1"
          placeholder="Search URL…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button
          disabled={loading}
          onClick={() => {
            setQ((x) => x);
          }}
          className="border border-neutral-700 bg-neutral-800 text-neutral-100 px-3 py-2 rounded hover:bg-neutral-700 transition"
        >
          {loading ? "Loading…" : "Refresh"}
        </button>
      </div>

      {/* Table */}
      <div className="overflow-auto border border-neutral-700 rounded">
        <table className="w-full text-sm">
          <thead className="bg-neutral-900 text-neutral-200">
            <tr>
              <th className="p-2 text-left">URL</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Latency</th>
              <th className="p-2 text-left">Attempts</th>
              <th className="p-2 text-left">Created</th>
              <th className="p-2 text-left">Finished</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((j) => (
              <tr key={j.id} className="border-t border-neutral-700 hover:bg-neutral-900">
                <td className="p-2">{j.url}</td>
                <td className="p-2 font-mono">{j.status}</td>
                <td className="p-2">{j.latencyMs ?? "—"} ms</td>
                <td className="p-2">{j.attempts}</td>
                <td className="p-2">{new Date(j.createdAt).toLocaleString()}</td>
                <td className="p-2">
                  {j.finishedAt ? new Date(j.finishedAt).toLocaleString() : "—"}
                </td>
              </tr>
            ))}
            {jobs.length === 0 && !loading && (
              <tr>
                <td className="p-4 text-neutral-400" colSpan={6}>
                  No jobs found. Try clearing filters or enqueue a job on the home page.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
