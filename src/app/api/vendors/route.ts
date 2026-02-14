import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  const category = searchParams.get("category");
  const location = searchParams.get("location");

  const where: any = {};

  if (query) {
    where.OR = [
      { businessName: { contains: query } }, // removed mode: 'insensitive' for SQLite compatibility if needed, but Prisma usually handles it.
      // Note: SQLite support for insensitive search is limited. 
      // If using PostgreSQL later, add mode: 'insensitive'.
      // For now, I'll stick to basic contains.
      { description: { contains: query } },
    ];
  }

  if (category) {
    where.category = { contains: category };
  }

  if (location) {
    where.location = { contains: location };
  }

  try {
    const vendors = await prisma.vendorProfile.findMany({
      where,
      include: {
        services: {
          take: 3, // Show a few services
        }
      }
    });

    return NextResponse.json(vendors);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
