'use client'
import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { getAllOrders } from '@/lib/services/admin.service'
import { updateOrderStatus, updatePaymentStatus } from '@/lib/services/order.service'
import PageHeader from '@/components/admin/PageHeader'
import DataTable from '@/components/admin/DataTable'
import StatusBadge from '@/components/admin/StatusBadge'
import SearchInput from '@/components/admin/SearchInput'
import EmptyState from '@/components/admin/EmptyState'
import { formatINR } from '@/lib/utils'
import type { FSOrder, OrderStatus, PaymentStatus } from '@/types/firebase'

const ORDER_STATUSES = ['all','pending','paid','processing','shipped','delivered','cancelled','refunded']

export default function AdminOrdersPage() {
  const [orders, setOrders]   = useState<FSOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState('all')

  async function load() {
    setLoading(true)
    const data = await getAllOrders()
    setOrders(data)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    let list = orders
    if (filter !== 'all') list = list.filter((o) => o.orderStatus === filter)
    if (search) list = list.filter((o) =>
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.userName.toLowerCase().includes(search.toLowerCase())
    )
    return list
  }, [orders, search, filter])

  async function handleStatus(orderId: string, status: OrderStatus) {
    await updateOrderStatus(orderId, status)
    load()
  }

  async function handlePayment(orderId: string, status: PaymentStatus) {
    await updatePaymentStatus(orderId, status)
    load()
  }

  return (
    <div>
      <PageHeader title="Orders" description={`${orders.length} total`} />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Order # or customer…" className="w-full sm:w-64" />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}
          className="h-9 px-3 text-sm border border-onyx/10 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-honey/50 capitalize w-full sm:w-auto">
          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s === 'all' ? 'All statuses' : s}</option>)}
        </select>
      </div>

      {!loading && filtered.length === 0 ? (
        <EmptyState icon={ShoppingBag} title="No orders found" />
      ) : (
        <DataTable<FSOrder & Record<string, unknown>>
          loading={loading}
          keyField="id"
          data={filtered as (FSOrder & Record<string, unknown>)[]}
          columns={[
            { key: 'orderNumber', label: 'Order #', width: '120px',
              render: (row) => {
                const o = row as FSOrder
                return <Link href={`/admin/orders/${o.id}`} className="font-mono text-xs font-bold text-honey hover:underline">{o.orderNumber}</Link>
              }
            },
            { key: 'userName', label: 'Customer',
              render: (row) => {
                const o = row as FSOrder
                return (
                  <div>
                    <p className="text-sm font-medium">{o.userName}</p>
                    <p className="text-xs text-onyx/40">{o.userEmail}</p>
                  </div>
                )
              }
            },
            { key: 'total', label: 'Total', width: '100px',
              render: (row) => <span className="font-semibold">{formatINR((row as FSOrder).total)}</span> },
            { key: 'orderStatus', label: 'Status', width: '110px',
              render: (row) => <StatusBadge status={(row as FSOrder).orderStatus} /> },
            { key: 'paymentStatus', label: 'Payment', width: '90px',
              render: (row) => <StatusBadge status={(row as FSOrder).paymentStatus} /> },
            { key: 'actions', label: 'Update', width: '180px',
              render: (row) => {
                const o = row as FSOrder
                return (
                  <div className="flex flex-col gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <select value={o.orderStatus}
                      onChange={(e) => handleStatus(o.id, e.target.value as OrderStatus)}
                      className="text-xs border border-onyx/10 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-honey capitalize">
                      {(['pending','processing','shipped','delivered','cancelled','refunded'] as OrderStatus[]).map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <select value={o.paymentStatus}
                      onChange={(e) => handlePayment(o.id, e.target.value as PaymentStatus)}
                      className="text-xs border border-onyx/10 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-honey capitalize">
                      {(['pending','paid','failed','refunded'] as PaymentStatus[]).map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                )
              }
            },
          ]}
        />
      )}
    </div>
  )
}
