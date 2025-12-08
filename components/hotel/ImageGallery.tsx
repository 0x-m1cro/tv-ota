"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ImageGalleryProps {
  images: Array<{ url: string; thumbnailUrl?: string }>;
  hotelName: string;
}

export default function ImageGallery({ images, hotelName }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[16/9] w-full bg-gradient-to-br from-blue-400 to-cyan-300" />
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      {/* Main Gallery */}
      <div className="relative">
        <div
          className="aspect-[16/9] w-full cursor-pointer overflow-hidden rounded-lg"
          onClick={() => setShowLightbox(true)}
        >
          <img
            src={images[currentIndex].url}
            alt={`${hotelName} - Image ${currentIndex + 1}`}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur transition-all hover:bg-white"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6 text-gray-800" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur transition-all hover:bg-white"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6 text-gray-800" />
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1 text-sm text-white backdrop-blur">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {images.slice(0, 8).map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative h-20 w-32 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                index === currentIndex
                  ? "border-blue-600 ring-2 ring-blue-600 ring-offset-2"
                  : "border-transparent hover:border-gray-300"
              }`}
            >
              <img
                src={image.thumbnailUrl || image.url}
                alt={`Thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
          {images.length > 8 && (
            <div className="flex h-20 w-32 shrink-0 items-center justify-center rounded-lg bg-gray-200 text-sm font-medium text-gray-600">
              +{images.length - 8} more
            </div>
          )}
        </div>
      )}

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 backdrop-blur transition-all hover:bg-white/20"
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6 text-white" />
          </button>

          <button
            onClick={goToPrevious}
            className="absolute left-4 rounded-full bg-white/10 p-3 backdrop-blur transition-all hover:bg-white/20"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-8 w-8 text-white" />
          </button>

          <div className="relative max-h-[90vh] max-w-[90vw]">
            <img
              src={images[currentIndex].url}
              alt={`${hotelName} - Image ${currentIndex + 1}`}
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-white backdrop-blur">
              {currentIndex + 1} / {images.length}
            </div>
          </div>

          <button
            onClick={goToNext}
            className="absolute right-4 rounded-full bg-white/10 p-3 backdrop-blur transition-all hover:bg-white/20"
            aria-label="Next image"
          >
            <ChevronRight className="h-8 w-8 text-white" />
          </button>
        </div>
      )}
    </>
  );
}
