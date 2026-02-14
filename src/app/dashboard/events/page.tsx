import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import EventsList from "./events-list";
import EventDialog from "./event-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function OrganizerEventsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ORGANIZER") {
    redirect("/dashboard");
  }

  const events = await prisma.event.findMany({
    where: { organizerId: session.user.id },
    orderBy: { date: 'asc' },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Events</h1>
          <p className="text-muted-foreground">
            Manage your upcoming events and plan details.
          </p>
        </div>
        <EventDialog 
          trigger={
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create Event
            </Button>
          }
        />
      </div>

      <EventsList events={events} />
    </div>
  );
}
