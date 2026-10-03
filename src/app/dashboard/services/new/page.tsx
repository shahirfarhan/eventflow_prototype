import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ServiceForm from "../service-form";

export default async function NewServicePage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "VENDOR") {
    redirect("/dashboard");
  }

  const vendor = await prisma.vendorProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!vendor) {
    return <div>Vendor profile not found.</div>;
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <ServiceForm />
    </div>
  );
}