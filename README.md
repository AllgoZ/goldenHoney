# 🍯 GOLDEN HONEY — E-Commerce Site

Premium e-commerce platform for wild honey and handcrafted wooden toys, sourced from indigenous tribal communities in Kodaikanal by founder **Sivakumar**.

**Live repo**: https://github.com/AllgoZ/goldenHoney

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
| Auth | Firebase Auth (admin) + Phone-as-ID (customers) |
| Images | Cloudinary CDN |
| Payments | Razorpay |
| Email | Resend (via direct REST API) |

---

## Project Structure

```
app/
├── (shop)/            # Customer-facing pages
│   ├── page.tsx       # Homepage with hero + bestsellers
│   ├── shop/          # Product listing + filters
│   ├── product/[slug] # Product detail
│   ├── cart/          # Cart page
│   ├── checkout/      # Checkout with Razorpay + COD
│   ├── order-success/ # Post-payment confirmation
│   ├── account/       # Customer account (orders, addresses, wishlist)
│   ├── about/         # Our story + team + values
│   └── contact/       # Contact page
├── admin/             # Admin dashboard (Firebase Auth protected)
│   ├── dashboard/
│   ├── products/      # CRUD with Cloudinary image upload
│   ├── orders/        # Order management + payment status + tracking
│   └── customers/     # Customer profiles
├── api/
│   ├── email/         # Resend email routes
│   ├── razorpay/      # Payment gateway routes
│   └── upload/        # Cloudinary upload route
components/
├── layout/            # Navbar, Footer
├── product/           # ProductCard with quantity stepper
├── admin/             # Admin-specific UI components
└── ui/                # Shared UI: Button, Input, Badge, etc.
lib/
├── firebase.ts        # Firebase client init
├── resend.ts          # Email via Resend REST API (IPv4-forced)
└── services/          # Firestore service layer
store/                 # Zustand stores: cart, wishlist, user, ui
types/
└── firebase.ts        # All Firestore TypeScript types
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Firebase project (Firestore + Auth enabled)
- Cloudinary account
- Razorpay account (test keys work)
- Resend account

### Environment Variables

Create `.env.local` at the project root:

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
ADMIN_EMAIL=your-admin@email.com

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

### Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Admin Setup

1. Create a Firebase Auth user for the admin email
2. Visit `/api/setup-admin` to grant super_admin role
3. Log in at `/admin`

---

## Key Features

### Customer-Facing
- **Shop** — Product listing with category filters, search, sort
- **Product pages** — Weight option selector, stock badges, low-stock warnings
- **Cart** — Quantity stepper, persistent across sessions (Zustand + localStorage)
- **Checkout** — Saved address selection, new address form, Razorpay online payment + COD
- **Order success** — Full order summary with Firestore data
- **Account** — Order history, saved addresses, wishlist
- **WhatsApp button** — Floating CTA on mobile

### Admin Panel
- **Products** — Create/edit/delete with Cloudinary image upload, weight options, stock per variant
- **Orders** — List + detail view, order status, payment status, tracking number (auto-marks shipped)
- **Customers** — Profile, order history, saved addresses, live cart
- **Settings** — Store settings (name, shipping, tax) + change admin login email/password
- **Mobile-responsive** — All admin pages work on phones and tablets

### Email (Resend)
- **Admin notification** — Full order details sent to admin on every order
- **Customer shipping** — Tracking number email sent when admin saves tracking (if customer has email)

### Content
- **About page** — Bilingual (English + Tamil) "Why Choose Golden Honey" feature cards
- **Branded story** — Sivakumar's story sourcing from Kodaikanal tribal communities
- **Contact page** — Real business phone, email, and both Oddanchatram addresses
- **Footer** — Real contact info + ALLGOZ TECH copyright

---

## Firestore Collections

| Collection | Purpose |
|---|---|
| `products` | Product catalog with weight variants |
| `categories` | Product categories |
| `orders` | All orders (admin view) |
| `customers/{phoneId}` | Customer profiles (phone as doc ID) |
| `customers/{phoneId}/orders` | Customer order sub-collection |
| `customers/{phoneId}/addresses` | Saved addresses |
| `coupons` | Discount codes |
| `admins` | Admin role + permissions |

---

## Deployment

Firebase Hosting (SSR via Cloud Functions Gen 2) — requires Blaze plan.

```bash
npm run build
firebase deploy
```

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
