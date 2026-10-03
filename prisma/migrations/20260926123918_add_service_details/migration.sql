-- AlterTable
ALTER TABLE "public"."Service" ADD COLUMN     "includedItems" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "locationsCovered" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "maxGuests" INTEGER,
ADD COLUMN     "minGuests" INTEGER,
ADD COLUMN     "pricingModel" TEXT NOT NULL DEFAULT 'FIXED';
