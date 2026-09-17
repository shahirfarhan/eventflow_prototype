# Booking Form Fields Expansion — Implementation Tasks

Parent spec: [spec.md](file:///Users/shahirfarhan/Desktop/archive/eventflow/trae_eventflow/.trae/specs/booking-form-fields-v1/spec.md)

## Task 1: Extend Booking Prisma model (3 schema copies + migration + deploy + 3x generate)

**Status:** pending
**Priority:** high
**Maps to AC:** Rule AC1, Rule AC2
**Files to edit:**
- [prisma/schema.prisma](file:///Users/shahirfarhan/Desktop/archive/eventflow/trae_eventflow/prisma/schema.prisma) (main, inside `model Booking { … }`)
- [prisma/schemas/schema.postgres.prisma](file:///Users/shahirfarhan/Desktop/archive/eventflow/trae_eventflow/prisma/schemas/schema.postgres.prisma) (structural mirror)
- [prisma/schemas/schema.sqlite.prisma](file:///Users/shahirfarhan/Desktop/archive/eventflow/trae_eventflow/prisma/schemas/schema.sqlite.prisma) (structural mirror)
- New file: `prisma/migrations/20260911000000_add_booking_detail_fields/migration.sql` (new)

**Implementation notes:**
- Append these nullable fields to Booking model, after `guests Int?` and before `specialRequests`:
  ```
  startTime   String?  @db.VarChar(8)
  endTime     String?  @db.VarChar(8)
  minAge      Int?
  maxAge      Int?
  venueType   String?  @db.VarChar(16)
  venueAccess String?  @db.VarChar(16)
  budgetMin   Float?
  budgetMax   Float?
  ```
- SQLite schema: drop `@db.VarChar(N)` modifiers (SQLite doesn't support them — just `String?`) but keep the field names identical.
- Migration SQL, run `prisma migrate dev --create-only` against the main schema to generate it OR hand-write idempotent ALTER TABLE blocks wrapping each of the 8 `ADD COLUMN IF NOT EXISTS` + optional indexes (no indexes needed here unless used in WHERE — none planned). For Postgres idempotency of ADD COLUMN on pre-existing column: use `DO $$ BEGIN ALTER TABLE "Booking" ADD COLUMN "startTime" VARCHAR(8); EXCEPTION WHEN duplicate_column THEN NULL; END $$;` for each of the 8 columns.
- Run the 3 validates, then the deploy, then the 3 generates — see verify rules.

**Test Requirements (TR):**
- TR 1.1 (rule): `npx prisma validate --schema=prisma/schema.prisma` exits 0 with "schema is valid". Evidence: console run exit 0.
- TR 1.2 (rule): Same EXIT 0 for both copies: `--schema=prisma/schemas/schema.postgres.prisma` and sqlite. Evidence: console run exit 0.
- TR 1.3 (rule): `npx prisma migrate deploy --schema=prisma/schema.prisma` EXIT 0 against Supabase on the first run AND a second consecutive run (idempotency). Evidence: console output two runs both EXIT 0.
- TR 1.4 (rule): `npx prisma generate --schema=prisma/schema.prisma` + same for postgres + sqlite copies all EXIT 0. Evidence: three consecutive runs all EXIT 0.

---

## Task 2: Update POST /api/bookings route to accept + persist 8 new fields

**Status:** pending
**Priority:** high
**Depends on:** Task 1 (must have new columns deployed before the write succeeds)
**Maps to AC:** Rule AC5 (payload wire) + Rule AC6 (persisted)
**File:** [src/app/api/bookings/route.ts](file:///Users/shahirfarhan/Desktop/archive/eventflow/trae_eventflow/src/app/api/bookings/route.ts)

**Implementation notes:**
1. Destructure all 8 new keys from body alongside existing fields (L15–L26): `startTime, endTime, minAge, maxAge, venueType, venueAccess, budgetMin, budgetMax`.
2. Add best-effort server-side validation/coercion at write time (no zod required here, simple guards):
   - `startTime`/`endTime`: keep as string only if it matches regex `^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$` otherwise null.
   - `minAge`/`maxAge`: parseInt; force within 0..120; if both set and `maxAge < minAge` swap them server-side silently (don't fail — coerce to sensible order).
   - `venueType`: accept only `'INDOOR'` or `'OUTDOOR'` else null.
   - `venueAccess`: accept only `'PUBLIC'` or `'PRIVATE'` else null.
   - `budgetMin`/`budgetMax`: parseFloat, must be >= 0 else null; if both set and `budgetMax < budgetMin` swap silently.
3. Pass all 8 fields into the `prisma.booking.create` `data` object, each guarded by ternary to coerced/null value.
4. Keep the existing combined DateTime line (L32–L33):
   ```
   const bookingDate = new Date(`${date}T${time || startTime || "00:00"}:00`);
   ```
   so it prefers the old `time` key (back-compat) but falls back to the new `startTime` if that's what the form sent.

**Test Requirements:**
- TR 2.1 (rule): `npx tsc --noEmit` after edits — the route.ts doesn't introduce TypeScript errors. (Evidence: tsc run exit 0 in Task 6.)
- TR 2.2 (rule): A manual curl POST with all 8 fields returns 200 and response body contains the new fields. Evidence: curl or a unit test stub pass; we'll assert via the UI end-to-end submit + DB select in Task 6.

---

## Task 3: Expand booking-dialog.tsx form (start/end time + budget + venue toggles + age-range visual bar)

**Status:** pending
**Priority:** high
**Depends on:** Task 2 (server must accept payload)
**Maps to AC:** Rule AC3 (renders 5 groups), Rule AC4 (client-side validates), Rule AC5 (wire format), Rubric AC9 (UX consistency)
**File:** [src/app/dashboard/vendors/[id]/booking-dialog.tsx](file:///Users/shahirfarhan/Desktop/archive/eventflow/trae_eventflow/src/app/dashboard/vendors/[id]/booking-dialog.tsx)

**Implementation notes:**

### 3a. Zod schema
Replace the current bookingSchema (L34–L39) with:
```ts
const bookingSchema = z.object({
  eventId: z.string().min(1, 'Please select an event'),
  date: z.date({ message: 'Please select a date' }),
  startTime: z.string().min(1, 'Please select a start time').regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Invalid time format'),
  endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Invalid time format').optional().or(z.literal('')),
  budgetMin: z.union([z.string().transform(v => v === '' ? undefined : parseFloat(v)), z.number(), z.undefined()]).refine(v => v === undefined || !isNaN(v) && v >= 0, 'Min budget must be ≥ 0').optional(),
  budgetMax: z.union([z.string().transform(v => v === '' ? undefined : parseFloat(v)), z.number(), z.undefined()]).refine(v => v === undefined || !isNaN(v) && v >= 0, 'Max budget must be ≥ 0').optional(),
  venueType: z.enum(['INDOOR', 'OUTDOOR']).optional().or(z.literal('')),
  venueAccess: z.enum(['PUBLIC', 'PRIVATE']).optional().or(z.literal('')),
  minAge: z.union([z.string().transform(v => v === '' ? undefined : parseInt(v, 10)), z.number(), z.undefined()]).refine(v => v === undefined || (!isNaN(v) && v >= 0 && v <= 100), 'Min age must be 0–100').optional(),
  maxAge: z.union([z.string().transform(v => v === '' ? undefined : parseInt(v, 10)), z.number(), z.undefined()]).refine(v => v === undefined || (!isNaN(v) && v >= 0 && v <= 100), 'Max age must be 0–100').optional(),
  notes: z.string().optional(),
}).refine(data => {
  if (data.endTime && data.startTime && data.endTime <= data.startTime) return false;
  return true;
}, { message: 'End time must be after start time', path: ['endTime'] })
  .refine(data => {
    if (typeof data.budgetMin === 'number' && typeof data.budgetMax === 'number' && data.budgetMax < data.budgetMin) return false;
    return true;
  }, { message: 'Max budget must be ≥ min budget', path: ['budgetMax'] })
  .refine(data => {
    if (typeof data.minAge === 'number' && typeof data.maxAge === 'number' && data.maxAge < data.minAge + 2) return false;
    return true;
  }, { message: 'Max age must be at least 2 years greater than min age', path: ['maxAge'] });
```

### 3b. useForm defaultValues
Add defaults: `startTime: '10:00'`, `endTime: ''`, `budgetMin: undefined`, `budgetMax: undefined`, `venueType: ''`, `venueAccess: ''`, `minAge: 18`, `maxAge: 60`.

### 3c. onSubmit payload (L86–L97)
Keep sending the legacy `time` key (= `data.startTime`) for back-compat with the server DateTime combo, AND add the new 8 fields:
```ts
body: JSON.stringify({
  vendorId,
  serviceId: service.id,
  eventId: data.eventId,
  date: dateStr,
  time: data.startTime,        // legacy back-compat key
  startTime: data.startTime,
  endTime: data.endTime || undefined,
  budgetMin: data.budgetMin ?? null,
  budgetMax: data.budgetMax ?? null,
  venueType: data.venueType || null,
  venueAccess: data.venueAccess || null,
  minAge: typeof data.minAge === 'number' ? data.minAge : null,
  maxAge: typeof data.maxAge === 'number' ? data.maxAge : null,
  notes: data.notes,
  price: service.basePrice,
})
```

### 3d. JSX — replace existing single time row (L171–L218) with:
1. Row 1 grid-cols-2: Event Date (Popover Calendar, keep as-is) ↔ Start Time (type=time, Clock icon) + End Time (type=time, Clock icon) — actually cols-3: date col-span-2 / start col-span-1 / end col-span-1. Or grid-cols-2 split: left=Date, right=start+end stacked. Recommendation: `grid-cols-2 gap-4` then:
   - Col 1: Event Date (unchanged)
   - Col 2: Label "Start / End Time", then a sub grid grid-cols-2 gap-2 containing two time inputs with Clock icons, each error under them.
2. Row 2: Budget (RM) grid-cols-2: Min budget `number` input with 'RM' prefix span, Max budget same. Error lines under each + cross-field refine.
3. Row 3: Venue Type — Label "Venue Type", pill toggle buttons using two Buttons (outline/default), state setValue with `shouldValidate`. Inactive=variant=outline, active=default. Use lucide Home (Indoor) / Trees or Sun (Outdoor) icons left of label.
4. Row 4: Venue Access — same pill toggle pattern for PUBLIC/PRIVATE. Small helper text below: "Private (home/private hall) vs Public (park/ticketed)".
5. Row 5: Age range slider. Use a grid grid-cols-[auto_1fr_auto] gap-3. Left: minAge number input min=0 max=100 step=1. Right: maxAge number input same. Between them: **visual bar** (a bg-border rounded-full relative div, h-2) with two absolute markers + coloured gradient fill between percentages. Example: minAge pct = `(min/100)*100`, maxAge pct = `(max/100)*100`. The active bar is a `bg-gradient-to-r from-emerald-400 to-primary` child. Display label above the row "Age range: {min} – {max} yrs" with a Sparkles icon. If fields are left empty treat as "any age".
6. Row 6: Notes (keep as-is).

### 3e. Error rendering
Use exact existing pattern: `{errors.fieldName && (<p className="text-red-500 text-sm">{errors.fieldName.message}</p>)}` under each input / each field row. Cross-field errors (refines attached to `endTime`, `budgetMax`, `maxAge`) render by their path automatically.

**Test Requirements:**
- TR 3.1 (rule): After edits `npx tsc --noEmit -p tsconfig.json` EXIT 0 with 0 errors referencing booking-dialog.tsx. (Evidence: tsc run in Task 6.)
- TR 3.2 (rule): zod refinements block submission when end≤start, budgetMax<budgetMin, maxAge<minAge+2 by showing inline red messages (not toasts). Confirmed in dev server with manual clicks during verify.
- TR 3.3 (rubric, 0-2, pass ≥1.5): UX score. 2 = all controls use Buttons/Label/Input consistently, lucide icons match, pill toggle active state looks like shadcn SelectValue; 1 = works but divergent; 0 = broken.

---

## Task 4: Update BookingsList Booking interface + Cards display extra structured rows

**Status:** pending
**Priority:** medium
**Depends on:** Task 1 (fields must be on model)
**Maps to AC:** Rule AC7 (cards display metadata), Rule AC8 (null fields no-op)
**Files:**
- [src/app/dashboard/bookings/bookings-list.tsx](file:///Users/shahirfarhan/Desktop/archive/eventflow/trae_eventflow/src/app/dashboard/bookings/bookings-list.tsx)

**Implementation notes:**

### 4a. Widen Booking interface (L14–L44)
Append to interface fields (all nullable, types match schema):
```ts
startTime: string | null
endTime: string | null
minAge: number | null
maxAge: number | null
venueType: string | null        // 'INDOOR' | 'OUTDOOR' | null at runtime; typed string/null like location
venueAccess: string | null      // 'PUBLIC' | 'PRIVATE' | null
budgetMin: number | null
budgetMax: number | null
```

### 4b. Inside CardContent div.grid (L290–L315)
After existing lines (location, guests, specialRequests, disputed) but before closing `</div>`, insert four new rows each guarded by non-null/meaningful checks (all follow existing flex items-center gap-2 + lucide icon pattern):

1. **Time range** — only if either startTime or endTime set.
   Icon: Clock. Text: `{startTime ?? '?'} – {endTime ?? '?'}`. If only startTime: `{startTime}+`.
2. **Venue** — if venueType OR venueAccess set. Icon: MapPin or Building2. Use Badge per segment: Indoor→green badge, Outdoor→amber badge, Public→blue badge, Private→purple badge (or simple text with · separator).
3. **Budget range** — icon: Banknote. Text:
   - If both set: `RM {min.toLocaleString()} – RM {max.toLocaleString()}`
   - If only min: `RM ≥ {min.toLocaleString()}`
   - If only max: `RM ≤ {max.toLocaleString()}`
4. **Age range** — icon: Users or Baby + Smile (Users general works). Text:
   - Both set: `Ages {min} – {max}`
   - Only min: `Ages {min}+`
   - Only max: `Ages ≤ {max}`

All four rows are conditional (no empty divs when all values are null — no layout shift for legacy bookings).

**Test Requirements:**
- TR 4.1 (rule): A legacy booking (all 8 fields NULL) rendered in the list card shows NO new blank icon rows; exactly the same lines as before (location/guests/specialRequests/disputed). Evidence: manual visual check; compare screenshot or render output.
- TR 4.2 (rule): A booking with all 8 filled shows all 4 new structured lines with correct formatted text per rules above. Evidence: during verify, load bookings list after creating a test booking.
- TR 4.3 (rule): tsc after edits exits 0 (no new TS errors in bookings-list). Evidence included in Task 6 tsc run.

---

## Task 5: (Optional follow-up, EXCLUDED) Parity for public /vendors/[id]/book page

**Status:** cancelled
**Priority:** low
**Reason:** Scoped explicitly to the dashboard booking-dialog in spec Assumption 4. No user approval needed to cancel; it's out of spec.
**Depends on:** N/A

---

## Task 6: Full verify — tsc, prisma, end-to-end submit

**Status:** pending
**Priority:** high
**Depends on:** Tasks 1, 2, 3, 4 all completed
**Maps to AC:** Rule AC1, Rule AC2, Rule AC8, Rubric AC10

**Implementation notes:**
Run (in order):
1. `npx prisma validate` × 3 (main, postgres copy, sqlite copy) → all EXIT 0.
2. `npx prisma migrate deploy` (main, against Supabase) → EXIT 0.
3. `npx prisma migrate deploy` (run a **second consecutive time** — idempotency) → EXIT 0.
4. `npx prisma generate` × 3 (main, postgres copy, sqlite copy) → all EXIT 0.
5. `npx tsc --noEmit -p tsconfig.json` → EXIT 0, zero "error TS" lines in stdout/stderr.
6. Optional: start dev server, create a fully filled booking via dialog → curl SELECT or admin dashboard check confirms columns persisted correctly and bookings-list renders them.

**Test Requirements:**
- TR 6.1 (rule): Steps 1–5 all EXIT 0. Capture logs as Completion Evidence.
- TR 6.2 (rubric, 0-2, pass ≥1.5): server-side field sanitisation & coercion quality. 2 = server checks strings, swaps inverted min/max age & budget safely, drops invalid venue strings to null. 1 = server passes values through directly (works for good payloads, risky). 0 = server crashes or writes invalid values when given bad types (e.g. venueType = "garbage" stored verbatim; or negative budgets get persisted).

---

# Remaining pending issues

(None at Plan time. To be filled during Review pass with findings that become remediation tasks.)
