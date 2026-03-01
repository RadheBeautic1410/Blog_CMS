import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import Pagination from "@/components/admin/Pagination";

const ITEMS_PER_PAGE = 15;

async function getSubscribers(page: number = 1) {
  try {
    const skip = (page - 1) * ITEMS_PER_PAGE;
    const [subscribers, total] = await Promise.all([
      prisma.newsletterSubscriber.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: ITEMS_PER_PAGE,
      }),
      prisma.newsletterSubscriber.count(),
    ]);
    return {
      subscribers,
      total,
      totalPages: Math.ceil(total / ITEMS_PER_PAGE),
    };
  } catch (error) {
    console.error("Error fetching newsletter subscribers:", error);
    return {
      subscribers: [],
      total: 0,
      totalPages: 0,
    };
  }
}

export default async function NewsletterAdminPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const currentPage = parseInt(searchParams.page || "1", 10);
  const { subscribers, total, totalPages } = await getSubscribers(currentPage);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#111827]">Newsletter Subscribers</h1>
        <p className="mt-2 text-gray-600">
          People who subscribed via &quot;Subscribe to our Newsletter&quot; on the site. Total: <strong>{total}</strong>
        </p>
      </div>

      <div className="rounded-lg bg-white shadow-sm border border-[#E5E7EB] overflow-hidden">
        {subscribers.length === 0 ? (
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
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <p className="mt-4">No subscribers yet. When someone subscribes on the website, they will appear here.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#E5E7EB]">
                <thead className="bg-[#F9FAFB]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#111827] uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#111827] uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#111827] uppercase tracking-wider">
                      Subscribed on
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#E5E7EB]">
                  {subscribers.map((sub, index) => (
                    <tr key={sub.id} className="hover:bg-[#F9FAFB]">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a
                          href={`mailto:${sub.email}`}
                          className="text-sm font-medium text-[#2563EB] hover:underline"
                        >
                          {sub.email}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(sub.createdAt), "MMM dd, yyyy HH:mm")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                basePath="/admin/newsletter"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
