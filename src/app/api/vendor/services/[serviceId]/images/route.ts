import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

const MAX_PHOTOS = 8

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ serviceId: string }> },
) {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "VENDOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { serviceId } = await params

  // Safety: without an id, Prisma would treat the filters below as "match everything"
  if (!serviceId) {
    return NextResponse.json({ error: "Missing service id" }, { status: 400 })
  }

  // Only the vendor who owns the service can change its photos
  const service = await prisma.service.findFirst({
    where: { id: serviceId, vendor: { userId: session.user.id } },
    select: { id: true },
  })
  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 })
  }

  const body = await req.json().catch(() => null)
  const urls: unknown = body?.urls
  if (!Array.isArray(urls)) {
    return NextResponse.json({ error: "urls must be a list" }, { status: 400 })
  }

  const clean = Array.from(
    new Set(
      urls.filter(
        (u): u is string =>
          typeof u === "string" &&
          u.length > 0 &&
          u.length < 2000 &&
          (u.startsWith("http") || u.startsWith("/")),
      ),
    ),
  )

  if (clean.length > MAX_PHOTOS) {
    return NextResponse.json({ error: `You can add up to ${MAX_PHOTOS} photos` }, { status: 400 })
  }

  // Replace the old list. createdAt is staggered by 1ms so the order you chose is kept
  // (the first photo is the cover).
  await prisma.serviceImage.deleteMany({ where: { serviceId: service.id } })
  if (clean.length > 0) {
    const start = Date.now()
    await prisma.serviceImage.createMany({
      data: clean.map((url, i) => ({
        serviceId: service.id,
        url,
        createdAt: new Date(start + i),
      })),
    })
  }

  return NextResponse.json({ ok: true, count: clean.length })
}