'use client'

import { useState, useEffect } from 'react'
import { Copy, Check, ExternalLink, RefreshCw, Plus, Eye } from 'lucide-react'
import Image from 'next/image'

interface Project {
  id: string
  name: string
  status: string
  clientName: string
  token: string
  startDate: string | null
  targetCompletion: string | null
  lastUpdated: string | null
}

const STATUS_COLORS: Record<string, string> = {
  'Discovery': 'bg-sky-100 text-sky-700',
  'In Progress': 'bg-amber-100 text-amber-700',
  'Review': 'bg-violet-100 text-violet-700',
  'Complete': 'bg-emerald-100 text-emerald-700',
}

function generateToken(): string {
  // Generate a cryptographically random token
  const array = new Uint8Array(24)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

function formatDate(dateString: string | null): string {
  if (!dateString) return '—'
  try {
    return new Date(dateString).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return '—'
  }
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [passphrase, setPassphrase] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoadingProjects, setIsLoadingProjects] = useState(false)
  const [copiedToken, setCopiedToken] = useState<string | null>(null)

  // Check session on mount
  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth')
    if (auth === 'true') {
      setAuthenticated(true)
    }
  }, [])

  // Load projects when authenticated
  useEffect(() => {
    if (authenticated) {
      loadProjects()
    }
  }, [authenticated])

  const handleAuth = async (e: React.FormEvent) => {
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
        sessionStorage.setItem('admin_auth', 'true')
        setAuthenticated(true)
      } else {
        setError('Invalid passphrase')
      }
    } catch {
      setError('Authentication failed')
    } finally {
      setIsLoading(false)
    }
  }

  const loadProjects = async () => {
    setIsLoadingProjects(true)
    try {
      const res = await fetch('/api/admin/projects/')
      if (res.ok) {
        const data = await res.json()
        setProjects(data.projects || [])
      }
    } catch (error) {
      console.error('Failed to load projects:', error)
    } finally {
      setIsLoadingProjects(false)
    }
  }

  const handleGenerateToken = async (projectId: string) => {
    const newToken = generateToken()
    
    try {
      const res = await fetch('/api/admin/projects/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, token: newToken }),
      })

      if (res.ok) {
        // Update local state
        setProjects(prev => 
          prev.map(p => p.id === projectId ? { ...p, token: newToken } : p)
        )
        // Copy to clipboard
        handleCopyToken(newToken)
      }
    } catch (error) {
      console.error('Failed to generate token:', error)
    }
  }

  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token)
    setCopiedToken(token)
    setTimeout(() => setCopiedToken(null), 2000)
  }

  const getClientUrl = (token: string): string => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    return `${baseUrl}/client/${token}/`
  }

  // Auth screen
  if (!authenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-ns-gray-100 px-4">
        <form 
          onSubmit={handleAuth} 
          className="bg-white p-8 rounded-xl shadow-sm border border-ns-gray-200 max-w-sm w-full"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <Image
                src="/assets/nss-logo.png"
                alt=""
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <h1 className="text-xl font-display font-bold text-center mb-6">
            Admin Access
          </h1>
          <input
            type="password"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            placeholder="Passphrase"
            className="w-full border border-ns-gray-300 rounded-lg px-4 py-3 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-ns-violet/20 focus:border-ns-violet"
            autoFocus
            disabled={isLoading}
          />
          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}
          <button
            type="submit"
            disabled={isLoading || !passphrase}
            className="w-full bg-ns-black text-white py-3 rounded-lg font-medium text-sm hover:bg-ns-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Verifying...' : 'Enter'}
          </button>
        </form>
      </main>
    )
  }

  // Admin dashboard
  return (
    <main className="min-h-screen bg-ns-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-ns-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden">
              <Image
                src="/assets/nss-logo.png"
                alt=""
                width={36}
                height={36}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-display font-bold">Project Admin</span>
          </div>
          <button
            onClick={() => {
              sessionStorage.removeItem('admin_auth')
              setAuthenticated(false)
            }}
            className="text-sm text-ns-gray-500 hover:text-ns-gray-700"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Projects Section */}
        <section className="bg-white rounded-xl border border-ns-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-ns-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-ns-gray-900">Projects</h2>
            <button
              onClick={loadProjects}
              disabled={isLoadingProjects}
              className="text-sm text-ns-gray-500 hover:text-ns-gray-700 inline-flex items-center gap-1.5"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingProjects ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {isLoadingProjects && projects.length === 0 ? (
            <div className="p-8 text-center text-ns-gray-500">
              Loading projects...
            </div>
          ) : projects.length === 0 ? (
            <div className="p-8 text-center text-ns-gray-500">
              No projects found. Add projects in Notion to see them here.
            </div>
          ) : (
            <div className="divide-y divide-ns-gray-200">
              {projects.map((project) => (
                <div key={project.id} className="px-6 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-medium text-ns-gray-900 truncate">
                          {project.name}
                        </h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[project.status] || 'bg-ns-gray-100 text-ns-gray-600'}`}>
                          {project.status}
                        </span>
                      </div>
                      {project.clientName && (
                        <p className="text-sm text-ns-gray-500">
                          {project.clientName}
                        </p>
                      )}
                      <p className="text-xs text-ns-gray-400 mt-1">
                        {formatDate(project.startDate)} → {formatDate(project.targetCompletion)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {project.token ? (
                        <>
                          <button
                            onClick={() => handleCopyToken(project.token)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-ns-gray-100 hover:bg-ns-gray-200 rounded-lg transition-colors"
                            title="Copy token"
                          >
                            {copiedToken === project.token ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                Copy
                              </>
                            )}
                          </button>
                          <a
                            href={getClientUrl(project.token)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-ns-gray-100 hover:bg-ns-gray-200 rounded-lg transition-colors"
                            title="Preview client view"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Preview
                          </a>
                        </>
                      ) : (
                        <button
                          onClick={() => handleGenerateToken(project.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-ns-violet text-white hover:bg-ns-violet/90 rounded-lg transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Generate Link
                        </button>
                      )}
                    </div>
                  </div>

                  {project.token && (
                    <div className="mt-3 p-3 bg-ns-gray-50 rounded-lg">
                      <p className="text-xs text-ns-gray-500 mb-1">Client Link:</p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 text-xs text-ns-gray-700 bg-white px-2 py-1 rounded border border-ns-gray-200 truncate">
                          {getClientUrl(project.token)}
                        </code>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(getClientUrl(project.token))
                            setCopiedToken(project.token)
                            setTimeout(() => setCopiedToken(null), 2000)
                          }}
                          className="text-ns-gray-400 hover:text-ns-gray-600 p-1"
                        >
                          {copiedToken === project.token ? (
                            <Check className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Help text */}
        <p className="text-center text-xs text-ns-gray-400 mt-6">
          Projects are managed in Notion. Add or update projects there, then refresh this page.
        </p>
      </div>
    </main>
  )
}
