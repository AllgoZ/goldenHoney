'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Phone, ArrowRight, Loader2 } from 'lucide-react'
import { getCustomer, createCustomer } from '@/lib/services/customer.service'
import { useUIStore } from '@/store/ui'
import { useUserStore } from '@/store/user'

export default function PhoneAuthModal() {
  const { authModal, hideAuthModal } = useUIStore()
  const setUser = useUserStore((s) => s.setUser)

  const [phone, setPhone]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    if (!authModal.open) {
      setPhone('')
      setError('')
      setLoading(false)
    }
  }, [authModal.open])

  async function handleSubmit() {
    const digits = phone.replace(/\D/g, '')
    if (digits.length !== 10) { setError('Enter a valid 10-digit mobile number.'); return }

    setLoading(true)
    setError('')

    try {
      const phoneFormatted = `+91${digits}`
      // Document ID = 10-digit phone number — acts as the customer ID
      const phoneId = digits

      const existing = await getCustomer(phoneId)

      if (existing) {
        // Returning customer — just update lastLogin (via updateCustomer inside createCustomer merging)
        setUser({
          id:         phoneId,
          name:       existing.name || phoneFormatted,
          phone:      existing.phone || phoneFormatted,
          email:      existing.email || '',
          isLoggedIn: true,
          createdAt:  new Date().toISOString(),
        })
      } else {
        // New customer — create Firestore doc
        await createCustomer(phoneId, {
          phone: phoneFormatted,
          name:  phoneFormatted,
          email: '',
        })
        setUser({
          id:         phoneId,
          name:       phoneFormatted,
          phone:      phoneFormatted,
          email:      '',
          isLoggedIn: true,
          createdAt:  new Date().toISOString(),
        })
      }

      const pending = authModal.onSuccess
      hideAuthModal()
      // Defer so the modal exit animation doesn't clash with pending state updates
      setTimeout(() => pending?.(), 50)
    } catch (err) {
      console.error('PhoneAuthModal:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {authModal.open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            onClick={() => { if (!loading) hideAuthModal() }}
          />

          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[61] max-w-sm mx-auto"
          >
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-2">
                <div>
                  <h2 className="font-heading font-bold text-xl text-onyx">Enter your mobile number</h2>
                  <p className="text-xs text-onyx/40 mt-0.5">We'll save your orders and cart to your account</p>
                </div>
                <button
                  onClick={() => { if (!loading) hideAuthModal() }}
                  className="w-8 h-8 rounded-full bg-onyx/5 flex items-center justify-center hover:bg-onyx/10 transition-colors"
                >
                  <X size={15} className="text-onyx/60" />
                </button>
              </div>

              {/* Brand strip */}
              <div className="mx-6 mt-4 mb-5 flex items-center gap-2 bg-honey/10 rounded-2xl px-4 py-2.5">
                <span className="text-xl">🍯</span>
                <span className="text-xs font-semibold text-honey-dark">GOLDEN HONEY</span>
              </div>

              <div className="px-6 pb-7">
                <label className="block text-xs font-semibold text-onyx/50 uppercase tracking-wider mb-2">
                  Mobile Number
                </label>
                <div className="flex items-center gap-2 border-2 border-onyx/10 rounded-xl px-3 focus-within:border-honey transition-[border-color] duration-150 mb-4">
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-onyx/60 shrink-0 border-r border-onyx/10 pr-3 py-3">
                    <Phone size={14} /> +91
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="98765 43210"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '')); setError('') }}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    className="flex-1 py-3 text-sm text-onyx bg-transparent outline-none placeholder:text-onyx/25 tracking-wider"
                    autoFocus
                  />
                </div>

                {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

                <button
                  onClick={handleSubmit}
                  disabled={loading || phone.replace(/\D/g, '').length < 10}
                  className="w-full h-12 rounded-2xl bg-honey text-onyx font-bold text-sm hover:bg-honey-dark active:scale-[0.98] transition-[background-color,transform] duration-150 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-honey/25"
                >
                  {loading
                    ? <Loader2 size={18} className="animate-spin" />
                    : <><span>Continue</span><ArrowRight size={16} /></>
                  }
                </button>

                <p className="text-center text-xs text-onyx/35 mt-4">
                  By continuing you agree to our{' '}
                  <a href="/terms" className="underline hover:text-onyx/60">Terms</a> &{' '}
                  <a href="/privacy-policy" className="underline hover:text-onyx/60">Privacy Policy</a>
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
