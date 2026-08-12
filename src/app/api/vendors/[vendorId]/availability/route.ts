import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const toDayKey = (d: Date) => d.toISOString().slice(0, 10);

export async function GET(
  req: Request,
  { params }: { params: Promise<{ vendorId: string }> }
) {
  const { vendorId } = await params;

  const [unavailable, bookings] = await Promise.all([
    prisma.availability.findMany({
      where: {
        vendorId,
        status: "UNAVAILABLE",
      },
      orderBy: { date: "asc" },
    }),
    prisma.booking.findMany({
      where: {
        vendorId,
        status: {
          notIn: ["REJECTED", "CANCELLED"],
        },
      },
      select: { date: true },
    }),
  ]);

  const set = new Set<string>();
  for (const a of unavailable) set.add(toDayKey(a.date));
  for (const b of bookings) set.add(toDayKey(b.date));

  return NextResponse.json({
    blocked: Array.from(set.values()).sort(),
  });
}

