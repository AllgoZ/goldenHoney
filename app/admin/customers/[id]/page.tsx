'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Phone, Mail, MapPin, ShoppingCart,
  Heart, Package, Loader2, Edit3, Check, X,
} from 'lucide-react'
import { getCustomer, getCustomerAddresses, updateCustomer } from '@/lib/services/customer.service'
import { getCustomerOrders } from '@/lib/services/order.service'
import StatusBadge from '@/components/admin/StatusBadge'
import { formatINR } from '@/lib/utils'
import type { FSCustomer, FSAddress, FSOrder } from '@/types/firebase'

function tsToDate(ts: any): string {
  if (!ts) return '—'
  const d = ts.toDate?.() ?? new Date(ts.seconds * 1000)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-card border border-black/6 p-5">
      <h3 className="font-semibold text-onyx text-sm mb-4">{title}</h3>
      {children}
    </div>
  )
}

export default function CustomerDetailPage() {
  const { id: phoneId } = useParams<{ id: string }>()
  const router = useRouter()

  const [customer,   setCustomer]   = useState<FSCustomer | null>(null)
  const [addresses,  setAddresses]  = useState<FSAddress[]>([])
  const [orders,     setOrders]     = useState<FSOrder[]>([])
  const [loading,    setLoading]    = useState(true)

  // Inline name edit
  const [editingName, setEditingName] = useState(false)
  const [nameValue,   setNameValue]   = useState('')
  const [savingName,  setSavingName]  = useState(false)

  useEffect(() => {
    Promise.all([
      getCustomer(phoneId),
      getCustomerAddresses(phoneId),
      getCustomerOrders(phoneId, 50),
    ]).then(([cust, addrs, ords]) => {
      if (!cust) { router.replace('/admin/customers'); return }
      setCustomer(cust)
      setNameValue(cust.name?.startsWith('+91') ? '' : (cust.name ?? ''))
      setAddresses(addrs)
      setOrders(ords)
      setLoading(false)
    })
  }, [phoneId, router])

  async function saveName() {
    if (!nameValue.trim()) return
    setSavingName(true)
    await updateCustomer(phoneId, { name: nameValue.trim() })
    setCustomer((c) => c ? { ...c, name: nameValue.trim() } : c)
    setSavingName(false)
    setEditingName(false)
  }

  const totalSpend = orders.reduce((s, o) => s + o.total, 0)

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={28} className="animate-spin text-honey" />
      </div>
    )
  }
  if (!customer) return null

  const displayName = customer.name?.startsWith('+91') ? '—' : (customer.name || '—')

  return (
    <div className="max-w-3xl space-y-5">

      {/* Back + header */}
      <div className="flex items-start gap-3">
        <Link
          href="/admin/customers"
          className="p-1.5 rounded-lg hover:bg-onyx/5 text-onyx/40 hover:text-onyx transition-colors mt-0.5"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            {editingName ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setEditingName(false) }}
                  className="font-heading font-bold text-xl text-onyx border-b-2 border-honey outline-none bg-transparent"
                />
                <button onClick={saveName} disabled={savingName} className="p-1 rounded hover:bg-green-50 text-green-600">
                  {savingName ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                </button>
                <button onClick={() => setEditingName(false)} className="p-1 rounded hover:bg-red-50 text-red-400">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <>
                <h2 className="font-heading font-bold text-xl text-onyx">{displayName}</h2>
                <button
                  onClick={() => setEditingName(true)}
                  className="p-1 rounded hover:bg-onyx/5 text-onyx/30 hover:text-onyx transition-colors"
                >
                  <Edit3 size={14} />
                </button>
              </>
            )}
          </div>
          <p className="text-xs text-onyx/40 font-mono">{customer.phone}</p>
        </div>

        {/* KPI pills */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="text-center px-3 py-1.5 bg-honey/10 rounded-xl">
            <p className="text-xs text-onyx/40">Orders</p>
            <p className="font-bold text-sm text-onyx">{orders.length}</p>
          </div>
          <div className="text-center px-3 py-1.5 bg-green-50 rounded-xl">
            <p className="text-xs text-onyx/40">Spent</p>
            <p className="font-bold text-sm text-onyx">{formatINR(totalSpend)}</p>
          </div>
        </div>
      </div>

      {/* Profile */}
      <Section title="Profile">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-onyx/60">
            <Phone size={14} className="text-onyx/30 shrink-0" />
            <span className="font-mono">{customer.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-onyx/60">
            <Mail size={14} className="text-onyx/30 shrink-0" />
            <span>{customer.email || '—'}</span>
          </div>
          <div className="flex items-center gap-2 text-onyx/40 text-xs">
            <span className="text-onyx/30">Joined:</span>
            <span>{tsToDate(customer.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2 text-onyx/40 text-xs">
            <span className="text-onyx/30">Last Login:</span>
            <span>{tsToDate(customer.lastLogin)}</span>
          </div>
        </div>
      </Section>

      {/* Orders */}
      <Section title={`Orders (${orders.length})`}>
        {orders.length === 0 ? (
          <div className="flex items-center gap-2 text-onyx/40 text-sm py-2">
            <Package size={16} className="opacity-50" />
            <span>No orders placed yet</span>
          </div>
        ) : (
          <div className="space-y-2">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-2.5 border-b border-black/4 last:border-0">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-mono text-xs font-bold text-honey hover:underline"
                    >
                      #{order.orderNumber}
                    </Link>
                    <StatusBadge status={order.orderStatus} />
                  </div>
                  <p className="text-xs text-onyx/40">
                    {tsToDate(order.createdAt)} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    {order.paymentMethod === 'cod' && ' · COD'}
                  </p>
                </div>
                <span className="font-semibold text-sm text-onyx">{formatINR(order.total)}</span>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Addresses */}
      <Section title={`Saved Addresses (${addresses.length})`}>
        {addresses.length === 0 ? (
          <div className="flex items-center gap-2 text-onyx/40 text-sm py-2">
            <MapPin size={16} className="opacity-50" />
            <span>No saved addresses</span>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map((addr) => (
              <div key={addr.id} className={`p-3 rounded-xl border text-sm ${addr.isDefault ? 'border-honey bg-honey/5' : 'border-black/6 bg-onyx/1'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-onyx">{addr.fullName}</span>
                  {addr.isDefault && (
                    <span className="text-[10px] font-bold uppercase bg-honey/15 text-honey-dark px-1.5 py-0.5 rounded-full">
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
            ))}
          </div>
        )}
      </Section>

      {/* Live Cart */}
      <Section title={`Live Cart (${customer.cart?.length ?? 0} items)`}>
        {!customer.cart?.length ? (
          <div className="flex items-center gap-2 text-onyx/40 text-sm py-2">
            <ShoppingCart size={16} className="opacity-50" />
            <span>Cart is empty</span>
          </div>
        ) : (
          <div className="space-y-2">
            {customer.cart.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-black/4 last:border-0">
                <div>
                  <p className="text-sm font-medium text-onyx">{item.productName}</p>
                  <p className="text-xs text-onyx/40">{item.selectedWeight} × {item.quantity}</p>
                </div>
                <span className="text-sm font-semibold text-onyx">
                  {formatINR(item.unitPrice * item.quantity)}
                </span>
              </div>
            ))}
            <div className="flex justify-between pt-2 text-sm font-bold text-onyx">
              <span>Cart Total</span>
              <span>
                {formatINR(customer.cart.reduce((s, i) => s + i.unitPrice * i.quantity, 0))}
              </span>
            </div>
          </div>
        )}
      </Section>

      {/* Wishlist */}
      {customer.wishlist && customer.wishlist.length > 0 && (
        <Section title={`Wishlist (${customer.wishlist.length} products)`}>
          <div className="flex items-center gap-2 text-onyx/50 text-sm">
            <Heart size={14} className="text-red-400" />
            <span>{customer.wishlist.length} product{customer.wishlist.length !== 1 ? 's' : ''} saved</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {customer.wishlist.map((pid) => (
              <span key={pid} className="text-xs font-mono bg-onyx/5 text-onyx/50 px-2 py-0.5 rounded-lg">
                {pid}
              </span>
            ))}
          </div>
        </Section>
      )}

    </div>
  )
}
