import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-[#FFF7ED] to-[#FED7AA] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
          {/* Left Content */}
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold tracking-tight text-[#1F2937] sm:text-5xl md:text-6xl">
              Discover Insights,{" "}
              <span className="text-[#F97316]">Tutorials & Ideas</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-[#6B7280] sm:text-xl">
              Explore our curated collection of articles covering technology,
              business, programming, lifestyle, and more. Stay informed and
              inspired.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 md:justify-start">
              <Link
                href="/blogs"
                className="rounded-lg bg-[#F97316] px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-[#EA580C] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F97316]"
              >
                Explore Blogs
              </Link>
            </div>
          </div>

          {/* Right Image/Illustration */}
                      {/* <div className="relative h-96 w-full overflow-hidden rounded-lg bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] shadow-xl">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="h-64 w-64 text-white opacity-20"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div> */}

          <div className="relative hidden md:block">
            <div className="relative h-96 w-full overflow-hidden rounded-lg shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop&q=80"
                alt="Blog graphics illustration"
                fill
                className="object-cover rounded-lg"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
