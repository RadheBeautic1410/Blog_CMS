import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // If user is already logged in, redirect to admin dashboard
  const user = await getCurrentUser();
  if (user) {
    redirect("/admin");
  }

  // Login page doesn't need the admin layout with sidebar
  return <>{children}</>;
}
