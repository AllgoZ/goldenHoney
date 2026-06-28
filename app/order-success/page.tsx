'use client'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle, Package, ArrowRight, Loader2 } from 'lucide-react'
import { getOrder } from '@/lib/services/order.service'
import { formatINR } from '@/lib/utils'
import Button from '@/components/ui/Button'
import type { FSOrder } from '@/types/firebase'

function tsToDateStr(ts: any): string {
  if (!ts) return ''
  const d = ts.toDate?.() ?? new Date(ts)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

/* ─────────────────────────────────────────────────────────── */

function OrderSuccessContent() {
  const params      = useSearchParams()
  const orderId     = params.get('id')
  const orderNumber = params.get('n')

  const [order,   setOrder]   = useState<FSOrder | null>(null)
  const [loading, setLoading] = useState(!!orderId)

  useEffect(() => {
    if (!orderId) return
    getOrder(orderId)
      .then(setOrder)
      .finally(() => setLoading(false))
  }, [orderId])

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 size={32} className="animate-spin text-honey" />
      </div>
    )
  }

  const displayNumber = order?.orderNumber ?? orderNumber ?? `GH${Date.now().toString(36).toUpperCase().slice(-6)}`

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className="max-w-md mx-auto px-6 text-center"
    >
      {/* Checkmark */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
        className="w-24 h-24 rounded-full bg-green-50 border-4 border-green-200 flex items-center justify-center mx-auto mb-8"
      >
        <CheckCircle size={48} className="text-green-500" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h1 className="font-heading font-bold text-4xl text-onyx mb-3">Order Placed!</h1>
        <p className="text-onyx/50 text-lg mb-4">Thank you for your purchase 🍯</p>

        {/* Order number badge */}
        <div className="inline-block bg-honey/10 border border-honey/30 rounded-xl px-5 py-2 mb-6">
          <p className="text-xs text-onyx/40 uppercase tracking-wider mb-1">Order Number</p>
          <p className="font-heading font-bold text-xl text-onyx">{displayNumber}</p>
        </div>

        {/* Order details (if loaded) */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-white rounded-2xl border border-black/5 p-5 mb-6 text-left"
          >
            <p className="text-xs font-semibold text-onyx/35 uppercase tracking-wider mb-3">
              {tsToDateStr(order.createdAt)} · COD
            </p>

            <div className="flex flex-col gap-2 mb-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-onyx/60">
                    {item.productName}
                    <span className="text-onyx/35 ml-1">× {item.quantity}</span>
                    <span className="text-xs text-onyx/30 block">{item.selectedWeight}</span>
                  </span>
                  <span className="text-onyx font-medium">{formatINR(item.lineTotal)}</span>
                </div>
              ))}
            </div>

            {order.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600 mb-2">
                <span>Discount {order.couponCode ? `(${order.couponCode})` : ''}</span>
                <span>−{formatINR(order.discount)}</span>
              </div>
            )}

            <div className="border-t border-black/5 pt-2.5 flex justify-between font-bold text-sm text-onyx">
              <span>Total</span>
              <span>{formatINR(order.total)}</span>
            </div>

            {order.shippingAddress && (
              <div className="mt-4 pt-4 border-t border-black/5">
                <p className="text-xs font-semibold text-onyx/35 uppercase tracking-wider mb-2">
                  Deliver to
                </p>
                <p className="text-sm font-semibold text-onyx">{order.shippingAddress.fullName}</p>
                <p className="text-xs text-onyx/50 mt-0.5 leading-relaxed">
                  {order.shippingAddress.addressLine1}
                  {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
                </p>
              </div>
            )}
          </motion.div>
        )}

        <p className="text-sm text-onyx/50 mb-8 leading-relaxed">
          Your order will be dispatched within 1–2 business days.
          {order?.paymentMethod === 'cod' && ' Please keep cash ready when the delivery arrives.'}
        </p>

        {/* Status tracker */}
        <div className="flex items-center justify-center gap-3 mb-10 text-xs text-onyx/40">
          {(['Order Placed', 'Packed', 'Shipped', 'Delivered'] as const).map((step, i, arr) => (
            <div key={step} className="flex items-center gap-3">
              <div className={`flex flex-col items-center gap-1 ${i === 0 ? 'text-green-600' : ''}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${i === 0 ? 'bg-green-100 text-green-600' : 'bg-onyx/5'}`}>
                  {i === 0 ? <CheckCircle size={14} /> : <Package size={12} />}
                </div>
                <span className="whitespace-nowrap">{step}</span>
              </div>
              {i < arr.length - 1 && <div className="w-5 h-px bg-onyx/15 shrink-0" />}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/account/orders" className="flex-1">
            <Button variant="outline" fullWidth>View My Orders</Button>
          </Link>
          <Link href="/shop" className="flex-1">
            <Button fullWidth>
              Continue Shopping <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function OrderSuccessPage() {
  return (
    <main className="pt-24 pb-20 min-h-screen bg-parchment flex items-center justify-center">
      <Suspense fallback={
        <div className="flex justify-center py-24">
          <Loader2 size={32} className="animate-spin text-honey" />
        </div>
      }>
        <OrderSuccessContent />
      </Suspense>
    </main>
  )
}
