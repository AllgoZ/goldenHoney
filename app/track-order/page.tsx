'use client'
import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Package, Check, Truck, Loader2 } from 'lucide-react'
import { getOrderByNumber } from '@/lib/services/order.service'
import { formatINR } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import type { FSOrder, OrderStatus } from '@/types/firebase'

/* ── Tracking step builder ────────────────────────────────── */
const ALL_STEPS: { key: OrderStatus; label: string; description: string }[] = [
  { key: 'pending',    label: 'Order Placed',    description: 'We have received your order' },
  { key: 'paid',       label: 'Confirmed',        description: 'Payment confirmed' },
  { key: 'processing', label: 'Being Packed',     description: 'Your order is being prepared' },
  { key: 'shipped',    label: 'Shipped',          description: 'Out for delivery' },
  { key: 'delivered',  label: 'Delivered',        description: 'Successfully delivered' },
]

const STATUS_ORDER: OrderStatus[] = ['pending', 'paid', 'processing', 'shipped', 'delivered']

function buildSteps(currentStatus: OrderStatus) {
  const currentIndex = STATUS_ORDER.indexOf(currentStatus)
  return ALL_STEPS.map((s, i) => ({
    ...s,
    completed: i < currentIndex,
    active:    i === currentIndex,
  }))
}

function tsToDateStr(ts: any): string {
  if (!ts) return ''
  const d = ts.toDate?.() ?? new Date(ts)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

/* ─────────────────────────────────────────────────────────── */

function TrackOrderContent() {
  const params       = useSearchParams()
  const [orderNo,    setOrderNo]  = useState(params.get('order') ?? '')
  const [searched,   setSearched] = useState(!!params.get('order'))
  const [loading,    setLoading]  = useState(false)
  const [order,      setOrder]    = useState<FSOrder | null>(null)
  const [notFound,   setNotFound] = useState(false)

  // Auto-search if order number was in URL
  useState(() => {
    if (params.get('order')) handleSearch()
  })

  async function handleSearch(e?: React.FormEvent) {
    e?.preventDefault()
    if (!orderNo.trim()) return
    setLoading(true)
    setSearched(true)
    setNotFound(false)
    setOrder(null)
    try {
      const found = await getOrderByNumber(orderNo.trim().toUpperCase())
      if (found) setOrder(found)
      else setNotFound(true)
    } catch {
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  const steps = order ? buildSteps(order.orderStatus) : []

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-10">
        <Truck size={40} className="mx-auto text-honey mb-4" />
        <h1 className="font-heading font-bold text-3xl text-onyx mb-2">Track Your Order</h1>
        <p className="text-onyx/50">Enter your order number to see real-time updates</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3 mb-10">
        <Input
          placeholder="e.g. GH2F4A9B"
          value={orderNo}
          onChange={(e) => { setOrderNo(e.target.value); setSearched(false) }}
          className="flex-1"
        />
        <Button type="submit" loading={loading} className="shrink-0">Track</Button>
      </form>

      {loading && (
        <div className="flex justify-center py-10">
          <Loader2 size={28} className="animate-spin text-honey" />
        </div>
      )}

      {!loading && searched && notFound && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-10 text-onyx/40"
        >
          <Package size={40} className="mx-auto mb-3 opacity-30" />
          <p>No order found with number <strong className="text-onyx/60">{orderNo.toUpperCase()}</strong></p>
        </motion.div>
      )}

      {!loading && order && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          {/* Order summary */}
          <div className="bg-white rounded-xl p-5 border border-black/5 shadow-sm mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-heading font-bold text-lg text-onyx">#{order.orderNumber}</p>
                <p className="text-sm text-onyx/40">{tsToDateStr(order.createdAt)}</p>
              </div>
              <p className="font-bold text-onyx">{formatINR(order.total)}</p>
            </div>

            <div className="flex flex-col gap-1.5 mb-3">
              {order.items.map((item, i) => (
                <p key={i} className="text-sm text-onyx/60">
                  {item.productName} × {item.quantity} ({item.selectedWeight})
                </p>
              ))}
            </div>

            {order.shippingAddress && (
              <p className="text-xs text-onyx/40 border-t border-black/5 pt-3 mt-3">
                Delivering to: {order.shippingAddress.addressLine1}, {order.shippingAddress.city},&nbsp;
                {order.shippingAddress.state}
              </p>
            )}
            {order.trackingNumber && (
              <p className="text-xs text-onyx/40 mt-1">
                Tracking: <span className="font-mono text-onyx">{order.trackingNumber}</span>
              </p>
            )}
          </div>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-onyx/10" />
            <div className="flex flex-col gap-0">
              {steps.map((step, i) => (
                <motion.div
                  key={step.key}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="relative flex gap-4 pb-8 last:pb-0"
                >
                  <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 ${
                    step.completed
                      ? 'bg-green-500 border-green-500'
                      : step.active
                      ? 'bg-honey border-honey'
                      : 'bg-white border-onyx/15'
                  }`}>
                    {step.completed ? (
                      <Check size={16} className="text-white" />
                    ) : step.active ? (
                      <div className="w-3 h-3 rounded-full bg-white" />
                    ) : (
                      <div className="w-2.5 h-2.5 rounded-full bg-onyx/15" />
                    )}
                  </div>
                  <div className="pt-1.5">
                    <p className={`font-semibold text-sm ${step.completed || step.active ? 'text-onyx' : 'text-onyx/35'}`}>
                      {step.label}
                    </p>
                    <p className={`text-xs mt-0.5 ${step.completed || step.active ? 'text-onyx/50' : 'text-onyx/25'}`}>
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default function TrackOrderPage() {
  return (
    <main className="pt-24 pb-20 min-h-screen bg-parchment">
      <Suspense fallback={
        <div className="flex justify-center py-24">
          <Loader2 size={32} className="animate-spin text-honey" />
        </div>
      }>
        <TrackOrderContent />
      </Suspense>
    </main>
  )
}
