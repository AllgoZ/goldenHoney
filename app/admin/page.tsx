'use client'
import { useEffect, useState } from 'react'
import { IndianRupee, ShoppingBag, Package, Users, Clock } from 'lucide-react'
import { getDashboardStats, type DashboardStats } from '@/lib/services/admin.service'
import { updateOrderStatus } from '@/lib/services/order.service'
import StatsCard from '@/components/admin/StatsCard'
import DataTable from '@/components/admin/DataTable'
import StatusBadge from '@/components/admin/StatusBadge'
import { formatINR } from '@/lib/utils'
import type { FSOrder, OrderStatus } from '@/types/firebase'

export default function AdminDashboard() {
  const [stats, setStats]   = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboardStats().then(setStats).finally(() => setLoading(false))
  }, [])

  async function handleStatusChange(orderId: string, status: OrderStatus) {
    await updateOrderStatus(orderId, status)
    getDashboardStats().then(setStats)
  }

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          label="Revenue"
          value={loading ? '…' : formatINR(stats?.totalRevenue ?? 0)}
          icon={IndianRupee}
          color="honey"
        />
        <StatsCard
          label="Orders"
          value={loading ? '…' : stats?.totalOrders ?? 0}
          icon={ShoppingBag}
          color="blue"
        />
        <StatsCard
          label="Products"
          value={loading ? '…' : stats?.totalProducts ?? 0}
          icon={Package}
          color="purple"
        />
        <StatsCard
          label="Customers"
          value={loading ? '…' : stats?.totalCustomers ?? 0}
          icon={Users}
          color="green"
        />
        <StatsCard
          label="Pending"
          value={loading ? '…' : stats?.pendingOrders ?? 0}
          icon={Clock}
          color="red"
          sub="awaiting action"
        />
      </div>

      {/* Recent orders */}
      <div>
        <h3 className="font-heading font-semibold text-onyx mb-3">Recent Orders</h3>
        <DataTable<FSOrder & Record<string, unknown>>
          loading={loading}
          keyField="id"
          data={(stats?.recentOrders ?? []) as (FSOrder & Record<string, unknown>)[]}
          columns={[
            { key: 'orderNumber', label: 'Order #', width: '120px',
              render: (row) => <span className="font-mono text-xs font-semibold text-onyx">{(row as FSOrder).orderNumber}</span> },
            { key: 'userName', label: 'Customer',
              render: (row) => <span className="text-sm">{(row as FSOrder).userName}</span> },
            { key: 'total', label: 'Total',
              render: (row) => <span className="font-semibold">{formatINR((row as FSOrder).total)}</span> },
            { key: 'orderStatus', label: 'Status',
              render: (row) => <StatusBadge status={(row as FSOrder).orderStatus} /> },
            { key: 'paymentStatus', label: 'Payment',
              render: (row) => <StatusBadge status={(row as FSOrder).paymentStatus} /> },
            { key: 'actions', label: '', width: '140px',
              render: (row) => {
                const order = row as FSOrder
                return (
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                    className="text-xs border border-onyx/10 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-honey"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {['pending','paid','processing','shipped','delivered','cancelled','refunded'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                )
              }
            },
          ]}
        />
      </div>
    </div>
  )
}
