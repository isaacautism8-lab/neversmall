'use client'

import { useState, useEffect } from 'react'
import { 
  LogOut, Users, RefreshCw, Copy, Check, 
  Edit3, Calendar, Activity, ExternalLink,
  Search, ChevronDown, Eye,
  TrendingUp, BarChart3, Zap
} from 'lucide-react'
import Image from 'next/image'

import { Modal } from '@/components/hub/Modal'
import { ClientEditModal } from '@/components/hub/ClientEditModal'

// Simple fallback components (3D libs crash on edge)
function ProjectOrbFallback({ activeProjects, totalProjects, className = '' }: { activeProjects: number; totalProjects: number; className?: string }) {
  const progress = totalProjects > 0 ? (activeProjects / totalProjects) * 100 : 0
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-ns-violet/30 to-ns-coral/30 animate-pulse" />
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-ns-violet to-ns-coral opacity-60" 
             style={{ clipPath: `polygon(0 ${100-progress}%, 100% ${100-progress}%, 100% 100%, 0 100%)` }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-4xl font-display font-bold text-white">{activeProjects}</p>
            <p className="text-xs text-white/70">Active</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function AnalyticsChartFallback({ data, className = '' }: { data: { label: string; value: number; color: string }[]; className?: string }) {
  const maxValue = Math.max(...data.map(d => d.value), 1)
  return (
    <div className={`flex items-end justify-center gap-6 ${className}`}>
      {data.map((item) => (
        <div key={item.label} className="flex flex-col items-center gap-2">
          <div 
            className="w-12 rounded-t-lg transition-all duration-500"
            style={{ 
              height: `${Math.max((item.value / maxValue) * 150, 8)}px`,
              backgroundColor: item.color,
              boxShadow: `0 0 20px ${item.color}40`
            }}
          />
          <div className="text-center">
            <p className="text-sm font-semibold text-white">{item.value}</p>
            <p className="text-xs text-ns-gray-400">{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

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

export default function HubDashboard() {
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [mounted, setMounted] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')

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

  const handleSaveClient = async (clientId: string, data: any) => {
    const passphrase = sessionStorage.getItem('hub_passphrase')
    try {
      const res = await fetch('/api/hub/clients/', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${passphrase}`
        },
        body: JSON.stringify({ clientId, ...data }),
      })
      if (res.ok) {
        await fetchClients()
      }
    } catch (err) {
      console.error('Failed to save client:', err)
      throw err
    }
  }

  const copyCredentials = (client: Client) => {
    const text = `Portal: https://neversmall.com.au/portal/\nUsername: ${client.username}\n(Password set in Notion)`
    navigator.clipboard.writeText(text)
    setCopiedId(client.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const previewPortal = (client: Client) => {
    // Generate a preview token (same format as portal auth)
    const token = btoa(JSON.stringify({
      clientId: client.id,
      username: 'team-preview',
      exp: Date.now() + (60 * 60 * 1000), // 1 hour
    }))
    window.open(`/portal/dashboard/?token=${token}`, '_blank')
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
    discovery: clients.filter(c => c.status === 'Discovery').length,
    active: clients.filter(c => c.status === 'In Progress').length,
    review: clients.filter(c => c.status === 'Review').length,
    complete: clients.filter(c => c.status === 'Complete').length,
  }

  const chartData = [
    { label: 'Discovery', value: stats.discovery, color: '#38bdf8' },
    { label: 'Active', value: stats.active, color: '#fbbf24' },
    { label: 'Review', value: stats.review, color: '#8b6ec9' },
    { label: 'Complete', value: stats.complete, color: '#34d399' },
  ]

  if (isLoading) {
    return (
      <main className="min-h-screen bg-ns-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-ns-violet/20 flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-ns-violet animate-pulse" />
          </div>
          <p className="text-ns-gray-400">Powering up the hub...</p>
        </div>
      </main>
    )
  }

  return (
    <main className={`min-h-screen bg-ns-black transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[1000px] h-[1000px] bg-gradient-to-br from-ns-violet/20 via-ns-coral/10 to-transparent rounded-full blur-[200px]" />
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-gradient-to-tl from-ns-mint/15 to-transparent rounded-full blur-[150px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-ns-black/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-white/10 shadow-lg shadow-ns-violet/20">
              <Image src="/assets/nss-logo.png" alt="" width={48} height={48} className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-display font-bold text-white text-lg">Command Center</h1>
              <p className="text-ns-gray-500 text-sm">Neversmall Studios</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchClients}
              className="p-2.5 text-ns-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
              title="Refresh"
            >
              <RefreshCw size={18} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-ns-gray-400 hover:text-white px-4 py-2.5 rounded-xl hover:bg-white/5 transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline text-sm font-medium">Exit</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Analytics Row */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Project Orb */}
          <div className="bg-gradient-to-br from-white/[0.05] to-transparent border border-white/[0.08] rounded-3xl overflow-hidden">
            <ProjectOrbFallback 
              activeProjects={stats.active + stats.review} 
              totalProjects={stats.total}
              className="h-64"
            />
            <div className="px-6 pb-5 -mt-4">
              <p className="text-ns-gray-400 text-sm">Active workload</p>
            </div>
          </div>

          {/* Analytics Chart */}
          <div className="lg:col-span-2 bg-gradient-to-br from-white/[0.05] to-transparent border border-white/[0.08] rounded-3xl p-6">
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <BarChart3 size={18} className="text-ns-violet" />
              Project Pipeline
            </h3>
            <AnalyticsChartFallback data={chartData} className="h-64" />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 hover:bg-white/[0.05] transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-ns-violet/30 flex items-center justify-center">
                <Users className="w-5 h-5 text-ns-violet" />
              </div>
            </div>
            <p className="text-3xl font-display font-bold text-white">{stats.total}</p>
            <p className="text-ns-gray-500 text-sm">Total Clients</p>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 hover:bg-white/[0.05] transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/30 flex items-center justify-center">
                <Activity className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <p className="text-3xl font-display font-bold text-white">{stats.active}</p>
            <p className="text-ns-gray-500 text-sm">In Progress</p>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 hover:bg-white/[0.05] transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-violet-500/30 flex items-center justify-center">
                <Eye className="w-5 h-5 text-violet-400" />
              </div>
            </div>
            <p className="text-3xl font-display font-bold text-white">{stats.review}</p>
            <p className="text-ns-gray-500 text-sm">In Review</p>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 hover:bg-white/[0.05] transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/30 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <p className="text-3xl font-display font-bold text-white">{stats.complete}</p>
            <p className="text-ns-gray-500 text-sm">Completed</p>
          </div>
        </div>

        {/* Client Management */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl overflow-hidden">
          {/* Filters */}
          <div className="px-6 py-4 border-b border-white/[0.06] flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ns-gray-500" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-ns-gray-500 focus:outline-none focus:border-ns-violet/50 transition-colors"
              />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 pr-10 text-white focus:outline-none focus:border-ns-violet/50 transition-colors cursor-pointer min-w-[140px]"
              >
                <option value="all">All Status</option>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ns-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Client list */}
          <div className="divide-y divide-white/[0.04]">
            {filteredClients.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="w-12 h-12 text-ns-gray-700 mx-auto mb-4" />
                <p className="text-ns-gray-500">No clients found</p>
              </div>
            ) : (
              filteredClients.map((client) => (
                <div
                  key={client.id}
                  className="px-6 py-5 hover:bg-white/[0.02] transition-colors"
                >
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
                          <span className="flex items-center gap-1.5 bg-white/5 px-2 py-0.5 rounded">
                            <span className="text-ns-gray-500">@</span>
                            {client.username}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-ns-gray-500" />
                          {formatDate(client.startDate)} → {formatDate(client.targetCompletion)}
                        </span>
                        {client.hasPassword ? (
                          <span className="flex items-center gap-1.5 text-emerald-400">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            Ready
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-amber-400">
                            <span className="w-2 h-2 rounded-full bg-amber-400" />
                            Needs setup
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => previewPortal(client)}
                        className="flex items-center gap-1.5 px-3 py-2.5 text-sm bg-white/5 text-ns-gray-300 rounded-xl hover:bg-white/10 transition-colors"
                        title="Preview client portal"
                      >
                        <ExternalLink size={14} />
                        <span className="hidden sm:inline">Preview</span>
                      </button>
                      {client.username && client.hasPassword && (
                        <button
                          onClick={() => copyCredentials(client)}
                          className="flex items-center gap-1.5 px-3 py-2.5 text-sm bg-white/5 text-ns-gray-300 rounded-xl hover:bg-white/10 transition-colors"
                          title="Copy credentials"
                        >
                          {copiedId === client.id ? (
                            <>
                              <Check size={14} className="text-emerald-400" />
                              <span className="hidden sm:inline">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy size={14} />
                              <span className="hidden sm:inline">Copy</span>
                            </>
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => setEditingClient(client)}
                        className="flex items-center gap-1.5 px-4 py-2.5 text-sm bg-ns-violet/20 text-ns-violet rounded-xl hover:bg-ns-violet/30 transition-colors font-medium"
                      >
                        <Edit3 size={14} />
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <ClientEditModal
        client={editingClient}
        isOpen={!!editingClient}
        onClose={() => setEditingClient(null)}
        onSave={handleSaveClient}
      />
    </main>
  )
}
