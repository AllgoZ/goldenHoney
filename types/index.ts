/* ── Product ──────────────────────────────────────────── */
export interface WeightOption {
  label: string
  price: number
  oldPrice?: number
}

export interface NutritionFact {
  label: string
  value: string
}

export interface Product {
  id: number
  slug: string
  name: string
  category: 'honey' | 'rare' | 'toys' | 'gifts'
  subtitle: string
  description: string
  longDescription: string
  benefits: string[]
  ingredients?: string
  weightOptions: WeightOption[]
  nutritionInfo?: NutritionFact[]
  price: number
  oldPrice?: number
  rating: number
  reviews: number
  badge?: 'bestseller' | 'limited' | 'new'
  images: string[]
  gradient: string
  inStock: boolean
  shippingNote?: string
}

/* ── Cart ─────────────────────────────────────────────── */
export interface CartItem {
  product: Product
  quantity: number
  selectedWeight: string
  unitPrice: number
}

/* ── Wishlist ─────────────────────────────────────────── */
export interface WishlistItem {
  product: Product
  addedAt: string
}

/* ── Review ───────────────────────────────────────────── */
export interface Review {
  id: number
  productId: number
  userName: string
  userInitial: string
  rating: number
  title: string
  body: string
  createdAt: string
  verified: boolean
  helpful: number
}

/* ── Address ──────────────────────────────────────────── */
export interface Address {
  id: string
  label: string
  firstName: string
  lastName: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  country: string
  isDefault: boolean
}

/* ── Order ────────────────────────────────────────────── */
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'

export interface OrderItem {
  product: Product
  quantity: number
  price: number
  selectedWeight: string
}

export interface Order {
  id: string
  orderNumber: string
  items: OrderItem[]
  status: OrderStatus
  subtotal: number
  shipping: number
  tax: number
  total: number
  createdAt: string
  estimatedDelivery: string
  address: Address
  trackingNumber?: string
  paymentMethod: string
}

/* ── User ─────────────────────────────────────────────── */
export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  isLoggedIn: boolean
  createdAt?: string
}

/* ── Coupon ───────────────────────────────────────────── */
export interface Coupon {
  code: string
  discount: number
  type: 'percentage' | 'flat'
  minOrder?: number
  valid: boolean
  description: string
}

/* ── Tracking ─────────────────────────────────────────── */
export interface TrackingStep {
  key: string
  label: string
  description: string
  timestamp?: string
  completed: boolean
  active: boolean
}

/* ── FAQ ──────────────────────────────────────────────── */
export interface FAQItem {
  id: number
  question: string
  answer: string
  category: string
}

/* ── Checkout ─────────────────────────────────────────── */
export interface CheckoutForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  pincode: string
  country: string
  deliveryNotes: string
  couponCode: string
  saveAddress: boolean
}
