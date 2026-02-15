import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-[#111827] mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-[#111827] mb-4">
            Blog Post Not Found
          </h2>
          <p className="text-gray-600 mb-8 max-w-md">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link
              href="/blogs"
              className="inline-flex items-center rounded-lg bg-[#2563EB] px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-[#1D4ED8] transition-colors"
            >
              Browse All Blogs
            </Link>
            <Link
              href="/"
              className="inline-flex items-center rounded-lg border border-[#E5E7EB] bg-white px-6 py-3 text-base font-semibold text-[#111827] shadow-sm hover:bg-[#F9FAFB] transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
