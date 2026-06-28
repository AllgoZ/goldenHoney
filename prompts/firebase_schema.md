# CLAUDE PROMPT — FIREBASE ARCHITECTURE & DATABASE DESIGN

We have completed:

✅ Next.js 15 Project
✅ TypeScript
✅ Tailwind CSS
✅ Shadcn UI
✅ Firebase Project
✅ Firebase Web App Setup
✅ Firebase Auth Enabled
✅ Firestore Enabled
✅ Firebase Storage Enabled

Now move to the architecture phase.

DO NOT BUILD UI.

DO NOT BUILD COMPONENTS.

DO NOT BUILD PAGES.

Your task is to design the COMPLETE FIRESTORE DATABASE ARCHITECTURE for a production-ready ecommerce platform called:

GOLDEN HONEY

Business:

* Organic Honey
* Rare Honey Collections
* Handmade Wooden Toys
* Gift Boxes

Future Features:

* Admin Dashboard
* Inventory Management
* Coupon System
* Reviews
* Wishlist
* Order Tracking
* Razorpay Payments
* Customer Accounts
* Analytics

=================================================

GOAL

Create a scalable Firestore architecture that can support:

* 10 products today
* 1000+ products later
* Multiple admins
* Thousands of customers
* Hundreds of orders per day

=================================================

DESIGN COLLECTION STRUCTURE

Design the complete Firestore schema.

Collections:

users
products
categories
orders
reviews
coupons
addresses
wishlist
banners
settings
notifications
admins

For each collection provide:

1. Collection Name
2. Document Structure
3. Field Types
4. Required Fields
5. Optional Fields
6. Example Document

=================================================

USER SCHEMA

Support:

Customer

Admin

Fields:

uid
name
email
phone
photoURL
role
createdAt
lastLogin
status

=================================================

PRODUCT SCHEMA

Support:

Honey Products
Wooden Toys
Gift Boxes

Fields:

id
name
slug
description
shortDescription
price
salePrice
stock
categoryId
images
featured
bestSeller
rating
reviewCount
seoTitle
seoDescription
status
createdAt
updatedAt

=================================================

CATEGORY SCHEMA

Fields:

id
name
slug
description
image
status

=================================================

ORDER SCHEMA

Support:

Pending

Paid

Processing

Shipped

Delivered

Cancelled

Refunded

Fields:

orderNumber
userId
items
subtotal
discount
shipping
total
paymentMethod
paymentStatus
orderStatus
trackingNumber
shippingAddress
createdAt

=================================================

REVIEW SCHEMA

Fields:

productId
userId
rating
title
comment
approved
createdAt

=================================================

COUPON SCHEMA

Support:

Percentage

Fixed Amount

Fields:

code
type
value
minimumOrder
usageLimit
usedCount
expiresAt
active

=================================================

WISHLIST SCHEMA

Fields:

userId
productIds

=================================================

ADDRESS SCHEMA

Fields:

userId
fullName
phone
addressLine1
addressLine2
city
state
pincode
country
isDefault

=================================================

ADMIN SCHEMA

Support:

Super Admin

Manager

Staff

Permissions Structure

=================================================

FIRESTORE INDEX DESIGN

Create recommended indexes for:

Products

Orders

Reviews

Coupons

Users

=================================================

SECURITY RULES

Design production-ready Firestore rules for:

Guests

Customers

Admins

Super Admins

=================================================

STORAGE STRUCTURE

Design Firebase Storage folders:

products/
banners/
users/
reviews/
certificates/
invoices/

=================================================

NEXT.JS SERVICE LAYER

Create recommended folder structure:

lib/firebase/
lib/services/

Include:

auth.service.ts
product.service.ts
order.service.ts
user.service.ts
coupon.service.ts
review.service.ts

=================================================

TYPESCRIPT TYPES

Generate all interfaces:

User
Product
Category
Order
OrderItem
Address
Review
Coupon
Banner
Admin

=================================================

DELIVERABLE

Generate:

1. Complete Firestore Architecture
2. Collection Design
3. Example Documents
4. Security Rules
5. Storage Architecture
6. Index Strategy
7. TypeScript Interfaces
8. Service Layer Architecture

The goal is to finalize the backend architecture before implementing Firestore queries, Razorpay integration, or Admin Dashboard development.
