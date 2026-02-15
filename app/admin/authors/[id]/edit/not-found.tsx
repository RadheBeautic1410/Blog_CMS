import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <h2 className="text-2xl font-bold text-[#111827] mb-4">Author Not Found</h2>
      <p className="text-gray-600 mb-6">The author you're looking for doesn't exist.</p>
      <Link
        href="/admin/authors"
        className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1D4ED8] transition-colors"
      >
        Back to Authors
      </Link>
    </div>
  );
}
