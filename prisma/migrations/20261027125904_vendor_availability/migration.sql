-- AlterTable
ALTER TABLE "public"."VendorProfile" ADD COLUMN     "closedWeekdays" INTEGER[] DEFAULT ARRAY[]::INTEGER[];

-- CreateTable
CREATE TABLE "public"."VendorBlockedDate" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VendorBlockedDate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VendorBlockedDate_vendorId_idx" ON "public"."VendorBlockedDate"("vendorId");

-- CreateIndex
CREATE UNIQUE INDEX "VendorBlockedDate_vendorId_date_key" ON "public"."VendorBlockedDate"("vendorId", "date");

-- AddForeignKey
ALTER TABLE "public"."VendorBlockedDate" ADD CONSTRAINT "VendorBlockedDate_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."VendorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
