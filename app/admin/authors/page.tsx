import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import Image from "next/image";
import DeleteAuthorButton from "@/components/admin/DeleteAuthorButton";
import Pagination from "@/components/admin/Pagination";

const ITEMS_PER_PAGE = 10;

async function getAuthors(page: number = 1) {
  try {
    const skip = (page - 1) * ITEMS_PER_PAGE;
    
    const [authors, total] = await Promise.all([
      prisma.author.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: ITEMS_PER_PAGE,
      }),
      prisma.author.count(),
    ]);

    return {
      authors,
      total,
      totalPages: Math.ceil(total / ITEMS_PER_PAGE),
    };
  } catch (error) {
    console.error("Error fetching authors:", error);
    return {
      authors: [],
      total: 0,
      totalPages: 0,
    };
  }
}

export default async function AuthorsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const currentPage = parseInt(searchParams.page || "1", 10);
  const { authors, totalPages } = await getAuthors(currentPage);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#111827]">Author Management</h1>
          <p className="mt-2 text-gray-600">Manage blog authors and contributors</p>
        </div>
        <Link
          href="/admin/authors/create"
          className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1D4ED8] transition-colors inline-flex items-center"
        >
          <svg
            className="mr-2 h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Author
        </Link>
      </div>

      <div className="rounded-lg bg-white shadow-sm border border-[#E5E7EB] overflow-hidden">
        {authors.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <p className="mt-4">No authors found. Create your first author!</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#E5E7EB]">
                <thead className="bg-[#F9FAFB]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#111827] uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#111827] uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#111827] uppercase tracking-wider">
                      Bio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#111827] uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-[#111827] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#E5E7EB]">
                  {authors.map((author) => (
                    <tr key={author.id} className="hover:bg-[#F9FAFB]">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-[#2563EB]/10 flex items-center justify-center mr-3 overflow-hidden">
                            {author.avatar ? (
                              <Image
                                src={author.avatar}
                                alt={author.name}
                                width={40}
                                height={40}
                                className="object-cover"
                              />
                            ) : (
                              <span className="text-[#2563EB] font-semibold text-sm">
                                {author.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="text-sm font-medium text-[#111827]">
                            {author.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {author.email || "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-xs truncate">
                          {author.bio || "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(author.createdAt), "MMM dd, yyyy")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/admin/authors/${author.id}/edit`}
                            className="text-[#2563EB] hover:text-[#1D4ED8]"
                            title="Edit"
                          >
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </Link>
                          <DeleteAuthorButton
                            authorId={author.id}
                            authorName={author.name}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {authors.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                basePath="/admin/authors"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
