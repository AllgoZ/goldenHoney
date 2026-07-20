# GOLDEN HONEY — site-v2 Project Status

> Last updated: 2026-07-20
> Build: ✅ Passing (TypeScript: 0 errors)
> Dev server: `npm run dev` → http://localhost:3000
> **Current Phase: PHASE 3 — Live Firestore Integration + UI Polish**

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
| Payments | Razorpay (live keys) | Latest |
| Email | Resend | Latest |
| Runtime | Node.js / Turbopack | — |

**Key Tailwind v4 note:** No `tailwind.config.ts`. All brand tokens live in `app/globals.css` inside `@theme {}`.

---

## Completed Features

### Core Integration ✅
- Live Firestore products, categories, orders, customers
- Firebase Auth for admin panel
- Cloudinary image CDN for product images
- Razorpay **live** keys configured — online payment only

### Shop & ProductCard ✅
- Search bar (filters by name, description, category)
- Category filters + sort (price asc/desc)
- Star ratings removed from product cards
- **Single black elevated "Buy" button** on card (no Add button)
- Buy → opens bottom sheet (mobile) or inline picker (desktop)
- Bottom sheet has two buttons: **Add to Cart** + **Buy Now**
- When item is in cart: stepper (−/qty/+) + "Cart" nav button
- `pickerMode` state removed — both actions always available in sheet

### Floating UI (Mobile) ✅
- **Floating cart bar** — animates up from bottom of shop page when cart has items; `bottom-20` on mobile (above bottom nav), `bottom-4` on desktop
- **Bottom navigation bar** — `md:hidden` fixed bar (`h-16`, `z-40`): Home · Cart (with badge) · Orders · Profile
- **WhatsApp button** — `bottom-20 right-5` on mobile (above bottom nav)
- **Picker conflict fix** — both floating cart bar and WhatsApp button set `opacity-0 pointer-events-none` when any product picker sheet is open (`store/ui.ts → pickerOpen`)

### Checkout ✅
- COD fully removed — Razorpay online payment only
- `paymentMethod` state removed from checkout page
- Button always shows "Pay Now"

### Admin Panel ✅
- Product CRUD with Cloudinary images, weight options, stock per variant, SEO fields
- Orders list + detail, status + tracking number (auto-marks shipped)
- Customers: profile, order history, addresses, live cart, wishlist count
- Categories management
- Settings: store settings + **change admin login email/password** (Firebase re-auth via `updateAdminCredentials()`)
- All admin grids mobile-responsive (grid-cols fixed for small screens)
- **Product save bug fixed**: Firestore rejects undefined values — conditional field assignment used throughout

### Content & Branding ✅
- Footer: `kodaigoldenhoney@gmail.com`, +91 91595 43104, both Oddanchatram addresses
- Footer copyright: "All Rights Reserved by ALLGOZ TECH"
- Contact page: real phone, email, hours, Oddanchatram + Malabar Bakes store address
- About page: bilingual (English + Tamil) feature cards

### Bug Fixes ✅
- Firestore undefined field rejection → conditional spreads throughout admin save flows
- `oldPrice` TypeScript error on Vercel: `number | undefined` was compared to `''` — fixed to `!== undefined`
- `CartItem.unitPrice` (not `price`) — shop page cart total uses `i.unitPrice * i.quantity`
- Mobile stepper `+` button clipping — removed `overflow-hidden`, used `flex-shrink-0 w-8` buttons
- Floating cart bar overlapping "Add" buttons — resolved by moving to `bottom-20` on mobile + `pickerOpen` gating

---

## Architecture

```
site-v2/
├── app/
│   ├── globals.css              # Tailwind v4 @theme brand tokens
│   ├── page.tsx                 # Homepage (Firestore bestsellers)
│   ├── shop/page.tsx            # Search, filters, floating cart bar
│   ├── product/[slug]/          # Product detail (client component)
│   ├── cart/                    # Cart page
│   ├── checkout/page.tsx        # Razorpay only (COD removed)
│   ├── order-success/
│   ├── account/
│   ├── contact/page.tsx         # Real business info
│   ├── about/
│   └── admin/
│       ├── products/[id]/page.tsx  # Edit product (mobile grid fixed)
│       ├── products/new/page.tsx   # New product (same fixes)
│       ├── orders/
│       ├── customers/
│       └── settings/page.tsx    # Store settings + credential update
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx           # kodaigoldenhoney@gmail.com, ALLGOZ TECH
│   │   ├── BottomNav.tsx        # Mobile fixed nav: Home/Cart/Orders/Profile
│   │   └── ShopLayoutWrapper.tsx # pb-16 main, WhatsApp at bottom-20
│   └── product/
│       └── ProductCard.tsx      # Single Buy button → sheet with Add + Buy Now
│
├── store/
│   ├── cart.ts
│   ├── wishlist.ts
│   ├── user.ts
│   └── ui.ts                   # pickerOpen: boolean + setPickerOpen
│
├── lib/
│   ├── firebase.ts
│   └── services/
│       ├── product.service.ts
│       ├── category.service.ts
│       ├── order.service.ts
│       ├── admin.service.ts
│       └── auth.service.ts     # updateAdminCredentials()
│
├── types/firebase.ts           # FSProduct, FSOrder, CartItem (unitPrice!)
├── .env.local                  # NEVER COMMIT — Razorpay live keys inside
└── CLAUDE.md / AGENTS.md       # AI coding guidelines
```

---

## Firestore Schema

| Collection | Status |
|-----------|--------|
| `products` | ✅ Live |
| `categories` | ✅ Live |
| `customers/{phoneId}` | ✅ Live |
| `customers/{phoneId}/addresses` | ✅ Live |
| `customers/{phoneId}/orders` | ✅ Live |
| `orders` | ✅ Live (dual-write) |
| `admins` | ✅ Live |
| `reviews` | 🟡 Schema ready |
| `coupons` | 🟡 Schema ready |
| `banners` | 🟡 Schema ready |
| `settings` | 🟡 Schema ready |

---

## Pending Features

| Feature | Priority | Notes |
|---------|----------|-------|
| Wishlist Firestore sync | Medium | Zustand store exists, needs Firestore write |
| Reviews on product page | Low | Schema ready, approval workflow needed |
| Coupon codes in checkout | Low | Schema ready |
| Promotional banners | Low | Schema ready |
| User profile avatar upload | Low | Cloudinary integration needed |
| Tighten Firestore security rules | Medium | Currently `allow read: if true` for products |

---

## How to Run

```bash
# Development
npm run dev            # → http://localhost:3000

# TypeScript check
npx tsc --noEmit

# Production build
npm run build && npm start

# Deploy Firestore rules
firebase deploy --only firestore:rules,firestore:indexes
```

---

## Known Issues (all resolved)

| Issue | Fix |
|-------|-----|
| Product save "Failed to save" | Firestore rejects undefined — conditional field assignment |
| `oldPrice !== ''` TypeScript error on Vercel | `oldPrice` is `number\|undefined`, not string — check `!== undefined` |
| Cart total using `i.price` | `CartItem` has `unitPrice` — fixed to `i.unitPrice * i.quantity` |
| `+` stepper button clipped on mobile | Removed `overflow-hidden`, used `flex-shrink-0 w-8` buttons |
| Floating cart bar overlaps Add button | Moved to `bottom-20` on mobile + hidden when `pickerOpen` |
| WhatsApp overlaps picker sheet | Hidden via `pickerOpen` from UI store |
| COD extra brace after removal | Carefully removed COD else block |

---

**Last updated by**: Claude Code assistant (claude-sonnet-4-6)
**Date**: 2026-07-20
