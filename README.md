# Maldives Only - Hotel Booking Application

A modern hotel booking application built with Next.js 15, TypeScript, and TailwindCSS, specifically designed for booking hotels and resorts in the Maldives. The application integrates with LiteAPI for real-time hotel data and booking capabilities.

## Features

- 🏝️ Browse and search hotels in the Maldives
- 🔍 Search by destination or vibe
- ❤️ Wishlist functionality
- 🏨 Detailed hotel and room information
- 💳 Secure booking and checkout process
- 📱 Responsive design for all devices

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **State Management:** Zustand
- **Form Handling:** React Hook Form
- **Schema Validation:** Zod
- **Icons:** Lucide React
- **API Integration:** LiteAPI

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- LiteAPI account and API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/0x-m1cro/tv-ota.git
cd tv-ota
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your LiteAPI credentials:
```env
LITEAPI_API_KEY=your_api_key_here
LITEAPI_SANDBOX_KEY=your_sandbox_key_here
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
tv-ota/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page with search
│   ├── search/            # Search results
│   ├── hotels/[id]/       # Hotel details
│   ├── checkout/          # Checkout page
│   ├── booking/
│   │   └── confirmation/  # Booking confirmation
│   └── wishlist/          # Wishlist page
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── search/           # Search-related components
│   ├── hotel/            # Hotel-related components
│   └── booking/          # Booking-related components
├── lib/                  # Utility functions
│   ├── liteApi.ts       # LiteAPI client
│   └── utils.ts         # Helper functions
└── types/               # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## API Integration

The application uses LiteAPI for hotel data and booking operations. Key endpoints:

- Search hotels by location
- Get hotel details
- Get available rooms
- Prebook rooms
- Create and manage bookings

API client is located in `lib/liteApi.ts` and uses the `server-only` package to ensure API keys never leak to the client.

## License

This project is private and proprietary.
