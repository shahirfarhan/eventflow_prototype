-- Add 8 new detail fields to the Booking table.
-- Wrapped in DO blocks so re-running this migration is idempotent
-- (safe against duplicate_column / duplicate_object errors).

DO $$
BEGIN
  ALTER TABLE "Booking" ADD COLUMN "startTime" VARCHAR(8);
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "Booking" ADD COLUMN "endTime" VARCHAR(8);
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "Booking" ADD COLUMN "minAge" INTEGER;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "Booking" ADD COLUMN "maxAge" INTEGER;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "Booking" ADD COLUMN "venueType" VARCHAR(16);
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "Booking" ADD COLUMN "venueAccess" VARCHAR(16);
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "Booking" ADD COLUMN "budgetMin" DOUBLE PRECISION;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "Booking" ADD COLUMN "budgetMax" DOUBLE PRECISION;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;
