import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DashboardHeader } from "@/components/dashboard/ui";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import InboxList from "./inbox-list";

export default async function InboxPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const role = session.user.role;
  const isVendor = role === "VENDOR";

  const vendor = isVendor
    ? await prisma.vendorProfile.findUnique({
        where: { userId: session.user.id },
        select: { id: true },
      })
    : null;

  // Counts for the red badges on the tabs
  const [pendingCount, unreadCount] = await Promise.all([
    vendor
      ? prisma.booking.count({ where: { vendorId: vendor.id, status: "PENDING" } })
      : Promise.resolve(0),
    prisma.message.count({ where: { receiverId: session.user.id, readAt: null } }),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-3xl space-y-6 px-4 pb-28 pt-6 sm:px-6 md:space-y-8 md:pb-10 md:pt-10">
        <DashboardHeader
          title="Inbox"
          description={
            isVendor
              ? "Chats with planners about your services and bookings."
              : "Chats with vendors about your events and bookings."
          }
        />

        <DashboardNav
          isVendor={isVendor}
          isOrganizer={role === "ORGANIZER"}
          pendingCount={pendingCount}
          unreadCount={unreadCount}
        />

        <InboxList />
      </main>
    </div>
  );
}
