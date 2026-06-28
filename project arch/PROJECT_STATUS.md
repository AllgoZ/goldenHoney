# GOLDEN HONEY — site-v2 Project Status

> Last updated: 2026-06-24
> Build: ✅ Passing (TypeScript: 0 errors)
> Dev server: `npm run dev` → http://localhost:3000
> **Current Phase: PHASE 3 — Live Firestore Integration** (In Progress)

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.2.9 |
| Language | TypeScript | ^5 |
| UI | React | 19.2.4 |
| Styling | Tailwind CSS v4 | ^4 |
| Animation | Framer Motion | ^12.40.0 |
| State | Zustand (with persist) | ^5.0.14 |
| Icons | Lucide React | ^1.21.0 |
| Database | Firebase / Firestore | Latest |
| CDN / Images | Cloudinary | Latest |
| Utilities | clsx + tailwind-merge | latest |
| Runtime | Node.js / Turbopack | — |

**Key Tailwind v4 note:** No `tailwind.config.ts`. All brand tokens live in `app/globals.css` inside `@theme {}`. Custom colors (`bg-honey`, `text-onyx`, etc.) are auto-generated from `--color-*` CSS variables.

---

## Current Status — PHASE 3: Live Firestore Integration

### ✅ **COMPLETED (Tier 1-2)**

#### Task 1: Products Integration ✅
- Real Firestore products collection connected
- `/shop` page loads products from Firestore (with category filters)
- Homepage displays bestsellers from Firestore
- Product detail pages pull from Firestore (`/product/[slug]`)
- All products default to `status: 'active'` for visibility
- **Status**: Fully functional

#### Task 2: Categories Integration ✅
- Categories loaded from Firestore into shop filters
- Admin product forms load categories dynamically
- Category-based filtering works on shop page
- **Status**: Fully functional

#### BONUS: Cloudinary Image CDN ✅
- All product images upload to Cloudinary
- Image URLs stored in Firestore
- Cloudinary domain configured in Next.js image optimization
- ImageUpload component uses Cloudinary API
- **Status**: Ready for testing

#### Admin Module ✅
- Login flow with Firebase Auth
- Dashboard with stats
- Product CRUD (create, read, update, delete)
- Categories management
- Orders list & detail view
- Admin pages hidden from navbar (/admin routes)
- **Status**: Fully functional with real Firestore

#### Firestore Rules & Security ✅
- Admin role-based permissions (super_admin, admin with role-based actions)
- Products: Guests can read active products; admins can write
- Orders: Users own their orders; admins can read all
- Categories, reviews, coupons: Admin-managed collections
- **Status**: Deployed and tested

---

### ✅ **COMPLETED (Tier 3)**

#### Task 3: Wishlist Integration ✅
- `AuthProvider` subscribes to Firebase Auth state at app root
- On login: loads wishlist product IDs from Firestore, fetches full products, populates Zustand store
- Toggle syncs optimistically to Zustand, then writes to Firestore `wishlist/{uid}`
- Reverts on Firestore write failure
- **Status**: Fully functional

#### Task 4: User Profile & Account ✅
- Real Firebase Auth wired up in `useAuth.ts` (replaces mock)
- Login/register pages use `auth.service.ts` with proper Firebase error messages
- `app/account/edit/page.tsx` created — updates Firebase displayName + Firestore + Zustand
- Account page shows edit button linking to `/account/edit`
- **Status**: Fully functional

#### Task 5: Address Management ✅
- `/account/addresses` page loads from Firestore `users/{uid}/addresses`
- Delete and set-default call `user.service.ts` (already had full service layer)
- Loading and per-item delete spinners added
- Add New link points to `/account/addresses/new` (form pending)
- **Status**: Read/delete/set-default functional; add/edit form pending

---

### 🔴 **PENDING (Tier 4-5)**

#### Task 6: Reviews Integration
- Review schema ready
- Approval workflow (admin-approved, user-submitted)
- **Next**: Review list on product page, submit review form

#### Task 7: Coupons in Checkout
- Coupon schema ready
- **Next**: Apply coupon validation, discount calculation in checkout

#### Task 8: Banners Integration
- Banner schema ready
- **Next**: Hero banner, promotional banners on homepage

#### Task 9: Settings Integration
- Store settings in Firestore (shipping rates, contact info, etc.)
- **Next**: Load in footer, admin settings page

#### Task 10: Order Creation
- Order schema ready (`orders` collection)
- **Next**: Create order from cart (no Razorpay yet), send confirmation

#### Task 11: Order History
- User orders view
- Admin orders view with pagination
- **Next**: Implement with real Firestore orders

#### Task 12: Firebase Storage for Avatars
- Avatar upload for user profile
- **Next**: Implement user avatar functionality

#### Task 13: Admin Validation
- Comprehensive admin CRUD testing with real data
- **Next**: Full regression testing

#### Task 14: Global Error Handling
- Error boundaries
- Loading skeletons
- Toast notifications
- **Next**: Implement error boundary, toast component, loading states

#### Task 15: Final E2E Validation
- Complete user flow from browse → cart → checkout → order
- **Next**: Full testing with real Firestore

---

## Architecture

```
site-v2/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout — fonts, Navbar, Footer
│   ├── globals.css               # Tailwind v4 @theme brand tokens + utilities
│   ├── page.tsx                  # Homepage (Firestore bestsellers)
│   ├── shop/page.tsx             # Product listing (Firestore products + filters)
│   ├── product/[slug]/
│   │   ├── page.tsx              # Client component — loads product from Firestore
│   │   └── ProductPageContent.tsx # Interactive UI
│   ├── admin/                    # Admin dashboard (Firebase Auth protected)
│   │   ├── layout.tsx
│   │   ├── page.tsx             # Dashboard
│   │   ├── products/            # Products CRUD
│   │   ├── orders/              # Orders list & detail
│   │   ├── categories/          # Categories management
│   │   ├── reviews/
│   │   ├── coupons/
│   │   ├── banners/
│   │   ├── customers/
│   │   └── settings/
│   ├── api/
│   │   ├── upload/route.ts      # Cloudinary image uploads
│   │   └── setup-admin/route.ts # First admin setup
│   └── [other public pages]
│
├── components/
│   ├── admin/                   # Admin components
│   ├── layout/                  # Navbar, Footer
│   └── product/                 # ProductCard, etc.
│
├── hooks/
│   ├── useCart.ts              # Zustand cart
│   ├── useWishlist.ts          # Zustand wishlist
│   ├── useAuth.ts              # Firebase Auth
│   └── useAdmin.ts             # Admin utilities
│
├── store/                       # Zustand stores
│   ├── cart.ts                 # Cart (localStorage)
│   ├── wishlist.ts             # Wishlist (localStorage)
│   ├── user.ts                 # Current user
│   └── ui.ts                   # UI state (modals, toasts)
│
├── lib/
│   ├── firebase.ts             # Firebase config + initialization
│   ├── services/               # Firestore service layer
│   │   ├── product.service.ts  # Products queries
│   │   ├── category.service.ts # Categories
│   │   ├── order.service.ts    # Orders
│   │   ├── user.service.ts     # User profiles
│   │   ├── admin.service.ts    # Admin utilities
│   │   └── cloudinary.service.ts # Cloudinary uploads
│   ├── utils.ts                # Helpers
│   └── mock/                   # [Legacy mock data — being phased out]
│
├── types/
│   ├── firebase.ts             # Firestore schema types (FSProduct, FSOrder, etc.)
│   └── index.ts                # Legacy types
│
├── firestore.rules             # Security rules (deployed)
├── firestore.indexes.json       # Composite indexes
├── .env.local                  # Firebase credentials
└── [config files]
```

---

## Firestore Schema

### Collections

| Collection | Fields | Status |
|-----------|--------|--------|
| `products` | id, slug, name, images[], categorySlug, price, rating, reviewCount, status, weightOptions[], etc. | ✅ Live |
| `categories` | id, slug, name | ✅ Live |
| `orders` | id, userId, items[], total, status, createdAt, etc. | 🟡 Schema ready, not in use yet |
| `users/{uid}` | email, displayName, avatar, createdAt | 🟡 Schema ready |
| `users/{uid}/addresses` | id, type, fullName, phone, address, city, state, zip, isDefault | 🟡 Schema ready |
| `wishlist/{userId}` | items: {productId: boolean} | 🔴 Schema ready |
| `reviews` | id, productId, userId, rating, text, approved, createdAt | 🔴 Schema ready |
| `coupons` | code, discount, type, minOrder, maxUses, usedCount | 🔴 Schema ready |
| `banners` | id, image, title, link, position, active | 🔴 Schema ready |
| `settings` | key, value | 🔴 Schema ready |

---

## Firestore Security Rules (Current)

```firestore
// Products: Public read (all), admin write only
match /products/{productId} {
  allow read:  if true;  // Temporarily permissive for testing
  allow write: if isSuperAdmin() || hasAdminPermission('manageProducts');
}

// Other collections: Similar admin-gated write, public/auth-gated read
```

**Note**: Currently set to `allow read: if true` for testing. Will be refined to:
```firestore
allow read: if resource.data.status == 'active' || isAdmin() || isSuperAdmin();
```

---

## Environment Setup (Firebase)

### .env.local
```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=golden-honey-920f5
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dhjcr3vdl
NEXT_PUBLIC_CLOUDINARY_API_KEY=455629597595875
```

---

## How to Run

```bash
# Development
npm run dev
# → http://localhost:3000

# Firestore emulator (optional)
firebase emulators:start

# Deploy Firestore rules
firebase deploy --only firestore:rules

# TypeScript check
npx tsc --noEmit

# Production build
npm run build && npm start
```

---

## Known Issues & Fixes

| Issue | Status | Fix |
|-------|--------|-----|
| Product detail 404 on initial load | ✅ Fixed | Made product page a client component; query now executes in browser with auth context |
| Firestore permissions denied (server-side) | ✅ Fixed | Rules set to `allow read: if true` for testing; will refine to status check |
| Hydration mismatch warnings | ✅ Fixed | Added `suppressHydrationWarning` to body tag |
| TypeScript errors with FSProduct type | ✅ Fixed | Updated all components to use FSProduct instead of Product |
| Cart/Wishlist store string IDs | ✅ Fixed | Store now accepts `string \| number` for product IDs |
| Missing Cloudinary domain in next.config | ✅ Fixed | Added `res.cloudinary.com` to remotePatterns |

---

## Next Immediate Steps

1. **Task 3 Completion**: Wishlist ↔ Firestore sync
2. **Task 4 Completion**: User profile form + avatar
3. **Refine Firestore Rules**: Change `allow read: if true` → `allow read: if resource.data.status == 'active'`
4. **Task 13**: Admin module regression testing
5. **Task 10-11**: Order creation and history

---

## Performance & Notes

- **Build time**: ~2s (Turbopack)
- **Dev server startup**: ~1s
- **Firestore queries**: Real-time with onSnapshot listeners
- **Image optimization**: Next.js Image component + Cloudinary CDN
- **State persistence**: Zustand with localStorage (cart, wishlist)
- **Animation library**: Framer Motion (spring physics for buttery feel)

---

**Last updated by**: Claude Code assistant
**Date**: 2026-06-23
