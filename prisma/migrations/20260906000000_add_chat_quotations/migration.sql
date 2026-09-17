-- ChatQuotation: a price quote sent/received inside a chat thread, with accept/reject workflow.
CREATE TABLE IF NOT EXISTS "ChatQuotation" (
    "id"                 TEXT         NOT NULL,
    "senderId"           TEXT         NOT NULL,
    "receiverId"         TEXT         NOT NULL,
    "bookingId"          TEXT,
    "vendorId"           TEXT,
    "serviceId"          TEXT,
    "packageId"          TEXT,
    "price"              DOUBLE PRECISION NOT NULL,
    "currency"           TEXT         NOT NULL DEFAULT 'MYR',
    "date"               TIMESTAMP(3),
    "time"               TEXT,
    "location"           TEXT,
    "notes"              TEXT,
    "validUntil"         TIMESTAMP(3),
    "status"             TEXT         NOT NULL DEFAULT 'PENDING',
    "acceptedAt"         TIMESTAMP(3),
    "rejectedAt"         TIMESTAMP(3),
    "createdAt"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatQuotation_pkey" PRIMARY KEY ("id")
);

DO $$ BEGIN
    ALTER TABLE "ChatQuotation" ADD CONSTRAINT "ChatQuotation_senderId_fkey"
        FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE "ChatQuotation" ADD CONSTRAINT "ChatQuotation_receiverId_fkey"
        FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE "ChatQuotation" ADD CONSTRAINT "ChatQuotation_bookingId_fkey"
        FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE "ChatQuotation" ADD CONSTRAINT "ChatQuotation_vendorId_fkey"
        FOREIGN KEY ("vendorId") REFERENCES "VendorProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE "ChatQuotation" ADD CONSTRAINT "ChatQuotation_serviceId_fkey"
        FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE "ChatQuotation" ADD CONSTRAINT "ChatQuotation_packageId_fkey"
        FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS "ChatQuotation_senderId_createdAt_idx" ON "ChatQuotation" ("senderId", "createdAt");
CREATE INDEX IF NOT EXISTS "ChatQuotation_receiverId_createdAt_idx" ON "ChatQuotation" ("receiverId", "createdAt");
CREATE INDEX IF NOT EXISTS "ChatQuotation_receiverId_status_idx" ON "ChatQuotation" ("receiverId", "status");
CREATE INDEX IF NOT EXISTS "ChatQuotation_bookingId_idx" ON "ChatQuotation" ("bookingId");
CREATE INDEX IF NOT EXISTS "ChatQuotation_vendorId_idx" ON "ChatQuotation" ("vendorId");
CREATE INDEX IF NOT EXISTS "ChatQuotation_serviceId_idx" ON "ChatQuotation" ("serviceId");

-- Add Message.quotationId column + FK
ALTER TABLE "Message" ADD COLUMN IF NOT EXISTS "quotationId" TEXT;

DO $$ BEGIN
    ALTER TABLE "Message" ADD CONSTRAINT "Message_quotationId_fkey"
        FOREIGN KEY ("quotationId") REFERENCES "ChatQuotation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS "Message_quotationId_idx" ON "Message" ("quotationId");

-- Add context columns to Message if they don't already exist (idempotent, first session added them previously;
-- DO blocks here protect re-runs).
ALTER TABLE "Message" ADD COLUMN IF NOT EXISTS "contextServiceId" TEXT;
ALTER TABLE "Message" ADD COLUMN IF NOT EXISTS "contextPackageId" TEXT;
ALTER TABLE "Message" ADD COLUMN IF NOT EXISTS "contextVendorId"  TEXT;

DO $$ BEGIN
    ALTER TABLE "Message" ADD CONSTRAINT "Message_contextServiceId_fkey"
        FOREIGN KEY ("contextServiceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE "Message" ADD CONSTRAINT "Message_contextPackageId_fkey"
        FOREIGN KEY ("contextPackageId") REFERENCES "Package"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE "Message" ADD CONSTRAINT "Message_contextVendorId_fkey"
        FOREIGN KEY ("contextVendorId") REFERENCES "VendorProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS "Message_contextServiceId_idx" ON "Message" ("contextServiceId");
CREATE INDEX IF NOT EXISTS "Message_contextPackageId_idx" ON "Message" ("contextPackageId");
CREATE INDEX IF NOT EXISTS "Message_contextVendorId_idx"  ON "Message" ("contextVendorId");
