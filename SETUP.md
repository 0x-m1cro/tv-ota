# 🚀 Setup Guide for Maldives Only

This guide will help you set up the Maldives Only hotel booking application from scratch.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** version 18 or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js) or **yarn**
- **Git** for version control
- A code editor (we recommend [VS Code](https://code.visualstudio.com/))

## Step 1: Get LiteAPI Credentials

1. Visit [LiteAPI](https://www.liteapi.travel/)
2. Sign up for a free account
3. Navigate to your dashboard
4. Copy your **Sandbox API Key** (for development)
5. (Optional) Copy your **Production API Key** (for live deployment)

## Step 2: Clone and Install

```bash
# Clone the repository
git clone https://github.com/0x-m1cro/tv-ota.git

# Navigate to the project directory
cd tv-ota

# Install dependencies
npm install

# This will install:
# - Next.js 16
# - React 19
# - TailwindCSS 4
# - LiteAPI SDK
# - Zustand (state management)
# - React Hook Form
# - And other dependencies
```

## Step 3: Configure Environment Variables

```bash
# Copy the example environment file
cp .env.local.example .env.local

# Open .env.local in your editor
# Add your LiteAPI credentials
```

Your `.env.local` should look like:

```env
# LiteAPI Configuration
LITEAPI_API_KEY=your_production_key_here
LITEAPI_SANDBOX_KEY=sand_xxxxxxxxxxxxxxxxxxxxx

# Base URL (don't change unless using a different API version)
NEXT_PUBLIC_API_BASE_URL=https://api.liteapi.travel/v3.0
```

> **Important:** 
> - For development, the app will use `LITEAPI_SANDBOX_KEY`
> - For production, it will use `LITEAPI_API_KEY`
> - Never commit `.env.local` to version control

## Step 4: Run the Development Server

```bash
# Start the development server
npm run dev

# The app will be available at:
# http://localhost:3000
```

You should see:
```
▲ Next.js 16.0.7
- Local:        http://localhost:3000
- Turbopack enabled
```

## Step 5: Verify the Setup

1. **Landing Page:** Open http://localhost:3000
   - You should see the hero section with search form
   - Try selecting dates and clicking "Search Hotels"

2. **Search Results:** Should display hotels from the Maldives
   - Verify filters work
   - Try clicking on a hotel card

3. **Hotel Details:** Should show hotel information
   - Check image gallery
   - Verify room listings appear when dates are selected

4. **Wishlist:** Click the heart icon on any hotel
   - Navigate to the wishlist page
   - Verify the hotel is saved

## Common Issues and Solutions

### Issue: "LITEAPI_API_KEY not configured" warning

**Solution:** Make sure you've created `.env.local` and added your sandbox key:
```bash
cp .env.local.example .env.local
# Then edit .env.local with your actual key
```

### Issue: Port 3000 is already in use

**Solution:** Either stop the other process or use a different port:
```bash
npm run dev -- -p 3001
```

### Issue: Module not found errors

**Solution:** Delete node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Build fails with TypeScript errors

**Solution:** Ensure you're using Node.js 18+:
```bash
node --version  # Should be v18.0.0 or higher
```

## Development Workflow

### Making Changes

1. **Edit Files:** All source files are in `app/`, `components/`, `lib/`, and `types/`
2. **Hot Reload:** Changes are reflected immediately (Fast Refresh)
3. **Check Console:** Open browser DevTools to see any errors

### Testing Features

1. **Search Hotels:**
   - Use "Maldives" as destination
   - Select future dates (today + 7 days, today + 10 days works well)
   - Try 2 adults, 1 room

2. **Test Booking Flow:**
   - Search for hotels
   - Select a hotel
   - Choose a room
   - Fill out guest information
   - Use test card: 4111 1111 1111 1111

### Code Quality

```bash
# Run linter
npm run lint

# Build for production (checks TypeScript)
npm run build
```

## Building for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start

# The app will run on http://localhost:3000
```

## Project Structure Overview

```
tv-ota/
├── app/                   # Next.js pages and API routes
│   ├── page.tsx          # Home/Landing page
│   ├── search/           # Search results
│   ├── hotels/[id]/      # Hotel details (dynamic route)
│   ├── checkout/         # Checkout page
│   ├── booking/          # Booking confirmation
│   ├── wishlist/         # Wishlist page
│   └── api/              # API endpoints
├── components/            # Reusable React components
├── lib/                   # Utilities and API client
├── types/                 # TypeScript type definitions
└── public/               # Static files (images, etc.)
```

## Environment Modes

### Development Mode (npm run dev)
- Uses `LITEAPI_SANDBOX_KEY`
- Hot reload enabled
- Source maps for debugging
- More verbose error messages

### Production Mode (npm run build && npm start)
- Uses `LITEAPI_API_KEY` (or falls back to sandbox)
- Optimized bundle size
- Server-side rendering
- Better performance

## Next Steps

1. **Customize the App:**
   - Edit colors in `tailwind.config.js`
   - Modify content in page components
   - Add your logo in the header

2. **Add Features:**
   - Integrate Google Maps for location
   - Add user authentication
   - Implement email notifications

3. **Deploy:**
   - Deploy to Vercel (recommended)
   - Or use any Node.js hosting platform

## Support

For issues or questions:
- Check the [README.md](./README.md) for detailed documentation
- Review [LiteAPI Documentation](https://docs.liteapi.travel/)
- Open an issue on GitHub

## Security Checklist

- [ ] Environment variables are in `.env.local` (not committed)
- [ ] `.gitignore` includes `.env.local`
- [ ] API keys are never exposed in client-side code
- [ ] HTTPS is used in production
- [ ] CORS is properly configured

---

**You're all set! Happy coding! 🎉**
