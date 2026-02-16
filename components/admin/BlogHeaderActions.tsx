"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface BlogHeaderActionsProps {
  isEdit?: boolean;
}

export default function BlogHeaderActions({ isEdit = false }: BlogHeaderActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Listen for form submission events
    const handleSubmit = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    const form = document.getElementById("blog-form") as HTMLFormElement;
    if (form) {
      form.addEventListener("submit", handleSubmit);
      // Listen for custom events from BlogForm
      window.addEventListener("blog-form-loading", handleSubmit);
      window.addEventListener("blog-form-complete", handleComplete);
    }

    return () => {
      if (form) {
        form.removeEventListener("submit", handleSubmit);
      }
      window.removeEventListener("blog-form-loading", handleSubmit);
      window.removeEventListener("blog-form-complete", handleComplete);
    };
  }, []);

  return (
    <div className="flex items-center justify-end space-x-4">
      <button
        type="button"
        onClick={() => router.back()}
        className="rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-semibold text-[#111827] shadow-sm hover:bg-[#F9FAFB] transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        form="blog-form"
        disabled={loading}
        className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1D4ED8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Saving..." : isEdit ? "Update Blog" : "Create Blog"}
      </button>
    </div>
  );
}
