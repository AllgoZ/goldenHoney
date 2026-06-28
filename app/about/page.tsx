'use client'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Leaf, Heart, Star } from 'lucide-react'
import Button from '@/components/ui/Button'

const HERO = 'https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=1200&q=80'
const FOREST = 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=800&q=80'

const VALUES = [
  {
    icon: <Leaf size={24} />,
    title: 'Sustainability First',
    desc: 'We work only with beekeepers who practice regenerative, sustainable beekeeping — protecting both the bees and the ecosystems they depend on.',
  },
  {
    icon: <Heart size={24} />,
    title: 'Craft & Care',
    desc: 'Every jar of honey and every wooden toy is made with the same care a craftsperson puts into their finest work. We never rush, never compromise.',
  },
  {
    icon: <Star size={24} />,
    title: 'Radical Transparency',
    desc: 'We share where every product comes from, how it\'s made, and who made it. No mystery ingredients, no hidden processes.',
  },
]

const TEAM = [
  { name: 'Arjun Menon',     role: 'Founder & Head Beekeeper',    initial: 'AM' },
  { name: 'Divya Krishnan',  role: 'Head of Product & Sourcing',   initial: 'DK' },
  { name: 'Ravi Subramaniam',role: 'Master Craftsman, Wooden Toys', initial: 'RS' },
]

export default function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-end overflow-hidden">
        <Image src={HERO} alt="Beekeeping" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-onyx/80 via-onyx/30 to-transparent" />
        <div className="relative z-10 p-8 sm:p-16 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-heading font-bold text-5xl sm:text-6xl text-white mb-4 leading-tight">
              Our Story
            </h1>
            <p className="text-white/70 text-xl">Pure honey, honest craft, real people</p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="font-heading font-bold text-4xl text-onyx mb-6">
                Born in the Forest,<br />
                <span className="text-gradient-honey">Delivered to Your Door</span>
              </h2>
              <div className="text-onyx/60 leading-relaxed space-y-4">
                <p>
                  GOLDEN HONEY began in 2019 when our founder Arjun Menon — a third-generation beekeeper from Kerala — realised that most of the honey on Indian supermarket shelves had been heated, filtered, and diluted until almost nothing of the original remained.
                </p>
                <p>
                  He set out to build something different: a direct channel between India's finest beekeepers and the families who deserved their best honey. No middlemen, no compromises, no heating. Just raw honey exactly as the bees made it.
                </p>
                <p>
                  In 2022, we expanded to include handcrafted wooden toys — the same philosophy applied: sustainable materials, honest craft, no shortcuts.
                </p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="relative aspect-[4/3] rounded-card overflow-hidden shadow-xl">
                <Image src={FOREST} alt="Forest beekeeping" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-parchment">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="font-heading font-bold text-4xl text-onyx mb-3">What We Stand For</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {VALUES.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center p-8 bg-white rounded-xl border border-black/5 shadow-sm"
              >
                <span className="inline-flex w-12 h-12 rounded-full bg-honey/15 items-center justify-center text-honey mb-5">{v.icon}</span>
                <h3 className="font-heading font-semibold text-lg text-onyx mb-3">{v.title}</h3>
                <p className="text-onyx/55 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="font-heading font-bold text-4xl text-onyx mb-3">The Team</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {TEAM.map((m, i) => (
              <motion.div key={m.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center bg-white rounded-xl p-7 border border-black/5 shadow-sm"
              >
                <div className="w-16 h-16 rounded-full bg-honey/20 flex items-center justify-center text-xl font-bold text-honey mx-auto mb-4">
                  {m.initial}
                </div>
                <p className="font-heading font-semibold text-onyx">{m.name}</p>
                <p className="text-xs text-onyx/40 mt-1">{m.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-onyx text-center">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <h2 className="font-heading font-bold text-3xl text-white mb-4">Taste the Difference</h2>
          <p className="text-white/50 mb-8">Join thousands of families who've made the switch to real honey.</p>
          <Link href="/shop">
            <Button size="lg">Shop Now <ArrowRight size={18} /></Button>
          </Link>
        </motion.div>
      </section>
    </main>
  )
}
