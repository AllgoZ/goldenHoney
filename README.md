# 🍯 GOLDEN HONEY — E-Commerce Site

Premium e-commerce platform for wild honey and handcrafted wooden toys, sourced from indigenous tribal communities in Kodaikanal by founder **SIVAKUMAR** (proprietor, ALLGOZ TECH).

**Live repo**: https://github.com/AllgoZ/goldenHoney
**Contact**: kodaigoldenhoney@gmail.com · +91 91595 43104

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 App Router |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (no config file — tokens in `globals.css`) |
| Animation | Framer Motion |
| State | Zustand with persist middleware |
| Database | Firebase Firestore |
| Auth | Firebase Auth (admin panel) + Phone-as-ID (customers) |
| Images | Cloudinary CDN |
| Payments | Razorpay (live keys, online only) |
| Email | Resend (via direct REST API) |

---

## Project Structure

```
app/
├── page.tsx               # Homepage — hero + bestsellers from Firestore
├── shop/                  # Product listing + search + category filters
├── product/[slug]/        # Product detail page
├── cart/                  # Cart page
├── checkout/              # Checkout — Razorpay online payment only (no COD)
├── order-success/         # Post-payment confirmation
├── account/               # Customer account (orders, addresses, wishlist)
├── about/                 # Our story + team + values
├── contact/               # Contact page (real business info)
└── admin/                 # Admin dashboard (Firebase Auth protected)
    ├── products/          # CRUD with Cloudinary image upload
    ├── orders/            # Order management + tracking
    ├── customers/         # Customer profiles + order history
    └── settings/          # Store settings + change admin email/password
components/
├── layout/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── BottomNav.tsx      # Mobile-only fixed bottom nav (Home/Cart/Orders/Profile)
│   └── ShopLayoutWrapper.tsx
├── product/
│   └── ProductCard.tsx    # Buy button → bottom sheet with Add + Buy Now
├── admin/
└── ui/
lib/
├── firebase.ts
├── services/
│   ├── product.service.ts
│   ├── category.service.ts
│   ├── order.service.ts
│   ├── admin.service.ts
│   └── auth.service.ts    # updateAdminCredentials()
store/
├── cart.ts
├── wishlist.ts
├── user.ts
└── ui.ts                  # cartOpen, pickerOpen, toast, authModal
types/
└── firebase.ts            # FSProduct, FSOrder, FSCategory, CartItem, etc.
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Firebase project (Firestore + Auth enabled)
- Cloudinary account
- Razorpay account (live keys for production)
- Resend account

### Environment Variables

Create `.env.local` — **never commit this file**:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Resend
RESEND_API_KEY=
RESEND_FROM=Golden Honey <onboarding@resend.dev>
ADMIN_EMAIL=kodaigoldenhoney@gmail.com

# Razorpay (live keys)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=
```

### Run locally

```bash
npm install
npm run dev
# → http://localhost:3000
```

### Admin Setup

1. Create a Firebase Auth user for the admin email
2. Visit `/api/setup-admin` to grant super_admin role
3. Log in at `/admin`
4. Change email/password from Admin → Settings → "Login Credentials" section

---

## Key Features

### Customer-Facing
- **Shop** — Product listing with category filters, search bar, sort
- **ProductCard** — Single black elevated "Buy" button → bottom sheet with "Add to Cart" + "Buy Now"; stepper when item is in cart
- **Bottom navigation** — Mobile-only fixed bar: Home, Cart (with badge), Orders, Profile
- **Floating cart bar** — Slides up from bottom on shop page when cart has items; hides when picker sheet or WhatsApp button would overlap
- **Product pages** — Weight option selector, stock badges, low-stock warnings
- **Cart** — Quantity stepper, persistent (Zustand + localStorage)
- **Checkout** — Razorpay online payment only (COD removed)
- **Order success** — Full order summary with Firestore data
- **Account** — Order history, saved addresses, wishlist
- **WhatsApp button** — Floating CTA on mobile (`bottom-20`); hides when picker sheet is open

### Admin Panel
- **Products** — Create/edit/delete with Cloudinary image upload, weight options, stock per variant, SEO fields
- **Orders** — List + detail view, order status, payment status, tracking number
- **Customers** — Profile, order history, saved addresses, live cart, wishlist count
- **Settings** — Store settings + change admin login email/password (Firebase re-auth)
- **Mobile-responsive** — All admin pages work on phones and tablets

### Email (Resend)
- **Admin notification** — Full order details on every order
- **Customer shipping** — Tracking email when admin saves tracking number

### Content & Branding
- **Footer** — Real contact info (kodaigoldenhoney@gmail.com, +91 91595 43104), both Oddanchatram addresses, copyright: ALLGOZ TECH
- **Contact page** — Real business phone, email, hours, Oddanchatram + Malabar Bakes addresses
- **About page** — Bilingual (English + Tamil) feature cards, Sivakumar's story

---

## Firestore Collections

| Collection | Purpose |
|---|---|
| `products` | Product catalog with weight variants |
| `categories` | Product categories |
| `orders` | All orders (admin view, dual-write) |
| `customers/{phoneId}` | Customer profiles (phone number as doc ID) |
| `customers/{phoneId}/orders` | Customer order sub-collection |
| `customers/{phoneId}/addresses` | Saved addresses |
| `coupons` | Discount codes (schema ready) |
| `admins` | Admin role + permissions |

---

## Deployment

Deployed on Vercel (recommended) or Firebase Hosting.

```bash
npm run build
# Vercel: push to main → auto-deploy
```

Firestore rules:
```bash
firebase deploy --only firestore:rules,firestore:indexes
```

---

## Business Info

| | |
|---|---|
| Proprietor | SIVAKUMAR |
| Company | ALLGOZ TECH |
| Email | kodaigoldenhoney@gmail.com |
| Phone | +91 91595 43104 |
| Hours | Mon–Sat, 9 AM – 6 PM IST |
| Address 1 | Oddanchatram, Dindigul – 624 619 |
| Address 2 | Malabar Bakes, near NH83, Periyakarattupatti, Oddanchatram – 624 614 |

---

## Products (11 honey varieties)

| Product | 300ml | 500ml | 1kg |
|---|---|---|---|
| Mountain Pine Honey | ₹500 | ₹750 | ₹1,500 |
| Kompu Honey | ₹650 | ₹1,000 | ₹2,000 |
| Gold Honey | ₹1,000 | ₹1,500 | ₹3,000 |
| White Honey | ₹1,300 | ₹2,000 | ₹4,000 |
| Black Honey | ₹1,300 | ₹2,000 | ₹4,000 |
| Single Honey | ₹1,300 | ₹2,000 | ₹4,000 |
| Paalaipoo Honey | ₹650 | ₹1,000 | ₹2,000 |
| Indampoo Honey | ₹1,000 | ₹1,500 | ₹3,000 |
| Drumstick Honey | ₹1,000 | ₹1,500 | ₹3,000 |
| Forest Honey | ₹400 | ₹750 | ₹1,500 |
| Karunkurunji Honey | ₹1,300 | ₹2,000 | ₹4,000 |
