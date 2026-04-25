import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

/** Invalidate public pages that list or show this blog (call after admin create/update). */
export async function revalidateAfterBlogSave(input: {
  slug: string;
  previousSlug?: string | null;
  categoryName: string;
  previousCategoryName?: string | null;
}) {
  revalidatePath("/");
  revalidatePath("/blogs");
  revalidatePath("/categories");
  revalidatePath(`/blogs/${input.slug}`);
  if (
    input.previousSlug &&
    input.previousSlug !== input.slug
  ) {
    revalidatePath(`/blogs/${input.previousSlug}`);
  }

  const names = new Set<string>();
  names.add(input.categoryName);
  if (input.previousCategoryName) {
    names.add(input.previousCategoryName);
  }

  for (const name of names) {
    if (!name) continue;
    const row = await prisma.category.findUnique({ where: { name } });
    if (row) revalidatePath(`/categories/${row.slug}`);
  }
}

/** After deleting a published post, drop its URL and category listing from the cache. */
export async function revalidateAfterBlogDelete(input: {
  slug: string;
  categoryName: string;
}) {
  revalidatePath("/");
  revalidatePath("/blogs");
  revalidatePath("/categories");
  revalidatePath(`/blogs/${input.slug}`);
  const row = await prisma.category.findUnique({
    where: { name: input.categoryName },
  });
  if (row) revalidatePath(`/categories/${row.slug}`);
}

/** Public category index lists all categories; call after admin category create/update/delete. */
export function revalidateCategoriesPage() {
  revalidatePath("/categories");
}
