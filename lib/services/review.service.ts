import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  increment,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { FSReview } from '@/types/firebase'

const COL = 'reviews'

/* ── Get approved reviews for a product ─────────────────── */
export async function getProductReviews(productId: string, count = 20): Promise<FSReview[]> {
  const snap = await getDocs(
    query(
      collection(db, COL),
      where('productId', '==', productId),
      where('approved', '==', true),
      orderBy('createdAt', 'desc'),
      limit(count)
    )
  )
  return snap.docs.map((d) => d.data() as FSReview)
}

/* ── Submit a review ─────────────────────────────────────── */
export interface SubmitReviewInput {
  productId: string
  userId:    string
  userName:  string
  userPhoto?: string
  rating:    number
  title:     string
  comment:   string
  verified:  boolean
}

export async function submitReview(input: SubmitReviewInput): Promise<string> {
  const ref = await addDoc(collection(db, COL), {
    ...input,
    approved:  false,   // must be approved by admin before showing
    helpful:   0,
    createdAt: serverTimestamp(),
  })

  // Update product aggregate rating (simple increment approach)
  await _updateProductRating(input.productId)

  return ref.id
}

/* ── Vote a review as helpful ────────────────────────────── */
export async function markHelpful(reviewId: string): Promise<void> {
  await updateDoc(doc(db, COL, reviewId), { helpful: increment(1) })
}

/* ── Admin: approve / reject review ─────────────────────── */
export async function setReviewApproved(reviewId: string, approved: boolean): Promise<void> {
  await updateDoc(doc(db, COL, reviewId), { approved })
  const snap = await getDoc(doc(db, COL, reviewId))
  if (snap.exists()) {
    await _updateProductRating((snap.data() as FSReview).productId)
  }
}

/* ── Recalculate product rating from approved reviews ────── */
async function _updateProductRating(productId: string): Promise<void> {
  const snap = await getDocs(
    query(collection(db, COL), where('productId', '==', productId), where('approved', '==', true))
  )
  if (snap.empty) return

  const total = snap.docs.reduce((sum, d) => sum + (d.data() as FSReview).rating, 0)
  const avg   = Math.round((total / snap.docs.length) * 10) / 10

  await updateDoc(doc(db, 'products', productId), {
    rating:      avg,
    reviewCount: snap.docs.length,
  })
}
