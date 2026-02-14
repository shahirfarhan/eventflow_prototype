import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const eventSchema = z.object({
  title: z.string().min(2),
  date: z.string().transform((str) => new Date(str)),
  location: z.string().min(2),
  type: z.string().min(2),
  budget: z.coerce.number().min(0),
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
    const data = eventSchema.parse(body);

    const event = await prisma.event.create({
      data: {
        organizerId: session.user.id,
        title: data.title,
        date: data.date,
        location: data.location,
        type: data.type,
        budget: data.budget,
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
