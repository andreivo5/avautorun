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
    const res = await fetch(`/api/jobs/${jobId}`);
    setStatus(await res.json());
  };

  return (
    <main className="p-6 max-w-xl mx-auto space-y-3">
      <h1 className="text-2xl font-semibold">AVAutoRun Micro-orchestrator</h1>
      <div className="flex gap-2">
        <input
          className="border px-3 py-2 flex-1"
          placeholder="https://example.com"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />
        <button className="border px-3 py-2" onClick={enqueue}>Enqueue Job</button>
      </div>

      {jobId && (
        <div className="space-y-2">
          <div>Job ID: <code>{jobId}</code></div>
          <button className="border px-3 py-2" onClick={poll}>Check Status</button>
          {status && <pre className="bg-gray-100 p-3 text-sm overflow-auto">
            {JSON.stringify(status, null, 2)}
          </pre>}
        </div>
      )}
    </main>
  );
}