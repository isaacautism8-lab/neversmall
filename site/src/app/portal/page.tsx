'use client'

import { useState, useEffect } from 'react'
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'
import Image from 'next/image'

export default function PortalLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check if already logged in
    const token = sessionStorage.getItem('portal_token')
    if (token) {
      window.location.href = '/portal/dashboard/'
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/portal/auth/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Invalid credentials')
        setIsLoading(false)
        return
      }

      // Store session
      sessionStorage.setItem('portal_token', data.token)
      sessionStorage.setItem('portal_client', JSON.stringify(data.client))
      
      // Redirect to dashboard
      window.location.href = '/portal/dashboard/'
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-ns-black relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-ns-violet/20 to-transparent rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-ns-coral/15 to-transparent rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-ns-mint/10 to-ns-violet/10 rounded-full blur-[80px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      {/* Content */}
      <div className={`relative z-10 min-h-screen flex flex-col items-center justify-center px-4 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Logo */}
        <div className="mb-12 text-center">
          <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-6 ring-2 ring-white/10 shadow-2xl shadow-ns-violet/20">
            <Image
              src="/assets/nss-logo.png"
              alt="Neversmall Studios"
              width={80}
              height={80}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <h1 className="text-2xl font-display font-bold text-white mb-2">
            Client Portal
          </h1>
          <p className="text-ns-gray-400 text-sm">
            Neversmall Studios
          </p>
        </div>

        {/* Login Card */}
        <div className="w-full max-w-md">
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-ns-gray-300 mb-2">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3.5 text-white placeholder:text-ns-gray-500 focus:outline-none focus:border-ns-violet/50 focus:ring-2 focus:ring-ns-violet/20 transition-all"
                  placeholder="Enter your username"
                  autoComplete="username"
                  disabled={isLoading}
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-ns-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3.5 pr-12 text-white placeholder:text-ns-gray-500 focus:outline-none focus:border-ns-violet/50 focus:ring-2 focus:ring-ns-violet/20 transition-all"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-ns-gray-400 hover:text-white transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading || !username || !password}
                className="w-full bg-gradient-to-r from-ns-violet to-ns-coral text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-ns-violet/25"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Help text */}
          <p className="text-center text-ns-gray-500 text-sm mt-6">
            Credentials provided by Neversmall Studios
          </p>
        </div>

        {/* Footer */}
        <div className="absolute bottom-8 text-center">
          <p className="text-ns-gray-600 text-xs">
            © {new Date().getFullYear()} Neversmall Studios
          </p>
        </div>
      </div>
    </main>
  )
}
