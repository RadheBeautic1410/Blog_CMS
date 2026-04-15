import { prisma } from "@/lib/prisma";

export async function incrementCategoryCount(categoryName: string) {
  if (!categoryName) return;

  await prisma.category.updateMany({
    where: { name: categoryName },
    data: {
      count: {
        increment: 1,
      },
    },
  });
}

export async function decrementCategoryCount(categoryName: string) {
  if (!categoryName) return;

  await prisma.category.updateMany({
    where: {
      name: categoryName,
      count: { gt: 0 },
    },
    data: {
      count: {
        decrement: 1,
      },
    },
  });
}
