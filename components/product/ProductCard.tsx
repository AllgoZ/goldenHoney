'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingCart, Zap, X, Plus, Minus } from 'lucide-react'
import type { FSProduct } from '@/types/firebase'
import { formatINR, discountPct } from '@/lib/utils'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import { useAuthGate } from '@/hooks/useAuthGate'
import { useUIStore } from '@/store/ui'
import Badge from '@/components/ui/Badge'

interface ProductCardProps {
  product: FSProduct
  priority?: boolean
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const router = useRouter()
  const [imgErr, setImgErr] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [selectedWeight, setSelectedWeight] = useState(product.weightOptions[0].label)
  const [quantity, setQuantity] = useState(1)

  const { addToCart, items, removeItem, updateQuantity } = useCart()
  const { toggle, has } = useWishlist()
  const { requireAuth } = useAuthGate()
  const setGlobalPickerOpen = useUIStore((s) => s.setPickerOpen)
  const wished = has(product.id)

  const activeOption =
    product.weightOptions.find((w) => w.label === selectedWeight) ?? product.weightOptions[0]
  const pct         = discountPct(activeOption.price, activeOption.oldPrice)
  const cartItem     = items.find(
    (i) => String(i.product.id) === String(product.id) && i.selectedWeight === selectedWeight
  )
  const cartQty      = cartItem?.quantity ?? 0
  const isInCart     = cartQty > 0
  const isOutOfStock = activeOption.stock === 0
  const isLowStock   = activeOption.stock > 0 && activeOption.stock <= 3
  const maxQty       = Math.min(10, activeOption.stock || 10)

  function openPicker(e: React.MouseEvent) {
    e.preventDefault()
    requireAuth(() => {
      setPickerOpen(true)
      setGlobalPickerOpen(true)
    })
  }

  function handleSheetAdd(e: React.MouseEvent) {
    e.preventDefault()
    requireAuth(() => {
      addToCart(product, selectedWeight, activeOption.price, quantity)
      setPickerOpen(false)
      setGlobalPickerOpen(false)
      setQuantity(1)
    })
  }

  function handleSheetBuy(e: React.MouseEvent) {
    e.preventDefault()
    requireAuth(() => {
      if (!isInCart) addToCart(product, selectedWeight, activeOption.price, quantity)
      setPickerOpen(false)
      setGlobalPickerOpen(false)
      setQuantity(1)
      router.push('/cart')
    })
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault()
    toggle(product)
  }

  function closePicker(e: React.MouseEvent) {
    e.preventDefault()
    setPickerOpen(false)
    setGlobalPickerOpen(false)
    setQuantity(1)
  }

  function handleDecrement(e: React.MouseEvent) {
    e.preventDefault()
    if (cartQty <= 1) {
      removeItem(product.id, selectedWeight)
    } else {
      updateQuantity(product.id, selectedWeight, cartQty - 1)
    }
  }

  function handleIncrement(e: React.MouseEvent) {
    e.preventDefault()
    if (cartQty < maxQty) {
      updateQuantity(product.id, selectedWeight, cartQty + 1)
    }
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

            {/* Price row — pushed to bottom */}
            <div className="flex items-baseline gap-2 mb-1 mt-auto">
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

            {/* Stock status */}
            <div className="mb-3 min-h-[16px]">
              {isOutOfStock && (
                <span className="text-[11px] font-semibold text-red-500">Out of stock</span>
              )}
              {isLowStock && (
                <span className="text-[11px] font-semibold text-orange-500">
                  Only {activeOption.stock} left
                </span>
              )}
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
                          onClick={(e) => { e.preventDefault(); setQuantity(Math.min(Math.min(10, activeOption.stock || 10), quantity + 1)) }}
                          className="w-7 h-7 rounded-lg border border-onyx/15 flex items-center justify-center hover:bg-honey/10 transition-[background-color,opacity] duration-150 ease-out disabled:opacity-30"
                          disabled={quantity >= Math.min(10, activeOption.stock || 10)}
                        >
                          <Plus size={11} />
                        </button>
                        <span className="text-xs text-onyx/40 ml-auto">= {formatINR(activeOption.price * quantity)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleSheetAdd}
                        className="flex-1 h-8 rounded-lg bg-honey/15 text-onyx text-xs font-semibold border border-honey/40 hover:bg-honey/30 transition-[background-color] duration-150 flex items-center justify-center gap-1"
                      >
                        <ShoppingCart size={12} /> Add
                      </button>
                      <button
                        onClick={handleSheetBuy}
                        className="flex-1 h-8 rounded-lg bg-onyx text-white text-xs font-semibold hover:bg-onyx/80 transition-[background-color] duration-150 flex items-center justify-center gap-1"
                      >
                        <Zap size={12} /> Buy Now
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

            {/* Buy button / stepper */}
            {!pickerOpen && (
              <div className="flex gap-2">
                {isInCart ? (
                  <>
                    <div className="flex-1 flex items-center h-9 rounded-xl border-2 border-honey bg-honey/5">
                      <button
                        onClick={handleDecrement}
                        className="w-8 h-full flex-shrink-0 text-onyx hover:bg-honey/30 transition-[background-color] duration-150 flex items-center justify-center rounded-l-[10px]"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="flex-1 text-center text-sm font-bold text-onyx tabular-nums">
                        {cartQty}
                      </span>
                      <button
                        onClick={handleIncrement}
                        disabled={cartQty >= maxQty}
                        className="w-8 h-full flex-shrink-0 text-onyx hover:bg-honey/30 transition-[background-color] duration-150 flex items-center justify-center rounded-r-[10px] disabled:opacity-30"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <button
                      onClick={(e) => { e.preventDefault(); router.push('/cart') }}
                      className="flex-1 h-9 rounded-xl text-xs font-semibold bg-onyx text-white hover:bg-onyx/80 transition-[background-color] duration-150 ease-out flex items-center justify-center gap-1"
                    >
                      <ShoppingCart size={12} /> Cart
                    </button>
                  </>
                ) : (
                  <button
                    onClick={openPicker}
                    disabled={isOutOfStock}
                    className="flex-1 h-10 rounded-2xl text-sm font-semibold bg-onyx text-white shadow-[0_4px_16px_rgba(0,0,0,0.22)] active:scale-[0.97] active:shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition-[transform,box-shadow] duration-150 ease-out flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isOutOfStock ? 'Out of Stock' : 'Buy'}
                  </button>
                )}
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
                      onClick={(e) => { e.preventDefault(); setQuantity(Math.min(Math.min(10, activeOption.stock || 10), quantity + 1)) }}
                      disabled={quantity >= Math.min(10, activeOption.stock || 10)}
                      className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center disabled:opacity-30 active:scale-95 transition-transform"
                    >
                      <Plus size={14} className="text-onyx" />
                    </button>
                  </div>
                </div>

                {/* Total + Add / Buy Now buttons */}
                <div className="flex items-center gap-3">
                  <div className="shrink-0">
                    <p className="text-xs text-onyx/40">Total</p>
                    <p className="text-lg font-bold text-onyx">{formatINR(activeOption.price * quantity)}</p>
                  </div>
                  <div className="flex gap-2 flex-1">
                    <button
                      onClick={handleSheetAdd}
                      className="flex-1 h-12 rounded-2xl font-bold text-sm active:scale-95 transition-[background-color,transform] duration-150 ease-out flex items-center justify-center gap-2 bg-honey/15 text-onyx border-2 border-honey/30 hover:bg-honey/25"
                    >
                      <ShoppingCart size={16} /> Add
                    </button>
                    <button
                      onClick={handleSheetBuy}
                      className="flex-1 h-12 rounded-2xl font-bold text-sm active:scale-95 transition-[background-color,transform] duration-150 ease-out flex items-center justify-center gap-2 bg-onyx text-white shadow-lg shadow-onyx/20"
                    >
                      <Zap size={16} /> Buy Now
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
