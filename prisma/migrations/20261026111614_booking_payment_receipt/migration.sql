-- AlterTable
ALTER TABLE "public"."Booking" ADD COLUMN     "paymentReceiptUrl" TEXT,
ADD COLUMN     "paymentSubmittedAt" TIMESTAMP(3),
ADD COLUMN     "paymentVerifiedAt" TIMESTAMP(3);
