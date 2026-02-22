"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/blogs", label: "Blogs" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Scroll detection - transparent at top, white when scrolled
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
        setSearchResults([]);
      }
    };

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isSearchOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        setSearchResults(data.results || []);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const handleResultClick = (slug: string) => {
    router.push(`/blogs/${slug}`);
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200/80"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className={`font-display text-2xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent transition-opacity hover:opacity-90 ${
                !isScrolled ? "drop-shadow-sm" : ""
              }`}
            >
              BlogHub
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center gap-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      active
                        ? "bg-indigo-50 text-slate-600 shadow-md shadow-indigo-500/30"
                        : isScrolled
                          ? "text-slate-600 hover:text-indigo-600 hover:bg-indigo-50"
                          : "text-slate-700 hover:text-indigo-600 hover:bg-indigo-100/90"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Side - Search and Login */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search */}
            <div className="relative" ref={searchContainerRef}>
              {isSearchOpen && (
                <div className="absolute right-0 top-0 w-96 bg-white border-2 border-indigo-300 rounded-xl shadow-2xl">
                  <form onSubmit={handleSearchSubmit} className="p-3">
                    <div className="flex items-center space-x-2">
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search articles..."
                        className="flex-1 px-4 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        type="submit"
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery("");
                          setSearchResults([]);
                        }}
                        className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </form>
                  
                  {/* Search Results Dropdown */}
                  {searchQuery.trim() && (
                    <div className="max-h-96 overflow-y-auto border-t border-indigo-200">
                      {isSearching ? (
                        <div className="p-4 text-center text-slate-500">
                          Searching...
                        </div>
                      ) : searchResults.length > 0 ? (
                        <div className="py-2">
                          {searchResults.slice(0, 5).map((result) => (
                            <button
                              key={result.id}
                              onClick={() => handleResultClick(result.slug)}
                              className="w-full text-left px-4 py-3 hover:bg-indigo-50 transition-colors border-b border-indigo-100 last:border-b-0"
                            >
                              <div className="font-medium text-slate-900 line-clamp-1">
                                {result.title}
                              </div>
                              <div className="text-sm text-slate-500 line-clamp-2 mt-1">
                                {result.excerpt}
                              </div>
                            </button>
                          ))}
                          {searchResults.length > 5 && (
                            <div className="px-4 py-2 border-t border-indigo-200">
                              <button
                                onClick={handleSearchSubmit}
                                className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline w-full text-center font-semibold"
                              >
                                View all {searchResults.length} results
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-slate-500">
                          No results found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              {!isSearchOpen && (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    isScrolled
                      ? "text-slate-600 hover:text-indigo-600 hover:bg-indigo-50"
                      : "text-slate-700 hover:text-indigo-600 hover:bg-indigo-100/90"
                  }`}
                  title="Search"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              )}
            </div>
            <Link
              href="/admin/login"
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-full hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-200 font-semibold text-sm"
            >
              Admin
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2.5 rounded-full transition-all ${
                isScrolled
                  ? "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
                  : "text-slate-700 hover:bg-indigo-100/90 hover:text-indigo-600"
              }`}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-lg">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block px-4 py-2.5 rounded-xl font-medium transition-all ${
                      active
                        ? "bg-gradient-to-r from-indigo-400 to-violet-500 text-white shadow-sm"
                        : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
              
              {/* Mobile Search */}
              <div className="px-3 py-2">
                <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2 bg-white rounded-lg border border-indigo-300">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles..."
                    className="flex-1 px-4 py-2 bg-white rounded-lg focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="p-2 text-indigo-600 hover:text-indigo-700"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </form>
              </div>
              
              <Button href="/admin/login" variant="primary" size="md" className="w-full mt-2 justify-center">
                Admin Login
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
