import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  increment,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { FSCoupon } from '@/types/firebase'

const COL = 'coupons'

/* ── Fetch coupon ────────────────────────────────────────── */
export async function getCoupon(code: string): Promise<FSCoupon | null> {
  const snap = await getDoc(doc(db, COL, code.toUpperCase()))
  return snap.exists() ? (snap.data() as FSCoupon) : null
}

/* ── Validate coupon ─────────────────────────────────────── */
export interface CouponValidation {
  valid:       boolean
  discount:    number   // ₹ amount to deduct
  reason?:     string
  coupon?:     FSCoupon
}

export async function validateCoupon(code: string, orderTotal: number): Promise<CouponValidation> {
  const coupon = await getCoupon(code)

  if (!coupon)               return { valid: false, discount: 0, reason: 'Coupon not found' }
  if (!coupon.active)        return { valid: false, discount: 0, reason: 'Coupon is no longer active' }

  const now = Timestamp.now()
  if (coupon.expiresAt && coupon.expiresAt.toMillis() < now.toMillis()) {
    return { valid: false, discount: 0, reason: 'Coupon has expired' }
  }
  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, discount: 0, reason: 'Coupon usage limit reached' }
  }
  if (orderTotal < coupon.minimumOrder) {
    return {
      valid:    false,
      discount: 0,
      reason:   `Minimum order ₹${coupon.minimumOrder} required`,
    }
  }

  const discount =
    coupon.type === 'percentage'
      ? Math.round((orderTotal * coupon.value) / 100)
      : coupon.value

  return { valid: true, discount: Math.min(discount, orderTotal), coupon }
}

/* ── Redeem coupon (increment usedCount) ─────────────────── */
export async function redeemCoupon(code: string): Promise<void> {
  await updateDoc(doc(db, COL, code.toUpperCase()), {
    usedCount: increment(1),
  })
}

/* ── Admin: list all coupons ─────────────────────────────── */
export async function listAllCoupons(): Promise<FSCoupon[]> {
  const snap = await getDocs(query(collection(db, COL), orderBy('code', 'asc')))
  return snap.docs.map((d) => d.data() as FSCoupon)
}

/* ── Admin: create coupon (doc ID = uppercase code) ─────── */
export async function createCoupon(data: FSCoupon): Promise<void> {
  const id = data.code.toUpperCase()
  await setDoc(doc(db, COL, id), { ...data, code: id })
}

/* ── Admin: delete coupon ────────────────────────────────── */
export async function deleteCoupon(code: string): Promise<void> {
  await deleteDoc(doc(db, COL, code.toUpperCase()))
}
