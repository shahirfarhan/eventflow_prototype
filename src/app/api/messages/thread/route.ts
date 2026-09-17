import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

const imageUrlSchema = z
  .string()
  .min(1)
  .refine(
    (val) => {
      if (val.startsWith("/")) return true;
      try {
        const u = new URL(val);
        return u.protocol === "http:" || u.protocol === "https:";
      } catch {
        return false;
      }
    },
    { message: "imageUrl must be a root-relative path or an http(s) URL" }
  );

const threadQuerySchema = z.object({
  peerId: z.string().min(1),
});

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "ORGANIZER" && session.user.role !== "VENDOR") {
      return NextResponse.json(
        { error: "Only organizers and vendors have messages" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const parsed = threadQuerySchema.safeParse({
      peerId: searchParams.get("peerId"),
    });
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }
    const userId = session.user.id;
    const { peerId } = parsed.data;

    if (peerId === userId) {
      return NextResponse.json({ error: "Cannot message yourself" }, { status: 400 });
    }

    const messages = await prisma.message.findMany({
      where: {
        AND: [
          { bookingId: null },
          {
            OR: [
              { senderId: userId, receiverId: peerId },
              { senderId: peerId, receiverId: userId },
            ],
          },
        ],
      },
      include: {
        sender: {
          select: { id: true, name: true, email: true },
        },
        receiver: {
          select: { id: true, name: true, email: true },
        },
        quotation: {
          include: {
            service: { select: { id: true, name: true } },
            package: { select: { id: true, name: true } },
            vendor: { select: { id: true, businessName: true } },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const marked = await prisma.message.updateMany({
      where: {
        bookingId: null,
        senderId: peerId,
        receiverId: userId,
        readAt: null,
      },
      data: { readAt: new Date() },
    });
    void marked;

    return NextResponse.json(messages);
  } catch (error) {
    console.error("[GET /api/messages/thread] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

const createSchema = z.object({
  peerId: z.string().min(1),
  content: z.string().max(5000).default(""),
  imageUrl: z.union([
    imageUrlSchema,
    z.literal("").transform(() => undefined as string | undefined),
    z.undefined(),
  ]).nullable().optional(),
  contextServiceId: z.string().min(1).optional(),
  contextPackageId: z.string().min(1).optional(),
  contextVendorId: z.string().min(1).optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "ORGANIZER" && session.user.role !== "VENDOR") {
      return NextResponse.json(
        { error: "Only organizers and vendors can send messages" },
        { status: 403 }
      );
    }

    const senderId = session.user.id;
    const raw = await req.json().catch(() => ({}));
    const parsed = createSchema.safeParse(raw);
    if (!parsed.success) {
      console.error(
        "[POST /api/messages/thread] schema validation failed: raw payload=",
        raw,
        " issues=",
        JSON.stringify(parsed.error.issues)
      );
      return NextResponse.json(
        { error: parsed.error.issues },
        { status: 400 }
      );
    }

    const { peerId, contextServiceId, contextPackageId, contextVendorId } = parsed.data;
    const bodyContent = (parsed.data.content || "").trim();
    const imageUrl = parsed.data.imageUrl || undefined;

    if (peerId === senderId) {
      return NextResponse.json(
        { error: "Cannot message yourself" },
        { status: 400 }
      );
    }
    if (!bodyContent && !imageUrl) {
      return NextResponse.json(
        { error: "Send at least text or an image" },
        { status: 400 }
      );
    }

    const peer = await prisma.user.findUnique({
      where: { id: peerId },
      select: { id: true, role: true },
    });
    if (!peer) {
      return NextResponse.json({ error: "Recipient not found" }, { status: 422 });
    }
    if (peer.role !== "ORGANIZER" && peer.role !== "VENDOR") {
      return NextResponse.json(
        { error: "Recipient must be an organizer or vendor" },
        { status: 422 }
      );
    }

    let finalContextVendorId: string | undefined = contextVendorId;

    if (contextServiceId) {
      const svc = await prisma.service.findUnique({
        where: { id: contextServiceId },
        select: { id: true, vendorId: true },
      });
      if (!svc) {
        return NextResponse.json(
          { error: "Context service does not exist" },
          { status: 400 }
        );
      }
      finalContextVendorId = finalContextVendorId ?? svc.vendorId;
    }

    if (contextPackageId) {
      const pkg = await prisma.package.findUnique({
        where: { id: contextPackageId },
        select: { id: true, service: { select: { vendorId: true } } },
      });
      if (!pkg) {
        return NextResponse.json(
          { error: "Context package does not exist" },
          { status: 400 }
        );
      }
      finalContextVendorId = finalContextVendorId ?? pkg.service.vendorId;
    }

    if (finalContextVendorId) {
      const vendor = await prisma.vendorProfile.findUnique({
        where: { id: finalContextVendorId },
        select: { id: true, userId: true },
      });
      if (!vendor) {
        return NextResponse.json(
          { error: "Context vendor does not exist" },
          { status: 400 }
        );
      }
      if (vendor.userId !== senderId && vendor.userId !== peerId) {
        return NextResponse.json(
          { error: "Context vendor does not match participants" },
          { status: 400 }
        );
      }
    }

    const created = await prisma.message.create({
      data: {
        senderId,
        receiverId: peerId,
        bookingId: null,
        content: bodyContent || "📎",
        imageUrl,
        contextServiceId,
        contextPackageId,
        contextVendorId: finalContextVendorId,
      },
      include: {
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("[POST /api/messages/thread] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
