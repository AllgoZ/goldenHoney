# GOLDEN HONEY — Next Steps & Roadmap

---

## 🎯 Current Status
**Phase**: PHASE 3 — Live Firestore Integration
**Progress**: 55% Complete (4 of 15 tasks done)
**Last Updated**: 2026-06-23

---

## ✅ What's DONE

| Task | Files | Status |
|------|-------|--------|
| Products from Firestore | `/app/shop`, `/app/product/[slug]` | ✅ Live |
| Categories from Firestore | `/app/shop`, `/admin/products` | ✅ Live |
| Cloudinary image CDN | `lib/services/cloudinary.service.ts` | ✅ Live |
| Admin dashboard & CRUD | `/app/admin/*` | ✅ Live |
| Firestore security rules | `firestore.rules` | ✅ Deployed |

---

## 🔄 What's In Progress

| Task | Blocker | Est. Time | Start Date |
|------|---------|-----------|-----------|
| Task 3: Wishlist ↔ Firestore | None | 2-3 hrs | Next session |
| Task 4: User Profile + Avatar | None | 3-4 hrs | After Task 3 |
| Task 5: Address Form | None | 2-3 hrs | After Task 4 |

---

## 🔴 What's Pending

```
Tier 4 (Orders & Content):
├─ Task 6: Reviews (4-5 hrs)
├─ Task 7: Coupons (2-3 hrs)
├─ Task 8: Banners (2-3 hrs)
├─ Task 9: Settings (1-2 hrs)
├─ Task 10: Order Creation (3 hrs)
└─ Task 11: Order History (3-4 hrs)

Tier 5 (Testing & Polish):
├─ Task 13: Admin Validation (2 hrs)
├─ Task 14: Error Handling (3-4 hrs)
└─ Task 15: Final E2E (3-4 hrs)

TOTAL REMAINING: ~30-35 hours
```

---

## 📋 Immediate Action Items (This Week)

### 1. ⚠️ FIX: Firestore Rules (HIGH PRIORITY)
**What**: Refine security rules from `allow read: if true` → `allow read: if status == 'active'`
**Why**: Current rules are too permissive for production
**Time**: 15 minutes
**Files**: `firestore.rules`

```firestore
// CHANGE FROM:
allow read: if true;

// CHANGE TO:
allow read: if resource == null || resource.data.status == 'active';

// Then deploy:
// firebase deploy --only firestore:rules
```

---

### 2. ✨ NEXT: Task 3 — Wishlist Integration (RECOMMENDED)
**What**: Connect Firestore wishlist collection to existing Zustand store
**Why**: Low hanging fruit; full UI already exists
**Time**: 2-3 hours
**Steps**:
1. Create `lib/services/wishlist.service.ts`
2. Add Firestore load in `hooks/useWishlist.ts`
3. Sync add/remove to Firestore
4. Test on `/wishlist` page

**Files to create**:
```
lib/services/wishlist.service.ts
├─ getWishlist(userId): Promise<FSWishlist>
├─ addToWishlist(userId, productId): Promise<void>
└─ removeFromWishlist(userId, productId): Promise<void>
```

---

### 3. 👤 Task 4 — User Profile (AFTER TASK 3)
**What**: Load/edit user profile, avatar upload
**Time**: 3-4 hours
**Files to create**:
```
lib/services/user.service.ts
app/account/edit/page.tsx
components/account/ProfileForm.tsx
```

---

### 4. 📍 Task 5 — Address Management (AFTER TASK 4)
**What**: Add/edit address forms
**Time**: 2-3 hours
**Files to create**:
```
components/account/AddressForm.tsx
lib/services/address.service.ts (or in user.service.ts)
```

---

## 🗓️ Recommended 2-Week Sprint

```
Week 1:
├─ Mon: Fix Firestore rules (15 min)
├─ Mon-Tue: Task 3 Wishlist (2-3 hrs)
├─ Wed-Thu: Task 4 Profile (3-4 hrs)
├─ Fri: Task 5 Address (2-3 hrs)
└─ Fri: Testing & fixes (2 hrs)

Week 2:
├─ Mon-Tue: Task 10 Order Creation (3 hrs)
├─ Tue-Wed: Task 11 Order History (3-4 hrs)
├─ Thu: Task 6 Reviews (2 hrs, partial)
├─ Fri: Task 7 Coupons (2 hrs)
└─ Fri: Testing (2 hrs)

Total: ~20-25 hours, 1 sprint cycle
```

---

## 🏗️ Implementation Template (for each task)

```typescript
// 1. Create service file
// lib/services/{feature}.service.ts

import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function get{Feature}(userId: string) {
  const snap = await getDocs(
    query(collection(db, '{collectionName}'), where('userId', '==', userId))
  )
  return snap.docs.map(d => d.data())
}

// 2. Create/update hook
// hooks/use{Feature}.ts

import { useState, useEffect } from 'react'
import { get{Feature} } from '@/lib/services/{feature}.service'

export function use{Feature}() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    get{Feature}(userId).then(setData).finally(() => setLoading(false))
  }, [userId])

  return { data, loading }
}

// 3. Use in component
// components/{Feature}.tsx

import { use{Feature} } from '@/hooks/use{Feature}'

export function {Feature}() {
  const { data, loading } = use{Feature}()
  
  if (loading) return <LoadingSpinner />
  return <>{data.map(item => ...)}</>
}
```

---

## 🚨 Known Issues to Address

| Issue | Impact | Status |
|-------|--------|--------|
| Firestore rules too open | Security risk | 🔴 Needs fix ASAP |
| No error boundaries | Bad UX on errors | 🟡 Medium priority |
| No loading states | Confusing delays | 🟡 Medium priority |
| Product page is client-rendered | Slower initial load | 🟡 Low priority |

---

## 📚 Documentation References

- **PROJECT_STATUS.md** — Full overview of architecture & completed work
- **PHASE3_PROGRESS.md** — Detailed breakdown of each task with Firestore schemas
- **firestore.rules** — Current security rules (needs refinement)
- **CLAUDE.md** — Project guidelines & conventions

---

## 🎓 Key Learnings

1. **Firestore Security Rules**: Server-side SDK queries without auth context will be denied. Solutions:
   - Make rules permissive for reads (current, temporary)
   - Use client-side fetching with auth context
   - Use server API endpoint with admin SDK

2. **Product Detail Pages**: Next.js App Router server components can't use client-side Firestore. Solution: Made page a client component with useEffect.

3. **Image CDN**: Cloudinary is faster than Firebase Storage and has better optimization. Integration via API route keeps secret safe.

---

## 💡 Quick Commands

```bash
# Start dev server
npm run dev

# Check TypeScript
npx tsc --noEmit

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy indexes
firebase deploy --only firestore:indexes

# Build for production
npm run build
```

---

## 📞 Questions?

Refer to:
- **PHASE3_PROGRESS.md** for task details & schemas
- **PROJECT_STATUS.md** for architecture overview
- **firestore.rules** for security rule examples
- **lib/services/** for service layer patterns

---

**Last Updated**: 2026-06-23  
**Next Review**: 2026-06-30
