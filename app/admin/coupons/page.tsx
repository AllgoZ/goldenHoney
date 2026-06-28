'use client'
import { useEffect, useState, useMemo } from 'react'
import { Ticket, Trash2 } from 'lucide-react'
import { listAllCoupons, createCoupon, deleteCoupon } from '@/lib/services/coupon.service'
import PageHeader from '@/components/admin/PageHeader'
import DataTable from '@/components/admin/DataTable'
import StatusBadge from '@/components/admin/StatusBadge'
import SearchInput from '@/components/admin/SearchInput'
import EmptyState from '@/components/admin/EmptyState'
import ConfirmModal from '@/components/admin/ConfirmModal'
import { formatINR } from '@/lib/utils'
import type { FSCoupon, CouponType } from '@/types/firebase'

type FormState = { code: string; type: CouponType; value: number; minimumOrder: number; usageLimit: number; expiresAt: string; description: string }
const EMPTY: FormState = { code: '', type: 'percentage', value: 10, minimumOrder: 0, usageLimit: 100, expiresAt: '', description: '' }

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<FSCoupon[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]         = useState<FormState>(EMPTY)
  const [saving, setSaving]     = useState(false)
  const [toDelete, setToDelete] = useState<FSCoupon | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function load() {
    setLoading(true)
    const data = await listAllCoupons()
    setCoupons(data)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    if (!search) return coupons
    return coupons.filter((c) => c.code.toLowerCase().includes(search.toLowerCase()))
  }, [coupons, search])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const { Timestamp } = await import('firebase/firestore')
    await createCoupon({
      code:         form.code.toUpperCase(),
      type:         form.type,
      value:        form.value,
      minimumOrder: form.minimumOrder,
      usageLimit:   form.usageLimit,
      usedCount:    0,
      active:       true,
      description:  form.description,
      expiresAt:    form.expiresAt ? Timestamp.fromDate(new Date(form.expiresAt)) : Timestamp.fromDate(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)),
    })
    setShowForm(false)
    setForm(EMPTY)
    setSaving(false)
    load()
  }

  async function handleDelete() {
    if (!toDelete) return
    setDeleting(true)
    await deleteCoupon(toDelete.code)
    setToDelete(null)
    setDeleting(false)
    load()
  }

  return (
    <div>
      <PageHeader title="Coupons" description={`${coupons.length} total`}>
        <button onClick={() => setShowForm((v) => !v)}
          className="h-9 px-4 bg-honey text-onyx text-sm font-semibold rounded-xl hover:bg-honey-dark transition-[background-color] duration-150">
          {showForm ? 'Cancel' : '+ New Coupon'}
        </button>
      </PageHeader>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white border border-black/6 rounded-card p-5 mb-5 grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-onyx/50 mb-1.5">Code *</label>
            <input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} required
              className="w-full h-9 px-3 text-sm border border-onyx/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-honey/50 bg-white font-mono uppercase"
              placeholder="SAVE20" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-onyx/50 mb-1.5">Type</label>
            <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as CouponType }))}
              className="w-full h-9 px-3 text-sm border border-onyx/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-honey/50 bg-white">
              <option value="percentage">Percent (%)</option>
              <option value="flat">Flat (₹)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-onyx/50 mb-1.5">Value *</label>
            <input type="number" value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: Number(e.target.value) }))} required
              className="w-full h-9 px-3 text-sm border border-onyx/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-honey/50 bg-white" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-onyx/50 mb-1.5">Min Order (₹)</label>
            <input type="number" value={form.minimumOrder} onChange={(e) => setForm((f) => ({ ...f, minimumOrder: Number(e.target.value) }))}
              className="w-full h-9 px-3 text-sm border border-onyx/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-honey/50 bg-white" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-onyx/50 mb-1.5">Usage Limit</label>
            <input type="number" value={form.usageLimit} onChange={(e) => setForm((f) => ({ ...f, usageLimit: Number(e.target.value) }))}
              className="w-full h-9 px-3 text-sm border border-onyx/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-honey/50 bg-white" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-onyx/50 mb-1.5">Expires (optional)</label>
            <input type="date" value={form.expiresAt} onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))}
              className="w-full h-9 px-3 text-sm border border-onyx/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-honey/50 bg-white" />
          </div>
          <div className="col-span-3">
            <label className="block text-xs font-semibold text-onyx/50 mb-1.5">Description (optional)</label>
            <input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full h-9 px-3 text-sm border border-onyx/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-honey/50 bg-white" placeholder="e.g. 20% off your first order" />
          </div>
          <div className="col-span-3 flex justify-end">
            <button type="submit" disabled={saving}
              className="h-9 px-5 bg-honey text-onyx text-sm font-semibold rounded-xl hover:bg-honey-dark transition-[background-color] duration-150 disabled:opacity-60 flex items-center gap-2">
              {saving && <span className="w-3.5 h-3.5 border-2 border-onyx/30 border-t-onyx rounded-full animate-spin" />}
              Create Coupon
            </button>
          </div>
        </form>
      )}

      <div className="mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by code…" className="w-60" />
      </div>

      {!loading && filtered.length === 0 ? (
        <EmptyState icon={Ticket} title="No coupons yet" message="Create your first coupon above." />
      ) : (
        <DataTable<FSCoupon & Record<string, unknown>>
          loading={loading}
          keyField="code"
          data={filtered as (FSCoupon & Record<string, unknown>)[]}
          columns={[
            { key: 'code', label: 'Code',
              render: (row) => <span className="font-mono font-bold text-onyx">{(row as FSCoupon).code}</span> },
            { key: 'type', label: 'Type', width: '100px',
              render: (row) => <span className="text-xs capitalize">{(row as FSCoupon).type}</span> },
            { key: 'value', label: 'Discount', width: '100px',
              render: (row) => {
                const c = row as FSCoupon
                return <span className="font-semibold">{c.type === 'percentage' ? `${c.value}%` : formatINR(c.value)}</span>
              }
            },
            { key: 'minimumOrder', label: 'Min Order', width: '100px',
              render: (row) => {
                const v = (row as FSCoupon).minimumOrder
                return <span className="text-sm">{v > 0 ? formatINR(v) : '—'}</span>
              }
            },
            { key: 'usedCount', label: 'Used', width: '80px',
              render: (row) => {
                const c = row as FSCoupon
                return <span className="text-sm">{c.usedCount} / {c.usageLimit}</span>
              }
            },
            { key: 'active', label: 'Status', width: '90px',
              render: (row) => <StatusBadge status={(row as FSCoupon).active ? 'active' : 'archived'} /> },
            { key: 'actions', label: '', width: '60px',
              render: (row) => (
                <button onClick={() => setToDelete(row as FSCoupon)} className="p-1.5 rounded-lg hover:bg-red-50 text-onyx/30 hover:text-red-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              )
            },
          ]}
        />
      )}

      <ConfirmModal
        open={!!toDelete}
        title="Delete coupon?"
        message={`Coupon "${toDelete?.code}" will be permanently removed.`}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
        loading={deleting}
      />
    </div>
  )
}
