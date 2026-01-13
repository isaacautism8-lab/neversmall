'use client'

import { MessageSquare, CheckCircle, HelpCircle, Info, User } from 'lucide-react'

interface Update {
  id: string
  title: string
  message: string
  type: string
  from: string
  date: string | null
}

interface UpdatesTimelineProps {
  updates: Update[]
}

const TYPE_CONFIG: Record<string, { icon: typeof MessageSquare; color: string; bgColor: string }> = {
  'Progress': {
    icon: CheckCircle,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
  },
  'Milestone': {
    icon: CheckCircle,
    color: 'text-violet-600',
    bgColor: 'bg-violet-100',
  },
  'Question': {
    icon: HelpCircle,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
  },
  'Feedback': {
    icon: User,
    color: 'text-sky-600',
    bgColor: 'bg-sky-100',
  },
  'FYI': {
    icon: Info,
    color: 'text-ns-gray-600',
    bgColor: 'bg-ns-gray-100',
  },
}

function formatDate(dateString: string | null): string {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
    })
  } catch {
    return ''
  }
}

export function UpdatesTimeline({ updates }: UpdatesTimelineProps) {
  if (updates.length === 0) {
    return (
      <div className="text-center py-8 bg-ns-gray-50 rounded-xl border border-ns-gray-200">
        <MessageSquare className="w-8 h-8 text-ns-gray-400 mx-auto mb-3" />
        <p className="text-ns-gray-500 text-sm">
          No updates yet. Check back soon.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {updates.map((update, index) => {
        const config = TYPE_CONFIG[update.type] || TYPE_CONFIG['FYI']
        const Icon = config.icon
        const isFromClient = update.from === 'Client'

        return (
          <div
            key={update.id}
            className={`relative flex gap-4 ${index !== updates.length - 1 ? 'pb-4' : ''}`}
          >
            {/* Timeline line */}
            {index !== updates.length - 1 && (
              <div className="absolute left-4 top-10 bottom-0 w-px bg-ns-gray-200" />
            )}

            {/* Icon */}
            <div className={`w-8 h-8 rounded-full ${config.bgColor} flex items-center justify-center flex-shrink-0 z-10`}>
              <Icon className={`w-4 h-4 ${config.color}`} />
            </div>

            {/* Content */}
            <div className={`flex-1 bg-white border rounded-xl p-4 ${isFromClient ? 'border-sky-200 bg-sky-50/50' : 'border-ns-gray-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-ns-gray-900">
                    {update.title}
                  </span>
                  {isFromClient && (
                    <span className="text-xs px-2 py-0.5 bg-sky-100 text-sky-600 rounded-full">
                      You
                    </span>
                  )}
                </div>
                <span className="text-xs text-ns-gray-500">
                  {formatDate(update.date)}
                </span>
              </div>
              <p className="text-sm text-ns-gray-600 leading-relaxed">
                {update.message}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
