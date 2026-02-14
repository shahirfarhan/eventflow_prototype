import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileForm from "./profile-form";

export default async function VendorProfilePage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "VENDOR") {
    redirect("/dashboard");
  }

  const profile = await prisma.vendorProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) {
    // Should not happen if registered correctly, but handle anyway
    return <div>Profile not found. Please contact support.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Vendor Profile</h1>
      <ProfileForm initialData={profile} />
    </div>
  );
}
