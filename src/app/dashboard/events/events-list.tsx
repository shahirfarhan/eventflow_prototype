"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";

import {
  MoreHorizontal,
  Pencil,
  Trash,
  Calendar as CalendarIcon,
  MapPin,
  DollarSign,
  CalendarCheck,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import EventDialog from "./event-dialog";

interface Event {
  id: string;
  title: string;
  date: string | Date;
  location: string;
  type: string;
  budget: number;
}

interface EventsListProps {
  events: Event[];
}

export default function EventsList({ events }: EventsListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) {
      return;
    }

    setDeletingId(id);

    try {
      const response = await fetch(`/api/organizer/events/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      toast.success("Event deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  {/* ============================================================
      EMPTY STATE
  ============================================================ */}

  if (events.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
        <h3 className="text-lg font-semibold text-foreground">
          No events yet
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          Get started by creating a new event.
        </p>

        <div className="mt-6">
          <Link href="/dashboard/events/new">
            <Button>
              <PlusIcon />
              Create Event
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

      {/* ==========================================================
          EVENT CARDS
      ========================================================== */}

      {events.map((event) => (
        <Card
          key={event.id}
          className="overflow-hidden transition-shadow hover:shadow-md"
        >
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="min-w-0 space-y-1 pr-3">
              <CardTitle className="truncate">
                {event.title}
              </CardTitle>

              <CardDescription className="font-semibold text-primary">
                {event.type}
              </CardDescription>
            </div>

            {/* Event menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 shrink-0 p-0"
                >
                  <span className="sr-only">
                    Open menu
                  </span>

                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">

                {/* Edit */}
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/events/${event.id}/edit`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>

                {/* Bookings */}
                <DropdownMenuItem
                  onClick={() =>
                    router.push("/dashboard/bookings")
                  }
                >
                  <CalendarCheck className="mr-2 h-4 w-4" />
                  Bookings
                </DropdownMenuItem>

                {/* Delete */}
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={() => handleDelete(event.id)}
                  disabled={deletingId === event.id}
                >
                  <Trash className="mr-2 h-4 w-4" />

                  {deletingId === event.id
                    ? "Deleting..."
                    : "Delete"}
                </DropdownMenuItem>

              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>

          <CardContent className="space-y-3 text-sm text-muted-foreground">

            {/* Date */}
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4 shrink-0 opacity-70" />

              {format(
                new Date(event.date),
                "PPP"
              )}
            </div>

            {/* Location */}
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4 shrink-0 opacity-70" />

              <span className="truncate">
                {event.location}
              </span>
            </div>

            {/* Budget */}
            <div className="flex items-center">
              <DollarSign className="mr-2 h-4 w-4 shrink-0 opacity-70" />

              Budget: RM
              {event.budget.toLocaleString()}
            </div>

          </CardContent>
        </Card>
      ))}

      {/* ==========================================================
          CREATE NEW EVENT CARD
      ========================================================== */}

      <Card className="relative flex min-h-[200px] flex-col items-center justify-center border-dashed border-border transition-colors hover:bg-accent/50">

        <Link
          href="/dashboard/events/new"
          className="absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <span className="text-2xl font-light text-primary">
              +
            </span>
          </div>

          <span className="text-sm font-medium text-foreground">
            Create New Event
          </span>
        </Link>

      </Card>
    </div>
  );
}

/* ================================================================
   SMALL PLUS ICON
================================================================ */

function PlusIcon() {
  return (
    <span className="mr-2 text-lg leading-none">
      +
    </span>
  );
}
