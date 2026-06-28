'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingCart, Zap, Check, X, Plus, Minus } from 'lucide-react'
import type { FSProduct } from '@/types/firebase'
import { formatINR, discountPct } from '@/lib/utils'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import { useAuthGate } from '@/hooks/useAuthGate'
import StarRating from '@/components/ui/StarRating'
import Badge from '@/components/ui/Badge'

interface ProductCardProps {
  product: FSProduct
  priority?: boolean
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const router = useRouter()
  const [imgErr, setImgErr] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerMode, setPickerMode] = useState<'add' | 'buy'>('add')
  const [added, setAdded] = useState(false)
  const [selectedWeight, setSelectedWeight] = useState(product.weightOptions[0].label)
  const [quantity, setQuantity] = useState(1)

  const { addToCart } = useCart()
  const { toggle, has } = useWishlist()
  const { requireAuth } = useAuthGate()
  const wished = has(product.id)

  const activeOption =
    product.weightOptions.find((w) => w.label === selectedWeight) ?? product.weightOptions[0]
  const pct = discountPct(activeOption.price, activeOption.oldPrice)

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    requireAuth(() => {
      if (product.weightOptions.length === 1) {
        addToCart(product, activeOption.label, activeOption.price, 1)
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
      } else {
        setPickerMode('add')
        setPickerOpen(true)
      }
    })
  }

  function handleBuy(e: React.MouseEvent) {
    e.preventDefault()
    requireAuth(() => {
      if (product.weightOptions.length === 1) {
        addToCart(product, activeOption.label, activeOption.price, 1)
        router.push('/checkout')
      } else {
        setPickerMode('buy')
        setPickerOpen(true)
      }
    })
  }

  function handleConfirm(e: React.MouseEvent) {
    e.preventDefault()
    requireAuth(() => {
      addToCart(product, selectedWeight, activeOption.price, quantity)
      setPickerOpen(false)
      setQuantity(1)
      if (pickerMode === 'buy') {
        router.push('/checkout')
      } else {
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
      }
    })
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault()
    toggle(product)
  }

  function closePicker(e: React.MouseEvent) {
    e.preventDefault()
    setPickerOpen(false)
    setQuantity(1)
  }

  return (
    <>
      <motion.div whileHover={{ y: pickerOpen ? 0 : -4 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} className="group h-full">
        <Link
          href={`/product/${product.slug}`}
          className="flex flex-col h-full bg-white rounded-card overflow-hidden shadow-sm hover:shadow-lg transition-[box-shadow] duration-300 ease-out border border-black/5"
        >
          {/* Image */}
          <div className="relative aspect-square overflow-hidden">
            {!imgErr && product.images?.length > 0 ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                priority={priority}
                onError={() => setImgErr(true)}
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-orange-100" />
            )}

            {product.badge && (
              <div className="absolute top-3 left-3">
                <Badge label={product.badge} variant={product.badge} />
              </div>
            )}
            {pct && !product.badge && (
              <div className="absolute top-3 left-3">
                <Badge label={`${pct}% off`} variant="sale" />
              </div>
            )}

            {/* Wishlist */}
            <button
              onClick={handleWishlist}
              aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
              className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-[opacity,transform] duration-200 ease-out hover:scale-110"
            >
              <Heart size={16} className={wished ? 'fill-red-500 stroke-red-500' : 'stroke-onyx/60'} />
            </button>
          </div>

          {/* Info */}
          <div className="flex flex-col flex-1 p-3 md:p-4">
            <h3 className="font-heading font-semibold text-onyx text-sm leading-tight mb-2 line-clamp-2">
              {product.name}
            </h3>
            <StarRating rating={product.rating} size="sm" showCount count={product.reviewCount} />

            {/* Price row — pushed to bottom */}
            <div className="flex items-baseline gap-2 mb-3 mt-auto">
              <span className="font-bold text-base text-onyx">
                {formatINR(activeOption.price)}
              </span>
              {activeOption.oldPrice && (
                <span className="text-xs text-onyx/40 line-through">
                  {formatINR(activeOption.oldPrice)}
                </span>
              )}
              <span className="text-xs text-onyx/30 ml-auto">{activeOption.label}</span>
            </div>

            {/* Desktop inline picker — hidden on mobile */}
            <AnimatePresence>
              {pickerOpen && (
                <motion.div
                  key="picker-desktop"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 32, mass: 0.8 }}
                  className="hidden md:block overflow-hidden"
                >
                  <div className="pt-1 pb-3 border-t border-black/5 mt-1">
                    {product.weightOptions.length > 1 && (
                      <div className="mb-3">
                        <p className="text-[11px] font-semibold text-onyx/50 uppercase tracking-wider mb-2">Size</p>
                        <div className="flex flex-wrap gap-1.5">
                          {product.weightOptions.map((opt) => (
                            <button
                              key={opt.label}
                              onClick={(e) => { e.preventDefault(); setSelectedWeight(opt.label) }}
                              className={`flex flex-col items-center px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-[background-color,border-color,color] duration-150 ease-out ${
                                selectedWeight === opt.label
                                  ? 'border-onyx bg-onyx text-white'
                                  : 'border-onyx/15 text-onyx/70 hover:border-onyx/40'
                              }`}
                            >
                              <span>{opt.label}</span>
                              <span className={`text-[10px] ${selectedWeight === opt.label ? 'text-white/60' : 'text-onyx/40'}`}>
                                {formatINR(opt.price)}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mb-3">
                      <p className="text-[11px] font-semibold text-onyx/50 uppercase tracking-wider mb-2">Qty</p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => { e.preventDefault(); setQuantity(Math.max(1, quantity - 1)) }}
                          className="w-7 h-7 rounded-lg border border-onyx/15 flex items-center justify-center hover:bg-honey/10 transition-[background-color,opacity] duration-150 ease-out disabled:opacity-30"
                          disabled={quantity <= 1}
                        >
                          <Minus size={11} />
                        </button>
                        <span className="w-5 text-center text-sm font-semibold text-onyx">{quantity}</span>
                        <button
                          onClick={(e) => { e.preventDefault(); setQuantity(Math.min(10, quantity + 1)) }}
                          className="w-7 h-7 rounded-lg border border-onyx/15 flex items-center justify-center hover:bg-honey/10 transition-[background-color,opacity] duration-150 ease-out disabled:opacity-30"
                          disabled={quantity >= 10}
                        >
                          <Plus size={11} />
                        </button>
                        <span className="text-xs text-onyx/40 ml-auto">= {formatINR(activeOption.price * quantity)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleConfirm}
                        className="flex-1 h-8 rounded-lg bg-honey text-onyx text-xs font-semibold hover:bg-honey-dark transition-colors flex items-center justify-center gap-1"
                      >
                        {pickerMode === 'buy'
                          ? <><Zap size={12} /> Buy Now</>
                          : <><ShoppingCart size={12} /> Add</>
                        }
                      </button>
                      <button
                        onClick={closePicker}
                        className="w-8 h-8 rounded-lg border border-onyx/10 flex items-center justify-center text-onyx/40 hover:text-onyx/70 transition-colors"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Add / Buy buttons */}
            {!pickerOpen && (
              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  className={`flex-1 h-9 rounded-xl text-xs font-semibold transition-[background-color,transform] duration-150 ease-out ${
                    added
                      ? 'bg-green-500 text-white'
                      : 'bg-honey text-onyx hover:bg-honey-dark'
                  }`}
                >
                  {added ? (
                    <span className="flex items-center justify-center gap-1">
                      <Check size={12} /> Added
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-1">
                      <ShoppingCart size={12} /> Add
                    </span>
                  )}
                </button>
                <button
                  onClick={handleBuy}
                  className="flex-1 h-9 rounded-xl text-xs font-semibold bg-onyx text-white hover:bg-onyx/80 transition-[background-color] duration-150 ease-out flex items-center justify-center gap-1"
                >
                  <Zap size={12} /> Buy
                </button>
              </div>
            )}
          </div>
        </Link>
      </motion.div>

      {/* Mobile bottom sheet */}
      <AnimatePresence>
        {pickerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
              onClick={closePicker}
            />

            {/* Sheet */}
            <motion.div
              key="sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 36, mass: 0.9 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl md:hidden"
              onClick={(e) => e.preventDefault()}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-onyx/10" />
              </div>

              <div className="px-5 pb-8 pt-2">
                {/* Product row */}
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-black/6">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-cream">
                    {!imgErr ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-orange-100" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-semibold text-onyx text-sm leading-tight truncate">{product.name}</p>
                  </div>
                  <button
                    onClick={closePicker}
                    className="w-8 h-8 rounded-full bg-onyx/5 flex items-center justify-center flex-shrink-0"
                  >
                    <X size={15} className="text-onyx/50" />
                  </button>
                </div>

                {/* Size */}
                {product.weightOptions.length > 1 && (
                  <div className="mb-5">
                    <p className="text-xs font-semibold text-onyx/50 uppercase tracking-wider mb-3">Select Size</p>
                    <div className="grid grid-cols-3 gap-2">
                      {product.weightOptions.map((opt) => (
                        <button
                          key={opt.label}
                          onClick={(e) => { e.preventDefault(); setSelectedWeight(opt.label) }}
                          className={`flex flex-col items-center py-2.5 rounded-xl border-2 transition-[background-color,border-color,color,transform] duration-150 ease-out ${
                            selectedWeight === opt.label
                              ? 'border-onyx bg-onyx text-white'
                              : 'border-onyx/10 text-onyx hover:border-onyx/30 bg-onyx/2'
                          }`}
                        >
                          <span className="text-sm font-bold">{opt.label}</span>
                          <span className={`text-xs mt-0.5 ${selectedWeight === opt.label ? 'text-white/60' : 'text-onyx/50'}`}>
                            {formatINR(opt.price)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="mb-6">
                  <p className="text-xs font-semibold text-onyx/50 uppercase tracking-wider mb-3">Quantity</p>
                  <div className="flex items-center justify-between bg-onyx/4 rounded-2xl p-1.5">
                    <button
                      onClick={(e) => { e.preventDefault(); setQuantity(Math.max(1, quantity - 1)) }}
                      disabled={quantity <= 1}
                      className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center disabled:opacity-30 active:scale-95 transition-transform"
                    >
                      <Minus size={14} className="text-onyx" />
                    </button>
                    <span className="text-lg font-bold text-onyx tabular-nums">{quantity}</span>
                    <button
                      onClick={(e) => { e.preventDefault(); setQuantity(Math.min(10, quantity + 1)) }}
                      disabled={quantity >= 10}
                      className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center disabled:opacity-30 active:scale-95 transition-transform"
                    >
                      <Plus size={14} className="text-onyx" />
                    </button>
                  </div>
                </div>

                {/* Total + Add / Buy buttons */}
                <div className="flex items-center gap-3">
                  <div className="shrink-0">
                    <p className="text-xs text-onyx/40">Total</p>
                    <p className="text-lg font-bold text-onyx">{formatINR(activeOption.price * quantity)}</p>
                  </div>
                  <div className="flex gap-2 flex-1">
                    <button
                      onClick={handleConfirm}
                      className={`flex-1 h-12 rounded-2xl font-bold text-sm active:scale-95 transition-[background-color,transform] duration-150 ease-out flex items-center justify-center gap-2 shadow-lg ${
                        pickerMode === 'buy'
                          ? 'bg-onyx text-white shadow-onyx/20'
                          : 'bg-honey text-onyx shadow-honey/30 hover:bg-honey-dark'
                      }`}
                    >
                      {pickerMode === 'buy'
                        ? <><Zap size={16} /> Buy Now</>
                        : <><ShoppingCart size={16} /> Add</>
                      }
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
