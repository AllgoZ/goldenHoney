'use client'
import { useEffect, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { getStoreSettings, updateStoreSettings } from '@/lib/services/settings.service'
import { updateAdminCredentials } from '@/lib/services/auth.service'
import { auth } from '@/lib/firebase'
import type { FSStoreSettings } from '@/types/firebase'

type EditableSettings = Omit<FSStoreSettings, 'updatedAt'>

const DEFAULTS: EditableSettings = {
  storeName:      'Golden Honey',
  storeEmail:     '',
  storePhone:     '',
  currency:       'INR',
  freeShippingAt: 500,
  flatShippingFee: 60,
  taxRate:         5,
  maintenanceMode: false,
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<EditableSettings>(DEFAULTS)
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)

  // credentials state
  const [currentEmail, setCurrentEmail]   = useState('')
  const [currentPw, setCurrentPw]         = useState('')
  const [newEmail, setNewEmail]           = useState('')
  const [newPw, setNewPw]                 = useState('')
  const [confirmPw, setConfirmPw]         = useState('')
  const [showCurrent, setShowCurrent]     = useState(false)
  const [showNew, setShowNew]             = useState(false)
  const [credSaving, setCredSaving]       = useState(false)
  const [credMsg, setCredMsg]             = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    getStoreSettings().then((data) => {
      if (data) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { updatedAt, ...rest } = data
        setSettings(rest)
      }
      setLoading(false)
    })
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user?.email) setCurrentEmail(user.email)
    })
    return unsubscribe
  }, [])

  function set<K extends keyof EditableSettings>(key: K, value: EditableSettings[K]) {
    setSettings((s) => ({ ...s, [key]: value }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await updateStoreSettings(settings)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault()
    setCredMsg(null)
    if (newPw && newPw !== confirmPw) {
      setCredMsg({ type: 'error', text: 'New passwords do not match.' })
      return
    }
    if (newPw && newPw.length < 6) {
      setCredMsg({ type: 'error', text: 'Password must be at least 6 characters.' })
      return
    }
    if (!newEmail && !newPw) {
      setCredMsg({ type: 'error', text: 'Enter a new email or new password to update.' })
      return
    }
    setCredSaving(true)
    try {
      await updateAdminCredentials(currentPw, newEmail || undefined, newPw || undefined)
      if (newEmail) setCurrentEmail(newEmail)
      setCurrentPw(''); setNewEmail(''); setNewPw(''); setConfirmPw('')
      setCredMsg({ type: 'success', text: 'Credentials updated successfully.' })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Update failed.'
      if (msg.includes('wrong-password') || msg.includes('invalid-credential')) {
        setCredMsg({ type: 'error', text: 'Current password is incorrect.' })
      } else {
        setCredMsg({ type: 'error', text: msg })
      }
    } finally {
      setCredSaving(false)
    }
  }

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-honey border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-bold text-xl text-onyx">Store Settings</h2>
        {saved && <span className="text-sm text-green-600 font-medium">Saved!</span>}
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Store info */}
        <div className="bg-white rounded-card border border-black/6 p-5 space-y-4">
          <h3 className="font-semibold text-onyx text-sm">Store Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-onyx/50 mb-1.5">Store Name</label>
              <input value={settings.storeName} onChange={(e) => set('storeName', e.target.value)}
                className="w-full h-9 px-3 text-sm border border-onyx/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-honey/50 bg-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-onyx/50 mb-1.5">Email</label>
              <input type="email" value={settings.storeEmail} onChange={(e) => set('storeEmail', e.target.value)}
                className="w-full h-9 px-3 text-sm border border-onyx/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-honey/50 bg-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-onyx/50 mb-1.5">Phone</label>
              <input value={settings.storePhone} onChange={(e) => set('storePhone', e.target.value)}
                className="w-full h-9 px-3 text-sm border border-onyx/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-honey/50 bg-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-onyx/50 mb-1.5">Currency</label>
              <input value={settings.currency} onChange={(e) => set('currency', e.target.value)}
                className="w-full h-9 px-3 text-sm border border-onyx/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-honey/50 bg-white" />
            </div>
          </div>
        </div>

        {/* Shipping & Tax */}
        <div className="bg-white rounded-card border border-black/6 p-5 space-y-4">
          <h3 className="font-semibold text-onyx text-sm">Shipping & Tax</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-onyx/50 mb-1.5">Flat Shipping Fee (₹)</label>
              <input type="number" value={settings.flatShippingFee} onChange={(e) => set('flatShippingFee', Number(e.target.value))}
                className="w-full h-9 px-3 text-sm border border-onyx/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-honey/50 bg-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-onyx/50 mb-1.5">Free Shipping At (₹)</label>
              <input type="number" value={settings.freeShippingAt} onChange={(e) => set('freeShippingAt', Number(e.target.value))}
                className="w-full h-9 px-3 text-sm border border-onyx/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-honey/50 bg-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-onyx/50 mb-1.5">Tax Rate (%)</label>
              <input type="number" value={settings.taxRate} onChange={(e) => set('taxRate', Number(e.target.value))}
                className="w-full h-9 px-3 text-sm border border-onyx/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-honey/50 bg-white" />
            </div>
          </div>
        </div>

        {/* Maintenance */}
        <div className="bg-white rounded-card border border-black/6 p-5">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={settings.maintenanceMode} onChange={(e) => set('maintenanceMode', e.target.checked)}
              className="w-4 h-4 accent-honey" />
            <div>
              <p className="text-sm font-medium text-onyx">Maintenance Mode</p>
              <p className="text-xs text-onyx/40">Site will show a maintenance message to visitors.</p>
            </div>
          </label>
        </div>

        <button type="submit" disabled={saving}
          className="w-full h-10 bg-honey text-onyx font-semibold rounded-xl hover:bg-honey-dark transition-[background-color] duration-150 disabled:opacity-60 flex items-center justify-center gap-2">
          {saving && <span className="w-4 h-4 border-2 border-onyx/30 border-t-onyx rounded-full animate-spin" />}
          Save Settings
        </button>
      </form>

      {/* ── Change Login Credentials ── */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-bold text-xl text-onyx">Login Credentials</h2>
        </div>

        <form onSubmit={handleCredentials} className="space-y-5">
          <div className="bg-white rounded-card border border-black/6 p-5 space-y-4">
            <h3 className="font-semibold text-onyx text-sm">Change Email / Password</h3>

            {/* Current email (read-only display) */}
            <div>
              <label className="block text-xs font-semibold text-onyx/50 mb-1.5">Current Email</label>
              <input value={currentEmail} readOnly
                className="w-full h-9 px-3 text-sm border border-onyx/10 rounded-xl bg-onyx/3 text-onyx/50 cursor-default" />
            </div>

            {/* Current password — always required */}
            <div>
              <label className="block text-xs font-semibold text-onyx/50 mb-1.5">Current Password <span className="text-red-400">*</span></label>
              <div className="relative">
                <input type={showCurrent ? 'text' : 'password'} value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)} required
                  placeholder="Enter current password"
                  className="w-full h-9 px-3 pr-10 text-sm border border-onyx/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-honey/50 bg-white" />
                <button type="button" onClick={() => setShowCurrent((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-onyx/30 hover:text-onyx/60">
                  {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* New email */}
            <div>
              <label className="block text-xs font-semibold text-onyx/50 mb-1.5">New Email <span className="text-onyx/30">(leave blank to keep current)</span></label>
              <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)}
                placeholder="new@example.com"
                className="w-full h-9 px-3 text-sm border border-onyx/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-honey/50 bg-white" />
            </div>

            {/* New password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-onyx/50 mb-1.5">New Password <span className="text-onyx/30">(leave blank to keep)</span></label>
                <div className="relative">
                  <input type={showNew ? 'text' : 'password'} value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full h-9 px-3 pr-10 text-sm border border-onyx/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-honey/50 bg-white" />
                  <button type="button" onClick={() => setShowNew((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-onyx/30 hover:text-onyx/60">
                    {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-onyx/50 mb-1.5">Confirm New Password</label>
                <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full h-9 px-3 text-sm border border-onyx/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-honey/50 bg-white" />
              </div>
            </div>

            {credMsg && (
              <div className={`text-sm rounded-xl px-4 py-3 ${credMsg.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                {credMsg.text}
              </div>
            )}
          </div>

          <button type="submit" disabled={credSaving}
            className="w-full h-10 bg-onyx text-white font-semibold rounded-xl hover:bg-onyx/80 transition-[background-color] duration-150 disabled:opacity-60 flex items-center justify-center gap-2">
            {credSaving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            Update Credentials
          </button>
        </form>
      </div>
    </div>
  )
}
