@AGENTS.md

# GOLDEN HONEY — site-v2 Claude Guidelines

## Project overview
E-commerce site for honey and wooden toys. Next.js 16 App Router, TypeScript, React 19, Tailwind CSS v4, Framer Motion, Zustand. All pages are complete and functional with live Firestore data. Razorpay live keys are configured (online payment only — COD removed). Firebase Auth for admin panel.

## Critical rules

### Tailwind v4 — no config file
There is **no** `tailwind.config.ts`. All brand tokens are defined in `app/globals.css` inside `@theme {}`. Custom classes like `bg-honey`, `text-onyx`, `rounded-card`, `rounded-chip` come from CSS variables — do not add a tailwind config file.

### Next.js App Router conventions
- Server components: no `'use client'`, can `async/await` directly
- Client components: must have `'use client'` at top
- Dynamic route params must be `await`ed: `const { slug } = await params`
- `useSearchParams()` requires a `<Suspense>` boundary — always wrap the component that calls it

### Animations — smoothness rules
The site uses a "premium buttery" feel. Follow these patterns:
- **Never use `transition-all`** — use specific properties: `transition-[background-color,transform,box-shadow]`
- **Spring physics for interactive elements**: `{ type: 'spring', stiffness: 400-500, damping: 30-36 }`
- **Easing for scroll reveals**: `ease: [0.16, 1, 0.3, 1]` (expo out) or `[0.25, 0.46, 0.45, 0.94]` (quart out)
- **GPU hints**: `.group { will-change: transform }` is set globally — animated cards are already composited
- **Image zoom**: `duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]` not `duration-500`

### ProductCard behaviour
- Single **black elevated "Buy" button** on the card — always opens the picker (no Add button on card)
- **Mobile bottom sheet** (`md:hidden`) — sheet has two buttons: "Add to Cart" (amber) + "Buy Now" (black)
- **Desktop inline picker** (`hidden md:block`) — also has two buttons: Add + Buy Now
- When item is already in cart: stepper (−/qty/+) replaces the Buy button, plus a "Cart" nav button
- Cards use `flex flex-col h-full` + `mt-auto` on price row so all cards in a grid row are the same height
- The motion.div wrapper needs `className="h-full"` and `transition={{ type: 'spring', stiffness: 500, damping: 30 }}`
- `pickerMode` state has been removed — both Add and Buy Now are always available in the sheet

### UI store — pickerOpen
`store/ui.ts` has a `pickerOpen: boolean` + `setPickerOpen(open)` field. `ProductCard` sets it `true` when the picker sheet opens and `false` when it closes. The shop page floating cart bar and the WhatsApp button both read `pickerOpen` and hide (`opacity-0 pointer-events-none`) while any sheet is open to avoid overlapping.

### Bottom navigation (mobile only)
`components/layout/BottomNav.tsx` — fixed bottom bar (`md:hidden`, `h-16`, `z-40`) with Home, Cart (badge), Orders, Profile tabs. Wired into `ShopLayoutWrapper`. The `<main>` inside the wrapper has `pb-16 md:pb-0` to keep content clear of the nav. WhatsApp button sits at `bottom-20` on mobile (above nav height).

### Checkout — online payment only
COD has been removed. Checkout only supports Razorpay online payment. The `paymentMethod` state and COD branch are gone from `app/checkout/page.tsx`. Razorpay **live** keys are in `.env.local` (NEVER commit this file).

### Firestore — no undefined values
`updateDoc` / `addDoc` throw if any field is `undefined`. Always use conditional spread:
```typescript
const updates: Partial<FSProduct> = { name, slug, ...required fields }
if (badge)    updates.badge          = badge
if (seoTitle) updates.seoTitle       = seoTitle
```
For weight options: check `w.oldPrice !== undefined` (not `!== ''` — `oldPrice` is `number | undefined`).

### Static assets
Local images must live in `public/`. The `herophotos/` folder at project root is **not** served by Next.js — copy files to `public/` before referencing them.

### No design drift
Do not change brand colors, spacing, border-radius, or component structure unless explicitly asked. When improving animations, change only timing/easing/transition properties.

## Key file locations

| What | Where |
|------|-------|
| Brand tokens | `app/globals.css` — `@theme {}` block |
| CSS easing curves | `app/globals.css` — `:root { --ease-out-expo, --ease-out-quart }` |
| Global animation hint | `app/globals.css` — `.group { will-change: transform }` |
| Mock products (legacy) | `lib/mock/products.ts` |
| Zustand stores | `store/cart.ts`, `store/wishlist.ts`, `store/user.ts`, `store/ui.ts` |
| UI picker state | `store/ui.ts` — `pickerOpen` + `setPickerOpen` |
| Hero images | `public/hero-desktop.webp` (md+), `public/hero-mobile.webp` (< md) |
| Bottom nav | `components/layout/BottomNav.tsx` |
| Shop layout wrapper | `components/layout/ShopLayoutWrapper.tsx` |
| Product card | `components/product/ProductCard.tsx` |
| Admin credentials update | `lib/services/auth.service.ts` — `updateAdminCredentials()` |
| Cart item type | `CartItem.unitPrice` (NOT `price`) — use `i.unitPrice * i.quantity` for totals |
