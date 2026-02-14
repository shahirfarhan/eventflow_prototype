import { auth } from "@/auth";
import { redirect } from "next/navigation";
import VendorSearch from "./vendor-search";

export default async function VendorsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ORGANIZER") {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Find Vendors</h1>
        <p className="text-muted-foreground">
          Discover and book the best vendors for your event.
        </p>
      </div>

      <VendorSearch />
    </div>
  );
}
