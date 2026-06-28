'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Check, Truck, ShieldCheck, Package } from 'lucide-react'
import type { FSProduct } from '@/types/firebase'
import { formatINR, discountPct } from '@/lib/utils'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import StarRating from '@/components/ui/StarRating'
import QuantitySelector from '@/components/ui/QuantitySelector'
import ProductCard from '@/components/product/ProductCard'

interface Props {
  product: FSProduct
  related: FSProduct[]
}

export default function ProductPageContent({ product, related }: Props) {
  const { addToCart } = useCart()
  const { toggle, has } = useWishlist()
  const wished = has(product.id)

  const [activeImage, setActiveImage] = useState(0)
  const [imgErr, setImgErr] = useState(false)
  const [selectedWeight, setSelectedWeight] = useState(product.weightOptions[0].label)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const activeOption =
    product.weightOptions.find((w) => w.label === selectedWeight) ?? product.weightOptions[0]
  const pct = discountPct(activeOption.price, activeOption.oldPrice)

  function handleAddToCart() {
    addToCart(product, selectedWeight, activeOption.price, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  return (
    <main className="pt-20 pb-20 bg-parchment min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-onyx/40 mb-8 pt-6">
          <Link href="/" className="hover:text-onyx transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-onyx transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-onyx">{product.name}</span>
        </nav>

        {/* Product layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Images */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square rounded-card overflow-hidden bg-white shadow-sm">
              {!imgErr && product.images.length > 0 ? (
                <Image
                  src={product.images[activeImage]}
                  alt={product.name}
                  fill
                  priority
                  onError={() => setImgErr(true)}
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-orange-100" />
              )}
              {product.badge && (
                <div className="absolute top-4 left-4">
                  <Badge label={product.badge} variant={product.badge} />
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => { setActiveImage(i); setImgErr(false) }}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === i ? 'border-honey' : 'border-transparent'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="font-heading font-bold text-3xl text-onyx mb-3">{product.name}</h1>
            <StarRating rating={product.rating} showCount count={product.reviewCount} className="mb-4" />
            <p className="text-onyx/60 leading-relaxed mb-6">{product.description}</p>

            {/* Weight / size options */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-onyx mb-3">
                Choose Size
                <span className="ml-2 text-onyx/40 font-normal text-xs">
                  (price updates automatically)
                </span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.weightOptions.map((opt) => {
                  const optPct = discountPct(opt.price, opt.oldPrice)
                  const isActive = selectedWeight === opt.label
                  return (
                    <button
                      key={opt.label}
                      onClick={() => setSelectedWeight(opt.label)}
                      className={`relative flex flex-col items-start px-4 py-3 rounded-xl border-2 transition-all min-w-[90px] ${
                        isActive
                          ? 'border-onyx bg-onyx text-white'
                          : 'border-onyx/15 text-onyx hover:border-onyx/40 bg-white'
                      }`}
                    >
                      <span className="font-semibold text-sm">{opt.label}</span>
                      <span className={`text-xs mt-0.5 ${isActive ? 'text-white/70' : 'text-onyx/50'}`}>
                        {formatINR(opt.price)}
                      </span>
                      {opt.oldPrice && (
                        <span className={`text-[10px] line-through ${isActive ? 'text-white/40' : 'text-onyx/30'}`}>
                          {formatINR(opt.oldPrice)}
                        </span>
                      )}
                      {optPct && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                          {optPct}%
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Live price display */}
            <motion.div
              key={selectedWeight}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-baseline gap-3 mb-6"
            >
              <span className="font-heading font-bold text-4xl text-onyx">
                {formatINR(activeOption.price)}
              </span>
              {activeOption.oldPrice && (
                <>
                  <span className="text-lg text-onyx/40 line-through">
                    {formatINR(activeOption.oldPrice)}
                  </span>
                  <Badge label={`${pct}% off`} variant="sale" />
                </>
              )}
            </motion.div>

            {/* Quantity */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-onyx mb-3">Quantity</p>
              <QuantitySelector value={quantity} onChange={setQuantity} />
              {quantity > 1 && (
                <p className="text-xs text-onyx/40 mt-2">
                  Total: <span className="font-semibold text-onyx">{formatINR(activeOption.price * quantity)}</span>
                </p>
              )}
            </div>

            {/* CTA row */}
            <div className="flex items-center gap-3 mb-6">
              <Button
                onClick={handleAddToCart}
                size="lg"
                fullWidth
                className={added ? 'bg-green-500 hover:bg-green-500 text-white' : ''}
              >
                {added ? (
                  <><Check size={18} /> Added to Cart</>
                ) : (
                  <><ShoppingCart size={18} /> Add to Cart</>
                )}
              </Button>
              <button
                onClick={() => toggle(product)}
                aria-label="Toggle wishlist"
                className="w-12 h-12 rounded-xl border-2 border-onyx/10 flex items-center justify-center hover:border-red-300 transition-colors shrink-0"
              >
                <Heart
                  size={20}
                  className={wished ? 'fill-red-500 stroke-red-500' : 'stroke-onyx/50'}
                />
              </button>
            </div>

            {/* Shipping info */}
            <div className="flex flex-col gap-2.5 p-4 bg-cream rounded-xl border border-honey/20">
              <div className="flex items-center gap-2 text-sm text-onyx/70">
                <Truck size={16} className="text-honey shrink-0" />
                <span>Ships within 3-5 business days</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-onyx/70">
                <ShieldCheck size={16} className="text-honey shrink-0" />
                <span>7-day return policy on unopened products</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-onyx/70">
                <Package size={16} className="text-honey shrink-0" />
                <span>Free shipping on orders above ₹999</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section>
            <h2 className="font-heading font-bold text-2xl text-onyx mb-6">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
