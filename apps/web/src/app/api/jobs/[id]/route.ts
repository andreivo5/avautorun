import { NextResponse } from "next/server";
import { getQueue } from "@/lib/queue";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const q = getQueue();
  const job = await q.getJob(params.id);
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const state = await job.getState(); // job state: queued | active | completed | failed | delayed
  const result = state === "completed" ? job.returnvalue : null;

  return NextResponse.json({
    id: job.id,
    state,
    result,
    attemptsMade: job.attemptsMade,
    failedReason: job.failedReason ?? null,
  });
}