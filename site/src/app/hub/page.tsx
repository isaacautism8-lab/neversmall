'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Shield, Loader2, Eye, EyeOff, AlertCircle, ChevronRight, Zap } from 'lucide-react'

export default function HubLogin() {
  const [passphrase, setPassphrase] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassphrase, setShowPassphrase] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check if already authenticated
    const auth = sessionStorage.getItem('hub_auth')
    if (auth === 'true') {
      window.location.href = '/hub/dashboard/'
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/admin/auth/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passphrase }),
      })

      const data = await res.json()

      if (res.ok && data.authenticated) {
        sessionStorage.setItem('hub_auth', 'true')
        sessionStorage.setItem('hub_passphrase', passphrase)
        window.location.href = '/hub/dashboard/'
      } else {
        setError(data.error || 'Invalid passphrase')
      }
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className={`min-h-screen bg-ns-black flex flex-col transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[900px] h-[900px] bg-gradient-to-bl from-ns-coral/15 via-ns-gold/10 to-transparent rounded-full blur-[200px]" />
        <div className="absolute bottom-1/4 left-0 w-[700px] h-[700px] bg-gradient-to-tr from-ns-violet/20 to-transparent rounded-full blur-[150px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-6">
        <a href="/" className="inline-flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-white/10 group-hover:ring-ns-coral/30 transition-all">
            <Image src="/assets/nss-logo.png" alt="Neversmall Studios" width={40} height={40} className="w-full h-full object-cover" />
          </div>
          <span className="text-white font-semibold text-sm opacity-70 group-hover:opacity-100 transition-opacity">
            Neversmall Studios
          </span>
        </a>
      </header>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.08] rounded-3xl p-8 backdrop-blur-sm shadow-2xl shadow-black/50">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-ns-coral to-ns-gold flex items-center justify-center shadow-lg shadow-ns-coral/30">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-display font-bold text-white mb-2">
                Command Center
              </h1>
              <p className="text-ns-gray-400 text-sm">
                Internal hub for the Neversmall team
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-ns-gray-400 text-sm mb-2 font-medium">
                  Passphrase
                </label>
                <div className="relative">
                  <input
                    type={showPassphrase ? 'text' : 'password'}
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3.5 pr-12 text-white placeholder:text-ns-gray-600 focus:outline-none focus:border-ns-coral/50 focus:ring-2 focus:ring-ns-coral/20 transition-all font-mono"
                    placeholder="Enter team passphrase"
                    required
                    autoComplete="current-password"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassphrase(!showPassphrase)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-ns-gray-500 hover:text-white transition-colors"
                  >
                    {showPassphrase ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 px-4 py-3 rounded-xl">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !passphrase}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-ns-coral to-ns-gold text-white py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-ns-coral/30 transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Shield size={18} />
                    Enter Hub
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Security note */}
          <div className="flex items-center justify-center gap-2 text-ns-gray-600 text-xs mt-6">
            <Shield size={12} />
            Team access only. Session expires when you close the browser.
          </div>
        </div>
      </div>
    </main>
  )
}
