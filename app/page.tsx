'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Star, ShieldCheck, Truck, Leaf } from 'lucide-react'
import Button from '@/components/ui/Button'
import ProductCard from '@/components/product/ProductCard'
import { getBestSellers } from '@/lib/services/product.service'
import type { FSProduct } from '@/types/firebase'

const TRUST_BADGES = [
  { icon: <ShieldCheck size={22} />, title: '100% Pure & Raw',      desc: 'Never heated, never filtered' },
  { icon: <Truck      size={22} />, title: 'Free Shipping ₹999+',   desc: 'Pan-India delivery' },
  { icon: <Leaf       size={22} />, title: 'Sustainably Sourced',   desc: 'Forest-to-door traceability' },
  { icon: <Star       size={22} />, title: '4.9★ Rated',            desc: '1,000+ verified reviews' },
]

export default function HomePage() {
  const [bestSellers, setBestSellers] = useState<FSProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBestSellers().then((products) => {
      setBestSellers(products.slice(0, 4))
      setLoading(false)
    })
  }, [])

  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {/* Mobile image (default), desktop image swapped via CSS */}
          <Image
            src="https://res.cloudinary.com/dhjcr3vdl/image/upload/v1782993653/golden-honey/wildhoney.webp"
            alt="Golden honey"
            fill
            priority
            className="object-cover block md:hidden"
          />
          <Image
            src="/hero-desktop.webp"
            alt="Golden honey"
            fill
            priority
            className="object-cover hidden md:block"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-onyx/60 via-onyx/30 to-cream/80" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-block bg-honey/20 text-honey border border-honey/30 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-chip mb-6 backdrop-blur-sm">
              Pure · Raw · Unfiltered
            </span>
            <h1 className="font-heading font-bold text-5xl sm:text-6xl lg:text-7xl text-white leading-tight mb-6">
              Liquid Gold<br />
              <span className="text-gradient-honey">from the Forest</span>
            </h1>
            <p className="text-white/80 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl mx-auto">
              Cold-extracted raw honey and handcrafted wooden toys — sourced with care,
              delivered to your door.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div
                className="rounded-full"
                animate={{ boxShadow: ['0 0 0px 0px rgba(246,196,83,0)', '0 0 22px 8px rgba(246,196,83,0.55)', '0 0 0px 0px rgba(246,196,83,0)'] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Link href="/shop">
                  <Button size="lg" className="min-w-[180px]">
                    Shop Now <ArrowRight size={18} />
                  </Button>
                </Link>
              </motion.div>
              <Link href="/about">
                <Button variant="ghost" size="lg" className="text-white hover:text-white hover:bg-white/15 min-w-[160px]">
                  Our Story
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 text-xs flex flex-col items-center gap-2"
        >
          <div className="w-px h-8 bg-white/30" />
          scroll
        </motion.div>
      </section>

      {/* Trust badges */}
      <section className="bg-cream border-y border-honey/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_BADGES.map((b) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex items-start gap-3"
              >
                <span className="text-honey mt-0.5">{b.icon}</span>
                <div>
                  <p className="font-semibold text-sm text-onyx">{b.title}</p>
                  <p className="text-xs text-onyx/50">{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-20 bg-parchment">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-12"
          >
            <h2 className="font-heading font-bold text-4xl text-onyx mb-3">Our Best Sellers</h2>
            <p className="text-onyx/50 text-lg">Loved by thousands of families across India</p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-96 bg-white rounded-card animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {bestSellers.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full"
                >
                  <ProductCard product={p} priority={i < 2} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link href="/shop">
              <Button variant="outline" size="lg">
                View All Products <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-12"
          >
            <h2 className="font-heading font-bold text-4xl text-onyx mb-3">Shop by Category</h2>
            <p className="text-onyx/50 text-lg">Discover our collections</p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { href: '/shop?cat=honey', label: 'Honey',           emoji: '🍯', bg: 'from-amber-100 to-amber-200' },
              { href: '/shop?cat=rare',  label: 'Rare Collection',  emoji: '✨', bg: 'from-yellow-100 to-orange-200' },
              { href: '/shop?cat=toys',  label: 'Wooden Toys',      emoji: '🧸', bg: 'from-orange-100 to-amber-100' },
              { href: '/shop?cat=gifts', label: 'Gift Boxes',       emoji: '🎁', bg: 'from-rose-100 to-pink-100'   },
            ].map((c, i) => (
              <motion.div
                key={c.href}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={c.href}
                  className={`flex flex-col items-center justify-center gap-3 rounded-card bg-gradient-to-br ${c.bg} aspect-square hover:shadow-md hover:scale-[1.02] transition-[box-shadow,transform] duration-300 ease-out border border-black/5`}
                >
                  <span className="text-5xl">{c.emoji}</span>
                  <span className="font-heading font-semibold text-onyx text-sm">{c.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-onyx relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #F6C453, transparent 70%)' }} />
        <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="font-heading font-bold text-4xl text-white mb-4">
              Free Shipping on Orders Over{' '}
              <span className="text-honey">₹999</span>
            </h2>
            <p className="text-white/60 text-lg mb-8">
              Join 10,000+ happy customers who have discovered the purest honey in India.
            </p>
            <Link href="/shop">
              <Button size="lg" className="min-w-[200px]">
                Shop Now <ArrowRight size={18} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
