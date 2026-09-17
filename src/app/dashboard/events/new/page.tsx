import { auth } from "@/auth";
import { redirect } from "next/navigation";
import EventForm from "./event-form";

export default async function NewEventPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string; prefillName?: string }>;
}) {
  const session = await auth();
  const { returnTo } = await searchParams;

  if (!session?.user || session.user.role !== "ORGANIZER") {
    redirect(`/login?callbackUrl=/dashboard/events/new`);
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
            Planner Workspace
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Event</h1>
          <p className="text-muted-foreground mt-2">
            Set up the basics of your event. After creating it you can attach vendor bookings,
            track budgets, and keep everything organized in one place.
          </p>
        </div>

        <EventForm defaultReturnTo={returnTo || null} />
      </div>
    </div>
  );
}
