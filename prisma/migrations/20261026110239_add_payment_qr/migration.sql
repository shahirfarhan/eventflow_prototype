/*
  Warnings:

  - You are about to drop the column `paymentQrUrl` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "paymentQrUrl";

-- AlterTable
ALTER TABLE "public"."VendorProfile" ADD COLUMN     "paymentQrUrl" TEXT;
