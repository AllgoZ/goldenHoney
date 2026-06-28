'use client'
import { useEffect, useState, useMemo } from 'react'
import { Star } from 'lucide-react'
import { getAllReviews } from '@/lib/services/admin.service'
import { setReviewApproved } from '@/lib/services/review.service'
import PageHeader from '@/components/admin/PageHeader'
import DataTable from '@/components/admin/DataTable'
import StatusBadge from '@/components/admin/StatusBadge'
import SearchInput from '@/components/admin/SearchInput'
import EmptyState from '@/components/admin/EmptyState'
import type { FSReview } from '@/types/firebase'

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<FSReview[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState<'all' | 'pending' | 'approved'>('all')

  async function load() {
    setLoading(true)
    const data = await getAllReviews(200)
    setReviews(data as FSReview[])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    let list = reviews
    if (filter === 'approved') list = list.filter((r) => r.approved)
    if (filter === 'pending')  list = list.filter((r) => !r.approved)
    if (search) list = list.filter((r) =>
      r.userName.toLowerCase().includes(search.toLowerCase()) ||
      r.title.toLowerCase().includes(search.toLowerCase())
    )
    return list
  }, [reviews, search, filter])

  async function toggle(review: FSReview) {
    await setReviewApproved(review.id, !review.approved)
    load()
  }

  return (
    <div>
      <PageHeader title="Reviews" description={`${reviews.length} total`} />

      <div className="flex flex-wrap gap-3 mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by user or title…" className="w-64" />
        <select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="h-9 px-3 text-sm border border-onyx/10 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-honey/50">
          <option value="all">All reviews</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
        </select>
      </div>

      {!loading && filtered.length === 0 ? (
        <EmptyState icon={Star} title="No reviews found" />
      ) : (
        <DataTable<FSReview & Record<string, unknown>>
          loading={loading}
          keyField="id"
          data={filtered as (FSReview & Record<string, unknown>)[]}
          columns={[
            { key: 'userName', label: 'Customer', width: '140px',
              render: (row) => <span className="text-sm font-medium">{(row as FSReview).userName}</span> },
            { key: 'rating', label: '★', width: '60px',
              render: (row) => {
                const r = row as FSReview
                return <span className="flex items-center gap-0.5 text-honey text-sm font-bold"><Star size={12} className="fill-honey" /> {r.rating}</span>
              }
            },
            { key: 'title', label: 'Review',
              render: (row) => {
                const r = row as FSReview
                return (
                  <div>
                    <p className="text-sm font-medium text-onyx">{r.title}</p>
                    <p className="text-xs text-onyx/50 truncate max-w-xs">{r.comment}</p>
                  </div>
                )
              }
            },
            { key: 'approved', label: 'Status', width: '100px',
              render: (row) => <StatusBadge status={(row as FSReview).approved ? 'approved' : 'pending'} /> },
            { key: 'actions', label: '', width: '110px',
              render: (row) => {
                const r = row as FSReview
                return (
                  <button onClick={() => toggle(r)}
                    className={`h-7 px-3 rounded-lg text-xs font-semibold transition-colors ${
                      r.approved
                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                    }`}>
                    {r.approved ? 'Reject' : 'Approve'}
                  </button>
                )
              }
            },
          ]}
        />
      )}
    </div>
  )
}
