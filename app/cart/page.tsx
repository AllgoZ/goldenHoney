'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { formatINR } from '@/lib/utils'
import Button from '@/components/ui/Button'
import QuantitySelector from '@/components/ui/QuantitySelector'

export default function CartPage() {
  const { items, removeItem, updateQuantity, itemCount, subtotal, shipping, tax, total } = useCart()

  if (itemCount === 0) {
    return (
      <main className="pt-24 pb-20 min-h-screen bg-parchment flex items-center justify-center">
        <div className="text-center px-6">
          <ShoppingBag size={64} className="mx-auto text-onyx/20 mb-6" />
          <h1 className="font-heading font-bold text-3xl text-onyx mb-3">Your cart is empty</h1>
          <p className="text-onyx/50 mb-8">Add some products to get started</p>
          <Link href="/shop">
            <Button size="lg">Continue Shopping</Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="pt-24 pb-20 min-h-screen bg-parchment">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading font-bold text-3xl text-onyx mb-8">
          Your Cart <span className="text-onyx/30 text-xl font-normal">({itemCount} items)</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div
                  key={`${item.product.id}-${item.selectedWeight}`}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0, overflow: 'hidden' }}
                  transition={{ duration: 0.2 }}
                  className="flex gap-4 bg-white rounded-xl p-4 border border-black/5 shadow-sm"
                >
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-cream">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${item.product.slug}`}
                      className="font-heading font-semibold text-sm text-onyx hover:text-honey-dark transition-colors line-clamp-2"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-onyx/40 mt-0.5">{item.selectedWeight}</p>
                    <p className="font-bold text-sm text-onyx mt-2">{formatINR(item.unitPrice)}</p>

                    <div className="flex items-center justify-between mt-3">
                      <QuantitySelector
                        value={item.quantity}
                        size="sm"
                        onChange={(q) => updateQuantity(item.product.id, item.selectedWeight, q)}
                      />
                      <button
                        onClick={() => removeItem(item.product.id, item.selectedWeight)}
                        className="text-onyx/30 hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="font-bold text-base text-onyx">{formatINR(item.unitPrice * item.quantity)}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 border border-black/5 shadow-sm sticky top-24">
              <h2 className="font-heading font-semibold text-lg text-onyx mb-5">Order Summary</h2>

              <div className="flex flex-col gap-3 mb-5 text-sm">
                <div className="flex justify-between text-onyx/60">
                  <span>Subtotal</span>
                  <span>{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-onyx/60">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                    {shipping === 0 ? 'Free' : formatINR(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-onyx/60">
                  <span>GST (9%)</span>
                  <span>{formatINR(tax)}</span>
                </div>
                <div className="border-t border-black/5 pt-3 flex justify-between font-bold text-base text-onyx">
                  <span>Total</span>
                  <span>{formatINR(total)}</span>
                </div>
              </div>

              {shipping > 0 && (
                <p className="text-xs text-onyx/40 mb-4">
                  Add {formatINR(999 - subtotal)} more for free shipping
                </p>
              )}

              <Link href="/checkout">
                <Button size="lg" fullWidth>
                  Proceed to Checkout <ArrowRight size={18} />
                </Button>
              </Link>

              <Link href="/shop" className="block text-center mt-4 text-sm text-onyx/40 hover:text-onyx transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
