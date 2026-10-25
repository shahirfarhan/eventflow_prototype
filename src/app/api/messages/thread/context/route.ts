import { NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

const schema = z.object({
  peerId: z.string().min(1),
  serviceId: z.string().min(1),
})

// PATCH /api/messages/thread/context  { peerId, serviceId }
// Lets a vendor change which of their services a direct (non-booking) chat is about.
// The service is stored on the conversation's messages, so we update all of them.
export async function PATCH(req: Request) {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "VENDOR") {
    return NextResponse.json({ error: "Only vendors can change this" }, { status: 403 })
  }

  const parsed = schema.safeParse(await req.json().catch(() => ({})))
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
  const { peerId, serviceId } = parsed.data
  const me = session.user.id

  // The service must belong to the logged-in vendor
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    select: { id: true, vendorId: true, vendor: { select: { userId: true } } },
  })
  if (!service || service.vendor.userId !== me) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 })
  }

  const result = await prisma.message.updateMany({
    where: {
      bookingId: null,
      OR: [
        { senderId: me, receiverId: peerId },
        { senderId: peerId, receiverId: me },
      ],
    },
    data: {
      contextServiceId: service.id,
      contextVendorId: service.vendorId,
      contextPackageId: null,
    },
  })

  return NextResponse.json({ ok: true, updated: result.count })
}
