'use client'

import { useState, useEffect } from 'react'
import { Shield, ArrowRight, Loader2 } from 'lucide-react'
import Image from 'next/image'

export default function HubLogin() {
  const [passphrase, setPassphrase] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const auth = sessionStorage.getItem('hub_auth')
    if (auth === 'true') {
      window.location.href = '/hub/dashboard/'
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/auth/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passphrase }),
      })

      if (res.ok) {
        sessionStorage.setItem('hub_auth', 'true')
        sessionStorage.setItem('hub_passphrase', passphrase)
        window.location.href = '/hub/dashboard/'
      } else {
        setError('Invalid passphrase')
      }
    } catch {
      setError('Authentication failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-ns-black relative overflow-hidden">
      {/* Premium gradient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-ns-violet/30 via-ns-coral/20 to-transparent rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-ns-mint/20 to-transparent rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '3s' }} />
      </div>

      {/* Mesh gradient overlay */}
      <div className="absolute inset-0 opacity-30" style={{
        background: `radial-gradient(at 40% 20%, rgba(139, 110, 201, 0.15) 0px, transparent 50%),
                     radial-gradient(at 80% 0%, rgba(224, 120, 96, 0.1) 0px, transparent 50%),
                     radial-gradient(at 0% 50%, rgba(110, 207, 154, 0.1) 0px, transparent 50%)`
      }} />

      {/* Content */}
      <div className={`relative z-10 min-h-screen flex flex-col items-center justify-center px-4 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="mb-12 text-center">
          <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden mb-6 ring-4 ring-white/10 shadow-2xl shadow-ns-violet/30 rotate-3 hover:rotate-0 transition-transform duration-500">
            <Image
              src="/assets/nss-logo.png"
              alt="Neversmall Studios"
              width={96}
              height={96}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            Internal Hub
          </h1>
          <p className="text-ns-gray-400 text-sm flex items-center justify-center gap-2">
            <Shield size={14} />
            Team Access Only
          </p>
        </div>

        <div className="w-full max-w-md">
          <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/[0.1] rounded-3xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="passphrase" className="block text-sm font-medium text-ns-gray-300 mb-2">
                  Team Passphrase
                </label>
                <input
                  id="passphrase"
                  type="password"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  className="w-full bg-black/30 border border-white/[0.1] rounded-xl px-4 py-4 text-white placeholder:text-ns-gray-500 focus:outline-none focus:border-ns-violet/50 focus:ring-2 focus:ring-ns-violet/20 transition-all text-center text-lg tracking-widest"
                  placeholder="••••••••"
                  autoComplete="off"
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !passphrase}
                className="w-full bg-white text-ns-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-ns-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Enter Hub
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="absolute bottom-8 text-center">
          <p className="text-ns-gray-600 text-xs">
            Neversmall Studios • Internal Operations
          </p>
        </div>
      </div>
    </main>
  )
}
