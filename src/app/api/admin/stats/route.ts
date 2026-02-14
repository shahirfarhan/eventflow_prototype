import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [usersCount, vendorsCount, organizersCount, bookingsCount, revenue] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "VENDOR" } }),
    prisma.user.count({ where: { role: "ORGANIZER" } }),
    prisma.booking.count(),
    prisma.booking.aggregate({
      where: { status: "PAID" },
      _sum: { price: true }
    })
  ]);

  return NextResponse.json({
    users: usersCount,
    vendors: vendorsCount,
    organizers: organizersCount,
    bookings: bookingsCount,
    revenue: revenue._sum.price || 0,
  });
}
