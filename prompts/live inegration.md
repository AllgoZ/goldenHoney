# CLAUDE PROMPT — PHASE 3: LIVE FIRESTORE INTEGRATION

Current Status:

✅ Next.js 15
✅ TypeScript
✅ Tailwind
✅ Shadcn UI
✅ Firebase Auth
✅ Firestore
✅ Firebase Storage
✅ Firestore Rules
✅ Storage Rules
✅ Firestore Indexes
✅ Service Layer Complete
✅ Admin Dashboard Complete
✅ Admin Authentication Complete

Now move to the next phase.

IMPORTANT:

Remove all remaining mock data usage.

Connect the application to the existing Firebase service layer.

Do NOT integrate Razorpay yet.

=================================================

OBJECTIVE

Convert the application from mock/demo mode to a fully Firestore-driven ecommerce platform.

=================================================

PHASE 3 TASKS

=================================================

1. PRODUCTS

Replace all mock products.

Connect:

product.service.ts

Pages:

/shop
/product/[slug]
homepage featured products
related products
best sellers

Requirements:

* Real Firestore reads
* Loading states
* Error states
* Empty states
* Pagination support
* Search support
* Category filtering
* Sorting

=================================================

2. CATEGORIES

Connect category dropdowns and filters.

Use Firestore categories collection.

Pages:

Shop

Admin Products

Admin Categories

=================================================

3. WISHLIST

Connect:

wishlist collection

Features:

Add to Wishlist

Remove from Wishlist

Wishlist Page

Wishlist Counter

User-specific data

=================================================

4. USER PROFILE

Connect:

users collection

Features:

Profile data

Edit profile

Avatar support

Account page

=================================================

5. ADDRESS MANAGEMENT

Connect:

addresses collection

Features:

Create Address

Edit Address

Delete Address

Set Default Address

Checkout Address Selection

=================================================

6. REVIEWS

Connect:

reviews collection

Features:

Submit Review

Review Listing

Review Count

Product Rating Calculation

Approved Reviews Only

=================================================

7. COUPONS

Connect:

coupon.service.ts

Checkout:

Apply Coupon

Validate Coupon

Show Discount

Update Totals

=================================================

8. BANNERS

Connect:

banners collection

Homepage Hero Banner

Promotional Banners

Admin Banner CRUD

=================================================

9. SETTINGS

Connect:

settings collection

Load:

Store Name

Shipping Fee

Free Shipping Threshold

Contact Info

Footer Data

=================================================

10. ORDER CREATION (WITHOUT PAYMENT)

Implement Firestore order creation.

Flow:

Cart
↓
Checkout
↓
Create Firestore Order
↓
Order Success

No Razorpay yet.

Use:

paymentMethod: "pending"

paymentStatus: "pending"

=================================================

11. ORDER HISTORY

Connect:

orders collection

Pages:

/account/orders
/admin/orders

Requirements:

Pagination

Search

Status Filters

=================================================

12. STORAGE UPLOADS

Connect Firebase Storage.

Upload support:

Product Images

Banner Images

User Avatars

Review Images

Requirements:

Progress indicators

Error handling

Delete old files when replaced

=================================================

13. ADMIN VALIDATION

Verify every admin module performs real Firestore CRUD:

Products

Categories

Orders

Coupons

Reviews

Banners

Settings

Customers

=================================================

14. GLOBAL ERROR HANDLING

Add:

Loading Skeletons

Error Boundaries

Toast Notifications

Firestore Error Messages

Retry Actions

=================================================

15. FINAL VALIDATION

Verify these flows:

User Registration
↓
Login
↓
Browse Products
↓
Add To Cart
↓
Wishlist
↓
Apply Coupon
↓
Add Address
↓
Checkout
↓
Create Order
↓
Order History
↓
Admin Sees Order

Everything must use Firestore.

No mock data should remain.

=================================================

DELIVERABLE

Provide:

1. Files Modified
2. Mock Data Removed
3. Firestore Queries Connected
4. Storage Uploads Connected
5. Order Creation Working
6. Validation Checklist
7. Any Remaining Work Before Razorpay

Do not start Razorpay integration yet.

The objective is a fully Firestore-powered ecommerce application before payment integration.
