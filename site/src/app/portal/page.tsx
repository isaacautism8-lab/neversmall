'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { LogIn, Loader2, Eye, EyeOff, AlertCircle, ChevronRight } from 'lucide-react'

export default function PortalLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check if already authenticated
    const auth = sessionStorage.getItem('portal_auth')
    if (auth === 'true') {
      window.location.href = '/portal/dashboard/'
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/portal/auth/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (res.ok && data.token) {
        sessionStorage.setItem('portal_auth', 'true')
        sessionStorage.setItem('portal_token', data.token)
        sessionStorage.setItem('portal_username', username)
        window.location.href = '/portal/dashboard/'
      } else {
        setError(data.error || 'Invalid credentials')
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
        <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-ns-violet/20 via-ns-coral/10 to-transparent rounded-full blur-[200px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-ns-mint/15 to-transparent rounded-full blur-[150px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-6">
        <a href="/" className="inline-flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-white/10 group-hover:ring-ns-violet/30 transition-all">
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
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-ns-violet to-ns-coral flex items-center justify-center shadow-lg shadow-ns-violet/30">
                <LogIn className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-display font-bold text-white mb-2">
                Client Portal
              </h1>
              <p className="text-ns-gray-400 text-sm">
                Sign in to view your project status
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-ns-gray-400 text-sm mb-2 font-medium">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3.5 text-white placeholder:text-ns-gray-600 focus:outline-none focus:border-ns-violet/50 focus:ring-2 focus:ring-ns-violet/20 transition-all"
                  placeholder="Enter your username"
                  required
                  autoComplete="username"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-ns-gray-400 text-sm mb-2 font-medium">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3.5 pr-12 text-white placeholder:text-ns-gray-600 focus:outline-none focus:border-ns-violet/50 focus:ring-2 focus:ring-ns-violet/20 transition-all"
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-ns-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
                disabled={isLoading || !username || !password}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-ns-violet to-ns-coral text-white py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-ns-violet/30 transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ChevronRight size={18} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Help text */}
          <p className="text-center text-ns-gray-500 text-sm mt-6">
            Don&apos;t have credentials?{' '}
            <a href="mailto:hello@neversmall.com.au" className="text-ns-violet hover:text-white transition-colors">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
