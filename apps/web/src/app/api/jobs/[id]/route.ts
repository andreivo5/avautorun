import { NextResponse } from "next/server";
import { getQueue } from "@/lib/queue";

// Ensure Node runtime (BullMQ requires Node, not Edge)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";  // disable static caching
export const revalidate = 0;             // no ISR

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }  // <-- params is a Promise
) {
  const { id } = await ctx.params;          // <-- await it
  const q = getQueue();
  const job = await q.getJob(id);
  if (!job) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const state = await job.getState();       // waiting | active | completed | failed | delayed
  const result = state === "completed" ? job.returnvalue : null;

  return NextResponse.json({
    id: job.id,
    state,
    result,
    attemptsMade: job.attemptsMade,
    failedReason: job.failedReason ?? null,
  });
}