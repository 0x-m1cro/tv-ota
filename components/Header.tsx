"use client";

import Link from "next/link";
import { Heart, Menu } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">Maldives</span>
            <span className="ml-2 text-2xl font-light text-gray-800">Only</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-6 md:flex">
          <Link
            href="/search"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
          >
            Search Hotels
          </Link>
          <Link
            href="/wishlist"
            className="flex items-center text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
          >
            <Heart className="mr-1 h-4 w-4" />
            Wishlist
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6 text-gray-700" />
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <nav className="container mx-auto flex flex-col space-y-4 px-4 py-4">
            <Link
              href="/search"
              className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Search Hotels
            </Link>
            <Link
              href="/wishlist"
              className="flex items-center text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Heart className="mr-1 h-4 w-4" />
              Wishlist
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
