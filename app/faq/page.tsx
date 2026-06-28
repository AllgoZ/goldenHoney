'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { faqs, faqCategories } from '@/lib/mock/faq'

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState(faqCategories[0])
  const [openId, setOpenId] = useState<number | null>(null)

  const filtered = faqs.filter((f) => f.category === activeCategory)

  return (
    <main className="pt-24 pb-20 min-h-screen bg-parchment">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="font-heading font-bold text-4xl text-onyx mb-3">Frequently Asked Questions</h1>
          <p className="text-onyx/50">Everything you need to know about our products and services</p>
        </motion.div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {faqCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setOpenId(null) }}
              className={`px-4 py-2 rounded-chip text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-onyx text-white'
                  : 'bg-white border border-onyx/10 text-onyx/60 hover:border-onyx/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion */}
        <div className="flex flex-col gap-3">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl border border-black/5 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenId(openId === item.id ? null : item.id)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left"
              >
                <span className="font-semibold text-sm text-onyx pr-2">{item.question}</span>
                <motion.span
                  animate={{ rotate: openId === item.id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-onyx/30 shrink-0"
                >
                  <ChevronDown size={18} />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {openId === item.id && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm text-onyx/60 leading-relaxed border-t border-black/5 pt-4">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center p-8 bg-honey/10 rounded-xl border border-honey/20">
          <p className="font-semibold text-onyx mb-2">Still have questions?</p>
          <p className="text-sm text-onyx/50 mb-5">Our team replies within 4 hours, Monday to Saturday</p>
          <a href="/contact" className="inline-flex items-center gap-2 bg-onyx text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-onyx/80 transition-colors">
            Contact Us
          </a>
        </div>
      </div>
    </main>
  )
}
