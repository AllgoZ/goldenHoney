@AGENTS.md

# GOLDEN HONEY — site-v2 Claude Guidelines

## Project overview
E-commerce site for honey and wooden toys. Next.js 16 App Router, TypeScript, React 19, Tailwind CSS v4, Framer Motion, Zustand. All pages are complete and functional with mock data. Firebase/Razorpay integration is pending.

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
- "Add to Cart" button opens a **bottom sheet on mobile** (`md:hidden`) — never expand inline on mobile
- Desktop uses the inline picker (`hidden md:block`)
- Cards use `flex flex-col h-full` + `mt-auto` on price row so all cards in a grid row are the same height
- The motion.div wrapper needs `className="h-full"` and `transition={{ type: 'spring', stiffness: 500, damping: 30 }}`

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
| Mock products | `lib/mock/products.ts` |
| Zustand stores | `store/cart.ts`, `store/wishlist.ts`, `store/user.ts`, `store/ui.ts` |
| Hero images | `public/hero-desktop.webp` (md+), `public/hero-mobile.webp` (< md) |
