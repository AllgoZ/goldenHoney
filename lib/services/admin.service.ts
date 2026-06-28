import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  where,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { FSAdmin, FSProduct, FSOrder, FSUser, FSCustomer } from '@/types/firebase'

export type FSCustomerDoc = FSCustomer & { phoneId: string }

/* ── Admin doc ───────────────────────────────────────────── */
export async function getAdminDoc(uid: string): Promise<FSAdmin | null> {
  const snap = await getDoc(doc(db, 'admins', uid))
  return snap.exists() ? (snap.data() as FSAdmin) : null
}

/* ── Dashboard stats ─────────────────────────────────────── */
export interface DashboardStats {
  totalRevenue:   number
  totalOrders:    number
  totalProducts:  number
  totalCustomers: number
  pendingOrders:  number
  recentOrders:   FSOrder[]
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [ordersSnap, productsSnap, customersSnap] = await Promise.all([
    getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(200))),
    getDocs(query(collection(db, 'products'), where('status', '==', 'active'))),
    getDocs(collection(db, 'customers')),
  ])

  const orders = ordersSnap.docs.map((d) => d.data() as FSOrder)
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.total, 0)
  const pendingOrders = orders.filter(
    (o) => o.orderStatus === 'pending' || o.orderStatus === 'paid'
  ).length

  return {
    totalRevenue,
    totalOrders:    ordersSnap.docs.length,
    totalProducts:  productsSnap.docs.length,
    totalCustomers: customersSnap.docs.length,
    pendingOrders,
    recentOrders:   orders.slice(0, 10),
  }
}

/* ── All products (no status filter — admin sees everything) */
export async function getAllProductsAdmin(count = 100): Promise<FSProduct[]> {
  const snap = await getDocs(
    query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(count))
  )
  return snap.docs.map((d) => d.data() as FSProduct)
}

/* ── All orders ──────────────────────────────────────────── */
export async function getAllOrders(count = 100): Promise<FSOrder[]> {
  const snap = await getDocs(
    query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(count))
  )
  return snap.docs.map((d) => d.data() as FSOrder)
}

export async function getOrdersByStatus(status: string, count = 100): Promise<FSOrder[]> {
  const snap = await getDocs(
    query(
      collection(db, 'orders'),
      where('orderStatus', '==', status),
      orderBy('createdAt', 'desc'),
      limit(count)
    )
  )
  return snap.docs.map((d) => d.data() as FSOrder)
}

/* ── All users (Firebase Auth / admin accounts) ──────────── */
export async function getAllUsers(count = 100): Promise<FSUser[]> {
  const snap = await getDocs(
    query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(count))
  )
  return snap.docs.map((d) => d.data() as FSUser)
}

/* ── All customers (phone-based registrations) ───────────── */
export async function getAllCustomers(count = 200): Promise<FSCustomerDoc[]> {
  const snap = await getDocs(
    query(collection(db, 'customers'), orderBy('createdAt', 'desc'), limit(count))
  )
  return snap.docs.map((d) => ({
    phoneId: d.id,
    ...(d.data() as FSCustomer),
  }))
}

/* ── All reviews (including unapproved) ──────────────────── */
export async function getAllReviews(count = 100) {
  const snap = await getDocs(
    query(collection(db, 'reviews'), orderBy('createdAt', 'desc'), limit(count))
  )
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}
