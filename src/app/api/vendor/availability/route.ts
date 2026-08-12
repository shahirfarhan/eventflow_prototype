import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const upsertSchema = z.object({
  date: z.string().min(10),
  blocked: z.boolean(),
});

const toDay = (dateStr: string) => new Date(`${dateStr}T00:00:00.000Z`);

export async function GET(req: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "VENDOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const vendor = await prisma.vendorProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!vendor) {
    return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 });
  }

  const rows = await prisma.availability.findMany({
    where: {
      vendorId: vendor.id,
      status: "UNAVAILABLE",
    },
    orderBy: { date: "asc" },
  });

  return NextResponse.json({
    unavailable: rows.map((r) => r.date.toISOString().slice(0, 10)),
  });
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "VENDOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const vendor = await prisma.vendorProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!vendor) {
    return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 });
  }

  try {
    const body = await req.json();
    const data = upsertSchema.parse(body);

    const date = toDay(data.date);

    if (data.blocked) {
      await prisma.availability.upsert({
        where: {
          vendorId_date: {
            vendorId: vendor.id,
            date,
          },
        },
        update: { status: "UNAVAILABLE" },
        create: {
          vendorId: vendor.id,
          date,
          status: "UNAVAILABLE",
        },
      });
    } else {
      await prisma.availability.deleteMany({
        where: {
          vendorId: vendor.id,
          date,
          status: "UNAVAILABLE",
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

