import { Queue } from "bullmq";

const connection = { url: process.env.REDIS_URL! };
let q: Queue | null = null;

export function getQueue() {
  if (!process.env.REDIS_URL) {
    throw new Error("REDIS_URL not set");
  }
  if (!q) q = new Queue("jobs", { connection });
  return q;
}
