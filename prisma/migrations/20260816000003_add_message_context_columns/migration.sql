-- AlterTable
ALTER TABLE "Message"
    ADD COLUMN "contextServiceId" TEXT,
    ADD COLUMN "contextPackageId" TEXT,
    ADD COLUMN "contextVendorId" TEXT;

-- AddForeignKey
ALTER TABLE "Message"
    ADD CONSTRAINT "Message_contextServiceId_fkey"
    FOREIGN KEY ("contextServiceId") REFERENCES "Service" ("id") ON DELETE SET NULL;

ALTER TABLE "Message"
    ADD CONSTRAINT "Message_contextPackageId_fkey"
    FOREIGN KEY ("contextPackageId") REFERENCES "Package" ("id") ON DELETE SET NULL;

ALTER TABLE "Message"
    ADD CONSTRAINT "Message_contextVendorId_fkey"
    FOREIGN KEY ("contextVendorId") REFERENCES "VendorProfile" ("id") ON DELETE SET NULL;

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS "Message_contextServiceId_idx" ON "Message" ("contextServiceId");
CREATE INDEX IF NOT EXISTS "Message_contextPackageId_idx" ON "Message" ("contextPackageId");
CREATE INDEX IF NOT EXISTS "Message_contextVendorId_idx"  ON "Message" ("contextVendorId");
