import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { FSOrder, OrderStatus, PaymentStatus } from '@/types/firebase'

const COL = 'orders'

/* ── Generate order number ───────────────────────────────── */
function generateOrderNumber(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let suffix = ''
  for (let i = 0; i < 8; i++) suffix += chars[Math.floor(Math.random() * chars.length)]
  return `GH${suffix}`
}

/* ── Create order ────────────────────────────────────────── */
export async function createOrder(
  data: Omit<FSOrder, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>
): Promise<FSOrder> {
  const ref = doc(collection(db, COL))
  const orderNumber = generateOrderNumber()

  const order: FSOrder = {
    ...data,
    id:          ref.id,
    orderNumber,
    createdAt:   serverTimestamp() as never,
    updatedAt:   serverTimestamp() as never,
  }

  await setDoc(ref, order)
  return order
}

/* ── Fetch single order ──────────────────────────────────── */
export async function getOrder(orderId: string): Promise<FSOrder | null> {
  const snap = await getDoc(doc(db, COL, orderId))
  return snap.exists() ? (snap.data() as FSOrder) : null
}

export async function getOrderByNumber(orderNumber: string): Promise<FSOrder | null> {
  const snap = await getDocs(
    query(collection(db, COL), where('orderNumber', '==', orderNumber), limit(1))
  )
  if (snap.empty) return null
  return snap.docs[0].data() as FSOrder
}

/* ── User order history ──────────────────────────────────── */
export async function getUserOrders(userId: string, count = 20): Promise<FSOrder[]> {
  const snap = await getDocs(
    query(
      collection(db, COL),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(count)
    )
  )
  return snap.docs.map((d) => d.data() as FSOrder)
}

/* ── Update order status ─────────────────────────────────── */
export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  await updateDoc(doc(db, COL, orderId), { orderStatus: status, updatedAt: serverTimestamp() })
}

/* ── Update payment status (admin manual override) ──────── */
export async function updatePaymentStatus(orderId: string, status: PaymentStatus): Promise<void> {
  await updateDoc(doc(db, COL, orderId), { paymentStatus: status, updatedAt: serverTimestamp() })
}

/* ── Update payment status after Razorpay callback ──────── */
export async function confirmPayment(
  orderId: string,
  razorpayOrderId: string,
  razorpayPaymentId: string
): Promise<void> {
  await updateDoc(doc(db, COL, orderId), {
    razorpayOrderId,
    razorpayPaymentId,
    paymentStatus: 'paid',
    orderStatus:   'paid',
    updatedAt:     serverTimestamp(),
  })
}

/* ── Update tracking number ──────────────────────────────── */
export async function setTrackingNumber(orderId: string, trackingNumber: string): Promise<void> {
  await updateDoc(doc(db, COL, orderId), {
    trackingNumber,
    orderStatus: 'shipped',
    updatedAt:   serverTimestamp(),
  })
}

/* ── Create order for phone customer (dual-write) ────────────
   Writes atomically to:
     1. orders/{id}                         — for admin panel
     2. customers/{customerId}/orders/{id}  — for "my orders" page
──────────────────────────────────────────────────────────── */
export async function createOrderForCustomer(
  customerId: string,
  data: Omit<FSOrder, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>
): Promise<FSOrder> {
  const orderRef        = doc(collection(db, COL))
  const customerOrderRef = doc(db, 'customers', customerId, 'orders', orderRef.id)
  const orderNumber     = generateOrderNumber()

  const order: FSOrder = {
    ...data,
    id:          orderRef.id,
    orderNumber,
    createdAt:   serverTimestamp() as never,
    updatedAt:   serverTimestamp() as never,
  }

  const batch = writeBatch(db)
  batch.set(orderRef, order)
  batch.set(customerOrderRef, order)
  await batch.commit()

  return order
}

/* ── Get all orders for a customer ───────────────────────── */
export async function getCustomerOrders(customerId: string, count = 20): Promise<FSOrder[]> {
  const snap = await getDocs(
    query(
      collection(db, 'customers', customerId, 'orders'),
      orderBy('createdAt', 'desc'),
      limit(count)
    )
  )
  return snap.docs.map((d) => d.data() as FSOrder)
}
