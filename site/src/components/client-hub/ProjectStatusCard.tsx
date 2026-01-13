'use client'

import { Clock, Calendar, CheckCircle2, Loader2, Search, FileCheck } from 'lucide-react'

interface ProjectStatusCardProps {
  status: string
  startDate: string | null
  targetCompletion: string | null
  lastUpdated: string | null
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string; icon: typeof Clock }> = {
  'Discovery': {
    label: 'Discovery',
    color: 'text-sky-600',
    bgColor: 'bg-sky-100',
    icon: Search,
  },
  'In Progress': {
    label: 'In Progress',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    icon: Loader2,
  },
  'Review': {
    label: 'Review',
    color: 'text-violet-600',
    bgColor: 'bg-violet-100',
    icon: FileCheck,
  },
  'Complete': {
    label: 'Complete',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    icon: CheckCircle2,
  },
}

function formatDate(dateString: string | null): string {
  if (!dateString) return '—'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return '—'
  }
}

function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return formatDate(dateString)
  } catch {
    return ''
  }
}

export function ProjectStatusCard({
  status,
  startDate,
  targetCompletion,
  lastUpdated,
}: ProjectStatusCardProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG['In Progress']
  const StatusIcon = config.icon

  return (
    <div className="bg-white border border-ns-gray-200 rounded-xl p-6 shadow-sm">
      {/* Status Badge */}
      <div className="flex items-center justify-between mb-6">
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bgColor}`}>
          <StatusIcon className={`w-4 h-4 ${config.color}`} />
          <span className={`text-sm font-medium ${config.color}`}>
            {config.label}
          </span>
        </div>
        {lastUpdated && (
          <span className="text-xs text-ns-gray-500">
            Updated {formatRelativeTime(lastUpdated)}
          </span>
        )}
      </div>

      {/* Timeline */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-ns-gray-100 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-4 h-4 text-ns-gray-500" />
          </div>
          <div>
            <p className="text-xs text-ns-gray-500 mb-0.5">Started</p>
            <p className="text-sm font-medium text-ns-gray-900">
              {formatDate(startDate)}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-ns-gray-100 flex items-center justify-center flex-shrink-0">
            <Clock className="w-4 h-4 text-ns-gray-500" />
          </div>
          <div>
            <p className="text-xs text-ns-gray-500 mb-0.5">Target</p>
            <p className="text-sm font-medium text-ns-gray-900">
              {formatDate(targetCompletion)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
