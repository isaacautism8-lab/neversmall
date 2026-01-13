'use client'

import { ExternalLink, FolderOpen } from 'lucide-react'

interface DeliverableLinksProps {
  url: string
}

function getLinkLabel(url: string): string {
  if (url.includes('drive.google.com')) return 'Google Drive'
  if (url.includes('figma.com')) return 'Figma'
  if (url.includes('dropbox.com')) return 'Dropbox'
  if (url.includes('notion.so')) return 'Notion'
  return 'Project Files'
}

export function DeliverableLinks({ url }: DeliverableLinksProps) {
  const label = getLinkLabel(url)

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between p-4 bg-white border border-ns-gray-200 rounded-xl hover:border-ns-violet hover:shadow-sm transition-all duration-200"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-ns-gray-100 flex items-center justify-center group-hover:bg-ns-violet/10 transition-colors">
          <FolderOpen className="w-5 h-5 text-ns-gray-500 group-hover:text-ns-violet transition-colors" />
        </div>
        <div>
          <p className="font-medium text-sm text-ns-gray-900">{label}</p>
          <p className="text-xs text-ns-gray-500">View project deliverables</p>
        </div>
      </div>
      <ExternalLink className="w-4 h-4 text-ns-gray-400 group-hover:text-ns-violet transition-colors" />
    </a>
  )
}
