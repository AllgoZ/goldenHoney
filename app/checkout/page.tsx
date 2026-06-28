'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronLeft, Tag, Plus, Loader2 } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useUserStore } from '@/store/user'
import { useUIStore } from '@/store/ui'
import { getCustomerAddresses, addCustomerAddress } from '@/lib/services/customer.service'
import { createOrderForCustomer } from '@/lib/services/order.service'
import { validateCoupon, redeemCoupon } from '@/lib/services/coupon.service'
import type { FSCoupon } from '@/types/firebase'
import { formatINR } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import type { FSAddress, FSOrderItem } from '@/types/firebase'

/* ────────────────────────────────────────────────────────────── */

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh',
]

const EMPTY_ADDR = {
  fullName: '', phone: '', addressLine1: '', addressLine2: '',
  city: '', state: '', pincode: '',
}

/* ────────────────────────────────────────────────────────────── */

export default function CheckoutPage() {
  const router     = useRouter()
  const user       = useUserStore((s) => s.user)
  const showModal  = useUIStore((s) => s.showAuthModal)
  const { items, subtotal, shipping, tax, total, clearCart } = useCart()

  /* ── Contact (pre-fill from Zustand) ─────────────────────── */
  const [name,  setName]  = useState(() => {
    const n = user?.name ?? ''
    return n.startsWith('+91') ? '' : n   // don't pre-fill phone-number-as-name
  })
  const [email, setEmail] = useState(user?.email ?? '')
  const [phone, setPhone] = useState(() =>
    (user?.phone ?? '').replace(/^\+91/, '')
  )

  /* ── Addresses ────────────────────────────────────────────── */
  const [loadingAddrs,    setLoadingAddrs]    = useState(true)
  const [savedAddresses,  setSavedAddresses]  = useState<FSAddress[]>([])
  const [addressTab,      setAddressTab]      = useState<'saved' | 'new'>('new')
  const [selectedAddrId,  setSelectedAddrId]  = useState<string | null>(null)
  const [newAddr,         setNewAddr]         = useState(EMPTY_ADDR)
  const [saveAddr,        setSaveAddr]        = useState(false)

  /* ── Coupon ───────────────────────────────────────────────── */
  const [couponCode,      setCouponCode]      = useState('')
  const [appliedCoupon,   setAppliedCoupon]   = useState<FSCoupon | null>(null)
  const [couponDiscount,  setCouponDiscount]  = useState(0)
  const [couponError,     setCouponError]     = useState('')
  const [couponLoading,   setCouponLoading]   = useState(false)

  /* ── UI state ─────────────────────────────────────────────── */
  const [loading, setLoading] = useState(false)
  const [errors,  setErrors]  = useState<Record<string, string>>({})

  /* ── Auth guard ───────────────────────────────────────────── */
  useEffect(() => {
    if (!user?.isLoggedIn) showModal(() => {})
  }, [user?.isLoggedIn])

  /* ── Load saved addresses ─────────────────────────────────── */
  useEffect(() => {
    if (!user?.id) { setLoadingAddrs(false); return }
    getCustomerAddresses(user.id)
      .then((addrs) => {
        setSavedAddresses(addrs)
        if (addrs.length > 0) {
          setAddressTab('saved')
          const def = addrs.find((a) => a.isDefault) ?? addrs[0]
          setSelectedAddrId(def.id)
        }
      })
      .finally(() => setLoadingAddrs(false))
  }, [user?.id])

  /* ── Coupon math ──────────────────────────────────────────── */
  const grandTotal = Math.max(0, total - couponDiscount)

  /* ── Handlers ─────────────────────────────────────────────── */
  function updateNewAddr(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setNewAddr((p) => ({ ...p, [field]: e.target.value }))
      setErrors((p) => ({ ...p, [field]: '' }))
    }
  }

  async function applyCoupon() {
    const code = couponCode.trim()
    if (!code) return
    setCouponLoading(true)
    setCouponError('')
    try {
      const result = await validateCoupon(code, subtotal)
      if (!result.valid || !result.coupon) {
        setCouponError(result.reason ?? 'Invalid coupon code')
        setAppliedCoupon(null)
        setCouponDiscount(0)
      } else {
        setAppliedCoupon(result.coupon)
        setCouponDiscount(result.discount)
      }
    } catch {
      setCouponError('Could not validate coupon. Please try again.')
    } finally {
      setCouponLoading(false)
    }
  }

  function removeCoupon() {
    setAppliedCoupon(null)
    setCouponDiscount(0)
    setCouponCode('')
    setCouponError('')
  }

  function validate() {
    const errs: Record<string, string> = {}
    if (!name.trim())  errs.name  = 'Required'
    if (!phone.trim()) errs.phone = 'Required'
    else if (!/^[6-9]\d{9}$/.test(phone)) errs.phone = 'Enter a valid 10-digit number'

    if (addressTab === 'saved') {
      if (!selectedAddrId) errs.address = 'Please select a delivery address'
    } else {
      if (!newAddr.fullName.trim())     errs.fullName     = 'Required'
      if (!newAddr.phone.trim())        errs.addrPhone    = 'Required'
      else if (!/^[6-9]\d{9}$/.test(newAddr.phone)) errs.addrPhone = 'Invalid number'
      if (!newAddr.addressLine1.trim()) errs.addressLine1 = 'Required'
      if (!newAddr.city.trim())         errs.city         = 'Required'
      if (!newAddr.state)               errs.state        = 'Required'
      if (!newAddr.pincode.trim())      errs.pincode      = 'Required'
      else if (!/^\d{6}$/.test(newAddr.pincode)) errs.pincode = 'Invalid pincode'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleOrder() {
    if (!validate() || !user?.id) return
    setLoading(true)
    setErrors({})

    try {
      /* Resolve shipping address */
      let shippingAddress: FSAddress

      if (addressTab === 'saved') {
        shippingAddress = savedAddresses.find((a) => a.id === selectedAddrId)!
      } else {
        const addrPayload = {
          fullName:     newAddr.fullName.trim(),
          phone:        newAddr.phone.trim(),
          addressLine1: newAddr.addressLine1.trim(),
          ...(newAddr.addressLine2.trim() && { addressLine2: newAddr.addressLine2.trim() }),
          city:         newAddr.city.trim(),
          state:        newAddr.state,
          pincode:      newAddr.pincode.trim(),
          country:      'India',
          isDefault:    savedAddresses.length === 0,
        }
        if (saveAddr) {
          const id = await addCustomerAddress(user.id, addrPayload)
          shippingAddress = { ...addrPayload, id, createdAt: new Date() as any }
        } else {
          shippingAddress = { ...addrPayload, id: '', createdAt: new Date() as any }
        }
      }

      /* Build order items */
      const orderItems: FSOrderItem[] = items.map((i) => ({
        productId:      String(i.product.id),
        productName:    i.product.name,
        productSlug:    (i.product as any).slug ?? '',
        productImage:   (i.product as any).images?.[0] ?? '',
        selectedWeight: i.selectedWeight,
        unitPrice:      i.unitPrice,
        quantity:       i.quantity,
        lineTotal:      i.unitPrice * i.quantity,
      }))

      /* Create order (dual-write: orders/ + customers/{id}/orders/) */
      const order = await createOrderForCustomer(user.id, {
        userId:        user.id,
        userName:      name.trim(),
        userEmail:     email.trim(),
        userPhone:     `+91${phone.trim()}`,
        items:         orderItems,
        subtotal,
        discount:      couponDiscount,
        shipping,
        tax,
        total:         grandTotal,
        ...(appliedCoupon && { couponCode: couponCode.toUpperCase() }),
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        orderStatus:   'pending',
        shippingAddress,
      })

      if (appliedCoupon) {
        redeemCoupon(appliedCoupon.code).catch(() => {})
      }
      clearCart()
      router.push(`/order-success?id=${order.id}&n=${order.orderNumber}`)

    } catch (err) {
      console.error('Order placement failed:', err)
      setErrors({ submit: 'Something went wrong. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  /* ── Empty cart guard ─────────────────────────────────────── */
  if (items.length === 0 && !loading) {
    return (
      <main className="pt-24 pb-20 min-h-screen bg-parchment flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-onyx/50 mb-6">Your cart is empty.</p>
          <Link href="/shop"><Button>Shop Now</Button></Link>
        </div>
      </main>
    )
  }

  /* ── Page ─────────────────────────────────────────────────── */
  return (
    <main className="pt-24 pb-20 min-h-screen bg-parchment">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/cart" className="inline-flex items-center gap-2 text-sm text-onyx/50 hover:text-onyx mb-8 transition-colors">
          <ChevronLeft size={16} /> Back to Cart
        </Link>
        <h1 className="font-heading font-bold text-3xl text-onyx mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left column ──────────────────────────────── */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Contact */}
            <div className="bg-white rounded-xl p-6 border border-black/5 shadow-sm">
              <h2 className="font-heading font-semibold text-base text-onyx mb-5">Contact Information</h2>
              <div className="flex flex-col gap-4">
                <Input
                  label="Full Name" placeholder="Your name"
                  value={name} error={errors.name}
                  onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })) }}
                />
                <Input
                  label="Email Address (optional)" type="email" placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div>
                  <label className="text-sm font-medium text-onyx/80 mb-1.5 block">Mobile Number</label>
                  <div className={`flex items-center h-11 rounded-xl border px-3 transition-colors focus-within:border-honey ${errors.phone ? 'border-red-400' : 'border-onyx/15'}`}>
                    <span className="text-sm font-semibold text-onyx/50 pr-2.5 mr-2.5 border-r border-onyx/10 shrink-0">+91</span>
                    <input
                      type="tel" inputMode="numeric" maxLength={10}
                      placeholder="98765 43210"
                      className="flex-1 bg-transparent text-sm text-onyx outline-none placeholder:text-onyx/25"
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '')); setErrors((p) => ({ ...p, phone: '' })) }}
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-xl p-6 border border-black/5 shadow-sm">
              <h2 className="font-heading font-semibold text-base text-onyx mb-5">Delivery Address</h2>

              {loadingAddrs ? (
                <div className="flex justify-center py-8">
                  <Loader2 size={24} className="animate-spin text-honey" />
                </div>
              ) : (
                <>
                  {savedAddresses.length > 0 && (
                    <div className="flex gap-2 mb-5 p-1 bg-onyx/5 rounded-xl">
                      {(['saved', 'new'] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setAddressTab(tab)}
                          className={`flex-1 h-8 rounded-lg text-sm font-semibold transition-colors ${
                            addressTab === tab
                              ? 'bg-white text-onyx shadow-sm'
                              : 'text-onyx/50 hover:text-onyx'
                          }`}
                        >
                          {tab === 'saved' ? 'Saved Addresses' : 'New Address'}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Saved addresses */}
                  {addressTab === 'saved' && (
                    <div className="flex flex-col gap-3">
                      {savedAddresses.map((addr) => (
                        <label
                          key={addr.id}
                          className={`flex gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                            selectedAddrId === addr.id
                              ? 'border-honey bg-honey/5'
                              : 'border-black/5 hover:border-black/15'
                          }`}
                        >
                          <input
                            type="radio" name="savedAddr"
                            checked={selectedAddrId === addr.id}
                            onChange={() => setSelectedAddrId(addr.id)}
                            className="mt-0.5 accent-amber-500"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="font-semibold text-sm text-onyx">{addr.fullName}</span>
                              {addr.isDefault && (
                                <span className="text-[10px] font-bold uppercase bg-honey/10 text-honey-dark px-2 py-0.5 rounded-chip">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-onyx/50 leading-relaxed">
                              {addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}<br />
                              {addr.city}, {addr.state} — {addr.pincode}<br />
                              {addr.phone}
                            </p>
                          </div>
                        </label>
                      ))}
                      {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
                      <button
                        onClick={() => setAddressTab('new')}
                        className="flex items-center gap-1.5 text-xs font-semibold text-honey-dark hover:underline mt-1"
                      >
                        <Plus size={12} /> Add new address
                      </button>
                    </div>
                  )}

                  {/* New address form */}
                  {addressTab === 'new' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col gap-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <Input label="Full Name" placeholder="Recipient's name"
                            value={newAddr.fullName} onChange={updateNewAddr('fullName')} error={errors.fullName} />
                        </div>
                        <div className="col-span-2">
                          <Input label="Phone Number" type="tel" placeholder="10-digit mobile number"
                            value={newAddr.phone} onChange={updateNewAddr('phone')} error={errors.addrPhone} />
                        </div>
                      </div>
                      <Input label="Address Line 1" placeholder="House no., Street, Building name"
                        value={newAddr.addressLine1} onChange={updateNewAddr('addressLine1')} error={errors.addressLine1} />
                      <Input label="Address Line 2 (optional)" placeholder="Area, Landmark"
                        value={newAddr.addressLine2} onChange={updateNewAddr('addressLine2')} />
                      <div className="grid grid-cols-2 gap-4">
                        <Input label="City" value={newAddr.city} onChange={updateNewAddr('city')} error={errors.city} />
                        <Input label="Pincode" placeholder="6-digit" value={newAddr.pincode}
                          onChange={updateNewAddr('pincode')} error={errors.pincode} />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-onyx/80 mb-1.5 block">State</label>
                        <select
                          value={newAddr.state}
                          onChange={updateNewAddr('state')}
                          className={`h-11 w-full rounded-xl border bg-white px-4 text-sm text-onyx focus:outline-none focus:ring-2 focus:ring-honey transition-colors ${errors.state ? 'border-red-400' : 'border-onyx/15'}`}
                        >
                          <option value="">Select State</option>
                          {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
                      </div>
                      <label className="flex items-center gap-2.5 cursor-pointer select-none">
                        <input
                          type="checkbox" checked={saveAddr}
                          onChange={(e) => setSaveAddr(e.target.checked)}
                          className="rounded-sm accent-amber-500"
                        />
                        <span className="text-sm text-onyx/60">Save this address for future orders</span>
                      </label>
                    </motion.div>
                  )}
                </>
              )}
            </div>

            {/* Payment */}
            <div className="bg-white rounded-xl p-6 border border-black/5 shadow-sm">
              <h2 className="font-heading font-semibold text-base text-onyx mb-4">Payment Method</h2>
              <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-honey bg-honey/5 cursor-pointer">
                <div className="w-4 h-4 rounded-full border-2 border-honey flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-honey" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-onyx">Cash on Delivery (COD)</p>
                  <p className="text-xs text-onyx/40 mt-0.5">Pay in cash when your order arrives</p>
                </div>
              </label>
              <p className="text-xs text-onyx/30 mt-3">
                Online payment via UPI / Cards coming soon.
              </p>
            </div>
          </div>

          {/* ── Right column — Order Summary ──────────────── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 border border-black/5 shadow-sm sticky top-24">
              <h2 className="font-heading font-semibold text-base text-onyx mb-5">Order Summary</h2>

              {/* Items */}
              <div className="flex flex-col gap-3 mb-5">
                {items.map((i) => (
                  <div key={`${i.product.id}-${i.selectedWeight}`} className="flex justify-between text-sm">
                    <span className="text-onyx/60 truncate mr-2">
                      {i.product.name} × {i.quantity}
                      <span className="text-xs text-onyx/30 block">{i.selectedWeight}</span>
                    </span>
                    <span className="text-onyx font-medium shrink-0">
                      {formatINR(i.unitPrice * i.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="mb-5">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200">
                    <span className="text-sm text-green-700 font-medium flex items-center gap-1.5">
                      <Tag size={14} />
                      {appliedCoupon.code} — {appliedCoupon.description || (
                        appliedCoupon.type === 'percentage'
                          ? `${appliedCoupon.value}% off`
                          : `₹${appliedCoupon.value} off`
                      )}
                    </span>
                    <button onClick={removeCoupon} className="text-xs text-red-500 hover:text-red-700">
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text" placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError('') }}
                      onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
                      className="flex-1 h-9 rounded-xl border border-onyx/15 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-honey uppercase"
                    />
                    <button
                      onClick={applyCoupon}
                      disabled={couponLoading || !couponCode.trim()}
                      className="h-9 px-4 rounded-xl bg-onyx text-white text-sm font-medium hover:bg-onyx/80 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {couponLoading ? <Loader2 size={14} className="animate-spin" /> : 'Apply'}
                    </button>
                  </div>
                )}
                {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
              </div>

              {/* Totals */}
              <div className="flex flex-col gap-2.5 text-sm border-t border-black/5 pt-4 mb-5">
                <div className="flex justify-between text-onyx/60">
                  <span>Subtotal</span><span>{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-onyx/60">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                    {shipping === 0 ? 'Free' : formatINR(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-onyx/60">
                  <span>GST (5%)</span><span>{formatINR(tax)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount</span><span>−{formatINR(couponDiscount)}</span>
                  </div>
                )}
                <div className="border-t border-black/5 pt-2.5 flex justify-between font-bold text-base text-onyx">
                  <span>Grand Total</span><span>{formatINR(grandTotal)}</span>
                </div>
              </div>

              {errors.submit && (
                <p className="text-xs text-red-500 text-center mb-3">{errors.submit}</p>
              )}

              <Button
                fullWidth size="lg"
                loading={loading}
                onClick={handleOrder}
                disabled={!user?.isLoggedIn || items.length === 0}
              >
                Place Order
              </Button>

              {!user?.isLoggedIn && (
                <p className="text-xs text-center text-onyx/40 mt-2">
                  Enter your mobile number to continue
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
