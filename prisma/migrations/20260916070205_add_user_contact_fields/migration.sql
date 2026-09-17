-- DropIndex
DROP INDEX "public"."Message_contextPackageId_idx";

-- DropIndex
DROP INDEX "public"."Message_contextServiceId_idx";

-- DropIndex
DROP INDEX "public"."Message_contextVendorId_idx";

-- AlterTable
ALTER TABLE "public"."ChatQuotation" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."Event" ALTER COLUMN "startTime" SET DATA TYPE TEXT,
ALTER COLUMN "endTime" SET DATA TYPE TEXT,
ALTER COLUMN "venueType" SET DATA TYPE TEXT,
ALTER COLUMN "venueAccess" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "location" TEXT,
ADD COLUMN     "phoneNumber" TEXT;
