import Button from "@/components/ui/Button";
import { FlowerIcon } from "@/components/icons";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 py-24 md:py-32">
      {/* Flower background - animated decorative flowers */}
      <div className="pointer-events-none absolute inset-0 overflow-visible" style={{ zIndex: 0 }}>
        <div className="flower-float absolute -left-20 top-1/3" style={{ animationDelay: "0s" }}>
          <FlowerIcon className="h-100 w-100 fill-purple-300/65" aria-hidden />
        </div>
        <div className="flower-float absolute right-1/3 -bottom-30" style={{ animationDelay: "0.7s" }}>
          <FlowerIcon className="h-70 w-70 fill-cyan-400/60" aria-hidden />
        </div>
        <div className="flower-float absolute right-8 top-2/3" style={{ animationDelay: "1.4s" }}>
          <FlowerIcon className="h-36 w-36 fill-violet-300/65" aria-hidden />
        </div>
        <div className="flower-float absolute left-1/2 top-1 -translate-x-1/2" style={{ animationDelay: "2.1s" }}>
          <FlowerIcon className="h-32 w-32 fill-pink-300/70" aria-hidden />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1
            className="font-display text-4xl font-bold tracking-tight text-[#0F172A] sm:text-5xl md:text-6xl lg:text-7xl leading-tight"
          >
            Discover Insights,{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
              Tutorials & Ideas
            </span>
          </h1>
          <p className="mt-8 text-lg leading-relaxed text-gray-600 sm:text-xl md:text-2xl max-w-2xl mx-auto">
            Explore our curated collection of articles covering technology,
            business, programming, lifestyle, and more. Stay informed and
            inspired.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="/blogs" variant="primary" size="lg" className="hover:scale-105">
              Explore Blogs
            </Button>
            <Button href="/categories" variant="outline" size="lg">
              Browse Categories
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
