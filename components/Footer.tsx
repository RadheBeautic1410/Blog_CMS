import Link from "next/link";
import { FlowerIcon } from "@/components/icons";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/blogs", label: "Blogs" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];

const socialLinks = [
  { href: "#", label: "Twitter", icon: "twitter" },
  { href: "#", label: "Facebook", icon: "facebook" },
  { href: "#", label: "LinkedIn", icon: "linkedin" },
  { href: "#", label: "GitHub", icon: "github" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden text-slate-800">
      {/* Proper waves - animated wave divider at top */}
      <div className="relative w-full overflow-hidden">
        <div
          className="wave-animate flex w-[200%]"
          style={{ minHeight: "88px" }}
        >
          <svg
            className="block w-1/2 flex-shrink-0"
            viewBox="0 0 1440 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            style={{ height: "auto", minHeight: "88px", display: "block" }}
            aria-hidden
          >
            {/* Long waves - back (2 gentle curves) */}
            <path
              d="M0 55 C360 5 720 105 1080 55 C1260 15 1440 55 1440 55 L1440 100 L0 100 Z"
              fill="#EDE9FE"
            />
            {/* Long waves - middle (2 long curves) */}
            <path
              d="M0 50 C360 10 720 90 1080 50 C1260 10 1440 90 1440 50 L1440 100 L0 100 Z"
              fill="#E0E7FF"
            />
            {/* Long waves - front (2 long curves) */}
            <path
              d="M0 45 C360 8 720 82 1080 45 C1260 8 1440 45 1440 45 L1440 100 L0 100 Z"
              fill="#F5F3FF"
            />
          </svg>
          <svg
            className="block w-1/2 flex-shrink-0"
            viewBox="0 0 1440 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            style={{ height: "auto", minHeight: "88px", display: "block" }}
            aria-hidden
          >
            <path
              d="M0 55 C360 5 720 105 1080 55 C1260 15 1440 55 1440 55 L1440 100 L0 100 Z"
              fill="#EDE9FE"
            />
            <path
              d="M0 50 C360 10 720 90 1080 50 C1260 10 1440 90 1440 50 L1440 100 L0 100 Z"
              fill="#E0E7FF"
            />
            <path
              d="M0 45 C360 8 720 82 1080 45 C1260 8 1440 45 1440 45 L1440 100 L0 100 Z"
              fill="#F5F3FF"
            />
          </svg>
        </div>
      </div>

      {/* Footer content area - solid light bg below waves */}
      <div className="relative bg-[#F5F3FF] min-h-[320px] pt-8 pb-16 sm:pt-10 sm:pb-20 lg:pt-12 lg:pb-24">
        {/* Soft flower motifs - very light pastel */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <FlowerIcon
            className="absolute -right-20 top-40 h-28 w-28 fill-violet-200/40"
            aria-hidden
          />
          <FlowerIcon
            className="absolute -left-16 bottom-32 h-24 w-24 fill-indigo-200/35"
            aria-hidden
          />
          <FlowerIcon
            className="absolute right-1/3 top-24 h-16 w-16 fill-sky-200/30"
            aria-hidden
          />
        </div>

        {/* Footer content - inside waves */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
            {/* Brand */}
            <div className="md:col-span-2">
              <Link href="/" className="font-display text-3xl font-bold">
                <span className="bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-500 bg-clip-text text-transparent">
                  BlogHub
                </span>
              </Link>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-slate-500">
                Your go-to destination for insightful articles, tutorials, and
                ideas on technology, business, programming, and lifestyle. Stay
                informed and inspired.
              </p>
              <div className="mt-8 flex gap-3">
                {socialLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-all duration-200 hover:bg-indigo-500 hover:text-white hover:scale-110"
                    aria-label={item.label}
                  >
                    {item.icon === "twitter" && (
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    )}
                    {item.icon === "facebook" && (
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {item.icon === "linkedin" && (
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {item.icon === "github" && (
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900">
                Quick Links
              </h4>
              <ul className="mt-5 space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 transition-colors hover:text-indigo-600"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900">
                Legal
              </h4>
              <ul className="mt-5 space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 transition-colors hover:text-indigo-600"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
