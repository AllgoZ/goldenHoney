'use client'
import { Suspense, useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import { getProducts } from '@/lib/services/product.service'
import { getCategories } from '@/lib/services/category.service'
import type { FSProduct, FSCategory } from '@/types/firebase'

function ShopContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<FSProduct[]>([])
  const [categories, setCategories] = useState<FSCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCat, setActiveCat] = useState(searchParams.get('cat') ?? 'all')
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default')

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

    if (sortBy === 'price-asc')  list = [...list].sort((a, b) => a.price - b.price)
    if (sortBy === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
    if (sortBy === 'rating')     list = [...list].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))

    return list
  }, [products, activeCat, sortBy])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="font-heading font-bold text-4xl text-onyx mb-2">Our Products</h1>
        {!loading && <p className="text-onyx/50">{filtered.length} products</p>}
      </div>

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
              key={activeCat + sortBy}
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
              <p className="text-lg font-medium">No products found</p>
            </div>
          )}
        </>
      )}
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
