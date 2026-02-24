import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/ui/Button";
import { FlowerIcon } from "@/components/icons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about our mission to share insights, tutorials, and ideas on technology, business, programming, and lifestyle.",
};

const values = [
  {
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "Quality Content",
    description: "We curate and publish well-researched, insightful articles that add real value to our readers.",
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: "Learn & Grow",
    description: "From beginners to experts, we create content that helps everyone learn and level up.",
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: "Community First",
    description: "We believe in building a community of curious minds who support and inspire each other.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/60 via-white to-indigo-50/50 relative">
      {/* Decorative flower background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <FlowerIcon className="absolute -right-8 top-20 h-40 w-40 fill-indigo-300/40 -rotate-12" aria-hidden />
        <FlowerIcon className="absolute -left-6 top-1/3 h-28 w-28 fill-violet-300/35 rotate-[15deg]" aria-hidden />
        <FlowerIcon className="absolute right-[20%] top-[55%] h-24 w-24 fill-rose-300/30 -rotate-[8deg]" aria-hidden />
        <FlowerIcon className="absolute left-[15%] bottom-[30%] h-32 w-32 fill-emerald-300/35 rotate-[20deg]" aria-hidden />
      </div>

      <Navbar />
      <main className="relative overflow-hidden">
        {/* Hero Section */}
        <section className="relative px-4 pt-20 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 p-4">
              <FlowerIcon className="flower-spin h-14 w-14 fill-indigo-500" aria-hidden />
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
              About <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-rose-500 bg-clip-text text-transparent">Us</span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed sm:text-xl">
              We&apos;re on a mission to share insights, tutorials, and ideas that inspire and inform. 
              Welcome to our corner of the internet.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-16">
          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-8 shadow-lg shadow-slate-200/40 sm:p-10 md:p-12">
            <div className="flex items-center gap-2 mb-6">
              <span className="h-1 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
              <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
                Our Story
              </h2>
            </div>
            <div className="space-y-5 text-slate-600 leading-relaxed">
              <p>
                We started this blog with a simple idea: to create a space where curious minds 
                can discover valuable content across technology, business, programming, and lifestyle. 
                Whether you&apos;re here to learn something new, get inspired, or stay updated — 
                we&apos;ve got you covered.
              </p>
              <p>
                Every article we publish is crafted with care. We focus on clarity, practical value, 
                and honest perspectives. Our goal is to help you make better decisions, build new skills, 
                and find ideas that matter.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50/80 p-8 ring-1 ring-indigo-200/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-600">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="font-display text-xl font-bold text-slate-900">Our Mission</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">
                To deliver high-quality, accessible content that empowers people to learn, 
                grow, and stay informed in a fast-changing world.
              </p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-violet-50 to-rose-50/80 p-8 ring-1 ring-violet-200/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/20 text-violet-600">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h2 className="font-display text-xl font-bold text-slate-900">Our Vision</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">
                To become a trusted resource where millions find inspiration, knowledge, 
                and a community that values curiosity and growth.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-20">
          <div className="text-center mb-12">
            <span className="h-1 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 mx-auto block mb-4" />
            <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              What We Stand For
            </h2>
            <p className="mt-3 text-slate-600 max-w-xl mx-auto">
              Our core values guide everything we create and share.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((item, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-200/30 hover:border-indigo-200/80"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 text-indigo-600 mb-5 group-hover:from-indigo-200 group-hover:to-violet-200 transition-colors">
                  {item.icon}
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-24">
          <div className="rounded-3xl bg-gradient-to-br from-indigo-50 via-violet-50/80 to-rose-50/60 p-10 text-center shadow-lg shadow-indigo-200/20 ring-1 ring-indigo-200/40 sm:p-14">
            <FlowerIcon className="mx-auto h-12 w-12 fill-indigo-500/80 mb-6" aria-hidden />
            <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              Ready to Explore?
            </h2>
            <p className="mt-4 text-slate-600 max-w-md mx-auto">
              Dive into our collection of articles, tutorials, and insights.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button href="/blogs" variant="primary" size="lg" className="hover:scale-105">
                Browse Blogs
              </Button>
              <Button href="/categories" variant="outline" size="lg">
                View Categories
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
