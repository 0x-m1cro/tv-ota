# 🏝️ Maldives Only - Premium Hotel Booking Application

A modern, full-featured hotel booking application built with Next.js 16, TypeScript, and TailwindCSS, specifically designed for booking hotels and resorts in the Maldives. The application integrates with LiteAPI for real-time hotel data, pricing, and complete booking capabilities.

## ✨ Features

### Core Functionality
- 🏝️ **Browse & Search** - Search hotels by destination or vibe (romantic, luxury, family, etc.)
- 🔍 **Advanced Filtering** - Filter by price, star rating, board type, amenities, and cancellation policy
- ❤️ **Wishlist** - Save favorite hotels with localStorage persistence
- 🏨 **Detailed Hotel Pages** - View comprehensive hotel information with image galleries, amenities, and policies
- 💳 **Secure Checkout** - Complete booking flow with LiteAPI Payment SDK integration
- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop devices

### Hotel Discovery
- **Destination Search** - Find hotels by city or location in the Maldives
- **Vibe-Based Search** - Discover hotels by mood: Romantic Water Villas, Budget Beachfront, Luxury All-Inclusive, Family Paradise
- **Smart Filtering** - Filter by price range, star rating, board types (Room Only, Breakfast, Half Board, Full Board, All-Inclusive)
- **Real-Time Availability** - Live pricing and availability from LiteAPI

### Booking Experience
- **Room Selection** - Choose from multiple room types with detailed descriptions
- **Rate Options** - Compare different rates with various board types and cancellation policies
- **Guest Information** - Easy-to-use form with validation
- **Payment Integration** - Secure payment processing via LiteAPI Payment SDK
- **Instant Confirmation** - Receive booking confirmation with reference numbers

## 🛠️ Tech Stack

- **Framework:** Next.js 16 with App Router & Turbopack
- **Language:** TypeScript 5
- **Styling:** TailwindCSS 4
- **State Management:** Zustand with persist middleware
- **Form Handling:** React Hook Form
- **Schema Validation:** Zod
- **Icons:** Lucide React
- **API Integration:** LiteAPI Node.js SDK
- **Date Handling:** date-fns

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- LiteAPI account and API key ([Sign up here](https://www.liteapi.travel/))

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/0x-m1cro/tv-ota.git
cd tv-ota
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your LiteAPI credentials:
```env
# Get your API keys from https://www.liteapi.travel/
LITEAPI_API_KEY=your_production_api_key_here
LITEAPI_SANDBOX_KEY=your_sandbox_api_key_here

# Base URL for LiteAPI (default is v3.0)
NEXT_PUBLIC_API_BASE_URL=https://api.liteapi.travel/v3.0
```

> **Note:** For development, use the `LITEAPI_SANDBOX_KEY`. For production, use `LITEAPI_API_KEY`.

4. **Run the development server:**
```bash
npm run dev
```

5. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
tv-ota/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Landing page with search
│   ├── search/page.tsx           # Search results with filters
│   ├── hotels/[id]/page.tsx      # Hotel details with rooms
│   ├── checkout/page.tsx         # Checkout with payment
│   ├── booking/
│   │   └── confirmation/page.tsx # Booking confirmation
│   ├── wishlist/page.tsx         # Saved hotels
│   └── api/                      # API routes
│       ├── search/route.ts       # Hotel search endpoint
│       ├── hotels/[id]/route.ts  # Hotel details endpoint
│       ├── prebook/route.ts      # Prebook endpoint
│       └── booking/              # Booking endpoints
├── components/                   # React components
│   ├── ui/                       # Base UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   ├── search/                   # Search components
│   │   └── FiltersPanel.tsx
│   ├── hotel/                    # Hotel components
│   │   ├── HotelCard.tsx
│   │   ├── ImageGallery.tsx
│   │   └── RoomAccordion.tsx
│   ├── booking/                  # Booking components
│   │   ├── CheckoutForm.tsx
│   │   ├── OrderSummary.tsx
│   │   └── PaymentSDK.tsx
│   ├── Header.tsx                # Site header
│   └── Footer.tsx                # Site footer
├── lib/                          # Utility functions
│   ├── liteApi.ts                # LiteAPI client with SDK
│   ├── store.ts                  # Zustand stores
│   └── utils.ts                  # Helper functions
├── types/                        # TypeScript definitions
│   ├── index.ts                  # App types
│   └── liteapi.ts                # LiteAPI types
└── public/                       # Static assets
```

## 📋 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code quality

## 🔌 API Integration

The application uses the **LiteAPI Node.js SDK** for all hotel-related operations:

### Key Features
- **Hotel Search** - Search hotels by location with occupancy and dates
- **Hotel Details** - Retrieve comprehensive hotel information
- **Room Rates** - Get available rooms with live pricing
- **Prebook** - Validate rates and get final pricing before booking
- **Booking** - Create confirmed bookings with payment
- **Retrieve Bookings** - Get booking details and confirmation

### API Client
Located in `lib/liteApi.ts`, the client uses the `server-only` package to ensure API keys never leak to the client-side code.

### Endpoints Used
```typescript
- GET    /hotels           # Search hotels
- GET    /hotels/{id}      # Hotel details
- GET    /hotels/rates     # Room rates
- POST   /rates/prebook    # Prebook validation
- POST   /rates/book       # Create booking
- GET    /bookings/{id}    # Retrieve booking
```

## 🎨 UI/UX Features

### Design Philosophy
- **Premium Experience** - Clean, modern interface matching Expedia-level quality
- **Mobile-First** - Optimized for all screen sizes
- **Fast Loading** - Server-side rendering with Next.js App Router
- **Intuitive Navigation** - Clear user flows from search to confirmation

### Key Components
- **Image Galleries** - Swipeable carousels with lightbox
- **Room Accordions** - Grouped room types with expandable rate options
- **Filter Panels** - Collapsible filters with mobile drawer
- **Order Summary** - Sticky summary with price breakdown
- **Payment SDK** - Embedded secure payment form

## 🔐 Security

- **Server-Side API Keys** - All API keys are kept server-side only
- **Secure Payment** - PCI-compliant payment processing via LiteAPI
- **Type Safety** - Full TypeScript coverage for type safety
- **Input Validation** - Form validation with React Hook Form and Zod
- **HTTPS Required** - Production deployment requires HTTPS

## 🌍 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `LITEAPI_API_KEY` | Production API key | Yes (for production) |
| `LITEAPI_SANDBOX_KEY` | Sandbox API key | Yes (for development) |
| `NEXT_PUBLIC_API_BASE_URL` | LiteAPI base URL | No (has default) |

## 🧪 Testing

### Manual Testing Checklist
- [ ] Landing page loads with search form
- [ ] Search returns results with filters working
- [ ] Hotel details page shows all information
- [ ] Room selection navigates to checkout
- [ ] Checkout form validates inputs
- [ ] Payment SDK loads correctly (sandbox mode)
- [ ] Booking confirmation displays properly
- [ ] Wishlist adds/removes hotels
- [ ] Mobile responsiveness on all pages

### Test Credentials (Sandbox)
```
Card Number: 4111 1111 1111 1111
Expiry: Any future date
CVV: Any 3 digits
Name: Any name
```

## 📝 License

This project is private and proprietary.

## 👥 Author

Built by [0x-m1cro](https://github.com/0x-m1cro)

## 🙏 Acknowledgments

- [LiteAPI](https://www.liteapi.travel/) for hotel booking API
- [Next.js](https://nextjs.org/) for the React framework
- [TailwindCSS](https://tailwindcss.com/) for styling
- [Lucide](https://lucide.dev/) for icons

---

**Note:** This application is designed specifically for booking hotels in the Maldives. For other destinations, additional configuration may be required.
