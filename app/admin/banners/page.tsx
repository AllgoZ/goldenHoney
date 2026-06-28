'use client'
import { useEffect, useState } from 'react'
import NextImage from 'next/image'
import { Image as ImageIcon, Pencil, Trash2 } from 'lucide-react'
import { getBanners, createBanner, updateBanner, deleteBanner } from '@/lib/services/banner.service'
import ImageUpload from '@/components/admin/ImageUpload'
import { deleteFile } from '@/lib/services/storage.service'
import PageHeader from '@/components/admin/PageHeader'
import DataTable from '@/components/admin/DataTable'
import StatusBadge from '@/components/admin/StatusBadge'
import EmptyState from '@/components/admin/EmptyState'
import ConfirmModal from '@/components/admin/ConfirmModal'
import type { FSBanner } from '@/types/firebase'

type FormState = { title: string; subtitle: string; linkHref: string; linkLabel: string; active: boolean; sortOrder: number; imageUrl: string }
const EMPTY: FormState = { title: '', subtitle: '', linkHref: '', linkLabel: '', active: true, sortOrder: 0, imageUrl: '' }

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<FSBanner[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<FSBanner | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]         = useState<FormState>(EMPTY)
  const [saving, setSaving]     = useState(false)
  const [toDelete, setToDelete] = useState<FSBanner | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function load() {
    setLoading(true)
    const data = await getBanners()
    setBanners(data)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  function openEdit(b: FSBanner) {
    setEditing(b)
    setForm({ title: b.title, subtitle: b.subtitle ?? '', linkHref: b.linkHref ?? '', linkLabel: b.linkLabel ?? '', active: b.active, sortOrder: b.sortOrder, imageUrl: b.imageUrl ?? '' })
    setShowForm(true)
  }
  function openNew() { setEditing(null); setForm(EMPTY); setShowForm(true) }
  function cancel() { setShowForm(false); setEditing(null); setForm(EMPTY) }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const payload: Partial<FSBanner> = { title: form.title, subtitle: form.subtitle, linkHref: form.linkHref, linkLabel: form.linkLabel, active: form.active, sortOrder: form.sortOrder, imageUrl: form.imageUrl }
    if (editing) {
      await updateBanner(editing.id, payload)
    } else {
      await createBanner(payload as Omit<FSBanner, 'id'>)
    }
    cancel(); setSaving(false); load()
  }

  async function handleDelete() {
    if (!toDelete) return
    setDeleting(true)
    if (toDelete.imageUrl) deleteFile(toDelete.imageUrl).catch(() => {})
    await deleteBanner(toDelete.id)
    setToDelete(null); setDeleting(false); load()
  }

  return (
    <div>
      <PageHeader title="Banners" description={`${banners.length} total`}>
        <button onClick={openNew}
          className="h-9 px-4 bg-honey text-onyx text-sm font-semibold rounded-xl hover:bg-honey-dark transition-[background-color] duration-150">
          + New Banner
        </button>
      </PageHeader>

      {showForm && (
        <form onSubmit={handleSave} className="bg-white border border-black/6 rounded-card p-5 mb-5 space-y-4">
          <h3 className="font-semibold text-onyx text-sm">{editing ? 'Edit Banner' : 'New Banner'}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-onyx/50 mb-1.5">Title *</label>
              <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required
                className="w-full h-9 px-3 text-sm border border-onyx/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-honey/50 bg-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-onyx/50 mb-1.5">Subtitle</label>
              <input value={form.subtitle} onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                className="w-full h-9 px-3 text-sm border border-onyx/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-honey/50 bg-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-onyx/50 mb-1.5">Link URL</label>
              <input value={form.linkHref} onChange={(e) => setForm((f) => ({ ...f, linkHref: e.target.value }))}
                className="w-full h-9 px-3 text-sm border border-onyx/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-honey/50 bg-white" placeholder="/shop" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-onyx/50 mb-1.5">Link Label</label>
              <input value={form.linkLabel} onChange={(e) => setForm((f) => ({ ...f, linkLabel: e.target.value }))}
                className="w-full h-9 px-3 text-sm border border-onyx/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-honey/50 bg-white" placeholder="Shop Now" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-onyx/50 mb-1.5">Sort Order</label>
              <input type="number" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))}
                className="w-full h-9 px-3 text-sm border border-onyx/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-honey/50 bg-white" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-onyx/50 mb-2">Image</label>
            <ImageUpload folder="banners" value={form.imageUrl}
              onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
              onRemove={() => { if (form.imageUrl) deleteFile(form.imageUrl).catch(() => {}); setForm((f) => ({ ...f, imageUrl: '' })) }}
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} className="w-4 h-4 accent-honey" />
            <span className="text-sm text-onyx/70">Active</span>
          </label>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={cancel} className="h-9 px-4 rounded-xl border border-onyx/10 text-sm text-onyx/70 hover:bg-onyx/4 transition-colors">Cancel</button>
            <button type="submit" disabled={saving}
              className="h-9 px-5 bg-honey text-onyx text-sm font-semibold rounded-xl hover:bg-honey-dark transition-[background-color] duration-150 disabled:opacity-60 flex items-center gap-2">
              {saving && <span className="w-3.5 h-3.5 border-2 border-onyx/30 border-t-onyx rounded-full animate-spin" />}
              {editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      )}

      {!loading && banners.length === 0 ? (
        <EmptyState icon={ImageIcon} title="No banners yet" />
      ) : (
        <DataTable<FSBanner & Record<string, unknown>>
          loading={loading}
          keyField="id"
          data={banners as (FSBanner & Record<string, unknown>)[]}
          columns={[
            { key: 'imageUrl', label: '', width: '80px',
              render: (row) => {
                const b = row as FSBanner
                return b.imageUrl ? (
                  <div className="relative w-14 h-8 rounded-lg overflow-hidden bg-cream">
                    <NextImage src={b.imageUrl} alt={b.title} fill className="object-cover" />
                  </div>
                ) : <div className="w-14 h-8 rounded-lg bg-cream" />
              }
            },
            { key: 'title', label: 'Title',
              render: (row) => {
                const b = row as FSBanner
                return (
                  <div>
                    <p className="text-sm font-medium text-onyx">{b.title}</p>
                    {b.subtitle && <p className="text-xs text-onyx/40">{b.subtitle}</p>}
                  </div>
                )
              }
            },
            { key: 'linkHref', label: 'Link', width: '130px',
              render: (row) => <span className="text-xs text-onyx/50 font-mono">{(row as FSBanner).linkHref || '—'}</span> },
            { key: 'sortOrder', label: 'Sort', width: '60px',
              render: (row) => <span className="text-sm">{(row as FSBanner).sortOrder}</span> },
            { key: 'active', label: 'Status', width: '90px',
              render: (row) => <StatusBadge status={(row as FSBanner).active ? 'active' : 'archived'} /> },
            { key: 'actions', label: '', width: '80px',
              render: (row) => {
                const b = row as FSBanner
                return (
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(b)} className="p-1.5 rounded-lg hover:bg-onyx/5 text-onyx/30 hover:text-onyx transition-colors"><Pencil size={14} /></button>
                    <button onClick={() => setToDelete(b)} className="p-1.5 rounded-lg hover:bg-red-50 text-onyx/30 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                  </div>
                )
              }
            },
          ]}
        />
      )}

      <ConfirmModal
        open={!!toDelete}
        title="Delete banner?"
        message={`"${toDelete?.title}" will be permanently removed.`}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
        loading={deleting}
      />
    </div>
  )
}
