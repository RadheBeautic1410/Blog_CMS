import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import Button from "@/components/ui/Button";
import { FlowerIcon } from "@/components/icons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with us. We'd love to hear from you — questions, feedback, or collaboration ideas.",
};

const contactMethods = [
  {
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: "Email",
    value: "hello@example.com",
    href: "mailto:hello@example.com",
    gradient: "from-indigo-400 to-violet-500",
    ring: "ring-indigo-200/60",
  },
  {
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: "Response Time",
    value: "Within 24–48 hrs",
    gradient: "from-violet-400 to-rose-500",
    ring: "ring-violet-200/60",
  },
  {
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
      </svg>
    ),
    label: "Social",
    value: "@ourblog",
    href: "#",
    gradient: "from-rose-400 to-amber-400",
    ring: "ring-rose-200/60",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FAFBFC] relative overflow-hidden">
      {/* Unique decorative background - gradient orbs + geometric */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-gradient-to-br from-indigo-200/40 to-violet-200/30 blur-3xl" />
        <div className="absolute top-1/2 -left-32 h-80 w-80 rounded-full bg-gradient-to-br from-rose-200/30 to-amber-200/20 blur-3xl" />
        <div className="absolute bottom-20 right-1/4 h-60 w-60 rounded-full bg-gradient-to-br from-violet-200/25 to-indigo-200/20 blur-3xl" />
        {/* Floating envelope/mail icons - subtle */}
        <div className="absolute top-32 right-[15%] opacity-[0.07]">
          <svg className="h-24 w-24 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
          </svg>
        </div>
        <div className="absolute bottom-40 left-[10%] opacity-[0.06] rotate-12">
          <svg className="h-20 w-20 text-violet-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
          </svg>
        </div>
        <FlowerIcon className="absolute -right-12 top-40 h-36 w-36 fill-indigo-200/25 -rotate-12" aria-hidden />
        <FlowerIcon className="absolute -left-8 bottom-1/3 h-28 w-28 fill-violet-200/20 rotate-[20deg]" aria-hidden />
      </div>

      <Navbar />
      <main className="relative">
        {/* Hero - compact, distinctive */}
        <section className="relative px-4 pt-20 pb-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center justify-center rounded-2xl bg-white/80 p-3 shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/60">
              <svg className="h-10 w-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Get in <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-rose-500 bg-clip-text text-transparent">Touch</span>
            </h1>
            <p className="mt-4 text-lg text-slate-600 max-w-xl mx-auto">
              Have a question, idea, or just want to say hi? We&apos;d love to hear from you.
            </p>
          </div>
        </section>

        {/* Main content - split layout */}
        <section className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-24">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-12">
            {/* Form - takes more space */}
            <div className="lg:col-span-3">
              <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-xl shadow-slate-200/30 backdrop-blur-sm sm:p-10">
                <div className="flex items-center gap-2 mb-8">
                  {/* <span className="h-1 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" /> */}
                  <h2 className="font-display text-xl font-bold text-slate-900 sm:text-2xl">
                    Send a Message
                  </h2>
                </div>
                <ContactForm />
              </div>
            </div>

            {/* Contact info - bento style */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-lg shadow-slate-200/20 backdrop-blur-sm">
                <h3 className="font-display text-lg font-bold text-slate-900 mb-6">
                  Other Ways to Reach Us
                </h3>
                <div className="space-y-5">
                  {contactMethods.map((method, i) => (
                    <a
                      key={i}
                      href={method.href}
                      className={`group flex items-center gap-4 rounded-2xl p-4 ring-1 ${method.ring} bg-white/60 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${
                        !method.href ? "cursor-default" : "hover:ring-2"
                      }`}
                    >
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${method.gradient} text-white shadow-md`}
                      >
                        {method.icon}
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                          {method.label}
                        </p>
                        <p className="font-medium text-slate-800 group-hover:text-indigo-600 transition-colors">
                          {method.value}
                        </p>
                      </div>
                      {method.href && (
                        <svg
                          className="ml-auto h-5 w-5 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick tip card */}
              <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50/80 p-6 ring-1 ring-indigo-200/40">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-600">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Quick tip</p>
                    <p className="mt-1 text-sm text-slate-600">
                      For faster responses, include a clear subject line. We read every message!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA strip */}
        <section className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-20">
          <div className="rounded-2xl bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-rose-500/10 p-8 text-center ring-1 ring-indigo-200/30">
            <p className="text-slate-600 mb-4">
              Prefer to explore our content first?
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button href="/blogs" variant="primary" size="md">
                Browse Blogs
              </Button>
              <Button href="/categories" variant="outline" size="md">
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
