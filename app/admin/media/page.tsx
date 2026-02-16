import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import Image from "next/image";
import DeleteMediaButton from "@/components/admin/DeleteMediaButton";
import Pagination from "@/components/admin/Pagination";
import MediaUploadButton from "@/components/admin/MediaUploadButton";

const ITEMS_PER_PAGE = 20;

async function getMedia(page: number = 1) {
  try {
    const skip = (page - 1) * ITEMS_PER_PAGE;
    
    const [media, total] = await Promise.all([
      prisma.media.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: ITEMS_PER_PAGE,
      }),
      prisma.media.count(),
    ]);

    return {
      media,
      total,
      totalPages: Math.ceil(total / ITEMS_PER_PAGE),
    };
  } catch (error) {
    console.error("Error fetching media:", error);
    return {
      media: [],
      total: 0,
      totalPages: 0,
    };
  }
}

function formatFileSize(bytes?: number | null): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function MediaLibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; view?: string }>;
}) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1", 10);
  const view = params.view || "grid";
  const { media, totalPages } = await getMedia(currentPage);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#111827]">Media Library</h1>
          <p className="mt-2 text-gray-600">
            Manage all your uploaded images and media files
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <MediaUploadButton folder="media" />
          {/* View Toggle */}
          <div className="flex items-center rounded-lg border border-[#E5E7EB] bg-white">
            <Link
              href={`/admin/media?view=grid${currentPage > 1 ? `&page=${currentPage}` : ""}`}
              className={`px-3 py-2 rounded-l-lg ${
                view === "grid"
                  ? "bg-[#2563EB] text-white"
                  : "text-gray-600 hover:bg-[#F9FAFB]"
              } transition-colors`}
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
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </Link>
            <Link
              href={`/admin/media?view=list${currentPage > 1 ? `&page=${currentPage}` : ""}`}
              className={`px-3 py-2 rounded-r-lg ${
                view === "list"
                  ? "bg-[#2563EB] text-white"
                  : "text-gray-600 hover:bg-[#F9FAFB]"
              } transition-colors`}
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {media.length === 0 ? (
        <div className="rounded-lg bg-white border border-[#E5E7EB] p-12 text-center">
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
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="mt-4 text-gray-500">No media files found.</p>
          <p className="mt-2 text-sm text-gray-400">
            Upload images when creating blogs or authors to see them here.
          </p>
        </div>
      ) : view === "grid" ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
            {media.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-lg border border-[#E5E7EB] bg-white overflow-hidden hover:shadow-lg transition-shadow"
              >
                <Link href={`/admin/media/${item.id}/edit`}>
                  <div className="relative aspect-square bg-gray-100">
                    <Image
                      src={item.url}
                      alt={item.alt || item.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-[#111827] truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatFileSize(item.size)}
                    </p>
                  </div>
                </Link>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center space-x-1">
                    <Link
                      href={`/admin/media/${item.id}/edit`}
                      className="p-1.5 bg-white rounded shadow-sm hover:bg-[#F9FAFB]"
                      title="Edit"
                    >
                      <svg
                        className="h-4 w-4 text-[#2563EB]"
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
                    <DeleteMediaButton
                      mediaId={item.id}
                      mediaName={item.name}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {media.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath="/admin/media"
            />
          )}
        </>
      ) : (
        <>
          <div className="rounded-lg bg-white border border-[#E5E7EB] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#E5E7EB]">
                <thead className="bg-[#F9FAFB]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#111827] uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#111827] uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#111827] uppercase tracking-wider">
                      Alt Text
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#111827] uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#111827] uppercase tracking-wider">
                      Dimensions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#111827] uppercase tracking-wider">
                      Folder
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#111827] uppercase tracking-wider">
                      Uploaded
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-[#111827] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#E5E7EB]">
                  {media.map((item) => (
                    <tr key={item.id} className="hover:bg-[#F9FAFB]">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative h-16 w-16 rounded overflow-hidden border border-[#E5E7EB] bg-gray-100">
                          <Image
                            src={item.url}
                            alt={item.alt || item.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-[#111827]">
                          {item.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-xs truncate">
                          {item.alt || "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatFileSize(item.size)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.width && item.height
                          ? `${item.width} × ${item.height}`
                          : "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-full bg-[#2563EB]/10 px-2.5 py-0.5 text-xs font-medium text-[#2563EB]">
                          {item.folder || "root"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(item.createdAt), "MMM dd, yyyy")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/admin/media/${item.id}/edit`}
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
                          <DeleteMediaButton
                            mediaId={item.id}
                            mediaName={item.name}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {media.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                basePath="/admin/media"
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
