'use client'
import { Suspense, useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, Search, X, ShoppingCart, ArrowRight } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import { getProducts } from '@/lib/services/product.service'
import { getCategories } from '@/lib/services/category.service'
import { useCart } from '@/hooks/useCart'
import { formatINR } from '@/lib/utils'
import type { FSProduct, FSCategory } from '@/types/firebase'

function ShopContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [products, setProducts] = useState<FSProduct[]>([])
  const [categories, setCategories] = useState<FSCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCat, setActiveCat] = useState(searchParams.get('cat') ?? 'all')
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default')
  const [search, setSearch] = useState('')

  const { items } = useCart()
  const cartCount = items.reduce((s, i) => s + i.quantity, 0)
  const cartTotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ])
        setProducts(productsData)
        setCategories(categoriesData)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products')
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filtered = useMemo(() => {
    let list = activeCat === 'all'
      ? products
      : products.filter((p) => p.categorySlug === activeCat)

    if (search) {
      const q = search.toLowerCase()
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        (p.shortDescription ?? '').toLowerCase().includes(q) ||
        p.categorySlug.toLowerCase().includes(q)
      )
    }

    if (sortBy === 'price-asc')  list = [...list].sort((a, b) => a.price - b.price)
    if (sortBy === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
    if (sortBy === 'rating')     list = [...list].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))

    return list
  }, [products, activeCat, sortBy, search])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-heading font-bold text-4xl text-onyx mb-2">Our Products</h1>
        {!loading && (
          <p className="text-onyx/50">
            {filtered.length} product{filtered.length !== 1 ? 's' : ''}
            {search ? ` for "${search}"` : ''}
          </p>
        )}
      </div>

      {/* Search bar */}
      {!loading && (
        <div className="relative mb-6">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-onyx/30 pointer-events-none" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search honey, wooden toys…"
            className="w-full h-12 pl-10 pr-10 text-sm font-medium bg-white border-2 border-onyx/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-honey/60 focus:border-honey text-onyx placeholder:text-onyx/35 placeholder:font-normal"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-onyx/30 hover:text-onyx/60 transition-colors"
            >
              <X size={15} />
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-card mb-8">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-96 bg-white rounded-card animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCat('all')}
                className={`px-4 py-2 rounded-chip text-sm font-medium transition-[background-color,border-color,color,transform] duration-150 ease-out ${
                  activeCat === 'all'
                    ? 'bg-onyx text-white'
                    : 'bg-white border border-onyx/10 text-onyx/60 hover:border-onyx/30'
                }`}
              >
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCat(c.slug)}
                  className={`px-4 py-2 rounded-chip text-sm font-medium transition-[background-color,border-color,color,transform] duration-150 ease-out capitalize ${
                    activeCat === c.slug
                      ? 'bg-onyx text-white'
                      : 'bg-white border border-onyx/10 text-onyx/60 hover:border-onyx/30'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-onyx/40" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="text-sm border border-onyx/10 rounded-xl px-3 py-2 bg-white text-onyx focus:outline-none focus:ring-2 focus:ring-honey"
              >
                <option value="default">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCat + sortBy + search}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
            >
              {filtered.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.035, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full"
                >
                  <ProductCard product={p} priority={i < 4} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-onyx/40">
              <p className="text-5xl mb-4">🍯</p>
              <p className="text-lg font-medium">
                {search ? `No products found for "${search}"` : 'No products found'}
              </p>
              {search && (
                <button onClick={() => setSearch('')} className="mt-3 text-sm text-honey-dark hover:underline">
                  Clear search
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* Floating cart bar — slides up when cart has items */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div
            initial={{ y: 120 }}
            animate={{ y: 0 }}
            exit={{ y: 120 }}
            transition={{ type: 'spring', stiffness: 420, damping: 36 }}
            className="fixed bottom-4 left-4 right-4 z-50 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:w-[420px]"
          >
            <div className="bg-onyx text-white rounded-2xl shadow-2xl shadow-onyx/30 flex items-center gap-3 px-4 py-3">
              <div className="w-10 h-10 rounded-xl bg-honey flex items-center justify-center flex-shrink-0">
                <ShoppingCart size={18} className="text-onyx" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold leading-tight">
                  {cartCount} item{cartCount !== 1 ? 's' : ''} in cart
                </p>
                <p className="text-xs text-white/50">{formatINR(cartTotal)}</p>
              </div>
              <button
                onClick={() => router.push('/cart')}
                className="h-10 px-4 rounded-xl bg-honey text-onyx text-sm font-bold flex items-center gap-1.5 hover:bg-honey-dark transition-[background-color] duration-150 flex-shrink-0"
              >
                Go to Cart <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function ShopPage() {
  return (
    <main className="pt-24 pb-20 min-h-screen bg-parchment">
      <Suspense fallback={<div className="pt-24 text-center text-onyx/40">Loading...</div>}>
        <ShopContent />
      </Suspense>
    </main>
  )
}
