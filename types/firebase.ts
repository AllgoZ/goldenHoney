import { Timestamp } from 'firebase/firestore'

/* ── User ──────────────────────────────────────────────────
   Collection: users/{uid}
   Sub-collections: addresses/{addressId}
──────────────────────────────────────────────────────────── */
export type UserRole   = 'customer' | 'admin'
export type UserStatus = 'active' | 'suspended' | 'deleted'

export interface FSUser {
  uid:        string
  name:       string
  email:      string
  phone?:     string
  photoURL?:  string
  role:       UserRole
  status:     UserStatus
  createdAt:  Timestamp
  lastLogin:  Timestamp
}

/* ── Address ───────────────────────────────────────────────
   Sub-collection: users/{uid}/addresses/{addressId}
──────────────────────────────────────────────────────────── */
export interface FSAddress {
  id:           string
  fullName:     string
  phone:        string
  addressLine1: string
  addressLine2?: string
  city:         string
  state:        string
  pincode:      string
  country:      string
  isDefault:    boolean
  createdAt:    Timestamp
}

/* ── Category ──────────────────────────────────────────────
   Collection: categories/{categoryId}
──────────────────────────────────────────────────────────── */
export type CategoryStatus = 'active' | 'inactive'

export interface FSCategory {
  id:          string
  name:        string
  slug:        string
  description?: string
  image?:      string
  status:      CategoryStatus
  sortOrder:   number
}

/* ── Product ───────────────────────────────────────────────
   Collection: products/{productId}
──────────────────────────────────────────────────────────── */
export type ProductStatus = 'active' | 'draft' | 'archived'
export type ProductBadge  = 'bestseller' | 'limited' | 'new' | 'sale'

export interface FSWeightOption {
  label:     string
  price:     number
  oldPrice?: number
  stock:     number
  sku:       string
}

export interface FSProduct {
  id:               string
  name:             string
  slug:             string
  shortDescription: string
  description:      string
  categoryId:       string
  categorySlug:     string
  weightOptions:    FSWeightOption[]
  price:            number           // lowest variant price (for sorting/filtering)
  salePrice?:       number
  images:           string[]         // Storage URLs
  badge?:           ProductBadge
  featured:         boolean
  bestSeller:       boolean
  rating:           number
  reviewCount:      number
  status:           ProductStatus
  seoTitle?:        string
  seoDescription?:  string
  createdAt:        Timestamp
  updatedAt:        Timestamp
}

/* ── Order ─────────────────────────────────────────────────
   Collection: orders/{orderId}
──────────────────────────────────────────────────────────── */
export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'
export type PaymentMethod = 'razorpay' | 'cod'

export interface FSOrderItem {
  productId:      string
  productName:    string
  productSlug:    string
  productImage:   string
  selectedWeight: string
  unitPrice:      number
  quantity:       number
  lineTotal:      number
}

export interface FSOrder {
  id:              string
  orderNumber:     string          // GH + 8 random chars e.g. GH2F4A9B
  userId:          string
  userName:        string
  userEmail:       string
  userPhone:       string
  items:           FSOrderItem[]
  subtotal:        number
  discount:        number
  shipping:        number
  tax:             number
  total:           number
  couponCode?:     string
  paymentMethod:   PaymentMethod
  paymentStatus:   PaymentStatus
  razorpayOrderId?:   string
  razorpayPaymentId?: string
  orderStatus:     OrderStatus
  trackingNumber?: string
  shippingAddress: FSAddress
  deliveryNotes?:  string
  createdAt:       Timestamp
  updatedAt:       Timestamp
}

/* ── Review ────────────────────────────────────────────────
   Collection: reviews/{reviewId}
──────────────────────────────────────────────────────────── */
export interface FSReview {
  id:        string
  productId: string
  userId:    string
  userName:  string
  userPhoto?: string
  rating:    number            // 1–5
  title:     string
  comment:   string
  verified:  boolean           // purchased the product
  approved:  boolean           // admin approved
  helpful:   number            // upvote count
  createdAt: Timestamp
}

/* ── Coupon ────────────────────────────────────────────────
   Collection: coupons/{code}  (document ID = coupon code)
──────────────────────────────────────────────────────────── */
export type CouponType = 'percentage' | 'flat'

export interface FSCoupon {
  code:         string
  type:         CouponType
  value:        number          // % or ₹ amount
  minimumOrder: number
  usageLimit:   number          // 0 = unlimited
  usedCount:    number
  expiresAt:    Timestamp
  active:       boolean
  description:  string
}

/* ── Wishlist ──────────────────────────────────────────────
   Collection: wishlist/{userId}  (one doc per user)
──────────────────────────────────────────────────────────── */
export interface FSWishlist {
  userId:     string
  productIds: string[]
  updatedAt:  Timestamp
}

/* ── Admin ─────────────────────────────────────────────────
   Collection: admins/{uid}
──────────────────────────────────────────────────────────── */
export type AdminRole = 'super_admin' | 'manager' | 'staff'

export interface FSAdminPermissions {
  manageProducts:  boolean
  manageOrders:    boolean
  manageUsers:     boolean
  manageCoupons:   boolean
  manageReviews:   boolean
  manageSettings:  boolean
  viewAnalytics:   boolean
}

export interface FSAdmin {
  uid:         string
  name:        string
  email:       string
  role:        AdminRole
  permissions: FSAdminPermissions
  createdAt:   Timestamp
  createdBy:   string
}

/* ── Banner ────────────────────────────────────────────────
   Collection: banners/{bannerId}
──────────────────────────────────────────────────────────── */
export interface FSBanner {
  id:          string
  title:       string
  subtitle?:   string
  imageUrl:    string
  mobileImageUrl?: string
  linkHref?:   string
  linkLabel?:  string
  active:      boolean
  sortOrder:   number
  expiresAt?:  Timestamp
}

/* ── Notification ──────────────────────────────────────────
   Collection: notifications/{notificationId}
──────────────────────────────────────────────────────────── */
export type NotificationType = 'order_update' | 'promo' | 'review' | 'system'

export interface FSNotification {
  id:        string
  userId:    string
  type:      NotificationType
  title:     string
  body:      string
  read:      boolean
  href?:     string
  createdAt: Timestamp
}

/* ── Cart item (embedded in FSCustomer) ────────────────────
──────────────────────────────────────────────────────────── */
export interface FSCartItem {
  productId:      string
  productName:    string
  productSlug:    string
  productImage:   string
  selectedWeight: string
  unitPrice:      number
  quantity:       number
}

/* ── Customer ──────────────────────────────────────────────
   Collection: customers/{phone10digits}
   e.g.  customers/9876543210
   Sub-collections: addresses/{addressId}
──────────────────────────────────────────────────────────── */
export interface FSCustomer {
  phone:     string          // "+91XXXXXXXXXX"  (also the display label)
  name:      string
  email:     string
  createdAt: Timestamp
  lastLogin: Timestamp
  cart:      FSCartItem[]
  wishlist:  string[]        // product IDs
}

/* ── Settings ──────────────────────────────────────────────
   Collection: settings/{key}   (singleton documents)
   e.g. settings/store, settings/shipping, settings/payments
──────────────────────────────────────────────────────────── */
export interface FSStoreSettings {
  storeName:      string
  storeEmail:     string
  storePhone:     string
  currency:       string
  freeShippingAt: number
  flatShippingFee: number
  taxRate:        number
  maintenanceMode: boolean
  updatedAt:      Timestamp
}
