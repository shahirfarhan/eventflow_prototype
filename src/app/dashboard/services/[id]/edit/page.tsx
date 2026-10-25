import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ServiceForm from "../../service-form";

/**
 * /dashboard/services/[id]/edit — opened from the "···" → Edit menu and the
 * "Finish setup" button on the Services page. Uses the same form as "New service",
 * filled in with this service's saved details.
 */
export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "VENDOR") redirect("/dashboard");

  const { id } = await params;

  // Only load it if it belongs to this vendor, so nobody can edit someone else's service
  const service = await prisma.service.findFirst({
    where: { id, vendor: { userId: session.user.id } },
    select: {
      id: true,
      name: true,
      description: true,
      basePrice: true,
      pricingModel: true,
      occasions: true,
      locationsCovered: true,
      includedItems: true,
      minGuests: true,
      maxGuests: true,
      // Oldest first = the order the vendor chose (first is the cover)
      images: { select: { url: true }, orderBy: { createdAt: "asc" } },
    },
  });

  if (!service) notFound();

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6 md:pt-10 lg:px-8">
        <ServiceForm service={{ ...service, images: service.images.map((img) => img.url) }} />
      </main>
    </div>
  );
}
