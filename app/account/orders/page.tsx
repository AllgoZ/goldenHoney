'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Package, Loader2 } from 'lucide-react'
import { useUserStore } from '@/store/user'
import { getCustomerOrders } from '@/lib/services/order.service'
import { formatINR } from '@/lib/utils'
import type { FSOrder } from '@/types/firebase'

const STATUS_COLOUR: Record<string, string> = {
  pending:    'bg-gray-100 text-gray-600',
  paid:       'bg-blue-100 text-blue-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped:    'bg-purple-100 text-purple-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-600',
  refunded:   'bg-orange-100 text-orange-700',
}

const STATUS_LABEL: Record<string, string> = {
  pending:    'Pending',
  paid:       'Confirmed',
  processing: 'Processing',
  shipped:    'Shipped',
  delivered:  'Delivered',
  cancelled:  'Cancelled',
  refunded:   'Refunded',
}

function tsToDateStr(ts: any): string {
  if (!ts) return ''
  const d = ts.toDate?.() ?? new Date(ts)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function OrdersPage() {
  const user = useUserStore((s) => s.user)
  const [orders,  setOrders]  = useState<FSOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) { setLoading(false); return }
    getCustomerOrders(user.id)
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user?.id])

  return (
    <main className="pt-24 pb-20 min-h-screen bg-parchment">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-sm text-onyx/50 hover:text-onyx mb-8 transition-colors"
        >
          <ChevronLeft size={16} /> Back to Account
        </Link>
        <h1 className="font-heading font-bold text-3xl text-onyx mb-8">My Orders</h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="animate-spin text-honey" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <Package size={48} className="mx-auto text-onyx/20 mb-4" />
            <p className="text-onyx/50">No orders yet</p>
            <Link
              href="/shop"
              className="inline-block mt-6 text-honey-dark font-medium hover:underline"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <AnimatePresence>
              {orders.map((order, i) => (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-white rounded-xl p-5 border border-black/5 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-heading font-semibold text-onyx text-sm">
                        #{order.orderNumber}
                      </p>
                      <p className="text-xs text-onyx/40 mt-0.5">{tsToDateStr(order.createdAt)}</p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-chip ${
                        STATUS_COLOUR[order.orderStatus] ?? 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {STATUS_LABEL[order.orderStatus] ?? order.orderStatus}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5 mb-4">
                    {order.items.map((item, j) => (
                      <div key={j} className="text-sm text-onyx/60 flex justify-between gap-2">
                        <span className="truncate">
                          {item.productName} × {item.quantity}
                          <span className="text-xs text-onyx/35 ml-1">({item.selectedWeight})</span>
                        </span>
                        <span className="shrink-0">{formatINR(item.lineTotal)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-black/5">
                    <div>
                      <span className="font-bold text-sm text-onyx">{formatINR(order.total)}</span>
                      <span className="text-xs text-onyx/30 ml-2">
                        {order.paymentMethod === 'cod' ? 'COD' : order.paymentMethod}
                      </span>
                    </div>
                    <Link
                      href={`/track-order?order=${order.orderNumber}`}
                      className="text-xs font-semibold text-honey-dark hover:underline"
                    >
                      Track Order →
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  )
}
