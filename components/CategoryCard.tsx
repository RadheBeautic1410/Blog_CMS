import Link from "next/link";

interface CategoryCardProps {
  name: string;
  slug: string;
  count: number;
}

export default function CategoryCard({ name, slug, count }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${slug}`}
      className="group relative overflow-hidden rounded-lg border border-[#FED7AA] bg-white p-6 transition-all duration-300 hover:border-[#F97316] hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[#1F2937] group-hover:text-[#F97316] transition-colors">
            {name}
          </h3>
          <p className="mt-1 text-sm text-[#6B7280]">
            {count === 0 ? "No articles" : count === 1 ? "1 article" : `${count} articles`}
          </p>
        </div>
        <div className="rounded-full bg-[#FDBA74]/30 p-3 group-hover:bg-[#F97316] transition-colors">
          <svg
            className="h-6 w-6 text-[#F97316] group-hover:text-white transition-colors"
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
      </div>
    </Link>
  );
}
