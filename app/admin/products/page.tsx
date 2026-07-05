'use client'
import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Package, Pencil, Trash2 } from 'lucide-react'
import { getAllProductsAdmin } from '@/lib/services/admin.service'
import { deleteProduct } from '@/lib/services/product.service'
import PageHeader from '@/components/admin/PageHeader'
import DataTable from '@/components/admin/DataTable'
import StatusBadge from '@/components/admin/StatusBadge'
import SearchInput from '@/components/admin/SearchInput'
import EmptyState from '@/components/admin/EmptyState'
import ConfirmModal from '@/components/admin/ConfirmModal'
import { formatINR } from '@/lib/utils'
import type { FSProduct } from '@/types/firebase'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<FSProduct[]>([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState<string>('all')
  const [toDelete, setToDelete] = useState<FSProduct | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function load() {
    setLoading(true)
    const data = await getAllProductsAdmin()
    setProducts(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    let list = products
    if (filter !== 'all') list = list.filter((p) => p.status === filter)
    if (search) list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    return list
  }, [products, search, filter])

  async function handleDelete() {
    if (!toDelete) return
    setDeleting(true)
    await deleteProduct(toDelete.id)
    setToDelete(null)
    setDeleting(false)
    load()
  }

  return (
    <div>
      <PageHeader title="Products" description={`${products.length} total`} actionLabel="Add Product" actionHref="/admin/products/new" />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search products…" className="w-full sm:w-60" />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-9 px-3 text-sm border border-onyx/10 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-honey/50 w-full sm:w-auto"
        >
          <option value="all">All status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {!loading && filtered.length === 0 ? (
        <EmptyState icon={Package} title="No products found" message="Try adjusting your search or filters." />
      ) : (
        <DataTable<FSProduct & Record<string, unknown>>
          loading={loading}
          keyField="id"
          data={filtered as (FSProduct & Record<string, unknown>)[]}
          columns={[
            { key: 'image', label: '', width: '56px',
              render: (row) => {
                const p = row as FSProduct
                return p.images?.[0] ? (
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-cream shrink-0">
                    <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                  </div>
                ) : <div className="w-10 h-10 rounded-lg bg-cream" />
              }
            },
            { key: 'name', label: 'Product',
              render: (row) => {
                const p = row as FSProduct
                return (
                  <div>
                    <p className="font-semibold text-onyx text-sm">{p.name}</p>
                    <p className="text-xs text-onyx/40">{p.categorySlug}</p>
                  </div>
                )
              }
            },
            { key: 'price', label: 'Price', width: '100px',
              render: (row) => <span className="font-semibold">{formatINR((row as FSProduct).price)}</span> },
            { key: 'status', label: 'Status', width: '90px',
              render: (row) => <StatusBadge status={(row as FSProduct).status} /> },
            { key: 'badge', label: 'Badge', width: '90px',
              render: (row) => {
                const b = (row as FSProduct).badge
                return b ? <StatusBadge status={b} /> : <span className="text-onyx/30 text-xs">—</span>
              }
            },
            { key: 'actions', label: '', width: '90px',
              render: (row) => {
                const p = row as FSProduct
                return (
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/products/${p.id}`} className="p-1.5 rounded-lg hover:bg-onyx/5 text-onyx/40 hover:text-onyx transition-colors">
                      <Pencil size={14} />
                    </Link>
                    <button onClick={() => setToDelete(p)} className="p-1.5 rounded-lg hover:bg-red-50 text-onyx/40 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                )
              }
            },
          ]}
        />
      )}

      <ConfirmModal
        open={!!toDelete}
        title="Delete product?"
        message={`"${toDelete?.name}" will be permanently removed.`}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
        loading={deleting}
      />
    </div>
  )
}
