-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_contextPackageId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_contextServiceId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_contextVendorId_fkey";

-- DropIndex
DROP INDEX "public"."Availability_vendorId_idx";

-- DropIndex
DROP INDEX "public"."Message_contextPackageId_idx";

-- DropIndex
DROP INDEX "public"."Message_contextServiceId_idx";

-- DropIndex
DROP INDEX "public"."Message_contextVendorId_idx";

-- DropIndex
DROP INDEX "public"."PackageImage_packageId_idx";

-- DropIndex
DROP INDEX "public"."ServiceImage_serviceId_idx";

-- CreateIndex
CREATE INDEX "Message_senderId_receiverId_createdAt_idx" ON "public"."Message"("senderId", "receiverId", "createdAt");

-- CreateIndex
CREATE INDEX "Message_receiverId_senderId_createdAt_idx" ON "public"."Message"("receiverId", "senderId", "createdAt");

-- CreateIndex
CREATE INDEX "Message_receiverId_readAt_idx" ON "public"."Message"("receiverId", "readAt");

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_contextServiceId_fkey" FOREIGN KEY ("contextServiceId") REFERENCES "public"."Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_contextPackageId_fkey" FOREIGN KEY ("contextPackageId") REFERENCES "public"."Package"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_contextVendorId_fkey" FOREIGN KEY ("contextVendorId") REFERENCES "public"."VendorProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
