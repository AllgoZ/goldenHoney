<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Agent Quick-Start — GOLDEN HONEY site-v2

> Last updated: 2026-07-20
> Read CLAUDE.md for full coding guidelines. Read PROJECT_STATUS.md for feature completion status.

## What this project is
E-commerce site for wild honey and wooden toys. Sold by SIVAKUMAR (proprietor), sourced from Kodaikanal tribal communities. Business contact: kodaigoldenhoney@gmail.com / +91 91595 43104.

## Stack at a glance
- Next.js 16 App Router · TypeScript · React 19 · Tailwind CSS v4 (no config file)
- Zustand (cart, wishlist, user, ui stores) · Framer Motion
- Firebase Firestore + Firebase Auth (admin only) · Cloudinary (images)
- Razorpay **live** keys — online payment only, COD removed
- Resend for transactional email

## Critical gotchas for agents

### Tailwind v4
No `tailwind.config.ts`. Tokens live in `app/globals.css @theme {}`. Classes like `bg-honey`, `text-onyx`, `rounded-card` come from CSS variables — do not create a config file.

### CartItem type
The cart item interface uses `unitPrice`, not `price`. Always compute totals as `i.unitPrice * i.quantity`.

### Firestore updates
Never pass `undefined` field values to `updateDoc`/`addDoc` — Firestore throws. Use conditional assignment:
```typescript
if (badge) updates.badge = badge
```
For optional numeric fields (`oldPrice: number | undefined`), check `!== undefined`, not `!== ''`.

### ProductCard — current button model
- Card shows a single black elevated **"Buy"** button (no "Add" on the card)
- Tapping Buy always opens the picker sheet
- Bottom sheet (mobile) and inline picker (desktop) both have **Add to Cart** + **Buy Now**
- When item is already in cart: stepper replaces Buy, plus a "Cart" nav button appears

### pickerOpen in UIStore
`store/ui.ts` exports `pickerOpen: boolean` + `setPickerOpen`. ProductCard sets this when its sheet opens/closes. The shop page floating cart bar and the mobile WhatsApp button both hide when `pickerOpen` is true. If adding any new overlay/sheet, follow the same pattern.

### Bottom nav (mobile)
`components/layout/BottomNav.tsx` — `md:hidden` fixed `h-16` bar at `z-40`. ShopLayoutWrapper adds `pb-16 md:pb-0` to `<main>`. WhatsApp button is at `bottom-20` on mobile. Floating cart bar is at `bottom-20` on mobile, `bottom-4` on sm+.

### Checkout
COD is fully removed. Only Razorpay online payment. Do not re-add COD.

### Admin credentials
`lib/services/auth.service.ts` exports `updateAdminCredentials(currentPassword, newEmail?, newPassword?)`. Uses Firebase `reauthenticateWithCredential` before updating.

### `.env.local`
Contains Razorpay live keys and Firebase secrets. NEVER commit this file to git.
