"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Button from "@/components/ui/Button";

export interface FilterOptions {
  priceRange: [number, number];
  starRating: number[];
  boardTypes: string[];
  amenities: string[];
  isRefundable: boolean;
}

interface FiltersPanelProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onClose?: () => void;
  isMobile?: boolean;
}

const BOARD_TYPES = [
  { value: "RO", label: "Room Only" },
  { value: "BB", label: "Bed & Breakfast" },
  { value: "HB", label: "Half Board" },
  { value: "FB", label: "Full Board" },
  { value: "AI", label: "All Inclusive" },
];

const AMENITIES = [
  "Pool",
  "Spa",
  "WiFi",
  "Beach Access",
  "Water Villa",
  "Restaurant",
  "Bar",
  "Gym",
  "Kids Club",
];

export default function FiltersPanel({
  filters,
  onFilterChange,
  onClose,
  isMobile = false,
}: FiltersPanelProps) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handlePriceChange = (index: 0 | 1, value: number) => {
    const newRange: [number, number] = [...localFilters.priceRange];
    newRange[index] = value;
    setLocalFilters({ ...localFilters, priceRange: newRange });
  };

  const handleStarRatingToggle = (star: number) => {
    const newRatings = localFilters.starRating.includes(star)
      ? localFilters.starRating.filter((s) => s !== star)
      : [...localFilters.starRating, star];
    setLocalFilters({ ...localFilters, starRating: newRatings });
  };

  const handleBoardTypeToggle = (type: string) => {
    const newTypes = localFilters.boardTypes.includes(type)
      ? localFilters.boardTypes.filter((t) => t !== type)
      : [...localFilters.boardTypes, type];
    setLocalFilters({ ...localFilters, boardTypes: newTypes });
  };

  const handleAmenityToggle = (amenity: string) => {
    const newAmenities = localFilters.amenities.includes(amenity)
      ? localFilters.amenities.filter((a) => a !== amenity)
      : [...localFilters.amenities, amenity];
    setLocalFilters({ ...localFilters, amenities: newAmenities });
  };

  const applyFilters = () => {
    onFilterChange(localFilters);
    if (onClose) onClose();
  };

  const resetFilters = () => {
    const defaultFilters: FilterOptions = {
      priceRange: [0, 10000],
      starRating: [],
      boardTypes: [],
      amenities: [],
      isRefundable: false,
    };
    setLocalFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className={`${isMobile ? "fixed inset-0 z-50 bg-white" : ""}`}>
      {isMobile && (
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-xl font-bold">Filters</h2>
          <button onClick={onClose} aria-label="Close filters">
            <X className="h-6 w-6" />
          </button>
        </div>
      )}

      <div className={`${isMobile ? "overflow-y-auto p-4" : ""} space-y-6`}>
        {/* Price Range */}
        <div>
          <h3 className="mb-3 font-semibold text-gray-900">Price Range (USD)</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={localFilters.priceRange[0]}
                onChange={(e) => handlePriceChange(0, parseInt(e.target.value) || 0)}
                className="w-full rounded border border-gray-300 px-3 py-2"
                placeholder="Min"
              />
              <span>-</span>
              <input
                type="number"
                value={localFilters.priceRange[1]}
                onChange={(e) => handlePriceChange(1, parseInt(e.target.value) || 0)}
                className="w-full rounded border border-gray-300 px-3 py-2"
                placeholder="Max"
              />
            </div>
          </div>
        </div>

        {/* Star Rating */}
        <div>
          <h3 className="mb-3 font-semibold text-gray-900">Star Rating</h3>
          <div className="space-y-2">
            {[5, 4, 3].map((star) => (
              <label key={star} className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={localFilters.starRating.includes(star)}
                  onChange={() => handleStarRatingToggle(star)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600"
                />
                <span className="text-sm">
                  {Array.from({ length: star }).map((_, i) => "⭐").join("")}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Cancellation Policy */}
        <div>
          <h3 className="mb-3 font-semibold text-gray-900">Cancellation</h3>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={localFilters.isRefundable}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, isRefundable: e.target.checked })
              }
              className="h-4 w-4 rounded border-gray-300 text-blue-600"
            />
            <span className="text-sm">Free Cancellation</span>
          </label>
        </div>

        {/* Board Type */}
        <div>
          <h3 className="mb-3 font-semibold text-gray-900">Board Type</h3>
          <div className="space-y-2">
            {BOARD_TYPES.map((type) => (
              <label key={type.value} className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={localFilters.boardTypes.includes(type.value)}
                  onChange={() => handleBoardTypeToggle(type.value)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600"
                />
                <span className="text-sm">{type.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div>
          <h3 className="mb-3 font-semibold text-gray-900">Amenities</h3>
          <div className="space-y-2">
            {AMENITIES.map((amenity) => (
              <label key={amenity} className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={localFilters.amenities.includes(amenity)}
                  onChange={() => handleAmenityToggle(amenity)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600"
                />
                <span className="text-sm">{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-4">
          <Button onClick={applyFilters} className="w-full">
            Apply Filters
          </Button>
          <Button onClick={resetFilters} variant="outline" className="w-full">
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
