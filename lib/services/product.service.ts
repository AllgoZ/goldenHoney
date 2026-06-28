import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  type DocumentSnapshot,
  type QueryConstraint,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { FSProduct } from '@/types/firebase'

const COL = 'products'

/* ── Single product ──────────────────────────────────────── */
export async function getProductById(id: string): Promise<FSProduct | null> {
  const snap = await getDoc(doc(db, COL, id))
  return snap.exists() ? (snap.data() as FSProduct) : null
}

export async function getProductBySlug(slug: string): Promise<FSProduct | null> {
  const snap = await getDocs(query(collection(db, COL), where('slug', '==', slug), limit(1)))
  if (snap.empty) return null
  return snap.docs[0].data() as FSProduct
}

/* ── Product lists ───────────────────────────────────────── */
interface GetProductsOptions {
  categorySlug?: string
  featured?:     boolean
  bestSeller?:   boolean
  sortBy?:       'price_asc' | 'price_desc' | 'rating' | 'newest'
  pageSize?:     number
  after?:        DocumentSnapshot
}

export async function getProducts(options: GetProductsOptions = {}): Promise<FSProduct[]> {
  const { categorySlug, featured, bestSeller, sortBy = 'newest', pageSize = 20, after } = options

  const constraints: QueryConstraint[] = [where('status', '==', 'active')]

  if (categorySlug) constraints.push(where('categorySlug', '==', categorySlug))
  if (featured !== undefined) constraints.push(where('featured', '==', featured))
  if (bestSeller !== undefined) constraints.push(where('bestSeller', '==', bestSeller))

  const sortMap: Record<string, [string, 'asc' | 'desc']> = {
    price_asc:  ['price', 'asc'],
    price_desc: ['price', 'desc'],
    rating:     ['rating', 'desc'],
    newest:     ['createdAt', 'desc'],
  }
  const [sortField, sortDir] = sortMap[sortBy]
  constraints.push(orderBy(sortField, sortDir))
  constraints.push(limit(pageSize))
  if (after) constraints.push(startAfter(after))

  const snap = await getDocs(query(collection(db, COL), ...constraints))
  return snap.docs.map((d) => d.data() as FSProduct)
}

export async function getFeaturedProducts(count = 8): Promise<FSProduct[]> {
  return getProducts({ featured: true, pageSize: count })
}

export async function getBestSellers(count = 4): Promise<FSProduct[]> {
  return getProducts({ bestSeller: true, pageSize: count })
}

export async function getProductsByCategory(categorySlug: string, count = 20): Promise<FSProduct[]> {
  return getProducts({ categorySlug, pageSize: count })
}

/* ── Related products ────────────────────────────────────── */
export async function getRelatedProducts(categorySlug: string, excludeId: string, count = 4): Promise<FSProduct[]> {
  const products = await getProductsByCategory(categorySlug, count + 1)
  return products.filter((p) => p.id !== excludeId).slice(0, count)
}

/* ── Admin CRUD ──────────────────────────────────────────── */
export async function createProduct(
  data: Omit<FSProduct, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const ref = doc(collection(db, COL))
  await setDoc(ref, {
    ...data,
    id:        ref.id,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function updateProduct(id: string, data: Partial<FSProduct>): Promise<void> {
  await updateDoc(doc(db, COL, id), { ...data, updatedAt: serverTimestamp() })
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id))
}
