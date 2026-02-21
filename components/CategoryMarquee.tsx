"use client";

import CategoryCard from "./CategoryCard";

interface Category {
  name: string;
  slug: string;
  count: number;
}

interface CategoryMarqueeProps {
  categories: Category[];
}

export default function CategoryMarquee({ categories }: CategoryMarqueeProps) {
  if (categories.length === 0) return null;

  const mid = Math.ceil(categories.length / 2);
  const row1 = categories.slice(0, mid);
  const row2 = categories.slice(mid);
  const row1Items = row1.length > 0 ? [...row1, ...row1] : [];
  const row2Items = row2.length > 0 ? [...row2, ...row2] : [];

  return (
    <div className="space-y-6 overflow-hidden py-2">
      {/* Top row: scrolls left to right */}
      {row1Items.length > 0 && (
        <div className="relative flex overflow-hidden">
          <div className="marquee-track marquee-ltr flex min-w-full gap-6 py-1">
            {row1Items.map((cat, i) => (
              <CategoryCard
                key={`row1-${cat.slug}-${i}`}
                name={cat.name}
                slug={cat.slug}
                count={cat.count}
                index={i % row1.length}
              />
            ))}
          </div>
        </div>
      )}

      {/* Bottom row: scrolls right to left */}
      {row2Items.length > 0 && (
        <div className="relative flex overflow-hidden">
          <div className="marquee-track marquee-rtl flex min-w-full gap-6 py-1">
            {row2Items.map((cat, i) => (
              <CategoryCard
                key={`row2-${cat.slug}-${i}`}
                name={cat.name}
                slug={cat.slug}
                count={cat.count}
                index={(i + mid) % 6}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
