import { NextResponse } from "next/server";
import { getQueue } from "@/lib/queue";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { url } = await req.json();
  const q = getQueue();
  const job = await q.add("http_ping", { url }, { attempts: 3, backoff: { type: "exponential", delay: 1000 } });

  await prisma.job.create({
    data: { queueId: String(job.id), type: "http_ping", url, status: "waiting" }
  });

  return NextResponse.json({ id: job.id });
}
