import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ServicesList from "./services-list";
import ServiceDialog from "./service-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function VendorServicesPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "VENDOR") {
    redirect("/dashboard");
  }

  const vendor = await prisma.vendorProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!vendor) {
    return <div>Vendor profile not found.</div>;
  }

  const services = await prisma.service.findMany({
    where: { vendorId: vendor.id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services & Packages</h1>
          <p className="text-muted-foreground">
            Manage the services you offer to event organizers.
          </p>
        </div>
        <ServiceDialog 
          trigger={
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Service
            </Button>
          }
        />
      </div>

      <ServicesList services={services} />
    </div>
  );
}
