import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

type InternalThread = {
  id: string;
  peerId: string;
  peerName: string | null;
  peerEmail: string;
  bookingId: string | null;
  eventTitle: string | null;
  vendorBusinessName: string | null;
  serviceName: string | null;
  packageName: string | null;
  contextServiceId: string | null;
  contextPackageId: string | null;
  contextVendorId: string | null;
  lastMessage: string;
  lastMessageAt: Date;
  unreadCount: number;
};

function peerDisplayName(
  role: string,
  t: InternalThread
): string {
  if (role === "ORGANIZER" && t.vendorBusinessName) {
    return t.vendorBusinessName;
  }
  return t.peerName || t.peerEmail;
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const role = session.user.role;
    if (role !== "ORGANIZER" && role !== "VENDOR") {
      return NextResponse.json(
        { error: "Only organizers and vendors have messages" },
        { status: 403 }
      );
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: {
          select: { id: true, name: true, email: true },
        },
        receiver: {
          select: { id: true, name: true, email: true },
        },
        booking: {
          include: {
            event: { select: { id: true, title: true } },
            vendor: { select: { id: true, businessName: true } },
            service: { select: { id: true, name: true } },
            package: { select: { id: true, name: true } },
          },
        },
        contextService: { select: { id: true, name: true } },
        contextPackage: { select: { id: true, name: true } },
        contextVendor: { select: { id: true, businessName: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const map = new Map<string, InternalThread>();
    for (const m of messages) {
      const peerId = m.senderId === userId ? m.receiverId : m.senderId;
      const peer = m.senderId === userId ? m.receiver : m.sender;
      const bookingKeyId = m.bookingId ?? `direct:${peerId}`;
      const key = `${bookingKeyId}:${peerId}`;

      const existing = map.get(key);
      if (!existing) {
        const bookingServiceName = m.booking?.service?.name ?? null;
        const bookingPackageName = m.booking?.package?.name ?? null;
        const bookingVendorName = m.booking?.vendor?.businessName ?? null;
        const ctxServiceName = m.contextService?.name ?? null;
        const ctxPackageName = m.contextPackage?.name ?? null;
        const ctxVendorName = m.contextVendor?.businessName ?? null;
        const thread: InternalThread = {
          id: key,
          peerId,
          peerName: peer?.name ?? null,
          peerEmail: peer?.email ?? "",
          bookingId: m.bookingId ?? null,
          eventTitle: m.booking?.event?.title ?? null,
          vendorBusinessName: bookingVendorName ?? ctxVendorName ?? null,
          serviceName: bookingServiceName ?? ctxServiceName ?? null,
          packageName: bookingPackageName ?? ctxPackageName ?? null,
          contextServiceId: m.contextServiceId ?? null,
          contextPackageId: m.contextPackageId ?? null,
          contextVendorId: m.contextVendorId ?? null,
          lastMessage: m.content,
          lastMessageAt: m.createdAt,
          unreadCount:
            m.receiverId === userId && !m.readAt ? 1 : 0,
        };
        map.set(key, thread);
      } else {
        if (m.receiverId === userId && !m.readAt) {
          existing.unreadCount += 1;
        }
      }
    }

    const threads = Array.from(map.values()).sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());

    const payload = threads.map((t) => ({
      id: t.id,
      peerId: t.peerId,
      peerName: peerDisplayName(role, t),
      bookingId: t.bookingId,
      eventTitle: t.eventTitle,
      serviceName: t.serviceName ?? t.packageName ?? null,
      vendorBusinessName: t.vendorBusinessName,
      contextServiceId: t.contextServiceId,
      contextPackageId: t.contextPackageId,
      contextVendorId: t.contextVendorId,
      lastMessage: t.lastMessage,
      lastMessageAt: t.lastMessageAt.toISOString(),
      unread: t.unreadCount > 0,
      unreadCount: t.unreadCount,
    }));

    return NextResponse.json(payload);
  } catch (error) {
    console.error("[GET /api/messages] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

const markReadSchema = z.object({
  peerId: z.string().min(1).optional(),
  bookingId: z.string().min(1).optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json().catch(() => ({}));
    const parsed = markReadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }

    const where: {
      receiverId: string;
      readAt: null;
      senderId?: string;
      bookingId?: string;
    } = {
      receiverId: userId,
      readAt: null,
    };
    if (parsed.data.peerId) where.senderId = parsed.data.peerId;
    if (parsed.data.bookingId) where.bookingId = parsed.data.bookingId;

    const updated = await prisma.message.updateMany({
      where,
      data: { readAt: new Date() },
    });

    return NextResponse.json({ markedRead: updated.count });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("[POST /api/messages] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
