"use client";

import { useState } from "react";
import { FlowerIcon } from "@/components/icons";
import Button from "@/components/ui/Button";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribing with email:", email);
    setEmail("");
  };

  return (
    <section className="relative overflow-hidden bg-slate-50 py-24 md:py-28">
      {/* Flower decorative background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <FlowerIcon className="absolute -left-12 top-1/4 h-24 w-24 fill-indigo-200/40" aria-hidden />
        <FlowerIcon className="absolute right-8 top-8 h-16 w-16 fill-violet-200/40" aria-hidden />
        <FlowerIcon className="absolute left-1/3 bottom-8 h-20 w-20 fill-emerald-200/30" aria-hidden />
        <FlowerIcon className="absolute -right-8 bottom-1/4 h-28 w-28 fill-amber-200/40" aria-hidden />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl md:p-12">
          <div className="text-center">
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100">
              <svg className="h-7 w-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              Subscribe to our Newsletter
            </h2>
            <p className="mt-4 text-lg text-slate-600 md:text-xl">
              Get the latest articles, tutorials, and insights delivered straight
              to your inbox. No spam, unsubscribe anytime.
            </p>
            <form onSubmit={handleSubmit} className="mt-10">
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-full border border-slate-200 bg-slate-50 px-6 py-4 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none sm:max-w-md"
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="px-8 py-4 hover:scale-105"
                >
                  Subscribe
                </Button>
              </div>
            </form>
            <p className="mt-6 text-sm text-slate-500">
              Join 10,000+ readers. We respect your privacy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
