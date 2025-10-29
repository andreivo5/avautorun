import { Worker, Job } from "bullmq";

const REDIS_URL = process.env.REDIS_URL;
if (!REDIS_URL) {
  console.error("REDIS_URL not set");
  process.exit(1);
}

const connection = { url: REDIS_URL };

/**
 * Worker for the "jobs" queue:
 * Supports http_ping job type with input/payload { url: string }
 */
const worker = new Worker(
  "jobs",
  async (job: Job) => {
    if (job.name !== "http_ping") {
      throw new Error(`Unsupported job type: ${job.name}`);
    }

    const { url } = job.data as { url: string };
    if (!url) throw new Error("Missing url");

    const started = Date.now();
    const res = await fetch(url);
    const latencyMs = Date.now() - started;

    console.log(
      JSON.stringify({
        level: "info",
        event: "http_ping_completed",
        jobId: job.id,
        url,
        status: res.status,
        latencyMs
      })
    );

    if (!res.ok) throw new Error(`Non-200 response: ${res.status}`);

    return { status: res.status, latencyMs };
  },
  { connection }
);

worker.on("completed", (job, rv) => {
  console.log(
    JSON.stringify({
      level: "info",
      event: "job_completed",
      jobId: job.id,
      returnvalue: rv
    })
  );
});

worker.on("failed", (job, err) => {
  console.log(
    JSON.stringify({
      level: "error",
      event: "job_failed",
      jobId: job?.id,
      error: err.message
    })
  );
});

console.log(JSON.stringify({ level: "info", event: "worker_started" }));