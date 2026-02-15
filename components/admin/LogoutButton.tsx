"use client";

import { useState } from "react";

export default function LogoutButton() {
  const [isPending, setIsPending] = useState(false);

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
      });

      if (response.ok) {
        // Use window.location for a full page reload to clear any cached state
        window.location.href = "/admin/login";
      } else {
        // Still redirect even if API call fails
        window.location.href = "/admin/login";
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Still redirect even if API call fails
      window.location.href = "/admin/login";
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isPending}
      className="flex w-full items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
      <span>{isPending ? "Logging out..." : "Logout"}</span>
    </button>
  );
}
