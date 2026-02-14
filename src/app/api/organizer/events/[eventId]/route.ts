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

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ORGANIZER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { eventId } = await params;

  // Verify ownership
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event || event.organizerId !== session.user.id) {
    return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
  }

  try {
    const body = await req.json();
    const data = eventSchema.parse(body);

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        title: data.title,
        date: data.date,
        location: data.location,
        type: data.type,
        budget: data.budget,
      },
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ORGANIZER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { eventId } = await params;

  // Verify ownership
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event || event.organizerId !== session.user.id) {
    return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
  }

  await prisma.event.delete({
    where: { id: eventId },
  });

  return NextResponse.json({ message: "Event deleted" });
}
