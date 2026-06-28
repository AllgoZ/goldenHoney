'use client'
import { useState } from 'react'
import { Layers, Eye, EyeOff } from 'lucide-react'
import { signIn } from '@/lib/services/auth.service'

export default function AdminLoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      // AdminGuard will detect the auth state change and redirect to /admin
    } catch {
      setError('Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto px-4">
      <div className="bg-white rounded-2xl shadow-xl border border-black/6 p-8">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Layers size={22} className="text-honey" />
          <span className="font-heading font-bold text-onyx text-lg tracking-wide">
            GOLDEN <span className="text-honey">ADMIN</span>
          </span>
        </div>

        <h1 className="font-heading font-bold text-xl text-onyx mb-1 text-center">Sign in</h1>
        <p className="text-sm text-onyx/50 text-center mb-6">Admin access only</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-onyx/60 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full h-10 px-3 text-sm bg-onyx/3 border border-onyx/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-honey/50 focus:border-honey text-onyx"
              placeholder="admin@goldenhoney.in"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-onyx/60 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full h-10 px-3 pr-10 text-sm bg-onyx/3 border border-onyx/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-honey/50 focus:border-honey text-onyx"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-onyx/30 hover:text-onyx/60 transition-colors"
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 bg-honey text-onyx font-semibold text-sm rounded-xl hover:bg-honey-dark transition-[background-color] duration-150 disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
          >
            {loading && <span className="w-4 h-4 border-2 border-onyx/30 border-t-onyx rounded-full animate-spin" />}
            Sign in to Admin
          </button>
        </form>
      </div>
    </div>
  )
}
