import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { FlowerIcon } from "@/components/icons";
import type { Metadata } from "next";
import { NEXT_PUBLIC_URL } from "@/app/constants/env";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms and conditions for using our blog and related services. Please read these terms carefully.",
  alternates: {
    canonical: `${NEXT_PUBLIC_URL}/terms`,
  },
  openGraph: {
    title: "Terms of Service",
    description:
      "Terms and conditions for using our blog and related services. Please read these terms carefully.",
    type: "website",
    url: `${NEXT_PUBLIC_URL}/terms`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service",
    description:
      "Terms and conditions for using our blog and related services. Please read these terms carefully.",
  },
};

const sections = [
  {
    title: "Acceptance of Terms",
    content: [
      "By accessing or using this website and its services, you agree to be bound by these Terms of Service. If you do not agree, please do not use our site. We may update these terms from time to time; continued use after changes constitutes acceptance.",
    ],
  },
  {
    title: "Use of the Site",
    content: [
      "You may use our blog for personal, non-commercial purposes. You agree not to use the site in any way that is unlawful, harmful, or that could damage, disable, or impair the site or others' use of it. You may not attempt to gain unauthorized access to any part of the site, other accounts, or systems.",
    ],
  },
  {
    title: "Intellectual Property",
    content: [
      "Content on this site (text, images, logos, design) is owned by us or our licensors and is protected by copyright and other laws. You may not copy, modify, distribute, or create derivative works without our prior written permission. You may share links to our content for non-commercial purposes.",
    ],
  },
  {
    title: "User-Generated Content",
    content: [
      "If you submit comments, feedback, or other content, you grant us a non-exclusive, royalty-free license to use, display, and distribute that content in connection with our services. You represent that you have the right to submit such content and that it does not violate any third-party rights or applicable laws.",
    ],
  },
  {
    title: "Disclaimer of Warranties",
    content: [
      "The site and content are provided “as is” and “as available.” We do not warrant that the site will be uninterrupted, error-free, or free of harmful components. We disclaim all warranties, express or implied, to the fullest extent permitted by law.",
    ],
  },
  {
    title: "Limitation of Liability",
    content: [
      "To the maximum extent permitted by law, we and our affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or data, arising from your use of the site. Our total liability shall not exceed the amount you paid to us, if any, in the past twelve months.",
    ],
  },
  {
    title: "Links to Other Sites",
    content: [
      "Our site may contain links to third-party websites. We are not responsible for the content or practices of those sites. Your use of linked sites is at your own risk and subject to their terms and policies.",
    ],
  },
  {
    title: "Termination",
    content: [
      "We may suspend or terminate your access to the site at any time, with or without cause or notice. Upon termination, your right to use the site ceases immediately. Provisions that by their nature should survive (e.g., intellectual property, disclaimers, limitation of liability) will survive.",
    ],
  },
  {
    title: "Governing Law",
    content: [
      "These terms are governed by the laws of the jurisdiction in which we operate, without regard to conflict of law principles. Any disputes shall be resolved in the courts of that jurisdiction.",
    ],
  },
  {
    title: "Contact",
    content: [
      "For questions about these Terms of Service, please contact us through our contact page.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-violet-50/30 relative">
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <FlowerIcon
          className="absolute -left-8 top-24 h-40 w-40 fill-violet-300/30 rotate-12"
          aria-hidden
        />
        <FlowerIcon
          className="absolute -right-6 top-1/2 h-28 w-28 fill-indigo-300/25 -rotate-[15deg]"
          aria-hidden
        />
      </div>

      <Navbar />
      <main className="relative overflow-hidden">
        <section className="relative px-4 pt-20 pb-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 p-4">
              <svg
                className="h-10 w-10 text-violet-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Terms of{" "}
              <span className="bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent">
                Service
              </span>
            </h1>
            <p className="mt-4 text-slate-600 max-w-xl mx-auto">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </section>

        <section className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-24">
          <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-8 shadow-lg shadow-slate-200/40 sm:p-10">
            <p className="text-slate-600 leading-relaxed mb-10">
              Please read these terms carefully before using our website. By
              using our blog, you agree to these terms and conditions.
            </p>

            <div className="space-y-10">
              {sections.map((section, i) => (
                <div key={i}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="h-1 w-8 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500" />
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
                For questions about these Terms of Service, please{" "}
                <Link
                  href="/contact"
                  className="text-violet-600 font-medium hover:underline"
                >
                  contact us
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
