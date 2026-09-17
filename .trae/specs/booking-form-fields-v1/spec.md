# Booking Form Fields Expansion — Specification

## Problem
The current booking request form (triggered by the **Request to Book** button on a vendor service card) collects only: selected event, single date, a single `time` field (treated as start time), and free-form notes.

Planners submitting a booking need to convey richer context about their event so vendors can prepare accurate quotations and logistics — specifically:
- **When exactly** the service is needed (both start AND end time, not just a single "time").
- **Who** the audience is (age group range, e.g. kids 5–12, adults 21–35).
- **Where** the venue will be sited (indoor vs outdoor), and whether it is a public or private venue — these strongly affect setup for catering / entertainment / decor / attire vendors.
- **What budget range** the planner is working with (min–max MYR), so the vendor knows up-front whether the ask is realistic before accepting / proposing a quotation.

## Users & Goals
| User | Goal |
|---|---|
| **Planner / Organizer** | Submit a richer, more structured booking request so vendors respond with on-target quotations and fewer back-and-forth clarifications. |
| **Vendor** | Receive fuller booking requirements up-front to assess logistics/feasibility faster and to price the job accurately on the first try. |

## Non-Goals
- No changes to booking status lifecycle or permission model (statuses PENDING/ACCEPTED/REJECTED/PAID etc. remain unchanged).
- No changes to Event model, Vendor profile, or Service models.
- No new notification types (the existing NEW_BOOKING notification will simply carry more populated context from the new fields if/when we choose).
- No support for multi-day bookings; `date` remains a single day.
- No currency conversion; everything remains RM (MYR) as already established.

## Functional Requirements
### FR1 — Start & End Time
- The booking dialog form shall collect **two** time inputs: `startTime` (HH:MM, 24h) and `endTime` (HH:MM, 24h), placed side-by-side.
- The existing single `time` field on the booking dialog form shall be renamed/replaced to `startTime`; a new `endTime` field is added next to it.
- `endTime` must be strictly greater than `startTime` (form-level validation with zod-refine).
- Both fields are optional on the form but if either is filled the other becomes required, OR both are optional; to keep it simple — start time required, end time optional with a message if end is before start. *Decision below: startTime required, endTime optional, but if provided must be ≥ startTime + 30 minutes.*
- UI: both inputs use the same `<Input type="time">` with a Clock icon prefix, matching the existing `time` field styling in [booking-dialog.tsx](file:///Users/shahirfarhan/Desktop/archive/eventflow/trae_eventflow/src/app/dashboard/vendors/[id]/booking-dialog.tsx#L204-L218).
- The combined Booking.date `DateTime` shall be built by concatenating the selected date with `startTime`, same pattern as currently (end time stored separately).

### FR2 — Age Group Range (Slider)
- The booking dialog shall render an **age-group double-ended range slider** with values spanning 0 years old → 80+ years old, in increments of 1 year.
- Two numeric labels display the selected **minAge** and **maxAge** above the slider (e.g. "Ages 5 – 12").
- Default values: minAge = 18, maxAge = 60, both inclusive.
- Constraint: `maxAge >= minAge + 2` (at least a 2-year span).
- Because this project's shadcn UI kit does **not** ship a prebuilt `slider.tsx` (confirmed by glob on [ui](file:///Users/shahirfarhan/Desktop/archive/eventflow/trae_eventflow/src/components/ui)), implement a small self-contained range slider using native `<input type="range" multiple … />` styled Tailwind-only or two stacked sliders with an overlay track. Simpler fallback: use a pair of `number` inputs min/max with a visual range bar rendered between them — whichever avoids introducing a new Radix dependency. *Decision: use two side-by-side number inputs (minAge / maxAge) plus a coloured visual range bar rendered purely with a div; this avoids a new Radix install and is still "a slider UX" via the visual bar + numeric scrubbers.*
- Fields are **optional**; planner can leave both unset to indicate "any age / not applicable".

### FR3 — Indoor / Outdoor Venue
- A segmented / pill-select control (two-button toggle) offering `INDOOR` and `OUTDOOR` options.
- Stored as an optional enum-like string `venueType: 'INDOOR' | 'OUTDOOR' | null`.
- Default: unset (no preselection).
- Icons: use `HomeIcon` for indoor and `TreesIcon` or `Sun` for outdoor (both Lucide icons, already in project via `lucide-react`).

### FR4 — Public / Private Venue
- Another segmented / pill-select control offering `PUBLIC` and `PRIVATE` options.
- Stored as optional `venueAccess: 'PUBLIC' | 'PRIVATE' | null`.
- Default: unset.
- Labels with helper hints:
  - **Private** — Home, private estate, by-invite-only hall (no walk-in public).
  - **Public** — Park, public hall, open street, ticketed event open to general public.

### FR5 — Min & Max Budget (RM)
- Two side-by-side number inputs for `budgetMin` and `budgetMax`, both in Ringgit Malaysia.
- Currency symbol "RM" shown as a prefix adornment on each input using lucide `Banknote` / plain text prefix.
- Constraint: if both are set, `budgetMax >= budgetMin + 100`.
- Fields optional; planner may leave them empty.
- Accepts integers or 2-decimal floats.

### FR6 — Persistence on Booking Model
All six new fields are stored on the Booking record:
| Field | DB Type | Nullable | Notes |
|---|---|---|---|
| `startTime` | `String @db.VarChar(8)` | Y | HH:MM(:SS) stored as plain string (same pattern as ChatQuotation.time). Kept nullable for backward-compat with existing rows. |
| `endTime` | `String @db.VarChar(8)` | Y | Same format. |
| `minAge` | `Int` | Y | 0–120. |
| `maxAge` | `Int` | Y | 0–120, must be ≥ minAge when both set. |
| `venueType` | `String @db.VarChar(16)` | Y | 'INDOOR' \| 'OUTDOOR'. |
| `venueAccess` | `String @db.VarChar(16)` | Y | 'PUBLIC' \| 'PRIVATE'. |
| `budgetMin` | `Float` | Y | MYR. |
| `budgetMax` | `Float` | Y | MYR. |

Note: There is already a combined `date DateTime` field in Booking which stores startTime merged with the date; adding a separate plain-string `startTime` field avoids parsing the `date` column for UI re-renders and also works cleanly for nulls/partials.

### FR7 — Booking POST API
- [POST /api/bookings](file:///Users/shahirfarhan/Desktop/archive/eventflow/trae_eventflow/src/app/api/bookings/route.ts) shall accept all eight new fields in the JSON body, coerce/validate types on best-effort basis (Float for budgets, Int for ages, strings for times/enums, null when empty) and persist them inside the `prisma.booking.create` call.
- For backward compatibility, omitting these fields entirely must still succeed (they're all nullable).

### FR8 — Booking PUT / Status API
The status-change-only PUT endpoint at [/api/bookings/[bookingId]/route.ts](file:///Users/shahirfarhan/Desktop/archive/eventflow/trae_eventflow/src/app/api/bookings/[bookingId]/route.ts) does **not** permit editing these detail fields. A separate patch endpoint is explicitly out of scope.

### FR9 — Display in Bookings List Cards
- [bookings-list.tsx](file:///Users/shahirfarhan/Desktop/archive/eventflow/trae_eventflow/src/app/dashboard/bookings/bookings-list.tsx) `Booking` interface shall include the 8 new fields (all nullable).
- The [page.tsx](file:///Users/shahirfarhan/Desktop/archive/eventflow/trae_eventflow/src/app/dashboard/bookings/page.tsx) server-side findMany shall include them (they are top-level scalar fields, no include needed — but the TS Booking interface prop must be widened to accept them).
- Card content (`CardContent`, currently shows location / guests / special requests) adds a second info grid for:
  - **Time**: "10:00 – 14:30" (falls back to just start, hides if both null).
  - **Ages**: "Ages 5 – 12" (hides if both null).
  - **Venue**: "Indoor · Private" / "Outdoor · Public" etc. (only set parts shown, hides if both venueType and venueAccess are null).
  - **Budget**: "RM 5,000 – RM 15,000" (hides if both null; if only one set shows "RM ≥ X" or "RM ≤ Y").

## Non-Functional Requirements
- **NFR1 (TS types clean):** After changes, `npx tsc --noEmit -p tsconfig.json` exits 0 with no errors printed.
- **NFR2 (Tri-schema parity):** Any Booking model edits in [schema.prisma](file:///Users/shahirfarhan/Desktop/archive/eventflow/trae_eventflow/prisma/schema.prisma) must be mirrored verbatim into both [schema.postgres.prisma](file:///Users/shahirfarhan/Desktop/archive/eventflow/trae_eventflow/prisma/schemas/schema.postgres.prisma) and [schema.sqlite.prisma](file:///Users/shahirfarhan/Desktop/archive/eventflow/trae_eventflow/prisma/schemas/schema.sqlite.prisma), and `npx prisma validate` must pass for all three, and `npx prisma generate` must be run against all three schemas.
- **NFR3 (DB migration idempotent):** New migration SQL wraps new column additions in `ALTER TABLE … ADD COLUMN IF NOT EXISTS` or equivalent `DO $$ BEGIN … EXCEPTION WHEN duplicate_column THEN NULL; END $$;` Postgres blocks so re-running deploy does not error.
- **NFR4 (No new Radix/shadcn installs):** Avoid installing a new slider primitive; use native number inputs + visual bar pattern.
- **NFR5 (UX consistency):** Form fields use existing project components: `Label`, `Input`, `Button`, `Badge`, `Textarea`, Lucide icons, Tailwind classes matching existing style in booking-dialog.
- **NFR6 (Backward compat):** Existing bookings (all new fields NULL) continue rendering the booking list cards without layout breakage.
- **NFR7 (Non-blocking notifications):** Existing NEW_BOOKING notification fire in [route.ts](file:///Users/shahirfarhan/Desktop/archive/eventflow/trae_eventflow/src/app/api/bookings/route.ts#L86-L96) continues to work as-is; new fields are not added to the notification context string in this ticket (can be a follow-up enhancement).

## Constraints & Dependencies
- **DB backend:** Supabase Postgres (pooler 6543, direct 5432). Migration `prisma migrate deploy` run against direct URL via existing `.env` vars `DATABASE_URL` / `DIRECT_URL`.
- **Tri-schema copies:** Established project pattern — edits must apply identically to all 3 schema files, followed by 3x generate.
- **No new npm dependencies.** Slider UX must be built from native inputs + Tailwind. (Project already has `lucide-react` for icons).
- **Form library:** Keep existing `react-hook-form` + `zodResolver` stack in booking-dialog.tsx.

## Assumptions
1. The existing single `time` field sent to the backend is only used to combine with `date` into a single `Booking.date DateTime` column (see [route.ts L32-L33](file:///Users/shahirfarhan/Desktop/archive/eventflow/trae_eventflow/src/app/api/bookings/route.ts#L32-L33)). We will keep that exact `time` field **also** sent for backwards compatibility *plus* additionally send `startTime` and `endTime` as separate top-level fields so the combined DateTime keeps working.
2. Budget ranges and age ranges are **informational** only; they are not enforced against final negotiated price.
3. Venue type/access are also planner-declared hints; vendors can still dispute or ask clarifications via the existing chat dialog.
4. The secondary public booking route [/vendors/[id]/book/page.tsx](file:///Users/shahirfarhan/Desktop/archive/eventflow/trae_eventflow/src/app/vendors/[id]/book/page.tsx) is out of scope for this iteration — only the Request to Book dialog on vendor profile dashboard page ([booking-dialog.tsx](file:///Users/shahirfarhan/Desktop/archive/eventflow/trae_eventflow/src/app/dashboard/vendors/[id]/booking-dialog.tsx)) gets the form expansion. If the public booking flow exists it will keep working with its existing fields; parity can be a follow-up task.

## Open Questions
(OQE1) Should the BookingCard display be the same for both VENDOR and ORGANIZER roles? — **Yes**, both sides benefit from seeing the structured metadata.
(OQE2) Age range slider. Should we cap the max at 80 or 100? — **100** max for ages, with a +2 span min and 0 minimum.
(OQE3) Start time mandatory but end time optional? — **Yes**, that matches how most planners think (they know when they need the vendor on-site but not exactly when the job ends). If end time is set require ≥ start + 30 min.

## Acceptance Criteria
### Rule AC1 — Booking model extended
`prisma validate` passes 0/3 and `Booking` includes nullable fields: startTime, endTime, minAge, maxAge, venueType, venueAccess, budgetMin, budgetMax. Verified by running `prisma validate` 3x + `prisma generate` 3x.
### Rule AC2 — Migration deployable
New migration SQL runs to EXIT 0 against Supabase via `prisma migrate deploy` EXIT 0, running it a second consecutive time also EXITs 0 (idempotency check).
### Rule AC3 — Form renders all 5 new field groups
When a planner opens the "Request to Book" dialog, the form fields section visually shows (in order after Event select + existing Date + Start/End Time row): Budget Min/Max row, Indoor/Outdoor pill row, Public/Private pill row, Age range with numeric scrubbers + visual bar row, Notes.
### Rule AC4 — Form client-side validation
Submitting with, e.g., endTime before startTime OR budgetMax < budgetMin OR maxAge < minAge triggers inline red error messages and blocks form submission (zod + react-hook-form error display matching existing pattern).
### Rule AC5 — Payload wire format
Browser network tab, when submitting a fully filled form, shows JSON body in POST to /api/bookings includes keys: time (= startTime for back-compat), startTime, endTime, minAge, maxAge, venueType, venueAccess, budgetMin, budgetMax, in addition to existing keys (vendorId, serviceId, eventId, date, notes, price).
### Rule AC6 — New fields persisted
The created Booking row in Supabase `SELECT * FROM "Booking" WHERE id = …` contains non-null values for the 8 new columns matching the form values filled in AC5.
### Rule AC7 — Bookings list card displays structured metadata
Dashboard Bookings list cards, for a booking created in AC5, now renders additional structured lines: time range, ages, venue (type + access), budget range — each row with matching Lucide icon prefix, existing style of location/guests rows.
### Rule AC8 — Empty/null fields no-op display
Existing pre-migration bookings with all 8 new fields NULL render exactly as before (no extra blank rows or icon placeholders).
### Rubric AC9 — Form UX consistency
Score 0–2; pass threshold ≥ 1.5.
- 2: All new controls match existing shadcn/booking-dialog visual language (same label styles, spacing grid gap-4, pill buttons reuse Button variant="outline"/"default" toggle, lucide icons, input prefixes consistent with existing Clock input on `time`). Field ordering groups "when → how much → where → who → notes" logically.
- 1: Controls work and validate but layout/spacing diverges noticeably from existing fields or icons are missing / wrong.
- 0: Field layout is broken, errors show as toasts instead of inline, or styling is obviously inconsistent.
### Rubric AC10 — Code maintainability
Score 0–2; pass threshold ≥ 1.5.
- 2: Zod schema is the single source of truth for validation (start<end, age span, budget span); server-side re-validates numeric ranges on best-effort basis before writing. New enums stored as plain strings (not Postgres ENUM type) — matches existing pattern (Booking.status is string, not enum).
- 1: Form validates but server-side trusts the request types blindly without any coercion / null-fallback.
- 0: Validation duplicated in three or more places, or server-side enforces no constraints at all leading to bad data (negative budget, maxAge<minAge, etc).
