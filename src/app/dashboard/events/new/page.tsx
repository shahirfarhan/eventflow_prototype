import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/auth";
import { MobileTabBar } from "@/components/dashboard/mobile-tab-bar";
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
    <div className="min-h-screen bg-background">
      <main className="mx-auto w-full max-w-4xl px-4 pb-10 pt-6 sm:px-6 md:pt-10">
        {/* Back link: easier than the browser back button on phones */}
        <Link
          href={returnTo || "/dashboard?tab=events"}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <div className="mt-4 md:mt-6">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-strong">
            Planner workspace
          </p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Create new event
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Set up the basics of your event. You can add vendor bookings and track your budget
            afterwards.
          </p>
        </div>

        <div className="mt-6 md:mt-8">
          <EventForm defaultReturnTo={returnTo || null} />
        </div>
      </main>

      {/* Bottom tab bar on phones */}
      <MobileTabBar />
    </div>
  );
}