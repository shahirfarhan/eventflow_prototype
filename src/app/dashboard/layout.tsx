import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardNav from "./dashboard-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = session.user.role;

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md hidden md:block">
        {/* <div className="p-6 border-b">
          <div className="text-xl font-bold">EventFlow</div>
          <div className="text-sm text-gray-500 mt-1 capitalize">{role.toLowerCase()}</div>
        </div> */}
        <DashboardNav role={role} />
      </aside>
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
