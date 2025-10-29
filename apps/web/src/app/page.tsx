"use client";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<any>(null);

  const enqueue = async () => {
    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "http_ping", url }),
    });
    const data = await res.json();
    setJobId(data.id);
    setStatus(null);
  };

  const poll = async () => {
    if (!jobId) return;
    const res = await fetch(`/api/jobs/${jobId}?t=${Date.now()}`, { cache: "no-store" });
    setStatus(await res.json());
  };

  return (
    <main className="p-6 max-w-xl mx-auto space-y-3">
      <h1 className="text-2xl font-semibold">AVAutoRun Micro-Orchestrator</h1>

      <div className="flex gap-2">
        <input
          className="bg-neutral-900 text-neutral-100 placeholder-neutral-400 border border-neutral-700 rounded px-3 py-2 flex-1"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          className="bg-neutral-800 text-neutral-100 border border-neutral-700 rounded px-3 py-2 hover:bg-neutral-700 transition"
          onClick={enqueue}
        >
          Enqueue Job
        </button>
      </div>

      {jobId && (
        <div className="space-y-2">
          <div>
            Job ID: <code>{jobId}</code>
          </div>
          <button
            className="bg-neutral-800 text-neutral-100 border border-neutral-700 rounded px-3 py-2 hover:bg-neutral-700 transition"
            onClick={poll}
          >
            Check Status
          </button>

          {status && (
            <pre className="bg-neutral-900 text-neutral-100 border border-neutral-700 rounded-md p-3 text-sm overflow-auto max-h-80 font-mono">
              {JSON.stringify(status, null, 2)}
            </pre>
          )}
        </div>
      )}
    </main>
  );
}