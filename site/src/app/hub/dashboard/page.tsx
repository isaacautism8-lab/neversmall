'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  LogOut, Users, Settings, RefreshCw, Copy, Check, 
  Eye, EyeOff, Edit3, Save, X, Plus, Calendar,
  TrendingUp, BarChart3, Activity, Sparkles,
  Search, Filter, ChevronDown, ExternalLink
} from 'lucide-react'
import Image from 'next/image'

interface Client {
  id: string
  name: string
  status: string
  clientName: string
  startDate: string | null
  targetCompletion: string | null
  deliverablesLink: string | null
  username: string
  hasPassword: boolean
  lastEdited: string
}

const STATUS_OPTIONS = ['Discovery', 'In Progress', 'Review', 'Complete']
const STATUS_COLORS: Record<string, string> = {
  'Discovery': 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  'In Progress': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'Review': 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  'Complete': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
}

function formatDate(dateString: string | null): string {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleDateString('en-AU', {
    day: 'numeric', month: 'short'
  })
}

function generatePassword(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let password = ''
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

export default function HubDashboard() {
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingClient, setEditingClient] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Client> & { password?: string }>({})
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [mounted, setMounted] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setMounted(true)
    const auth = sessionStorage.getItem('hub_auth')
    if (auth !== 'true') {
      window.location.href = '/hub/'
      return
    }
    fetchClients()
  }, [])

  const fetchClients = async () => {
    const passphrase = sessionStorage.getItem('hub_passphrase')
    try {
      const res = await fetch('/api/hub/clients/', {
        headers: { 'Authorization': `Bearer ${passphrase}` }
      })
      if (res.ok) {
        const data = await res.json()
        setClients(data.clients || [])
      }
    } catch (err) {
      console.error('Failed to fetch clients:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('hub_auth')
    sessionStorage.removeItem('hub_passphrase')
    window.location.href = '/hub/'
  }

  const startEditing = (client: Client) => {
    setEditingClient(client.id)
    setEditForm({
      username: client.username,
      status: client.status,
      startDate: client.startDate,
      targetCompletion: client.targetCompletion,
      deliverablesLink: client.deliverablesLink,
      clientName: client.clientName,
      password: '',
    })
  }

  const cancelEditing = () => {
    setEditingClient(null)
    setEditForm({})
  }

  const saveClient = async () => {
    if (!editingClient) return
    setIsSaving(true)

    const passphrase = sessionStorage.getItem('hub_passphrase')
    try {
      const res = await fetch('/api/hub/clients/', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${passphrase}`
        },
        body: JSON.stringify({
          clientId: editingClient,
          ...editForm,
        }),
      })

      if (res.ok) {
        await fetchClients()
        cancelEditing()
      }
    } catch (err) {
      console.error('Failed to save client:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const generateClientPassword = () => {
    setEditForm(prev => ({ ...prev, password: generatePassword() }))
  }

  const copyCredentials = (client: Client) => {
    const text = `Portal: https://neversmall.com.au/portal/\nUsername: ${client.username}\n(Password set in Notion)`
    navigator.clipboard.writeText(text)
    setCopiedId(client.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Filter clients
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          client.clientName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Stats
  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status === 'In Progress').length,
    review: clients.filter(c => c.status === 'Review').length,
    complete: clients.filter(c => c.status === 'Complete').length,
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-ns-black flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-8 h-8 text-ns-violet animate-pulse mx-auto mb-4" />
          <p className="text-ns-gray-400">Loading hub...</p>
        </div>
      </main>
    )
  }

  return (
    <main className={`min-h-screen bg-ns-black transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-ns-violet/15 to-transparent rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-tl from-ns-coral/10 to-transparent rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-ns-black/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-white/10">
              <Image src="/assets/nss-logo.png" alt="" width={40} height={40} className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-display font-bold text-white">Internal Hub</h1>
              <p className="text-ns-gray-500 text-sm">Client Management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchClients}
              className="p-2 text-ns-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw size={18} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-ns-gray-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline text-sm">Exit</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-ns-violet/20 to-transparent border border-ns-violet/20 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-ns-violet/30 flex items-center justify-center">
                <Users className="w-5 h-5 text-ns-violet" />
              </div>
              <span className="text-ns-gray-400 text-sm">Total Clients</span>
            </div>
            <p className="text-3xl font-display font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-gradient-to-br from-amber-500/20 to-transparent border border-amber-500/20 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/30 flex items-center justify-center">
                <Activity className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-ns-gray-400 text-sm">In Progress</span>
            </div>
            <p className="text-3xl font-display font-bold text-white">{stats.active}</p>
          </div>
          <div className="bg-gradient-to-br from-violet-500/20 to-transparent border border-violet-500/20 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/30 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-violet-400" />
              </div>
              <span className="text-ns-gray-400 text-sm">In Review</span>
            </div>
            <p className="text-3xl font-display font-bold text-white">{stats.review}</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500/20 to-transparent border border-emerald-500/20 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/30 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-ns-gray-400 text-sm">Completed</span>
            </div>
            <p className="text-3xl font-display font-bold text-white">{stats.complete}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ns-gray-500" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-ns-gray-500 focus:outline-none focus:border-ns-violet/50 transition-colors"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 pr-10 text-white focus:outline-none focus:border-ns-violet/50 transition-colors cursor-pointer"
            >
              <option value="all">All Status</option>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ns-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Client list */}
        <div className="space-y-4">
          {filteredClients.length === 0 ? (
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-12 text-center">
              <Users className="w-12 h-12 text-ns-gray-600 mx-auto mb-4" />
              <p className="text-ns-gray-400">No clients found</p>
            </div>
          ) : (
            filteredClients.map((client) => (
              <div
                key={client.id}
                className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.04] transition-colors"
              >
                {editingClient === client.id ? (
                  /* Edit mode */
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">{client.name}</h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={cancelEditing}
                          className="p-2 text-ns-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <X size={18} />
                        </button>
                        <button
                          onClick={saveClient}
                          disabled={isSaving}
                          className="flex items-center gap-2 px-4 py-2 bg-ns-violet text-white rounded-lg hover:bg-ns-violet/90 disabled:opacity-50 transition-colors"
                        >
                          <Save size={16} />
                          {isSaving ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-ns-gray-400 text-sm mb-1">Username</label>
                        <input
                          type="text"
                          value={editForm.username || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                          className="w-full bg-black/30 border border-white/[0.1] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-ns-violet/50"
                          placeholder="client_username"
                        />
                      </div>
                      <div>
                        <label className="block text-ns-gray-400 text-sm mb-1">Password</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editForm.password || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, password: e.target.value }))}
                            className="flex-1 bg-black/30 border border-white/[0.1] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-ns-violet/50"
                            placeholder="Leave empty to keep current"
                          />
                          <button
                            onClick={generateClientPassword}
                            className="px-3 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                            title="Generate password"
                          >
                            <Sparkles size={16} />
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-ns-gray-400 text-sm mb-1">Status</label>
                        <select
                          value={editForm.status || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                          className="w-full bg-black/30 border border-white/[0.1] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-ns-violet/50"
                        >
                          <option value="">Select status</option>
                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-ns-gray-400 text-sm mb-1">Start Date</label>
                        <input
                          type="date"
                          value={editForm.startDate || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, startDate: e.target.value }))}
                          className="w-full bg-black/30 border border-white/[0.1] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-ns-violet/50"
                        />
                      </div>
                      <div>
                        <label className="block text-ns-gray-400 text-sm mb-1">Target Completion</label>
                        <input
                          type="date"
                          value={editForm.targetCompletion || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, targetCompletion: e.target.value }))}
                          className="w-full bg-black/30 border border-white/[0.1] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-ns-violet/50"
                        />
                      </div>
                      <div>
                        <label className="block text-ns-gray-400 text-sm mb-1">Deliverables Link</label>
                        <input
                          type="url"
                          value={editForm.deliverablesLink || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, deliverablesLink: e.target.value }))}
                          className="w-full bg-black/30 border border-white/[0.1] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-ns-violet/50"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* View mode */
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white truncate">{client.name}</h3>
                        <span className={`text-xs px-2.5 py-1 rounded-full border ${STATUS_COLORS[client.status] || 'bg-ns-gray-500/20 text-ns-gray-400 border-ns-gray-500/30'}`}>
                          {client.status || 'Unknown'}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-ns-gray-400">
                        {client.username && (
                          <span className="flex items-center gap-1.5">
                            <span className="text-ns-gray-500">@</span>
                            {client.username}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5">
                          <Calendar size={14} />
                          {formatDate(client.startDate)} → {formatDate(client.targetCompletion)}
                        </span>
                        {client.hasPassword ? (
                          <span className="text-emerald-400 text-xs">● Password set</span>
                        ) : (
                          <span className="text-amber-400 text-xs">○ No password</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {client.username && client.hasPassword && (
                        <button
                          onClick={() => copyCredentials(client)}
                          className="flex items-center gap-1.5 px-3 py-2 text-sm bg-white/5 text-ns-gray-300 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          {copiedId === client.id ? (
                            <>
                              <Check size={14} className="text-emerald-400" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy size={14} />
                              Copy Info
                            </>
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => startEditing(client)}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm bg-ns-violet/20 text-ns-violet rounded-lg hover:bg-ns-violet/30 transition-colors"
                      >
                        <Edit3 size={14} />
                        Edit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  )
}
