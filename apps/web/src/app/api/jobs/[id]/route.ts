import { NextResponse } from "next/server";
import { getQueue } from "@/lib/queue";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const q = getQueue();
  const job = await q.getJob(id);
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const state = await job.getState();
  const rv = (job.returnvalue ?? null) as { status?: number; latencyMs?: number } | null;

  await prisma.job.updateMany({
    where: { queueId: String(job.id) },
    data: {
      status: state,
      latencyMs: rv?.latencyMs ?? null,
      attempts: job.attemptsMade ?? 0,
      startedAt: job.processedOn ? new Date(job.processedOn) : null,
      finishedAt: job.finishedOn ? new Date(job.finishedOn) : null,
    },
  });

  return NextResponse.json({
    id: job.id,
    state,
    result: state === "completed" ? rv : null,
    attemptsMade: job.attemptsMade,
    failedReason: job.failedReason ?? null,
  });
}