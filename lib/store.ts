import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { HotelDetails } from "@/types/liteapi";

// Search State
interface SearchState {
  searchMode: "destination" | "vibe";
  destination: string;
  vibe: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
  setSearchMode: (mode: "destination" | "vibe") => void;
  setDestination: (destination: string) => void;
  setVibe: (vibe: string) => void;
  setCheckIn: (checkIn: string) => void;
  setCheckOut: (checkOut: string) => void;
  setAdults: (adults: number) => void;
  setChildren: (children: number) => void;
  setRooms: (rooms: number) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  searchMode: "destination",
  destination: "",
  vibe: "",
  checkIn: "",
  checkOut: "",
  adults: 2,
  children: 0,
  rooms: 1,
  setSearchMode: (mode) => set({ searchMode: mode }),
  setDestination: (destination) => set({ destination }),
  setVibe: (vibe) => set({ vibe }),
  setCheckIn: (checkIn) => set({ checkIn }),
  setCheckOut: (checkOut) => set({ checkOut }),
  setAdults: (adults) => set({ adults }),
  setChildren: (children) => set({ children }),
  setRooms: (rooms) => set({ rooms }),
}));

// Wishlist State with localStorage persistence
interface WishlistItem {
  hotelId: string;
  hotelName: string;
  hotelImage?: string;
  rating?: number;
  price?: {
    amount: number;
    currency: string;
  };
  addedAt: string;
}

interface WishlistState {
  items: WishlistItem[];
  addToWishlist: (hotel: WishlistItem) => void;
  removeFromWishlist: (hotelId: string) => void;
  isInWishlist: (hotelId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addToWishlist: (hotel) => {
        const items = get().items;
        if (!items.find((item) => item.hotelId === hotel.hotelId)) {
          set({ items: [...items, { ...hotel, addedAt: new Date().toISOString() }] });
        }
      },
      removeFromWishlist: (hotelId) => {
        set({ items: get().items.filter((item) => item.hotelId !== hotelId) });
      },
      isInWishlist: (hotelId) => {
        return get().items.some((item) => item.hotelId === hotelId);
      },
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "wishlist-storage",
    }
  )
);

// Booking State
interface BookingState {
  prebookId: string | null;
  offerId: string | null;
  hotelId: string | null;
  checkIn: string | null;
  checkOut: string | null;
  guests: number;
  transactionId: string | null;
  secretKey: string | null;
  setPrebookData: (data: {
    prebookId: string;
    offerId: string;
    hotelId: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    transactionId?: string;
    secretKey?: string;
  }) => void;
  clearBookingData: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  prebookId: null,
  offerId: null,
  hotelId: null,
  checkIn: null,
  checkOut: null,
  guests: 2,
  transactionId: null,
  secretKey: null,
  setPrebookData: (data) => set(data),
  clearBookingData: () =>
    set({
      prebookId: null,
      offerId: null,
      hotelId: null,
      checkIn: null,
      checkOut: null,
      guests: 2,
      transactionId: null,
      secretKey: null,
    }),
}));
