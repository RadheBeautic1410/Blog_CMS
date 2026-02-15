import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";

export default async function AdminDashboard() {
  const user = await getCurrentUser();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#111827]">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome back, {user?.name}!</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-sm border border-[#E5E7EB]">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-[#2563EB]/10 flex items-center justify-center">
              <svg className="h-5 w-5 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#111827]">Blogs</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Manage your blog posts and articles</p>
          <Link
            href="/admin/blogs"
            className="inline-flex items-center text-sm font-medium text-[#2563EB] hover:text-[#1D4ED8]"
          >
            View Blogs
            <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm border border-[#E5E7EB]">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-[#2563EB]/10 flex items-center justify-center">
              <svg className="h-5 w-5 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#111827]">Categories</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Organize blogs by categories</p>
          <Link
            href="/admin/categories"
            className="inline-flex items-center text-sm font-medium text-[#2563EB] hover:text-[#1D4ED8]"
          >
            View Categories
            <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm border border-[#E5E7EB]">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-[#2563EB]/10 flex items-center justify-center">
              <svg className="h-5 w-5 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#111827]">Users</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Manage admin users and permissions</p>
          <Link
            href="/admin/users"
            className="inline-flex items-center text-sm font-medium text-[#2563EB] hover:text-[#1D4ED8]"
          >
            View Users
            <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
