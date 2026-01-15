'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { 
  LogOut, Calendar, ExternalLink, Send, Clock, 
  CheckCircle2, MessageCircle, Package, ArrowRight,
  FileText, Sparkles, Loader2, Check, ChevronDown, ChevronRight,
  Image as ImageIcon, Code, Link2, File, Square, CheckSquare
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

interface NotionBlock {
  id: string
  type: string
  text?: string
  url?: string
  caption?: string
  language?: string
  checked?: boolean
  hasChildren?: boolean
  icon?: string
  color?: string
  title?: string
  content?: NotionBlock[]
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
  'Discovery': { 
    label: 'Discovery Phase', 
    color: 'from-sky-500 to-sky-600',
    icon: Sparkles
  },
  'In Progress': { 
    label: 'In Progress', 
    color: 'from-amber-500 to-orange-500',
    icon: Clock
  },
  'Review': { 
    label: 'In Review', 
    color: 'from-violet-500 to-purple-600',
    icon: FileText
  },
  'Complete': { 
    label: 'Completed', 
    color: 'from-emerald-500 to-green-600',
    icon: CheckCircle2
  },
}

function formatDate(dateString: string | null): string {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleDateString('en-AU', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
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

// Render a single Notion block
function NotionBlockRenderer({ block }: { block: NotionBlock }) {
  switch (block.type) {
    case 'paragraph':
      if (!block.text) return null
      return <p className="text-ns-gray-300 mb-3">{block.text}</p>
    case 'heading_1':
      return <h2 className="text-2xl font-bold text-white mt-6 mb-3">{block.text}</h2>
    case 'heading_2':
      return <h3 className="text-xl font-semibold text-white mt-5 mb-2">{block.text}</h3>
    case 'heading_3':
      return <h4 className="text-lg font-medium text-white mt-4 mb-2">{block.text}</h4>
    case 'bulleted_list_item':
      return (
        <div className="flex gap-2 mb-1">
          <span className="text-ns-violet">•</span>
          <span className="text-ns-gray-300">{block.text}</span>
        </div>
      )
    case 'numbered_list_item':
      return (
        <div className="flex gap-2 mb-1">
          <span className="text-ns-violet min-w-[1.5rem]">→</span>
          <span className="text-ns-gray-300">{block.text}</span>
        </div>
      )
    case 'to_do':
      return (
        <div className="flex gap-2 mb-1 items-start">
          {block.checked ? (
            <CheckSquare size={18} className="text-emerald-400 mt-0.5" />
          ) : (
            <Square size={18} className="text-ns-gray-500 mt-0.5" />
          )}
          <span className={block.checked ? 'text-ns-gray-500 line-through' : 'text-ns-gray-300'}>
            {block.text}
          </span>
        </div>
      )
    case 'quote':
      return (
        <blockquote className="border-l-4 border-ns-violet pl-4 py-2 my-3 italic text-ns-gray-400">
          {block.text}
        </blockquote>
      )
    case 'callout':
      return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 my-3 flex gap-3">
          {block.icon && <span className="text-xl">{block.icon}</span>}
          <span className="text-ns-gray-300">{block.text}</span>
        </div>
      )
    case 'code':
      return (
        <div className="my-3">
          <div className="bg-ns-gray-900 rounded-xl p-4 overflow-x-auto">
            <pre className="text-sm text-ns-gray-300 font-mono">{block.text}</pre>
          </div>
          {block.language && (
            <span className="text-xs text-ns-gray-500">{block.language}</span>
          )}
        </div>
      )
    case 'image':
      return block.url ? (
        <div className="my-4">
          <img 
            src={block.url} 
            alt={block.caption || ''} 
            className="rounded-xl max-w-full h-auto"
          />
          {block.caption && (
            <p className="text-sm text-ns-gray-500 mt-2 text-center">{block.caption}</p>
          )}
        </div>
      ) : null
    case 'video':
      return block.url ? (
        <div className="my-4">
          <video src={block.url} controls className="rounded-xl max-w-full" />
        </div>
      ) : null
    case 'file':
      return block.url ? (
        <a 
          href={block.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-xl p-3 my-2 transition-colors"
        >
          <File size={18} className="text-ns-violet" />
          <span className="text-ns-gray-300">{block.title || 'Download File'}</span>
          <ExternalLink size={14} className="text-ns-gray-500 ml-auto" />
        </a>
      ) : null
    case 'bookmark':
    case 'embed':
      return block.url ? (
        <a 
          href={block.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-xl p-3 my-2 transition-colors"
        >
          <Link2 size={18} className="text-ns-violet" />
          <span className="text-ns-gray-300 truncate">{block.caption || block.url}</span>
          <ExternalLink size={14} className="text-ns-gray-500 ml-auto flex-shrink-0" />
        </a>
      ) : null
    case 'divider':
      return <hr className="border-white/10 my-6" />
    default:
      return null
  }
}

// Collapsible section for child pages
function ChildPageSection({ page }: { page: NotionBlock }) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden my-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <FileText size={18} className="text-ns-violet" />
          <span className="font-medium text-white">{page.title || 'Untitled'}</span>
        </div>
        {isOpen ? (
          <ChevronDown size={18} className="text-ns-gray-400" />
        ) : (
          <ChevronRight size={18} className="text-ns-gray-400" />
        )}
      </button>
      {isOpen && page.content && page.content.length > 0 && (
        <div className="px-4 pb-4 border-t border-white/[0.06]">
          <div className="pt-4">
            {page.content.map((block) => (
              <NotionBlockRenderer key={block.id} block={block} />
            ))}
          </div>
        </div>
      )}
      {isOpen && (!page.content || page.content.length === 0) && (
        <div className="px-4 pb-4 border-t border-white/[0.06]">
          <p className="text-ns-gray-500 text-sm pt-4">No content in this section</p>
        </div>
      )}
    </div>
  )
}

export default function PortalDashboard() {
  const [project, setProject] = useState<ProjectData | null>(null)
  const [content, setContent] = useState<NotionBlock[]>([])
  const [childPages, setChildPages] = useState<NotionBlock[]>([])
  const [updates, setUpdates] = useState<Update[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [isSendingFeedback, setIsSendingFeedback] = useState(false)
  const [feedbackSent, setFeedbackSent] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check for token in URL (team preview) or session
    const urlParams = new URLSearchParams(window.location.search)
    const urlToken = urlParams.get('token')
    
    if (urlToken) {
      // Team preview mode
      sessionStorage.setItem('portal_token', urlToken)
      sessionStorage.setItem('portal_auth', 'true')
      // Clean URL
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
        setContent(data.content || [])
        setChildPages(data.childPages || [])
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
        // Refresh to show the new feedback
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
          <button onClick={handleLogout} className="text-ns-violet hover:underline">
            Return to login
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className={`min-h-screen bg-ns-black transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-gradient-to-br from-ns-violet/15 to-transparent rounded-full blur-[200px]" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-gradient-to-tr from-ns-coral/10 to-transparent rounded-full blur-[150px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-ns-black/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-white/10">
              <Image src="/assets/nss-logo.png" alt="" width={40} height={40} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-ns-gray-500 text-xs uppercase tracking-wider">Client Portal</p>
              <h1 className="font-semibold text-white text-sm">Neversmall Studios</h1>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-ns-gray-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Project Hero */}
        <div className="bg-gradient-to-br from-white/[0.05] to-transparent border border-white/[0.08] rounded-3xl overflow-hidden mb-8">
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-ns-gray-400 text-sm mb-1">Your Project</p>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
                  {project.name}
                </h2>
                <p className="text-ns-gray-400">
                  Hello, {project.clientName}
                </p>
              </div>
              {/* Status badge */}
              {statusInfo && (
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${statusInfo.color} text-white text-sm font-medium`}>
                  <StatusIcon size={16} />
                  {statusInfo.label}
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-white/[0.03] rounded-2xl p-4">
                <div className="flex items-center gap-2 text-ns-gray-400 text-sm mb-1">
                  <Calendar size={14} />
                  Started
                </div>
                <p className="text-white font-medium">{formatDate(project.startDate)}</p>
              </div>
              <div className="bg-white/[0.03] rounded-2xl p-4">
                <div className="flex items-center gap-2 text-ns-gray-400 text-sm mb-1">
                  <Clock size={14} />
                  Target
                </div>
                <p className="text-white font-medium">{formatDate(project.targetCompletion)}</p>
              </div>
              <div className="bg-white/[0.03] rounded-2xl p-4">
                <div className="flex items-center gap-2 text-ns-gray-400 text-sm mb-1">
                  <CheckCircle2 size={14} />
                  Last activity
                </div>
                <p className="text-white font-medium">{formatRelative(project.lastEdited)}</p>
              </div>
            </div>
          </div>

          {/* Deliverables Link */}
          {project.deliverablesLink && (
            <a
              href={project.deliverablesLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-6 bg-gradient-to-r from-ns-violet/20 to-ns-coral/10 border-t border-white/[0.06] hover:from-ns-violet/30 hover:to-ns-coral/20 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-ns-violet/30 flex items-center justify-center">
                  <Package className="w-6 h-6 text-ns-violet" />
                </div>
                <div>
                  <p className="text-white font-semibold">Your Deliverables</p>
                  <p className="text-ns-gray-400 text-sm">View files and assets</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-ns-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </a>
          )}
        </div>

        {/* Project Content from Notion */}
        {(content.length > 0 || childPages.length > 0) && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-ns-violet" />
              <h3 className="text-lg font-semibold text-white">Project Details</h3>
            </div>
            
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
              {/* Main content blocks */}
              {content.length > 0 && (
                <div className="mb-4">
                  {content.map((block) => (
                    <NotionBlockRenderer key={block.id} block={block} />
                  ))}
                </div>
              )}
              
              {/* Child pages / sections */}
              {childPages.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm text-ns-gray-500 mb-3 uppercase tracking-wider">Sections</p>
                  {childPages.map((page) => (
                    <ChildPageSection key={page.id} page={page} />
                  ))}
                </div>
              )}
              
              {content.length === 0 && childPages.length === 0 && (
                <p className="text-ns-gray-500">No additional content available</p>
              )}
            </div>
            
            {/* Link to full Notion page */}
            {project.notionUrl && (
              <a
                href={project.notionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 mt-4 text-sm text-ns-gray-400 hover:text-white transition-colors"
              >
                <ExternalLink size={14} />
                View full page in Notion
              </a>
            )}
          </div>
        )}

        {/* Updates */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="w-5 h-5 text-ns-violet" />
            <h3 className="text-lg font-semibold text-white">Updates</h3>
            <span className="text-ns-gray-500 text-sm">({updates.length})</span>
          </div>
          
          {updates.length === 0 ? (
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8 text-center">
              <MessageCircle className="w-12 h-12 text-ns-gray-700 mx-auto mb-3" />
              <p className="text-ns-gray-500">No updates yet</p>
              <p className="text-ns-gray-600 text-sm">We&apos;ll post progress updates here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {updates.map((update, index) => (
                <div
                  key={update.id}
                  className={`bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 ${
                    index === 0 ? 'ring-2 ring-ns-violet/20' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        update.from === 'Client' 
                          ? 'bg-ns-coral/20 text-ns-coral' 
                          : 'bg-ns-violet/20 text-ns-violet'
                      }`}>
                        {update.from === 'Client' ? 'You' : 'Studio'}
                      </span>
                      {update.type && update.type !== 'FYI' && (
                        <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-ns-gray-400">
                          {update.type}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-ns-gray-500">
                      {formatRelative(update.date)}
                    </span>
                  </div>
                  <p className="text-white font-medium mb-1">{update.title}</p>
                  <p className="text-ns-gray-400 text-sm">{update.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Feedback Form */}
        <div className="bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.06] rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <Send className="w-5 h-5 text-ns-coral" />
            <h3 className="text-lg font-semibold text-white">Send Feedback</h3>
          </div>
          <p className="text-ns-gray-400 text-sm mb-4">
            Have questions or feedback? Drop us a message and we&apos;ll get back to you.
          </p>
          
          <form onSubmit={handleSubmitFeedback}>
            <textarea
              value={feedbackMessage}
              onChange={(e) => setFeedbackMessage(e.target.value)}
              placeholder="What's on your mind?"
              rows={4}
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder:text-ns-gray-500 focus:outline-none focus:border-ns-violet/50 focus:ring-2 focus:ring-ns-violet/20 resize-none mb-4 transition-all"
              maxLength={2000}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-ns-gray-500">
                {feedbackMessage.length}/2000
              </span>
              <button
                type="submit"
                disabled={!feedbackMessage.trim() || isSendingFeedback}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-ns-violet to-ns-coral text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-ns-violet/25 transition-all"
              >
                {feedbackSent ? (
                  <>
                    <Check size={18} />
                    Sent!
                  </>
                ) : isSendingFeedback ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send Message
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] py-6 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-ns-gray-500 text-sm">
            Neversmall Studios • Have urgent questions? Email us directly.
          </p>
        </div>
      </footer>
    </main>
  )
}
