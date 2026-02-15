"use server";

import { logout } from "@/lib/auth";

export async function logoutAction() {
  await logout();
  // Don't redirect here - let the client handle it to avoid loops
}
