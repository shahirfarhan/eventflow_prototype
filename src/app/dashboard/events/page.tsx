// import { auth } from "@/auth";
// import { prisma } from "@/lib/prisma";
// import { redirect } from "next/navigation";
// import EventsList from "./events-list";
// import { Button } from "@/components/ui/button";
// import { Plus, ArrowRight } from "lucide-react";
// import Link from "next/link";

// export default async function OrganizerEventsPage() {
//   const session = await auth();

//   if (!session?.user || session.user.role !== "ORGANIZER") {
//     redirect("/dashboard");
//   }

//   const events = await prisma.event.findMany({
//     where: { organizerId: session.user.id },
//     orderBy: { date: 'asc' },
//   });

//   return (
//     <div className="space-y-8">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">My Events</h1>
//           <p className="text-muted-foreground">
//             Manage your upcoming events and plan details.
//           </p>
//         </div>
//         <Button asChild>
//           <Link href="/dashboard/events/new">
//             <Plus className="mr-2 h-4 w-4" /> Create Event
//             <ArrowRight className="ml-2 h-4 w-4" />
//           </Link>
//         </Button>
//       </div>

//       <EventsList events={events} />
//     </div>
//   );
// }


//----

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import EventsList from "./events-list";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function OrganizerEventsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ORGANIZER") {
    redirect("/dashboard");
  }

  const events = await prisma.event.findMany({
    where: {
      organizerId: session.user.id,
    },
    orderBy: {
      date: "asc",
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-brand">
              Events
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              My Events
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Manage your upcoming events and plan details.
            </p>
          </div>

          <div>
            <Link href="/dashboard/events/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Event
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Events */}
        <div className="mt-8">
          <EventsList events={events} />
        </div>

      </main>
    </div>
  );
}
