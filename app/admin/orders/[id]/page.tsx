'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getOrder, updateOrderStatus, updatePaymentStatus, setTrackingNumber } from '@/lib/services/order.service'
import StatusBadge from '@/components/admin/StatusBadge'
import { formatINR } from '@/lib/utils'
import type { FSOrder, OrderStatus, PaymentStatus } from '@/types/firebase'

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router  = useRouter()
  const [order, setOrder]       = useState<FSOrder | null>(null)
  const [loading, setLoading]   = useState(true)
  const [tracking, setTracking] = useState('')
  const [saving, setSaving]     = useState(false)

  useEffect(() => {
    getOrder(id).then((o) => {
      if (!o) { router.replace('/admin/orders'); return }
      setOrder(o)
      setTracking(o.trackingNumber ?? '')
      setLoading(false)
    })
  }, [id, router])

  async function handleStatusChange(status: OrderStatus) {
    if (!order) return
    await updateOrderStatus(order.id, status)
    setOrder((o) => o ? { ...o, orderStatus: status } : null)
  }

  async function handlePaymentStatusChange(status: PaymentStatus) {
    if (!order) return
    await updatePaymentStatus(order.id, status)
    setOrder((o) => o ? { ...o, paymentStatus: status } : null)
  }

  async function handleTrackingSave() {
    if (!order) return
    setSaving(true)
    await setTrackingNumber(order.id, tracking)
    const updated = { ...order, trackingNumber: tracking, orderStatus: 'shipped' as const }
    setOrder(updated)

    // Fire shipping email to customer — non-blocking
    if (order.userEmail) {
      fetch('/api/email/shipping-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: updated, trackingNumber: tracking }),
      }).catch(() => {})
    }

    setSaving(false)
  }

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-honey border-t-transparent rounded-full animate-spin" /></div>
  if (!order) return null

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/admin/orders" className="p-1.5 rounded-lg hover:bg-onyx/5 text-onyx/40 hover:text-onyx transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h2 className="font-heading font-bold text-xl text-onyx">{order.orderNumber}</h2>
          <p className="text-xs text-onyx/40">{new Date((order.createdAt as unknown as { seconds: number }).seconds * 1000).toLocaleString('en-IN')}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <StatusBadge status={order.paymentStatus} />
          <StatusBadge status={order.orderStatus} />
        </div>
      </div>

      {/* Order status control */}
      <div className="bg-white rounded-card border border-black/6 p-5">
        <h3 className="font-semibold text-onyx text-sm mb-3">Order Status</h3>
        <div className="flex flex-wrap gap-2">
          {(['pending','processing','shipped','delivered','cancelled','refunded'] as OrderStatus[]).map((s) => (
            <button key={s} onClick={() => handleStatusChange(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors capitalize ${
                order.orderStatus === s
                  ? 'bg-onyx text-white border-onyx'
                  : 'border-onyx/10 text-onyx/60 hover:border-onyx/30'
              }`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Payment status control */}
      <div className="bg-white rounded-card border border-black/6 p-5">
        <h3 className="font-semibold text-onyx text-sm mb-3">Payment Status</h3>
        <div className="flex flex-wrap gap-2">
          {(['pending','paid','failed','refunded'] as PaymentStatus[]).map((s) => (
            <button key={s} onClick={() => handlePaymentStatusChange(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors capitalize ${
                order.paymentStatus === s
                  ? 'bg-onyx text-white border-onyx'
                  : 'border-onyx/10 text-onyx/60 hover:border-onyx/30'
              }`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Tracking */}
      <div className="bg-white rounded-card border border-black/6 p-5">
        <h3 className="font-semibold text-onyx text-sm mb-3">Tracking Number</h3>
        <div className="flex gap-3">
          <input value={tracking} onChange={(e) => setTracking(e.target.value)}
            placeholder="Enter courier tracking number"
            className="flex-1 h-9 px-3 text-sm border border-onyx/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-honey/50 bg-white font-mono" />
          <button onClick={handleTrackingSave} disabled={saving || !tracking}
            className="h-9 px-4 bg-honey text-onyx text-sm font-semibold rounded-xl hover:bg-honey-dark transition-[background-color] duration-150 disabled:opacity-50">
            {saving ? 'Saving…' : 'Save & Mark Shipped'}
          </button>
        </div>
      </div>

      {/* Customer */}
      <div className="bg-white rounded-card border border-black/6 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-onyx text-sm">Customer</h3>
          {/* userId is the 10-digit phone for phone customers */}
          {/^\d{10}$/.test(order.userId) && (
            <Link
              href={`/admin/customers/${order.userId}`}
              className="text-xs font-semibold text-honey hover:underline"
            >
              View Profile →
            </Link>
          )}
        </div>
        <p className="text-sm font-medium text-onyx">{order.userName}</p>
        <p className="text-sm text-onyx/50">{order.userEmail || '—'}</p>
        <p className="text-sm text-onyx/50">{order.userPhone}</p>
      </div>

      {/* Shipping address */}
      <div className="bg-white rounded-card border border-black/6 p-5">
        <h3 className="font-semibold text-onyx text-sm mb-3">Shipping Address</h3>
        <p className="text-sm text-onyx">{order.shippingAddress.fullName}</p>
        <p className="text-sm text-onyx/60">{order.shippingAddress.addressLine1}</p>
        {order.shippingAddress.addressLine2 && <p className="text-sm text-onyx/60">{order.shippingAddress.addressLine2}</p>}
        <p className="text-sm text-onyx/60">{order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}</p>
        <p className="text-sm text-onyx/60">{order.shippingAddress.phone}</p>
      </div>

      {/* Items */}
      <div className="bg-white rounded-card border border-black/6 p-5">
        <h3 className="font-semibold text-onyx text-sm mb-3">Items</h3>
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-black/4 last:border-0">
              <div>
                <p className="text-sm font-medium text-onyx">{item.productName}</p>
                <p className="text-xs text-onyx/40">{item.selectedWeight} × {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold">{formatINR(item.lineTotal)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-card border border-black/6 p-5">
        <h3 className="font-semibold text-onyx text-sm mb-3">Order Summary</h3>
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between text-onyx/60"><span>Subtotal</span><span>{formatINR(order.subtotal)}</span></div>
          {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>− {formatINR(order.discount)}</span></div>}
          <div className="flex justify-between text-onyx/60"><span>Shipping</span><span>{order.shipping === 0 ? 'Free' : formatINR(order.shipping)}</span></div>
          <div className="flex justify-between text-onyx/60"><span>Tax</span><span>{formatINR(order.tax)}</span></div>
          <div className="flex justify-between font-bold text-onyx text-base pt-2 border-t border-black/6 mt-2"><span>Total</span><span>{formatINR(order.total)}</span></div>
        </div>
      </div>
    </div>
  )
}
