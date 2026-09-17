import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import EventForm from "../../new/event-form"

type EditEventPageProps = {
  params: Promise<{
    eventId: string
  }>
}

export default async function EditEventPage({
  params,
}: EditEventPageProps) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  if (session.user.role !== "ORGANIZER") {
    redirect("/dashboard")
  }

  const { eventId } = await params

  const event = await prisma.event.findFirst({
    where: {
      id: eventId,
      organizerId: session.user.id,
    },
  })

  if (!event) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
            Planner Workspace
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Event</h1>
          <p className="text-muted-foreground mt-2">
            Update the details of your event. Changes will be reflected across any linked bookings.
          </p>
        </div>

        <EventForm
          event={{
            id: event.id,
            title: event.title,
            date: event.date.toISOString(),
            location: event.location,
            type: event.type,
            budget: event.budget,
            startTime: event.startTime,
            endTime: event.endTime,
            budgetMin: event.budgetMin,
            budgetMax: event.budgetMax,
            headcount: event.headcount,
            minAge: event.minAge,
            maxAge: event.maxAge,
            venueType: event.venueType,
            venueAccess: event.venueAccess,
            notes: event.notes,
          }}
        />
      </div>
    </div>
  )
}