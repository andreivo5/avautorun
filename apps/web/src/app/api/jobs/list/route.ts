import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? undefined;
  const q = searchParams.get("q") ?? undefined;
  const take = Number(searchParams.get("take") ?? 50);

  const where: any = {};
  if (status) where.status = status;
  if (q) where.url = { contains: q, mode: "insensitive" };

  const jobs = await prisma.job.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: Math.min(Math.max(take, 1), 200),
    select: {
      id: true,
      queueId: true,
      type: true,
      url: true,
      status: true,
      latencyMs: true,
      attempts: true,
      createdAt: true,
      startedAt: true,
      finishedAt: true,
    },
  });

  return NextResponse.json({ jobs });
}
