import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteCategoryButton from "@/components/admin/DeleteCategoryButton";
import Pagination from "@/components/admin/Pagination";

const ITEMS_PER_PAGE = 10;

async function getCategories(page: number = 1) {
  try {
    const skip = (page - 1) * ITEMS_PER_PAGE;
    
    const [categoriesData, total] = await Promise.all([
      prisma.category.findMany({
        orderBy: { name: "asc" },
        skip,
        take: ITEMS_PER_PAGE,
      }),
      prisma.category.count(),
    ]);

    // Calculate actual blog counts for each category
    const categories = await Promise.all(
      categoriesData.map(async (category) => {
        const blogCount = await prisma.blog.count({
          where: {
            category: category.name,
            status: "published",
          },
        });
        return {
          ...category,
          count: blogCount,
        };
      })
    );

    return {
      categories,
      total,
      totalPages: Math.ceil(total / ITEMS_PER_PAGE),
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {
      categories: [],
      total: 0,
      totalPages: 0,
    };
  }
}

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const currentPage = parseInt(searchParams.page || "1", 10);
  const { categories, totalPages } = await getCategories(currentPage);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#111827]">Category Management</h1>
          <p className="mt-2 text-gray-600">Manage your blog categories</p>
        </div>
        <Link
          href="/admin/categories/create"
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
          Add Category
        </Link>
      </div>

      <div className="rounded-lg bg-white shadow-sm border border-[#E5E7EB] overflow-hidden">
        {categories.length === 0 ? (
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
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <p className="mt-4">No categories found. Create your first category!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#E5E7EB]">
              <thead className="bg-[#F9FAFB]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#111827] uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#111827] uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#111827] uppercase tracking-wider">
                    Blog Count
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[#111827] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#E5E7EB]">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-[#F9FAFB]">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-lg bg-[#2563EB]/10 flex items-center justify-center mr-3">
                          <svg
                            className="h-5 w-5 text-[#2563EB]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                            />
                          </svg>
                        </div>
                        <div className="text-sm font-medium text-[#111827]">
                          {category.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{category.slug}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                        {category.count} {category.count === 1 ? "blog" : "blogs"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/admin/categories/${category.id}/edit`}
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
                        <DeleteCategoryButton
                          categoryId={category.id}
                          categoryName={category.name}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        )}
        {categories.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath="/admin/categories"
          />
        )}
      </div>
    </div>
  );
}
