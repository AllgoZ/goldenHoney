# GOLDEN HONEY — Next Steps & Pending Tasks

> **Date**: 2026-06-25
> **Status**: Core systems complete, ready for feature polish
> **Next Milestone**: Customer-facing features (wishlist, addresses, coupons)

---

## 🎯 Immediate Actions (Today)

### 1. Restart Dev Server
The `.next` cache is stale after adding new admin routes. Clear and restart:

```powershell
Remove-Item -Recurse -Force .next
npm run dev
```

### 2. Test Admin Routes
Visit these URLs and verify they work:
- `http://localhost:3000/admin/customers` — List all customers
- `http://localhost:3000/admin/customers/9876543210` — Customer detail (use a real phone ID from Firestore)
- `http://localhost:3000/admin/orders` — Orders list (click an order to verify customer link)

### 3. Deploy Firebase
Push indexes and rules to production:

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

---

## 📋 Pending Tasks (Priority Order)

### **High Priority** (Blocks customer workflows)

| # | Task | Scope | Estimate | Files |
|---|------|-------|----------|-------|
| 1 | **Wishlist Firestore Sync** | Sync Zustand ↔ Firestore for phone users | 2-3h | `hooks/useWishlist.ts`, `components/AuthProvider.tsx` |
| 2 | **Checkout Address Form** | Refine address selection/entry, "Save for future" | 2-3h | `app/checkout/page.tsx` |
| 3 | **Coupon Validation** | Validate code, calculate discount in checkout | 2-3h | `app/checkout/page.tsx`, `lib/services/coupon.service.ts` |

### **Medium Priority** (Nice to have, unblocks other features)

| # | Task | Scope | Estimate | Files |
|---|------|-------|----------|-------|
| 4 | **User Profile (Firebase Auth)** | For admins and future email users | 3-4h | `lib/services/user.service.ts`, `app/account/edit/page.tsx` |
| 5 | **Reviews** | Display reviews on product, submit form, admin approval | 4-5h | `lib/services/review.service.ts`, `app/product/[slug]/page.tsx` |
| 6 | **Banners** | Load from Firestore, display on homepage/shop | 2-3h | `lib/services/banner.service.ts`, `app/page.tsx` |

### **Low Priority** (Polish & Polish)

| # | Task | Scope | Estimate | Files |
|---|------|-------|----------|-------|
| 7 | **Settings** | Store config (shipping, contact), admin page | 1-2h | `lib/services/settings.service.ts`, `app/admin/settings/page.tsx` |
| 8 | **Error Handling** | Error boundaries, loading states, toast notifications | 3-4h | `components/ErrorBoundary.tsx`, global error.tsx |
| 9 | **E2E Testing** | Full user flow: register → shop → cart → checkout → order | 3-4h | Manual testing + test plan doc |

---

## 🔍 What's Complete (Core Systems)

✅ **Phone Authentication**
- Register via 10-digit phone number
- Automatic returning customer detection
- Cart/wishlist restoration on login

✅ **Customer Management**
- Firestore `customers/{phoneId}` collection
- Sub-collections: addresses, orders, (wishlist array)
- Full CRUD in service layer

✅ **Admin Panel**
- Customer listing with search
- Customer detail page with orders, addresses, cart, wishlist
- Order detail with customer profile link

✅ **Order System**
- Atomic dual-write: `orders/{id}` + `customers/{phoneId}/orders/{id}`
- Order creation from checkout with address
- Order success page with real data
- Customer order history view

✅ **Firestore Infrastructure**
- Rules for customers + orders
- Composite indexes for performance
- Security rules allow open access (OTP coming later)

---

## 🚀 Recommended Session Plan

### **Session 1 (2-3 hours)** — High-value features
```
1. Wishlist Firestore sync (2-3h)
   └─ Already hydrated in AuthProvider, just need Zustand ↔ Firestore sync
   └─ Test with add/remove wishlist items across page reloads
```

### **Session 2 (2-3 hours)** — Checkout polish
```
1. Refine checkout address form (1-2h)
   └─ Add "Save for future" checkbox
   └─ Validate pincode format
   └─ Test address selection
2. Coupon validation (1-2h)
   └─ Validate coupon code against Firestore
   └─ Calculate discount on totals
   └─ Check usage limits
```

### **Session 3 (3-4 hours)** — Firebase Auth users
```
1. User profile for email/admin users (3-4h)
   └─ Load from `users/{uid}` collection
   └─ Edit form + avatar upload
   └─ Distinguish from phone users in UI
```

### **Session 4 (4-5 hours)** — Content features
```
1. Reviews (4-5h)
   └─ Display on product page
   └─ Submit form (logged-in only)
   └─ Admin approval workflow
```

### **Session 5 (2-3 hours)** — Branding
```
1. Banners (2-3h)
   └─ Load from Firestore
   └─ Display on homepage/shop
2. Settings (1-2h, overlap)
   └─ Load from Firestore
   └─ Display in footer
```

---

## ⚠️ Known Issues & Fixes

| Issue | Fix | Priority |
|-------|-----|----------|
| Checkout address form may have undefined fields | Use conditional spreads `...(field && { field })` | HIGH |
| Wishlist not syncing across sessions | Implement AuthProvider hydration for wishlist | HIGH |
| No coupon validation in checkout | Create coupon.service.ts + validation logic | HIGH |
| Admin order detail doesn't show phone link for some orders | Fixed in latest code — verify after restart | MEDIUM |
| Scroll-behavior warning in console | Fixed in layout.tsx — data-scroll-behavior="smooth" | LOW |

---

## 📊 Progress Snapshot

```
Core Systems: ████████████████████ 100%
├─ Products: ✅
├─ Categories: ✅
├─ Phone Auth: ✅
├─ Customers: ✅
├─ Orders: ✅
├─ Admin: ✅
└─ Firebase: ✅

Customer Features: ██████░░░░░░░░░░░░░░  30%
├─ Wishlist: 🔄 (30%)
├─ Addresses: 🔄 (70%)
├─ Profile: 🔴 (0%)
└─ Reviews: 🔴 (0%)

Content: ████░░░░░░░░░░░░░░░░  20%
├─ Coupons: 🔴 (0%)
├─ Banners: 🔴 (0%)
└─ Settings: 🔴 (0%)

Polish: ██░░░░░░░░░░░░░░░░░░  10%
├─ Error Handling: 🔴 (0%)
├─ Loading States: 🔴 (0%)
└─ Testing: 🔴 (0%)

OVERALL: 44% Complete
```

---

## 🔗 Related Docs

- [PROJECT_STATUS.md](PROJECT_STATUS.md) — Full status overview
- [PHASE3_PROGRESS.md](PHASE3_PROGRESS.md) — Detailed progress breakdown
- [CLAUDE.md](CLAUDE.md) — Project guidelines & conventions

---

**Next sync**: Restart dev server + test admin routes  
**Expected next session**: Wishlist Firestore sync (high-value, 2-3 hours)
