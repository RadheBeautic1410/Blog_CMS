import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Sidebar from "@/components/admin/Sidebar";
import { headers } from "next/headers";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the pathname from headers to check if we're on the login page
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  
  // Skip auth check for login page - it has its own layout that handles auth
  const isLoginPage = pathname === "/admin/login";
  
  if (!isLoginPage) {
    const user = await getCurrentUser();
    if (!user) {
      redirect("/admin/login");
    }
  }

  // Don't render sidebar layout for login page
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Sidebar />
      <main className="flex-1 lg:ml-64">
        <div className="p-4 lg:p-6 xl:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
