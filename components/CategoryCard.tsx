import Link from "next/link";

interface CategoryCardProps {
  name: string;
  slug: string;
  count: number;
  index?: number;
}

const CARD_STYLES = [
  { bg: "bg-emerald-50 border-emerald-200/60 hover:border-emerald-400/80", accent: "text-emerald-600" },
  { bg: "bg-amber-50/80 border-amber-200/60 hover:border-amber-400/80", accent: "text-amber-600" },
  { bg: "bg-violet-50/80 border-violet-200/60 hover:border-violet-400/80", accent: "text-violet-600" },
  { bg: "bg-sky-50/80 border-sky-200/60 hover:border-sky-400/80", accent: "text-sky-600" },
  { bg: "bg-rose-50/80 border-rose-200/60 hover:border-rose-400/80", accent: "text-rose-600" },
  { bg: "bg-teal-50/80 border-teal-200/60 hover:border-teal-400/80", accent: "text-teal-600" },
] as const;

// Varied icons - no flower on every card
const CARD_ICONS = [
  <path key="folder" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />,
  <path key="layers" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />,
  <path key="bookmark" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />,
  <path key="grid" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />,
  <path key="tag" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />,
  <path key="sparkles" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />,
];

export default function CategoryCard({ name, slug, count, index = 0 }: CategoryCardProps) {
  const style = CARD_STYLES[index % CARD_STYLES.length];
  const icon = CARD_ICONS[index % CARD_ICONS.length];

  return (
    <Link
      href={`/categories/${slug}`}
      className={`group relative shrink-0 overflow-hidden rounded-2xl border-2 border-dashed p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg w-[200px] md:w-[220px] ${style.bg}`}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 ${style.accent} opacity-90 transition-transform group-hover:scale-110`}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {icon}
            </svg>
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            {count === 0 ? "No articles" : count === 1 ? "1 article" : `${count} articles`}
          </span>
        </div>
        <h3 className="font-display text-base font-bold text-stone-900 transition-colors group-hover:text-stone-700 md:text-lg">
          {name}
        </h3>
        <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${style.accent} opacity-90`}>
          Explore
          <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
