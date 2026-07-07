'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { createProduct } from '@/lib/services/product.service'
import { getCategories } from '@/lib/services/category.service'
import ImageUpload from '@/components/admin/ImageUpload'
import { deleteFile } from '@/lib/services/storage.service'
import type { FSCategory, FSWeightOption, ProductBadge, ProductStatus } from '@/types/firebase'

const STATUSES: ProductStatus[] = ['active', 'draft', 'archived']
const BADGES: (ProductBadge | '')[] = ['', 'bestseller', 'limited', 'new', 'sale']

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function NewProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<FSCategory[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  const [name, setName]           = useState('')
  const [slug, setSlug]           = useState('')
  const [shortDesc, setShortDesc] = useState('')
  const [desc, setDesc]           = useState('')
  const [category, setCategory]   = useState('')
  const [status, setStatus]       = useState<ProductStatus>('active')
  const [badge, setBadge]         = useState<ProductBadge | ''>('')
  const [featured, setFeatured]   = useState(false)
  const [bestSeller, setBestSeller] = useState(false)
  const [images, setImages]       = useState<string[]>([])
  const [seoTitle, setSeoTitle]   = useState('')
  const [seoDesc, setSeoDesc]     = useState('')
  const [weights, setWeights]     = useState<FSWeightOption[]>([
    { label: '250g', price: 0, stock: 0, sku: '' },
  ])

  useEffect(() => {
    getCategories().then((cats) => {
      setCategories(cats)
      if (cats.length > 0) setCategory(cats[0].slug)
    })
  }, [])

  function addWeight() {
    setWeights((w) => [...w, { label: '', price: 0, stock: 0, sku: '' }])
  }
  function removeWeight(i: number) {
    setWeights((w) => w.filter((_, idx) => idx !== i))
  }
  function updateWeight(i: number, field: keyof FSWeightOption, value: string | number) {
    setWeights((w) => w.map((opt, idx) => idx === i ? { ...opt, [field]: value } : opt))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !slug || weights.length === 0) {
      setError('Name, slug, and at least one weight option are required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const sanitizedWeights = weights.map((w) => {
        const opt: FSWeightOption = { label: w.label, price: w.price, stock: w.stock, sku: w.sku }
        if (w.oldPrice !== undefined) opt.oldPrice = w.oldPrice
        return opt
      })

      const data: Parameters<typeof createProduct>[0] = {
        name, slug,
        shortDescription: shortDesc,
        description:      desc,
        categoryId:       category,
        categorySlug:     category,
        weightOptions:    sanitizedWeights,
        price:            sanitizedWeights.length ? Math.min(...sanitizedWeights.map((w) => w.price)) : 0,
        images,
        featured,
        bestSeller,
        status,
        rating:      0,
        reviewCount: 0,
      }
      if (badge)    data.badge          = badge
      if (seoTitle) data.seoTitle       = seoTitle
      if (seoDesc)  data.seoDescription = seoDesc

      await createProduct(data)
      router.push('/admin/products')
    } catch (err) {
      console.error('Product save error:', err)
      setError('Failed to save product. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/products" className="p-1.5 rounded-lg hover:bg-onyx/5 text-onyx/40 hover:text-onyx transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <h2 className="font-heading font-bold text-xl text-onyx">New Product</h2>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">{error}</div>}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic info */}
        <div className="bg-white rounded-card border border-black/6 p-5 space-y-4">
          <h3 className="font-semibold text-onyx text-sm">Basic Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-onyx/50 mb-1.5">Product Name *</label>
              <input value={name} onChange={(e) => { setName(e.target.value); setSlug(slugify(e.target.value)) }}
                className="w-full h-9 px-3 text-sm border border-onyx/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-honey/50 bg-white"
                placeholder="Golden Forest Honey" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-onyx/50 mb-1.5">Slug *</label>
              <input value={slug} onChange={(e) => setSlug(e.target.value)}
                className="w-full h-9 px-3 text-sm border border-onyx/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-honey/50 bg-white font-mono"
                placeholder="golden-forest-honey" required />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-onyx/50 mb-1.5">Short Description</label>
            <input value={shortDesc} onChange={(e) => setShortDesc(e.target.value)}
              className="w-full h-9 px-3 text-sm border border-onyx/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-honey/50 bg-white"
              placeholder="One-line product summary" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-onyx/50 mb-1.5">Description</label>
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={4}
              className="w-full px-3 py-2 text-sm border border-onyx/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-honey/50 bg-white resize-none" />
          </div>
        </div>

        {/* Category & status */}
        <div className="bg-white rounded-card border border-black/6 p-5">
          <h3 className="font-semibold text-onyx text-sm mb-4">Classification</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-onyx/50 mb-1.5">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full h-9 px-3 text-sm border border-onyx/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-honey/50 bg-white capitalize">
                {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-onyx/50 mb-1.5">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as ProductStatus)}
                className="w-full h-9 px-3 text-sm border border-onyx/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-honey/50 bg-white capitalize">
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-onyx/50 mb-1.5">Badge</label>
              <select value={badge} onChange={(e) => setBadge(e.target.value as ProductBadge | '')}
                className="w-full h-9 px-3 text-sm border border-onyx/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-honey/50 bg-white capitalize">
                {BADGES.map((b) => <option key={b} value={b}>{b || 'None'}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-6 mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 accent-honey rounded" />
              <span className="text-sm text-onyx/70">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={bestSeller} onChange={(e) => setBestSeller(e.target.checked)}
                className="w-4 h-4 accent-honey rounded" />
              <span className="text-sm text-onyx/70">Best Seller</span>
            </label>
          </div>
        </div>

        {/* Weight options */}
        <div className="bg-white rounded-card border border-black/6 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-onyx text-sm">Weight / Size Options</h3>
            <button type="button" onClick={addWeight}
              className="text-xs text-honey font-semibold flex items-center gap-1 hover:text-honey-dark transition-colors">
              <Plus size={13} /> Add variant
            </button>
          </div>
          <div className="space-y-3">
            {weights.map((w, i) => (
              <div key={i} className="grid grid-cols-2 sm:grid-cols-5 gap-3 items-center">
                <input value={w.label} onChange={(e) => updateWeight(i, 'label', e.target.value)}
                  placeholder="250g" className="h-9 px-3 text-sm border border-onyx/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-honey/50 bg-white" />
                <input type="number" value={w.price || ''} onChange={(e) => updateWeight(i, 'price', Number(e.target.value))}
                  placeholder="Price ₹" className="h-9 px-3 text-sm border border-onyx/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-honey/50 bg-white" />
                <input type="number" value={w.oldPrice || ''} onChange={(e) => updateWeight(i, 'oldPrice', e.target.value ? Number(e.target.value) : '')}
                  placeholder="Old price" className="h-9 px-3 text-sm border border-onyx/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-honey/50 bg-white" />
                <input type="number" value={w.stock || ''} onChange={(e) => updateWeight(i, 'stock', Number(e.target.value))}
                  placeholder="Stock" className="h-9 px-3 text-sm border border-onyx/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-honey/50 bg-white" />
                <button type="button" onClick={() => removeWeight(i)} disabled={weights.length === 1}
                  className="col-span-2 sm:col-span-1 w-9 h-9 rounded-xl border border-onyx/10 flex items-center justify-center text-onyx/30 hover:text-red-500 hover:border-red-200 transition-colors disabled:opacity-30">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-card border border-black/6 p-5">
          <h3 className="font-semibold text-onyx text-sm mb-4">Images (max 5)</h3>
          <div className="flex flex-wrap gap-3">
            {images.map((url, i) => (
              <ImageUpload key={url} folder="products" value={url}
                onChange={(newUrl) => setImages((imgs) => imgs.map((u, idx) => idx === i ? newUrl : u))}
                onRemove={() => {
                  deleteFile(url).catch(() => {})
                  setImages((imgs) => imgs.filter((_, idx) => idx !== i))
                }}
              />
            ))}
            {images.length < 5 && (
              <ImageUpload folder="products" onChange={(url) => setImages((imgs) => [...imgs, url])} />
            )}
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white rounded-card border border-black/6 p-5 space-y-4">
          <h3 className="font-semibold text-onyx text-sm">SEO (optional)</h3>
          <div>
            <label className="block text-xs font-semibold text-onyx/50 mb-1.5">SEO Title</label>
            <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)}
              className="w-full h-9 px-3 text-sm border border-onyx/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-honey/50 bg-white" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-onyx/50 mb-1.5">SEO Description</label>
            <textarea value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} rows={2}
              className="w-full px-3 py-2 text-sm border border-onyx/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-honey/50 bg-white resize-none" />
          </div>
        </div>

        <div className="flex gap-3">
          <Link href="/admin/products"
            className="flex-1 h-10 rounded-xl border border-onyx/10 text-sm font-medium text-onyx/70 hover:bg-onyx/4 transition-colors flex items-center justify-center">
            Cancel
          </Link>
          <button type="submit" disabled={saving}
            className="flex-1 h-10 bg-honey text-onyx text-sm font-semibold rounded-xl hover:bg-honey-dark transition-[background-color] duration-150 disabled:opacity-60 flex items-center justify-center gap-2">
            {saving && <span className="w-4 h-4 border-2 border-onyx/30 border-t-onyx rounded-full animate-spin" />}
            Save Product
          </button>
        </div>
      </form>
    </div>
  )
}
