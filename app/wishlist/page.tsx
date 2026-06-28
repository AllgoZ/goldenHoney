'use client'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useWishlist } from '@/hooks/useWishlist'
import { useWishlistStore } from '@/store/wishlist'
import ProductCard from '@/components/product/ProductCard'

export default function WishlistPage() {
  const { count } = useWishlist()
  const items = useWishlistStore((s) => s.items)

  return (
    <main className="pt-24 pb-20 min-h-screen bg-parchment">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading font-bold text-3xl text-onyx mb-2">
          Wishlist
        </h1>
        <p className="text-onyx/40 mb-8">{count} saved {count === 1 ? 'product' : 'products'}</p>

        {count === 0 ? (
          <div className="text-center py-20">
            <Heart size={64} className="mx-auto text-onyx/10 mb-6" />
            <h2 className="font-heading font-semibold text-xl text-onyx mb-3">Nothing saved yet</h2>
            <p className="text-onyx/50 mb-8">Add products to your wishlist to save them for later</p>
            <Link href="/shop" className="inline-flex items-center gap-2 bg-honey text-onyx font-semibold px-6 py-3 rounded-xl hover:bg-honey-dark transition-colors">
              Browse Products
            </Link>
          </div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {items.map((item, i) => (
                <motion.div
                  key={item.product.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <ProductCard product={item.product} />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </main>
  )
}
