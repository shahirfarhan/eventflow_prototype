import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const notification = await prisma.notification.updateMany({
      where: {
        id,
        userId: session.user.id,
      },
      data: {
        readAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      updated: notification.count,
    });
  } catch (error) {
    console.error("[POST /api/notifications/:id]", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}