import { NextResponse } from "next/server";
import Redis from "ioredis";

export const runtime = "nodejs";        
export const dynamic = "force-dynamic";   
export const revalidate = 0;

export async function GET() {
  const started = Date.now();

  const info = {
    uptimeSec: Math.floor(process.uptime()),
    node: process.version,
    env: process.env.NODE_ENV || "development",
  };

  let redisOk = false;
  let redisLatencyMs: number | null = null;
  let status = 200;

  try {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) throw new Error("REDIS_URL not set");

    const redis = new Redis(redisUrl, { lazyConnect: true });
    await redis.connect();

    const t0 = Date.now();
    const pong = await redis.ping();
    redisLatencyMs = Date.now() - t0;
    redisOk = pong === "PONG";

    await redis.quit();
  } catch (err) {
    redisOk = false;
    status = 503;
  }

  const body = {
    ok: redisOk,
    redis: { ok: redisOk, latencyMs: redisLatencyMs },
    app: info,
    respondedInMs: Date.now() - started,
  };

  return NextResponse.json(body, { status });
}
