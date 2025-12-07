"use client";

import { Heart } from "lucide-react";

export default function WishlistPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Heart className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
      </div>
      <p className="text-gray-600">
        Wishlist page - to be implemented with saved hotels
      </p>
    </div>
  );
}
