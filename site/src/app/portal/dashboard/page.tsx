'use client'

import { useState, useEffect } from 'react'
import { 
  LogOut, ExternalLink, Calendar, Clock, CheckCircle2, 
  Loader2, Search, FileCheck, FolderOpen, MessageSquare,
  Send, Check, AlertCircle, ChevronRight, Sparkles
} from 'lucide-react'
import Image from 'next/image'

interface ClientData {
  id: string
  name: string
  status: string
  startDate: string | null
  targetCompletion: string | null
  deliverablesLink: string | null
  clientName: string
}

interface Update {
  id: string
  title: string
  message: string
  type: string
  from: string
  date: string | null
}

interface ContentItem {
  id: string
  title: string
  type: 'database' | 'page'
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string; icon: any }> = {
  'Discovery': { label: 'Discovery', color: 'text-sky-400', bgColor: 'bg-sky-500/20', icon: Search },
  'In Progress': { label: 'In Progress', color: 'text-amber-400', bgColor: 'bg-amber-500/20', icon: Loader2 },
  'Review': { label: 'Review', color: 'text-violet-400', bgColor: 'bg-violet-500/20', icon: FileCheck },
  'Complete': { label: 'Complete', color: 'text-emerald-400', bgColor: 'bg-emerald-500/20', icon: CheckCircle2 },
}

function formatDate(dateString: string | null): string {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleDateString('en-AU', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

export default function PortalDashboard() {
  const [client, setClient] = useState<ClientData | null>(null)
  const [updates, setUpdates] = useState<Update[]>([])
  const [content, setContent] = useState<{ databases: ContentItem[]; pages: ContentItem[] }>({ databases: [], pages: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackState, setFeedbackState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const token = sessionStorage.getItem('portal_token')
    if (!token) {
      window.location.href = '/portal/'
      return
    }

    fetchClientData(token)
  }, [])

  const fetchClientData = async (token: string) => {
    try {
      const res = await fetch('/api/portal/client/', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!res.ok) {
        if (res.status === 401) {
          sessionStorage.removeItem('portal_token')
          window.location.href = '/portal/'
          return
        }
        throw new Error('Failed to fetch data')
      }

      const data = await res.json()
      setClient(data.client)
      setUpdates(data.updates || [])
      setContent(data.content || { databases: [], pages: [] })
    } catch (err) {
      setError('Failed to load your portal. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('portal_token')
    sessionStorage.removeItem('portal_client')
    window.location.href = '/portal/'
  }

  const handleFeedback = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!feedbackMessage.trim() || !client) return

    setFeedbackState('sending')
    const token = sessionStorage.getItem('portal_token')

    try {
      const res = await fetch('/api/feedback/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token: client.id, // Use client ID as project ID
          message: feedbackMessage.trim() 
        }),
      })

      if (res.ok) {
        setFeedbackState('sent')
        setFeedbackMessage('')
        // Refresh updates
        if (token) fetchClientData(token)
        setTimeout(() => setFeedbackState('idle'), 3000)
      } else {
        setFeedbackState('error')
      }
    } catch {
      setFeedbackState('error')
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-ns-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-ns-violet animate-spin mx-auto mb-4" />
          <p className="text-ns-gray-400">Loading your portal...</p>
        </div>
      </main>
    )
  }

  if (error || !client) {
    return (
      <main className="min-h-screen bg-ns-black flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-white mb-4">{error || 'Something went wrong'}</p>
          <button
            onClick={() => window.location.href = '/portal/'}
            className="text-ns-violet hover:underline"
          >
            Return to login
          </button>
        </div>
      </main>
    )
  }

  const statusConfig = STATUS_CONFIG[client.status] || STATUS_CONFIG['In Progress']
  const StatusIcon = statusConfig.icon

  return (
    <main className={`min-h-screen bg-ns-black transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-ns-violet/10 to-transparent rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-ns-coral/10 to-transparent rounded-full blur-[80px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-ns-black/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/10">
              <Image
                src="/assets/nss-logo.png"
                alt=""
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="font-display font-bold text-white">{client.name}</h1>
              <p className="text-ns-gray-500 text-sm">Client Portal</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-ns-gray-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline text-sm">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome banner */}
        <div className="bg-gradient-to-br from-ns-violet/20 to-ns-coral/10 border border-white/[0.08] rounded-2xl p-6 sm:p-8 mb-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-ns-gold" />
                <span className="text-ns-gold text-sm font-medium">Welcome back</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
                {client.clientName || client.name}
              </h2>
              <p className="text-ns-gray-400">
                Your project is currently <span className={`font-medium ${statusConfig.color}`}>{client.status || 'Active'}</span>
              </p>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusConfig.bgColor}`}>
              <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
              <span className={`text-sm font-medium ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-sky-400" />
              </div>
              <span className="text-ns-gray-400 text-sm">Started</span>
            </div>
            <p className="text-white font-medium">{formatDate(client.startDate)}</p>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-ns-gray-400 text-sm">Target</span>
            </div>
            <p className="text-white font-medium">{formatDate(client.targetCompletion)}</p>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-violet-400" />
              </div>
              <span className="text-ns-gray-400 text-sm">Updates</span>
            </div>
            <p className="text-white font-medium">{updates.length}</p>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <FolderOpen className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-ns-gray-400 text-sm">Resources</span>
            </div>
            <p className="text-white font-medium">{content.databases.length + content.pages.length}</p>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left column - Updates & Feedback */}
          <div className="lg:col-span-2 space-y-8">
            {/* Updates */}
            <section>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-ns-violet" />
                Project Updates
              </h3>
              <div className="space-y-3">
                {updates.length === 0 ? (
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 text-center">
                    <MessageSquare className="w-8 h-8 text-ns-gray-600 mx-auto mb-3" />
                    <p className="text-ns-gray-400">No updates yet. Check back soon.</p>
                  </div>
                ) : (
                  updates.slice(0, 5).map((update) => (
                    <div
                      key={update.id}
                      className={`bg-white/[0.03] border rounded-xl p-4 ${
                        update.from === 'Client' ? 'border-sky-500/30 bg-sky-500/5' : 'border-white/[0.06]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white text-sm">{update.title}</span>
                          {update.from === 'Client' && (
                            <span className="text-xs px-2 py-0.5 bg-sky-500/20 text-sky-400 rounded-full">You</span>
                          )}
                        </div>
                        <span className="text-ns-gray-500 text-xs">{formatDate(update.date)}</span>
                      </div>
                      <p className="text-ns-gray-400 text-sm">{update.message}</p>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Feedback form */}
            <section>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Send className="w-5 h-5 text-ns-coral" />
                Send Feedback
              </h3>
              <form onSubmit={handleFeedback} className="space-y-4">
                <textarea
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  placeholder="Share your thoughts, questions, or feedback..."
                  disabled={feedbackState === 'sending' || feedbackState === 'sent'}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder:text-ns-gray-500 focus:outline-none focus:border-ns-violet/50 focus:ring-2 focus:ring-ns-violet/20 transition-all min-h-[100px] resize-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!feedbackMessage.trim() || feedbackState === 'sending' || feedbackState === 'sent'}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
                      feedbackState === 'sent'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white text-ns-black hover:bg-ns-gray-200 disabled:opacity-50 disabled:cursor-not-allowed'
                    }`}
                  >
                    {feedbackState === 'sending' && <Loader2 className="w-4 h-4 animate-spin" />}
                    {feedbackState === 'sent' && <Check className="w-4 h-4" />}
                    {feedbackState === 'sending' ? 'Sending...' : feedbackState === 'sent' ? 'Sent' : 'Send Feedback'}
                  </button>
                </div>
              </form>
            </section>
          </div>

          {/* Right column - Resources */}
          <div className="space-y-8">
            {/* Deliverables */}
            {client.deliverablesLink && (
              <section>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-ns-mint" />
                  Deliverables
                </h3>
                <a
                  href={client.deliverablesLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 hover:bg-white/[0.05] hover:border-ns-violet/30 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-ns-mint/20 flex items-center justify-center">
                        <FolderOpen className="w-5 h-5 text-ns-mint" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Project Files</p>
                        <p className="text-ns-gray-500 text-sm">View deliverables</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-ns-gray-500 group-hover:text-ns-violet transition-colors" />
                  </div>
                </a>
              </section>
            )}

            {/* Resources */}
            {(content.databases.length > 0 || content.pages.length > 0) && (
              <section>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <ChevronRight className="w-5 h-5 text-ns-lavender" />
                  Resources
                </h3>
                <div className="space-y-2">
                  {content.databases.map((db) => (
                    <div
                      key={db.id}
                      className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-ns-violet/20 flex items-center justify-center">
                        <FolderOpen className="w-4 h-4 text-ns-violet" />
                      </div>
                      <span className="text-white text-sm font-medium truncate">{db.title}</span>
                    </div>
                  ))}
                  {content.pages.map((page) => (
                    <div
                      key={page.id}
                      className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-ns-coral/20 flex items-center justify-center">
                        <FileCheck className="w-4 h-4 text-ns-coral" />
                      </div>
                      <span className="text-white text-sm font-medium truncate">{page.title}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Contact */}
            <section>
              <h3 className="text-lg font-semibold text-white mb-4">Need Help?</h3>
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                <p className="text-ns-gray-400 text-sm mb-3">
                  Questions about your project? Reach out directly.
                </p>
                <a
                  href="mailto:hello@neversmall.com.au"
                  className="text-ns-violet hover:underline text-sm"
                >
                  hello@neversmall.com.au
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] mt-12 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-ns-gray-600 text-sm">
            © {new Date().getFullYear()} Neversmall Studios
          </p>
        </div>
      </footer>
    </main>
  )
}
