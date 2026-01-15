'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { 
  LogOut, Calendar, ExternalLink, Send, Clock, 
  CheckCircle2, MessageCircle, Package, ArrowRight,
  FileText, Sparkles, Loader2, Check, ChevronDown, ChevronRight,
  Maximize2, Minimize2, RefreshCw
} from 'lucide-react'

interface ProjectData {
  id: string
  name: string
  status: string
  clientName: string
  startDate: string | null
  targetCompletion: string | null
  deliverablesLink: string | null
  lastEdited: string
  notionUrl?: string
}

interface Update {
  id: string
  title: string
  message: string
  type: string
  from: string
  date: string | null
}

const STATUS_DISPLAY: Record<string, { label: string; color: string; icon: any }> = {
  'Discovery': { label: 'Discovery Phase', color: 'from-sky-500 to-sky-600', icon: Sparkles },
  'In Progress': { label: 'In Progress', color: 'from-amber-500 to-orange-500', icon: Clock },
  'Review': { label: 'In Review', color: 'from-violet-500 to-purple-600', icon: FileText },
  'Complete': { label: 'Completed', color: 'from-emerald-500 to-green-600', icon: CheckCircle2 },
}

function formatDate(dateString: string | null): string {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatRelative(dateString: string | null): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  if (diff < 7) return `${diff} days ago`
  return formatDate(dateString)
}

// Convert Notion page URL to embeddable URL
function getNotionEmbedUrl(notionUrl: string | undefined): string | null {
  if (!notionUrl) return null
  // Extract page ID from URL and create embed URL
  const match = notionUrl.match(/([a-f0-9]{32})/)
  if (match) {
    return `https://www.notion.so/${match[1]}`
  }
  return notionUrl
}

export default function PortalDashboard() {
  const [project, setProject] = useState<ProjectData | null>(null)
  const [updates, setUpdates] = useState<Update[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [isSendingFeedback, setIsSendingFeedback] = useState(false)
  const [feedbackSent, setFeedbackSent] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [viewMode, setViewMode] = useState<'native' | 'notion'>('notion')

  useEffect(() => {
    setMounted(true)
    const urlParams = new URLSearchParams(window.location.search)
    const urlToken = urlParams.get('token')
    
    if (urlToken) {
      sessionStorage.setItem('portal_token', urlToken)
      sessionStorage.setItem('portal_auth', 'true')
      window.history.replaceState({}, '', '/portal/dashboard/')
    }
    
    const auth = sessionStorage.getItem('portal_auth')
    if (auth !== 'true') {
      window.location.href = '/portal/'
      return
    }
    fetchProjectData()
  }, [])

  const fetchProjectData = async () => {
    const token = sessionStorage.getItem('portal_token')
    try {
      const res = await fetch(`/api/portal/client/?token=${token}`)
      if (res.ok) {
        const data = await res.json()
        setProject(data.project)
        setUpdates(data.updates || [])
      } else {
        handleLogout()
      }
    } catch (err) {
      console.error('Failed to fetch project:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('portal_auth')
    sessionStorage.removeItem('portal_token')
    sessionStorage.removeItem('portal_username')
    window.location.href = '/portal/'
  }

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!feedbackMessage.trim()) return
    
    setIsSendingFeedback(true)
    const token = sessionStorage.getItem('portal_token')
    
    try {
      const res = await fetch('/api/feedback/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, message: feedbackMessage }),
      })
      
      if (res.ok) {
        setFeedbackSent(true)
        setFeedbackMessage('')
        setTimeout(() => setFeedbackSent(false), 3000)
        await fetchProjectData()
      }
    } catch (err) {
      console.error('Failed to send feedback:', err)
    } finally {
      setIsSendingFeedback(false)
    }
  }

  const statusInfo = project?.status ? STATUS_DISPLAY[project.status] : null
  const StatusIcon = statusInfo?.icon || Clock
  const notionEmbedUrl = getNotionEmbedUrl(project?.notionUrl)

  if (isLoading) {
    return (
      <main className="min-h-screen bg-ns-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-ns-violet/20 flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-ns-violet animate-spin" />
          </div>
          <p className="text-ns-gray-400">Loading your project...</p>
        </div>
      </main>
    )
  }

  if (!project) {
    return (
      <main className="min-h-screen bg-ns-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-ns-gray-400 mb-4">Unable to load project</p>
          <button onClick={handleLogout} className="text-ns-violet hover:underline">Return to login</button>
        </div>
      </main>
    )
  }

  // Fullscreen Notion view
  if (isFullscreen && notionEmbedUrl) {
    return (
      <main className="fixed inset-0 bg-ns-black z-50">
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
          <button
            onClick={() => setIsFullscreen(false)}
            className="flex items-center gap-2 px-4 py-2 bg-ns-black/80 text-white rounded-xl hover:bg-ns-black transition-colors backdrop-blur-sm border border-white/10"
          >
            <Minimize2 size={18} />
            Exit Fullscreen
          </button>
        </div>
        <iframe
          src={notionEmbedUrl}
          className="w-full h-full border-0"
          allow="fullscreen"
        />
      </main>
    )
  }

  return (
    <main className={`min-h-screen bg-ns-black transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-ns-black/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-white/10">
              <Image src="/assets/nss-logo.png" alt="" width={40} height={40} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-ns-gray-500 text-xs uppercase tracking-wider">Client Portal</p>
              <h1 className="font-semibold text-white text-sm">{project.name}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {notionEmbedUrl && (
              <button
                onClick={() => setIsFullscreen(true)}
                className="flex items-center gap-2 text-ns-gray-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm"
              >
                <Maximize2 size={16} />
                <span className="hidden sm:inline">Fullscreen</span>
              </button>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-ns-gray-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Two column layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left sidebar - Project info */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
              <p className="text-ns-gray-500 text-xs uppercase tracking-wider mb-3">Project Status</p>
              {statusInfo && (
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${statusInfo.color} text-white text-sm font-medium`}>
                  <StatusIcon size={16} />
                  {statusInfo.label}
                </div>
              )}
              <div className="mt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-ns-gray-400">Started</span>
                  <span className="text-white">{formatDate(project.startDate)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ns-gray-400">Target</span>
                  <span className="text-white">{formatDate(project.targetCompletion)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ns-gray-400">Last update</span>
                  <span className="text-white">{formatRelative(project.lastEdited)}</span>
                </div>
              </div>
            </div>

            {/* Deliverables */}
            {project.deliverablesLink && (
              <a
                href={project.deliverablesLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-gradient-to-r from-ns-violet/20 to-ns-coral/10 border border-white/[0.08] rounded-2xl p-5 hover:from-ns-violet/30 hover:to-ns-coral/20 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-ns-violet/30 flex items-center justify-center">
                  <Package className="w-6 h-6 text-ns-violet" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold">Deliverables</p>
                  <p className="text-ns-gray-400 text-sm">View files & assets</p>
                </div>
                <ArrowRight className="w-5 h-5 text-ns-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </a>
            )}

            {/* Feedback Form */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Send className="w-4 h-4 text-ns-coral" />
                <h3 className="font-semibold text-white text-sm">Quick Feedback</h3>
              </div>
              <form onSubmit={handleSubmitFeedback}>
                <textarea
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  placeholder="Questions or feedback..."
                  rows={3}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-white placeholder:text-ns-gray-500 focus:outline-none focus:border-ns-violet/50 resize-none text-sm mb-3"
                  maxLength={2000}
                />
                <button
                  type="submit"
                  disabled={!feedbackMessage.trim() || isSendingFeedback}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-ns-violet to-ns-coral text-white rounded-xl font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-ns-violet/25 transition-all"
                >
                  {feedbackSent ? <><Check size={16} /> Sent!</> : isSendingFeedback ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : <><Send size={16} /> Send</>}
                </button>
              </form>
            </div>

            {/* Recent Updates */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-ns-violet" />
                  <h3 className="font-semibold text-white text-sm">Updates</h3>
                </div>
                <span className="text-xs text-ns-gray-500">{updates.length}</span>
              </div>
              {updates.length === 0 ? (
                <p className="text-ns-gray-500 text-sm">No updates yet</p>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {updates.slice(0, 5).map((update) => (
                    <div key={update.id} className="text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-1.5 py-0.5 rounded ${update.from === 'Client' ? 'bg-ns-coral/20 text-ns-coral' : 'bg-ns-violet/20 text-ns-violet'}`}>
                          {update.from === 'Client' ? 'You' : 'Studio'}
                        </span>
                        <span className="text-xs text-ns-gray-500">{formatRelative(update.date)}</span>
                      </div>
                      <p className="text-ns-gray-300 line-clamp-2">{update.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main content - Notion embed */}
          <div className="lg:col-span-2">
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden h-[calc(100vh-180px)] min-h-[600px]">
              {notionEmbedUrl ? (
                <iframe
                  src={notionEmbedUrl}
                  className="w-full h-full border-0"
                  allow="fullscreen"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-8">
                    <FileText className="w-16 h-16 text-ns-gray-700 mx-auto mb-4" />
                    <p className="text-ns-gray-400 mb-2">Project content loading...</p>
                    <p className="text-ns-gray-500 text-sm">If this persists, contact the studio</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
