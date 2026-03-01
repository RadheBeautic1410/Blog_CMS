import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { FlowerIcon } from "@/components/icons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how we collect, use, and protect your personal information when you use our blog and services.",
};

const sections = [
  {
    title: "Information We Collect",
    content: [
      "We may collect information you provide directly (e.g., name, email when you subscribe to our newsletter or contact us), usage data (e.g., pages visited, time spent), and technical data (e.g., IP address, browser type) to improve our site and services.",
    ],
  },
  {
    title: "How We Use Your Information",
    content: [
      "We use collected information to deliver and improve our content, respond to your inquiries, send newsletters (if you opted in), analyze site usage, and ensure security. We do not sell your personal information to third parties.",
    ],
  },
  {
    title: "Cookies and Similar Technologies",
    content: [
      "We may use cookies and similar technologies to remember preferences, understand how you use our site, and improve your experience. You can manage cookie settings in your browser.",
    ],
  },
  {
    title: "Third-Party Services",
    content: [
      "Our site may use third-party services (e.g., analytics, hosting). These providers have their own privacy policies governing how they use data. We encourage you to review their policies.",
    ],
  },
  {
    title: "Data Security",
    content: [
      "We take reasonable measures to protect your data against unauthorized access, alteration, or loss. No method of transmission over the internet is 100% secure; we cannot guarantee absolute security.",
    ],
  },
  {
    title: "Your Rights",
    content: [
      "Depending on your location, you may have rights to access, correct, or delete your personal data, or to object to or restrict certain processing. Contact us to exercise these rights.",
    ],
  },
  {
    title: "Children's Privacy",
    content: [
      "Our services are not directed to individuals under 13. We do not knowingly collect personal information from children. If you believe we have collected such information, please contact us so we can delete it.",
    ],
  },
  {
    title: "Changes to This Policy",
    content: [
      "We may update this Privacy Policy from time to time. We will post the revised policy on this page and update the “Last updated” date. Continued use of the site after changes constitutes acceptance.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-indigo-50/30 relative">
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <FlowerIcon className="absolute -right-8 top-20 h-40 w-40 fill-indigo-300/30 -rotate-12" aria-hidden />
        <FlowerIcon className="absolute -left-6 top-1/2 h-28 w-28 fill-violet-300/25 rotate-[15deg]" aria-hidden />
      </div>

      <Navbar />
      <main className="relative overflow-hidden">
        <section className="relative px-4 pt-20 pb-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 p-4">
              <svg className="h-10 w-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Privacy <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">Policy</span>
            </h1>
            <p className="mt-4 text-slate-600 max-w-xl mx-auto">
              Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </section>

        <section className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-24">
          <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-8 shadow-lg shadow-slate-200/40 sm:p-10">
            <p className="text-slate-600 leading-relaxed mb-10">
              We respect your privacy and are committed to protecting your personal data. This policy explains how we collect, use, and safeguard your information when you visit our blog.
            </p>

            <div className="space-y-10">
              {sections.map((section, i) => (
                <div key={i}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="h-1 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
                    <h2 className="font-display text-xl font-bold text-slate-900">
                      {section.title}
                    </h2>
                  </div>
                  <div className="space-y-3 text-slate-600 leading-relaxed pl-10">
                    {section.content.map((para, j) => (
                      <p key={j}>{para}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-slate-200">
              <p className="text-slate-600 text-sm">
                If you have questions about this Privacy Policy or your data, please{" "}
                <Link href="/contact" className="text-indigo-600 font-medium hover:underline">
                  contact us
                </Link>.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
