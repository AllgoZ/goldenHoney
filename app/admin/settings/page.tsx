'use client'
import { useEffect, useState } from 'react'
import { getStoreSettings, updateStoreSettings } from '@/lib/services/settings.service'
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

  useEffect(() => {
    getStoreSettings().then((data) => {
      if (data) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { updatedAt, ...rest } = data
        setSettings(rest)
      }
      setLoading(false)
    })
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
    </div>
  )
}
