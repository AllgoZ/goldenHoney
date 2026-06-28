'use client'
import { useEffect, useState, useMemo } from 'react'
import { Tag, Pencil, Trash2 } from 'lucide-react'
import {
  getCategories, createCategory, updateCategory, deleteCategory,
} from '@/lib/services/category.service'
import PageHeader from '@/components/admin/PageHeader'
import DataTable from '@/components/admin/DataTable'
import StatusBadge from '@/components/admin/StatusBadge'
import EmptyState from '@/components/admin/EmptyState'
import ConfirmModal from '@/components/admin/ConfirmModal'
import type { FSCategory } from '@/types/firebase'

type FormState = { name: string; slug: string; description: string; status: 'active' | 'inactive'; sortOrder: number }
const EMPTY: FormState = { name: '', slug: '', description: '', status: 'active', sortOrder: 0 }
function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }

export default function AdminCategoriesPage() {
  const [cats, setCats]       = useState<FSCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<FSCategory | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]         = useState<FormState>(EMPTY)
  const [saving, setSaving]     = useState(false)
  const [toDelete, setToDelete] = useState<FSCategory | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function load() {
    setLoading(true)
    const data = await getCategories()
    setCats(data)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  function openEdit(cat: FSCategory) {
    setEditing(cat)
    setForm({ name: cat.name, slug: cat.slug, description: cat.description ?? '', status: cat.status, sortOrder: cat.sortOrder })
    setShowForm(true)
  }
  function openNew() { setEditing(null); setForm(EMPTY); setShowForm(true) }
  function cancel() { setShowForm(false); setEditing(null); setForm(EMPTY) }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    if (editing) {
      await updateCategory(editing.id, { name: form.name, slug: form.slug, description: form.description, status: form.status, sortOrder: form.sortOrder })
    } else {
      await createCategory({ name: form.name, slug: form.slug, description: form.description, status: form.status, sortOrder: form.sortOrder } as Omit<FSCategory, 'id'>)
    }
    cancel(); setSaving(false); load()
  }

  async function handleDelete() {
    if (!toDelete) return
    setDeleting(true)
    await deleteCategory(toDelete.id)
    setToDelete(null); setDeleting(false); load()
  }

  const sorted = useMemo(() => [...cats].sort((a, b) => a.sortOrder - b.sortOrder), [cats])

  return (
    <div>
      <PageHeader title="Categories" description={`${cats.length} total`}>
        <button onClick={openNew}
          className="h-9 px-4 bg-honey text-onyx text-sm font-semibold rounded-xl hover:bg-honey-dark transition-[background-color] duration-150">
          + New Category
        </button>
      </PageHeader>

      {showForm && (
        <form onSubmit={handleSave} className="bg-white border border-black/6 rounded-card p-5 mb-5 space-y-4">
          <h3 className="font-semibold text-onyx text-sm">{editing ? 'Edit Category' : 'New Category'}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-onyx/50 mb-1.5">Name *</label>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: editing ? f.slug : slugify(e.target.value) }))} required
                className="w-full h-9 px-3 text-sm border border-onyx/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-honey/50 bg-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-onyx/50 mb-1.5">Slug *</label>
              <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} required
                className="w-full h-9 px-3 text-sm border border-onyx/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-honey/50 bg-white font-mono" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-onyx/50 mb-1.5">Description</label>
            <input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full h-9 px-3 text-sm border border-onyx/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-honey/50 bg-white" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-onyx/50 mb-1.5">Status</label>
              <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as 'active' | 'inactive' }))}
                className="w-full h-9 px-3 text-sm border border-onyx/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-honey/50 bg-white">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-onyx/50 mb-1.5">Sort Order</label>
              <input type="number" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))}
                className="w-full h-9 px-3 text-sm border border-onyx/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-honey/50 bg-white" />
            </div>
          </div>
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

      {!loading && sorted.length === 0 ? (
        <EmptyState icon={Tag} title="No categories yet" />
      ) : (
        <DataTable<FSCategory & Record<string, unknown>>
          loading={loading}
          keyField="id"
          data={sorted as (FSCategory & Record<string, unknown>)[]}
          columns={[
            { key: 'name', label: 'Name',
              render: (row) => {
                const c = row as FSCategory
                return (
                  <div>
                    <p className="text-sm font-medium text-onyx">{c.name}</p>
                    <p className="text-xs text-onyx/40 font-mono">{c.slug}</p>
                  </div>
                )
              }
            },
            { key: 'description', label: 'Description',
              render: (row) => <span className="text-sm text-onyx/50">{(row as FSCategory).description ?? '—'}</span> },
            { key: 'sortOrder', label: 'Sort', width: '60px',
              render: (row) => <span className="text-sm">{(row as FSCategory).sortOrder}</span> },
            { key: 'status', label: 'Status', width: '90px',
              render: (row) => <StatusBadge status={(row as FSCategory).status} /> },
            { key: 'actions', label: '', width: '80px',
              render: (row) => {
                const c = row as FSCategory
                return (
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-onyx/5 text-onyx/30 hover:text-onyx transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => setToDelete(c)} className="p-1.5 rounded-lg hover:bg-red-50 text-onyx/30 hover:text-red-500 transition-colors">
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
        title="Delete category?"
        message={`"${toDelete?.name}" will be permanently removed.`}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
        loading={deleting}
      />
    </div>
  )
}
