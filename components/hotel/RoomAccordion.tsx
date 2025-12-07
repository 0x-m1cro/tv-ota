"use client";

import { useState } from "react";
import { ChevronDown, Users, Wifi, Coffee, CheckCircle, XCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import type { Rate } from "@/types/liteapi";

interface RoomAccordionProps {
  rooms: Array<{
    roomId: string;
    roomName: string;
    rates: Rate[];
  }>;
  onSelectRoom: (offerId: string, rate: Rate) => void;
}

export default function RoomAccordion({ rooms, onSelectRoom }: RoomAccordionProps) {
  const [expandedRooms, setExpandedRooms] = useState<Set<string>>(new Set([rooms[0]?.roomId]));

  const toggleRoom = (roomId: string) => {
    const newExpanded = new Set(expandedRooms);
    if (newExpanded.has(roomId)) {
      newExpanded.delete(roomId);
    } else {
      newExpanded.add(roomId);
    }
    setExpandedRooms(newExpanded);
  };

  const getBoardTypeLabel = (boardType: string) => {
    const labels: Record<string, string> = {
      RO: "Room Only",
      BB: "Bed & Breakfast",
      HB: "Half Board",
      FB: "Full Board",
      AI: "All Inclusive",
      BD: "Breakfast & Dinner",
      BL: "Breakfast & Lunch",
      DI: "Dinner Included",
    };
    return labels[boardType] || boardType;
  };

  const isRefundable = (rate: Rate) => {
    return rate.cancellationPolicies.refundableTag === "refundable";
  };

  const getFreeCancellationDate = (rate: Rate) => {
    const policies = rate.cancellationPolicies.cancelPolicyInfos;
    if (!policies || policies.length === 0) return null;
    
    const freePolicy = policies.find((p) => p.amount === 0);
    if (freePolicy) {
      return new Date(freePolicy.toDate).toLocaleDateString();
    }
    return null;
  };

  if (!rooms || rooms.length === 0) {
    return (
      <div className="rounded-lg bg-gray-50 p-8 text-center">
        <p className="text-gray-600">No rooms available for the selected dates</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {rooms.map((room) => {
        const isExpanded = expandedRooms.has(room.roomId);

        return (
          <div key={room.roomId} className="overflow-hidden rounded-lg border border-gray-200">
            {/* Room Header */}
            <button
              onClick={() => toggleRoom(room.roomId)}
              className="flex w-full items-center justify-between bg-gray-50 p-4 text-left transition-colors hover:bg-gray-100"
            >
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{room.roomName}</h3>
                <p className="mt-1 text-sm text-gray-600">
                  {room.rates.length} rate option{room.rates.length > 1 ? "s" : ""} available
                </p>
              </div>
              <ChevronDown
                className={`h-6 w-6 text-gray-600 transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Room Details */}
            {isExpanded && (
              <div className="space-y-4 p-4">
                {room.rates.map((rate, index) => {
                  const price = rate.retailRate.total[0];
                  const freeCancellationDate = getFreeCancellationDate(rate);

                  return (
                    <div
                      key={`${rate.rateId}-${index}`}
                      className="rounded-lg border border-gray-200 bg-white p-4"
                    >
                      {/* Rate Header */}
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {getBoardTypeLabel(rate.boardType)}
                          </h4>
                          {rate.boardName && (
                            <p className="mt-1 text-sm text-gray-600">{rate.boardName}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">
                            {price.currency} {price.amount.toFixed(0)}
                          </div>
                          <div className="text-sm text-gray-600">per night</div>
                        </div>
                      </div>

                      {/* Occupancy */}
                      <div className="mb-3 flex items-center gap-2 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>
                          Max {rate.maxOccupancy} guests ({rate.adultCount} adults
                          {rate.childCount > 0 && `, ${rate.childCount} children`})
                        </span>
                      </div>

                      {/* Amenities */}
                      {rate.amenities && rate.amenities.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-2">
                          {rate.amenities.slice(0, 3).map((amenity, i) => (
                            <span
                              key={i}
                              className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700"
                            >
                              <Wifi className="h-3 w-3" />
                              {amenity}
                            </span>
                          ))}
                          {rate.amenities.length > 3 && (
                            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                              +{rate.amenities.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Cancellation Policy */}
                      <div className="mb-4 space-y-2">
                        <div className="flex items-center gap-2">
                          {isRefundable(rate) ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium text-green-700">
                                Free Cancellation
                                {freeCancellationDate && ` until ${freeCancellationDate}`}
                              </span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-red-600" />
                              <span className="text-sm font-medium text-red-700">
                                Non-refundable
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Book Button */}
                      <Button
                        onClick={() => onSelectRoom(rate.rateId, rate)}
                        className="w-full"
                      >
                        Book This Room →
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
