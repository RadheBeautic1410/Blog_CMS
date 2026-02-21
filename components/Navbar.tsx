"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === "/";

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
    <header className={`sticky top-0 z-50 ${isHomePage ? 'bg-white/80 backdrop-blur-sm' : 'bg-white'} shadow-sm`}>
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className={`text-2xl font-bold ${isHomePage ? 'text-[#1F2937]' : 'text-[#111827]'}`}>
              BlogHub
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                href="/"
                className={`${isHomePage ? 'text-[#1F2937] hover:text-[#F97316]' : 'text-[#111827] hover:text-[#2563EB]'} transition-colors font-medium`}
              >
                Home
              </Link>
              <Link
                href="/blogs"
                className={`${isHomePage ? 'text-[#1F2937] hover:text-[#F97316]' : 'text-[#111827] hover:text-[#2563EB]'} transition-colors font-medium`}
              >
                Blogs
              </Link>
              <Link
                href="/categories"
                className={`${isHomePage ? 'text-[#1F2937] hover:text-[#F97316]' : 'text-[#111827] hover:text-[#2563EB]'} transition-colors font-medium`}
              >
                Categories
              </Link>
              <Link
                href="/about"
                className={`${isHomePage ? 'text-[#1F2937] hover:text-[#F97316]' : 'text-[#111827] hover:text-[#2563EB]'} transition-colors font-medium`}
              >
                About
              </Link>
              <Link
                href="/contact"
                className={`${isHomePage ? 'text-[#1F2937] hover:text-[#F97316]' : 'text-[#111827] hover:text-[#2563EB]'} transition-colors font-medium`}
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Right Side - Search and Login */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search */}
            <div className="relative" ref={searchContainerRef}>
              {isSearchOpen ? (
                <div className="absolute right-0 top-0 w-96 bg-white border border-gray-300 rounded-lg shadow-lg">
                  <form onSubmit={handleSearchSubmit} className="p-2">
                    <div className="flex items-center space-x-2">
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search articles..."
                        className={`flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${isHomePage ? 'focus:ring-[#F97316]' : 'focus:ring-[#2563EB]'}`}
                      />
                      <button
                        type="submit"
                        className={`p-2 ${isHomePage ? 'text-[#F97316]' : 'text-[#2563EB]'} hover:bg-gray-100 rounded-md`}
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
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-md"
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
                    <div className="max-h-96 overflow-y-auto border-t border-gray-200">
                      {isSearching ? (
                        <div className="p-4 text-center text-gray-500">
                          Searching...
                        </div>
                      ) : searchResults.length > 0 ? (
                        <div className="py-2">
                          {searchResults.slice(0, 5).map((result) => (
                            <button
                              key={result.id}
                              onClick={() => handleResultClick(result.slug)}
                              className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                            >
                              <div className={`font-medium ${isHomePage ? 'text-[#1F2937]' : 'text-[#111827]'} line-clamp-1`}>
                                {result.title}
                              </div>
                              <div className={`text-sm ${isHomePage ? 'text-[#6B7280]' : 'text-gray-500'} line-clamp-2 mt-1`}>
                                {result.excerpt}
                              </div>
                            </button>
                          ))}
                          {searchResults.length > 5 && (
                            <div className="px-4 py-2 border-t border-gray-200">
                              <button
                                onClick={handleSearchSubmit}
                                className={`text-sm ${isHomePage ? 'text-[#F97316]' : 'text-[#2563EB]'} hover:underline w-full text-center`}
                              >
                                View all {searchResults.length} results
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          No results found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className={`p-2 ${isHomePage ? 'text-[#1F2937] hover:text-[#F97316]' : 'text-[#111827] hover:text-[#2563EB]'} transition-colors`}
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
            <button className={`px-4 py-2 ${isHomePage ? 'text-[#1F2937] hover:text-[#F97316]' : 'text-[#111827] hover:text-[#2563EB]'} transition-colors font-medium`}>
              Login
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 ${isHomePage ? 'text-[#1F2937]' : 'text-[#111827]'}`}
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
          <div className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              <Link
                href="/"
                className={`block px-3 py-2 ${isHomePage ? 'text-[#1F2937] hover:text-[#F97316]' : 'text-[#111827] hover:text-[#2563EB]'} transition-colors`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/blogs"
                className={`block px-3 py-2 ${isHomePage ? 'text-[#1F2937] hover:text-[#F97316]' : 'text-[#111827] hover:text-[#2563EB]'} transition-colors`}
                onClick={() => setIsMenuOpen(false)}
              >
                Blogs
              </Link>
              <Link
                href="/categories"
                className={`block px-3 py-2 ${isHomePage ? 'text-[#1F2937] hover:text-[#F97316]' : 'text-[#111827] hover:text-[#2563EB]'} transition-colors`}
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="/about"
                className={`block px-3 py-2 ${isHomePage ? 'text-[#1F2937] hover:text-[#F97316]' : 'text-[#111827] hover:text-[#2563EB]'} transition-colors`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className={`block px-3 py-2 ${isHomePage ? 'text-[#1F2937] hover:text-[#F97316]' : 'text-[#111827] hover:text-[#2563EB]'} transition-colors`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              
              {/* Mobile Search */}
              <div className="px-3 py-2">
                <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles..."
                        className={`flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${isHomePage ? 'focus:ring-[#F97316]' : 'focus:ring-[#2563EB]'}`}
                  />
                  <button
                    type="submit"
                    className={`p-2 ${isHomePage ? 'text-[#F97316]' : 'text-[#2563EB]'} hover:bg-gray-100 rounded-md`}
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
              
              <button className={`block w-full text-left px-3 py-2 ${isHomePage ? 'text-[#1F2937] hover:text-[#F97316]' : 'text-[#111827] hover:text-[#2563EB]'} transition-colors font-medium`}>
                Login
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
