'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, Clock, MapPin, CheckCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const CONTACT_INFO = [
  { icon: <Mail size={20} />,  label: 'Email',   value: 'hello@goldenhoney.in',  sub: 'We reply within 4 hours' },
  { icon: <Phone size={20} />, label: 'Phone',   value: '+91 98765 43210',        sub: 'Mon–Sat, 9 AM – 6 PM' },
  { icon: <Clock size={20} />, label: 'Hours',   value: 'Mon – Sat, 9 AM – 6 PM IST', sub: 'Closed Sundays & public holidays' },
  { icon: <MapPin size={20} />,label: 'Address', value: '14, Neem Tree Lane, Koramangala', sub: 'Bengaluru, Karnataka 560095' },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  function update(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setSent(true)
    setLoading(false)
  }

  return (
    <main className="pt-24 pb-20 min-h-screen bg-parchment">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <h1 className="font-heading font-bold text-4xl text-onyx mb-3">Get in Touch</h1>
          <p className="text-onyx/50 text-lg">We'd love to hear from you. We typically respond within 4 hours.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact info */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {CONTACT_INFO.map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-4 bg-white rounded-xl p-5 border border-black/5 shadow-sm"
              >
                <span className="text-honey mt-0.5">{c.icon}</span>
                <div>
                  <p className="text-xs text-onyx/40 uppercase tracking-wider mb-0.5">{c.label}</p>
                  <p className="font-semibold text-sm text-onyx">{c.value}</p>
                  <p className="text-xs text-onyx/40">{c.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-3 bg-white rounded-xl p-8 border border-black/5 shadow-sm"
          >
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle size={52} className="text-green-500 mb-5" />
                <h2 className="font-heading font-bold text-2xl text-onyx mb-3">Message Sent!</h2>
                <p className="text-onyx/50">Thank you for reaching out. We'll get back to you within 4 hours.</p>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                  className="mt-8 text-sm text-honey-dark font-medium hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Your Name" placeholder="Nagul" value={form.name} onChange={update('name')} required />
                  <Input label="Email Address" type="email" placeholder="you@example.com" value={form.email} onChange={update('email')} required />
                </div>
                <Input label="Subject" placeholder="How can we help?" value={form.subject} onChange={update('subject')} required />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-onyx/80">Message</label>
                  <textarea
                    value={form.message}
                    onChange={update('message')}
                    required
                    rows={5}
                    placeholder="Tell us more…"
                    className="w-full rounded-xl border border-onyx/15 bg-white px-4 py-3 text-sm text-onyx placeholder:text-onyx/30 focus:outline-none focus:ring-2 focus:ring-honey focus:border-transparent resize-none transition-colors"
                  />
                </div>
                <Button type="submit" size="lg" fullWidth loading={loading}>
                  Send Message
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  )
}
