import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import VendorCalendar from "./vendor-calendar";

export default async function VendorCalendarPage() {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">
          Block out dates you are not available so planners can’t book you.
        </p>
      </div>
      <VendorCalendar />
    </div>
  );
}

