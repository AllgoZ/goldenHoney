'use client'
import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { Users, ShoppingCart, Heart, ChevronRight } from 'lucide-react'
import { getAllCustomers, type FSCustomerDoc } from '@/lib/services/admin.service'
import PageHeader from '@/components/admin/PageHeader'
import DataTable from '@/components/admin/DataTable'
import SearchInput from '@/components/admin/SearchInput'
import EmptyState from '@/components/admin/EmptyState'

function tsToDate(ts: any): string {
  if (!ts) return '—'
  const d = ts.toDate?.() ?? new Date(ts.seconds * 1000)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<FSCustomerDoc[]>([])
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState('')

  useEffect(() => {
    getAllCustomers().then((data) => { setCustomers(data); setLoading(false) })
  }, [])

  const filtered = useMemo(() => {
    if (!search) return customers
    const q = search.toLowerCase()
    return customers.filter((c) =>
      c.name?.toLowerCase().includes(q) ||
      c.phone?.includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phoneId.includes(q)
    )
  }, [customers, search])

  return (
    <div>
      <PageHeader title="Customers" description={`${customers.length} registered`} />

      <div className="mb-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by name, phone, or email…"
          className="w-full sm:w-80"
        />
      </div>

      {!loading && filtered.length === 0 ? (
        <EmptyState icon={Users} title="No customers yet" />
      ) : (
        <DataTable<FSCustomerDoc & Record<string, unknown>>
          loading={loading}
          keyField="phoneId"
          data={filtered as (FSCustomerDoc & Record<string, unknown>)[]}
          columns={[
            {
              key: 'name',
              label: 'Customer',
              render: (row) => {
                const c = row as FSCustomerDoc
                return (
                  <div>
                    <p className="text-sm font-semibold text-onyx">
                      {c.name?.startsWith('+91') ? '(no name)' : (c.name || '(no name)')}
                    </p>
                    <p className="text-xs text-onyx/40 font-mono">{c.phone}</p>
                  </div>
                )
              },
            },
            {
              key: 'email',
              label: 'Email',
              render: (row) => {
                const c = row as FSCustomerDoc
                return (
                  <span className="text-xs text-onyx/50">{c.email || '—'}</span>
                )
              },
            },
            {
              key: 'cart',
              label: 'Cart',
              width: '70px',
              render: (row) => {
                const c = row as FSCustomerDoc
                const count = c.cart?.length ?? 0
                return (
                  <div className="flex items-center gap-1 text-xs text-onyx/50">
                    <ShoppingCart size={12} />
                    <span>{count}</span>
                  </div>
                )
              },
            },
            {
              key: 'wishlist',
              label: 'Wishlist',
              width: '80px',
              render: (row) => {
                const c = row as FSCustomerDoc
                const count = c.wishlist?.length ?? 0
                return (
                  <div className="flex items-center gap-1 text-xs text-onyx/50">
                    <Heart size={12} />
                    <span>{count}</span>
                  </div>
                )
              },
            },
            {
              key: 'lastLogin',
              label: 'Last Seen',
              width: '120px',
              render: (row) => (
                <span className="text-xs text-onyx/40">{tsToDate((row as FSCustomerDoc).lastLogin)}</span>
              ),
            },
            {
              key: 'createdAt',
              label: 'Joined',
              width: '110px',
              render: (row) => (
                <span className="text-xs text-onyx/40">{tsToDate((row as FSCustomerDoc).createdAt)}</span>
              ),
            },
            {
              key: 'actions',
              label: '',
              width: '50px',
              render: (row) => {
                const c = row as FSCustomerDoc
                return (
                  <Link
                    href={`/admin/customers/${c.phoneId}`}
                    className="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-onyx/5 text-onyx/30 hover:text-onyx transition-colors"
                  >
                    <ChevronRight size={16} />
                  </Link>
                )
              },
            },
          ]}
        />
      )}
    </div>
  )
}
