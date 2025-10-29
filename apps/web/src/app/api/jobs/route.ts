import { NextRequest, NextResponse } from "next/server";
import { getQueue } from "@/lib/queue";

export async function POST(req: NextRequest) {
  const { type, url } = await req.json();

  if (type !== "http_ping" || !url) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const queue = getQueue();
  const job = await queue.add(
    "http_ping",
    { url },
    { attempts: 3, backoff: { type: "exponential", delay: 1000 } }
  );

  return NextResponse.json({ id: job.id });
}