import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const cleanFloat = (v: any): number | null => {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? (n >= 0 ? n : 0) : null;
};

const cleanInt = (v: any, clamp = 1000000): number | null => {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  const i = Math.floor(n);
  if (i < 0) return 0;
  if (i > clamp) return clamp;
  return i;
};

const swapMinMax = (
  min: number | null,
  max: number | null
): [number | null, number | null] => {
  if (min === null || max === null) return [min, max];
  return max < min ? [max, min] : [min, max];
};

const cleanTime = (v: any): string | null => {
  if (typeof v !== "string") return null;
  const m = v.trim().match(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/);
  if (!m) return null;
  return `${m[1]}:${m[2]}`;
};

const cleanEnum = (
  v: any,
  allowed: readonly string[]
): string | null => {
  if (typeof v !== "string") return null;
  const s = v.trim().toUpperCase();
  return (allowed as readonly string[]).includes(s) ? s : null;
};

const eventSchema = z.object({
  title: z.string().min(2),
  date: z.union([z.string().transform((str) => new Date(str)), z.date()]),
  startTime: z.any().optional().nullable(),
  endTime: z.any().optional().nullable(),
  location: z.string().min(2),
  type: z.string().min(2),
  budget: z.preprocess(
    (v: any) => (v === undefined || v === null || v === "" ? 0 : v),
    z.coerce.number().min(0)
  ),
  budgetMin: z.any().optional().nullable(),
  budgetMax: z.any().optional().nullable(),
  headcount: z.any().optional().nullable(),
  minAge: z.any().optional().nullable(),
  maxAge: z.any().optional().nullable(),
  venueType: z.any().optional().nullable(),
  venueAccess: z.any().optional().nullable(),
  notes: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v ? v.trim() || null : null)),
});

export async function GET(req: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ORGANIZER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const events = await prisma.event.findMany({
    where: { organizerId: session.user.id },
    orderBy: { date: 'asc' },
  });

  return NextResponse.json(events);
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ORGANIZER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = eventSchema.parse(body);

    let budgetMin = cleanFloat(parsed.budgetMin);
    let budgetMax = cleanFloat(parsed.budgetMax);
    [budgetMin, budgetMax] = swapMinMax(budgetMin, budgetMax);

    let minAge = cleanInt(parsed.minAge, 120);
    let maxAge = cleanInt(parsed.maxAge, 120);
    [minAge, maxAge] = swapMinMax(minAge, maxAge);
    if (minAge !== null && maxAge !== null && maxAge - minAge < 2) {
      maxAge = minAge + 2;
    }

    const headcount = cleanInt(parsed.headcount, 1000000);
    const venueType = cleanEnum(parsed.venueType, ["INDOOR", "OUTDOOR"] as const);
    const venueAccess = cleanEnum(parsed.venueAccess, ["PUBLIC", "PRIVATE"] as const);
    let startTime = cleanTime(parsed.startTime);
    let endTime = cleanTime(parsed.endTime);
    if (startTime && endTime && endTime <= startTime) {
      return NextResponse.json(
        { error: "End time must be after start time" },
        { status: 400 }
      )
    }

    const event = await prisma.event.create({
      data: {
        organizerId: session.user.id,
        title: parsed.title,
        date: parsed.date,
        startTime,
        endTime,
        location: parsed.location,
        type: parsed.type,
        budget: parsed.budget,
        budgetMin,
        budgetMax,
        headcount,
        minAge,
        maxAge,
        venueType,
        venueAccess,
        notes: parsed.notes ?? null,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
