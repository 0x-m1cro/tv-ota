import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-gray-50">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center">
              <span className="text-xl font-bold text-blue-600">Maldives</span>
              <span className="ml-2 text-xl font-light text-gray-800">Only</span>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              Discover the most beautiful hotels and resorts in the Maldives.
              Your dream tropical getaway awaits.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-600 hover:text-blue-600"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/search"
                  className="text-sm text-gray-600 hover:text-blue-600"
                >
                  Search Hotels
                </Link>
              </li>
              <li>
                <Link
                  href="/wishlist"
                  className="text-sm text-gray-600 hover:text-blue-600"
                >
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
              Contact
            </h3>
            <ul className="mt-4 space-y-2">
              <li className="text-sm text-gray-600">Email: info@maldivesonly.com</li>
              <li className="text-sm text-gray-600">Phone: +960 123 4567</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Maldives Only. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
