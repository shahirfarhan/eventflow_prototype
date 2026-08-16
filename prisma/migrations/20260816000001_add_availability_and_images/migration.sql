-- CreateTable
CREATE TABLE IF NOT EXISTS "Availability" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "ServiceImage" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServiceImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "PackageImage" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PackageImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex (unique only if not already present; CREATE INDEX IF NOT EXISTS is PG12+ which Supabase uses)
CREATE UNIQUE INDEX IF NOT EXISTS "Availability_vendorId_date_key" ON "Availability"("vendorId", "date");
CREATE INDEX IF NOT EXISTS "Availability_vendorId_idx" ON "Availability"("vendorId");
CREATE INDEX IF NOT EXISTS "ServiceImage_serviceId_idx" ON "ServiceImage"("serviceId");
CREATE INDEX IF NOT EXISTS "PackageImage_packageId_idx" ON "PackageImage"("packageId");

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "Availability" ADD CONSTRAINT "Availability_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "VendorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE "ServiceImage" ADD CONSTRAINT "ServiceImage_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE "PackageImage" ADD CONSTRAINT "PackageImage_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;
