"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Check, ImageIcon, MoreHorizontal, Pencil, Plus, Trash } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { EmptyState, buttonPrimary, formatRM } from "@/components/dashboard/ui";

interface Service {
  id: string;
  name: string;
  description: string | null;
  basePrice: number;
  occasions: string | null;
  pricingModel: string;
  locationsCovered: string[];
  includedItems: string[];
  minGuests: number | null;
  maxGuests: number | null;
  images?: { id: string; url: string }[];
  packages?: { id: string }[];
  bookings?: { status: string }[];
  /** Only loaded for admins, to show whose service it is */
  vendor?: { id: string; businessName: string } | null;
}

interface ServicesListProps {
  services: Service[];
  /** Admin: see every vendor's services, read-only (no edit/delete/add) */
  adminView?: boolean;
}

type Filter = "all" | "ready" | "setup";

/* ================================================================
   HELPERS
================================================================ */

const priceUnit: Record<string, string> = {
  FIXED: "/ event",
  PER_HOUR: "/ hour",
  PER_PAX: "/ pax",
  PER_DAY: "/ day",
  CUSTOM: "· custom quote",
};

/** Soft cover colours used when a service has no photo yet. */
const coverTones = [
  "bg-[#F6D9CB] text-[#B4532A]",
  "bg-[#DCE5F5] text-[#3A5BA0]",
  "bg-[#DCEFE3] text-[#2F7A4E]",
  "bg-[#ECE2F4] text-[#7350A0]",
];

const splitOccasions = (value: string | null) =>
  (value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

/** The three things that make a listing convincing to planners. */
function setupSteps(service: Service) {
  return [
    { label: "Set a price", done: service.basePrice > 0 },
    { label: "Write a description", done: !!service.description?.trim() },
    { label: "Add at least 3 photos", done: (service.images?.length ?? 0) >= 3 },
  ];
}

const isReady = (service: Service) => setupSteps(service).every((s) => s.done);

/* ================================================================
   MAIN
================================================================ */

export default function ServicesList({ services, adminView = false }: ServicesListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const readyCount = services.filter(isReady).length;
  const setupCount = services.length - readyCount;
  const [filter, setFilter] = useState<Filter>("all");

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/vendor/services/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete service");

      toast.success("Service deleted successfully");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  /* ---------- No services at all ---------- */

  if (services.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card">
        <EmptyState
          icon={<ImageIcon className="h-5 w-5" />}
          title="No services yet"
          description={
            adminView
              ? "No vendor has listed a service yet."
              : "Add your first service so planners can find and book you."
          }
          action={
            adminView ? undefined : (
              <Link href="/dashboard/services/new" className={buttonPrimary}>
                <Plus className="h-4 w-4" />
                New service
              </Link>
            )
          }
        />
      </div>
    );
  }

  const visible = services.filter((s) =>
    filter === "all" ? true : filter === "ready" ? isReady(s) : !isReady(s),
  );

  return (
    <div className="space-y-6">
      {/* ==========================================================
          FILTER PILLS
      ========================================================== */}

      <div className="flex flex-wrap gap-2">
        <FilterPill active={filter === "all"} onClick={() => setFilter("all")}>
          All · {services.length}
        </FilterPill>
        <FilterPill active={filter === "ready"} onClick={() => setFilter("ready")}>
          Ready · {readyCount}
        </FilterPill>
        <FilterPill active={filter === "setup"} onClick={() => setFilter("setup")}>
          Needs setup · {setupCount}
        </FilterPill>
      </div>

      {/* ==========================================================
          CARDS
      ========================================================== */}

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center text-sm text-muted-foreground">
          {filter === "setup"
            ? "Every service is fully set up. Nice work."
            : adminView
              ? "No services are fully set up yet."
              : "None of your services are fully set up yet."}
        </div>
      ) : (
        <div className="grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((service) => {
            const index = services.indexOf(service);
            return isReady(service) ? (
              <ServiceCard
                key={service.id}
                service={service}
                tone={coverTones[index % coverTones.length]}
                adminView={adminView}
                deleting={deletingId === service.id}
                onDelete={() => handleDelete(service.id)}
              />
            ) : (
              <SetupCard
                key={service.id}
                service={service}
                adminView={adminView}
                deleting={deletingId === service.id}
                onDelete={() => handleDelete(service.id)}
              />
            );
          })}

          {/* Add new service */}
          {filter === "all" && !adminView && (
            <Link
              href="/dashboard/services/new"
              className="flex min-h-[160px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed md:min-h-[280px] border-border bg-card/60 text-foreground transition-colors hover:bg-card"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-muted text-brand-strong">
                <Plus className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold">Add new service</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

/* ================================================================
   PIECES
================================================================ */

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex h-11 items-center rounded-full px-5 text-sm transition-colors",
        active
          ? "bg-foreground font-semibold text-background"
          : "border border-border bg-card font-medium text-foreground hover:bg-muted",
      )}
    >
      {children}
    </button>
  );
}

function ServiceMenu({
  serviceId,
  deleting,
  onDelete,
  className,
}: {
  serviceId: string;
  deleting: boolean;
  onDelete: () => void;
  className?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl bg-card text-foreground shadow-sm transition-colors hover:bg-muted",
            className,
          )}
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/services/${serviceId}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600"
          onClick={onDelete}
          disabled={deleting}
        >
          <Trash className="mr-2 h-4 w-4" />
          {deleting ? "Deleting..." : "Delete"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ---------------- Full card (service is set up) ---------------- */

function ServiceCard({
  service,
  tone,
  adminView,
  deleting,
  onDelete,
}: {
  service: Service;
  tone: string;
  adminView: boolean;
  deleting: boolean;
  onDelete: () => void;
}) {
  const cover = service.images?.[0]?.url;
  const occasions = splitOccasions(service.occasions);
  const shown = occasions.slice(0, 3);
  const extra = occasions.length - shown.length;

  const bookings = service.bookings ?? [];
  const booked = bookings.filter((b) =>
    ["ACCEPTED", "PAID", "CONFIRMED", "COMPLETED"].includes(b.status),
  ).length;
  const packages = service.packages?.length ?? 0;

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
      {/* Cover */}
      <div className={cn("relative flex h-48 items-center justify-center", !cover && tone)}>
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <ImageIcon className="h-10 w-10" strokeWidth={1.5} />
        )}

        <span className="absolute left-4 top-4 rounded-full bg-card px-2.5 py-1 text-xs font-bold text-emerald-700">
          Live
        </span>
        {!adminView && (
          <ServiceMenu
            serviceId={service.id}
            deleting={deleting}
            onDelete={onDelete}
            className="absolute right-4 top-4"
          />
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6">
        {adminView && <VendorLine vendor={service.vendor} />}
        <h3 className="text-lg font-semibold text-foreground">{service.name}</h3>
        <p className="mt-1 text-foreground">
          <span className="font-semibold">From {formatRM(service.basePrice)}</span>{" "}
          <span className="text-muted-foreground">
            {priceUnit[service.pricingModel] ?? ""}
          </span>
        </p>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{service.description}</p>

        {shown.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {shown.map((o) => (
              <span
                key={o}
                className="rounded-full bg-muted px-3 py-1 text-sm text-foreground"
              >
                {o}
              </span>
            ))}
            {extra > 0 && (
              <span className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
                +{extra}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="mt-auto flex items-center justify-between border-t border-border px-6 py-4 text-sm text-muted-foreground">
        <span>
          <span className="font-semibold text-foreground">{packages}</span>{" "}
          {packages === 1 ? "package" : "packages"}
        </span>
        <span>
          <span className="font-semibold text-foreground">{bookings.length}</span>{" "}
          {bookings.length === 1 ? "request" : "requests"}
        </span>
        <span>
          <span className="font-semibold text-foreground">{booked}</span> booked
        </span>
      </div>
    </article>
  );
}

/* ---------------- Setup card (something missing) ---------------- */

function SetupCard({
  service,
  adminView,
  deleting,
  onDelete,
}: {
  service: Service;
  adminView: boolean;
  deleting: boolean;
  onDelete: () => void;
}) {
  const steps = setupSteps(service);
  const done = steps.filter((s) => s.done).length;

  return (
    <article className="flex min-h-[280px] flex-col rounded-2xl border border-dashed border-foreground/20 bg-card p-6">
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-bold text-muted-foreground">
          Needs setup
        </span>
        {!adminView && (
          <ServiceMenu
            serviceId={service.id}
            deleting={deleting}
            onDelete={onDelete}
            className="border border-border shadow-none"
          />
        )}
      </div>

      {adminView && <div className="mt-3"><VendorLine vendor={service.vendor} /></div>}
      <h3 className="mt-3 text-lg font-semibold text-foreground">{service.name}</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        {adminView
          ? "This listing is missing some details."
          : "Almost there. Planners can already see this, but complete listings get far more bookings."}
      </p>

      {/* Progress */}
      <div className="mt-5 flex gap-2">
        {steps.map((s) => (
          <span
            key={s.label}
            className={cn("h-1.5 flex-1 rounded-full", s.done ? "bg-brand" : "bg-border")}
          />
        ))}
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        Step {done} of {steps.length} done
      </p>

      <ul className="mt-4 space-y-2 text-sm">
        {steps.map((s) => (
          <li
            key={s.label}
            className={cn(
              "flex items-center gap-2",
              s.done ? "text-muted-foreground line-through" : "text-foreground",
            )}
          >
            <span
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                s.done ? "bg-emerald-50 text-emerald-700" : "border border-border",
              )}
            >
              {s.done && <Check className="h-3 w-3" />}
            </span>
            {s.label}
          </li>
        ))}
      </ul>

      {!adminView && (
        <div className="mt-auto pt-6">
          <Link
            href={`/dashboard/services/${service.id}/edit`}
            className={cn(buttonPrimary, "w-full")}
          >
            Finish setup
          </Link>
        </div>
      )}
    </article>
  );
}

/* ---------------- Admin: whose service this is ---------------- */

function VendorLine({ vendor }: { vendor?: { id: string; businessName: string } | null }) {
  if (!vendor) return null;
  return (
    <Link
      href={`/vendors/${vendor.id}`}
      className="mb-1 inline-block max-w-full truncate text-xs font-bold uppercase tracking-wider text-brand-strong hover:underline"
    >
      {vendor.businessName}
    </Link>
  );
}
