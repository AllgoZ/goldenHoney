# GOLDEN HONEY — Next Steps

> **Last updated**: 2026-07-05
> **Current state**: Core commerce flows complete and working end-to-end

---

## ✅ What's Working Right Now

| Feature | Status |
|---|---|
| Product listing + filters | ✅ Live |
| Product detail + weight selector | ✅ Live |
| Cart with quantity stepper | ✅ Live |
| Checkout — Razorpay payment | ✅ Live |
| Checkout — COD (testing only) | ✅ Live |
| Order creation → Firestore | ✅ Live |
| Admin order notification email | ✅ Live |
| Customer shipping email (with tracking) | ✅ Live |
| Admin: products CRUD + image upload | ✅ Live |
| Admin: order status + payment status | ✅ Live |
| Admin: tracking number → auto-shipped | ✅ Live |
| Admin: customer profiles | ✅ Live |
| Coupon codes (admin + checkout) | ✅ Live |
| Phone-based customer login | ✅ Live |
| About page + bilingual content | ✅ Live |
| WhatsApp floating button (mobile) | ✅ Live |

---

## 🔴 Pending — Priority Order

### 1. Add Product Images (Immediate)
All 11 products are in Firestore with no images. Admin can upload via the edit page:
- Go to `/admin/products`
- Click each product → Edit → Upload image → Save

### 2. Verify Custom Email Domain (Resend)
Current FROM is `onboarding@resend.dev` — emails show as sent by Resend's test domain.
For branded emails from a custom address:
- Log in to [resend.com](https://resend.com)
- Add and verify your domain (e.g. `goldenhoney.in`)
- Update `lib/resend.ts` → change `FROM` constant to `noreply@goldenhoney.in`

### 3. Firebase Deployment
The site needs Firebase Blaze (pay-as-you-go) plan for SSR hosting:
- Upgrade Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
- Then run: `npm run build && firebase deploy`

### 4. Wishlist Firestore Sync (2-3 hours)
Currently wishlist is stored in localStorage only. Needs Firestore sync so it persists across devices.
- **Files**: `hooks/useWishlist.ts`, `components/AuthProvider.tsx`
- Sync Zustand ↔ `customers/{phoneId}.wishlist[]`

### 5. Reviews System (4-5 hours)
- Display reviews on product detail pages
- Submit form for logged-in customers (after purchase)
- Admin approval in admin panel
- **Files**: `lib/services/review.service.ts`, `app/product/[slug]/page.tsx`

### 6. Error Handling + Loading States (3-4 hours)
- Loading skeleton screens instead of blank while Firestore loads
- Toast notifications for add-to-cart, checkout errors, etc.
- Global error boundary component

### 7. E2E Testing
Manual test checklist before going live:
- [ ] Register as new customer (phone number)
- [ ] Add product to cart, apply coupon
- [ ] Complete Razorpay payment
- [ ] Verify admin email received
- [ ] Admin saves tracking → customer receives shipping email
- [ ] Customer views order in account page
- [ ] Admin creates/edits/deletes a product
- [ ] All above on mobile (iOS + Android)

---

## 🟡 Nice to Have (Future)

| Feature | Effort |
|---|---|
| Banners — load from Firestore, display on homepage | 2-3h |
| Store settings — shipping rates, contact info from Firestore | 1-2h |
| User profile edit page (name, email) | 2-3h |
| Order tracking page (public, by order ID) | 2h |
| SMS notification on order (Twilio/AWS SNS) | 3-4h |
| Product search with Firestore full-text (or Algolia) | 4-5h |

---

## 📞 Contact & Credentials

| Item | Value |
|---|---|
| Admin email | kodaigoldenhoney@gmail.com |
| Admin panel | `/admin` |
| Firebase project | golden-honey-920f5 |
| Cloudinary cloud | dhjcr3vdl |
| Resend account | re_V4WUJ2Tf_... |
| GitHub repo | https://github.com/Nagul232/goldenhoney |
| Business phone | +91 9159543104 |
| Business email | tomoshiva@gmail.com |
