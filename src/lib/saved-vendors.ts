"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export type ToggleSavedVendorResult =
  | { ok: true; saved: boolean }
  | { ok: false; error: string }

export async function toggleSavedVendor(
  vendorId: string
): Promise<ToggleSavedVendorResult> {
  const session = await auth()

  if (!session?.user?.id) {
    return { ok: false, error: "Please sign in to save vendors." }
  }
  if (session.user.role !== "ORGANIZER") {
    return { ok: false, error: "Only event planners can save vendors." }
  }

  const userId = session.user.id
  const existing = await prisma.savedVendor.findUnique({
    where: { userId_vendorId: { userId, vendorId } },
  })

  if (existing) {
    await prisma.savedVendor.delete({ where: { id: existing.id } })
  } else {
    const vendor = await prisma.vendorProfile.findUnique({
      where: { id: vendorId },
      select: { id: true },
    })
    if (!vendor) {
      return { ok: false, error: "Vendor not found." }
    }
    // upsert guards against a double-click race on the unique constraint
    await prisma.savedVendor.upsert({
      where: { userId_vendorId: { userId, vendorId } },
      create: { userId, vendorId },
      update: {},
    })
  }

  revalidatePath("/dashboard")
  revalidatePath("/vendors")
  revalidatePath(`/vendors/${vendorId}`)

  return { ok: true, saved: !existing }
}
