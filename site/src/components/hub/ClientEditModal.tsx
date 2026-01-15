'use client'

import { useState } from 'react'
import { Modal } from './Modal'
import { Save, Sparkles, Copy, Check, ExternalLink } from 'lucide-react'

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
}

interface ClientEditModalProps {
  client: Client | null
  isOpen: boolean
  onClose: () => void
  onSave: (clientId: string, data: any) => Promise<void>
}

const STATUS_OPTIONS = ['Discovery', 'In Progress', 'Review', 'Complete']

function generatePassword(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%'
  let password = ''
  for (let i = 0; i < 14; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

export function ClientEditModal({ client, isOpen, onClose, onSave }: ClientEditModalProps) {
  const [form, setForm] = useState({
    username: client?.username || '',
    password: '',
    status: client?.status || '',
    startDate: client?.startDate || '',
    targetCompletion: client?.targetCompletion || '',
    deliverablesLink: client?.deliverablesLink || '',
    clientName: client?.clientName || '',
  })
  const [isSaving, setIsSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  // Reset form when client changes
  useState(() => {
    if (client) {
      setForm({
        username: client.username || '',
        password: '',
        status: client.status || '',
        startDate: client.startDate || '',
        targetCompletion: client.targetCompletion || '',
        deliverablesLink: client.deliverablesLink || '',
        clientName: client.clientName || '',
      })
    }
  })

  const handleSave = async () => {
    if (!client) return
    setIsSaving(true)
    try {
      await onSave(client.id, form)
      onClose()
    } finally {
      setIsSaving(false)
    }
  }

  const handleGeneratePassword = () => {
    setForm(prev => ({ ...prev, password: generatePassword() }))
  }

  const copyCredentials = () => {
    const text = `Client Portal Access
---
URL: https://neversmall.com.au/portal/
Username: ${form.username}
Password: ${form.password || '(unchanged)'}
`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!client) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit: ${client.name}`} size="lg">
      <div className="p-6 space-y-6">
        {/* Credentials Section */}
        <div className="bg-gradient-to-br from-ns-violet/20 to-ns-coral/10 border border-white/10 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Sparkles size={16} className="text-ns-gold" />
            Portal Credentials
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-ns-gray-400 text-sm mb-1.5">Username</label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm(prev => ({ ...prev, username: e.target.value }))}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-ns-gray-500 focus:outline-none focus:border-ns-violet/50 focus:ring-2 focus:ring-ns-violet/20"
                placeholder="client_username"
              />
            </div>
            <div>
              <label className="block text-ns-gray-400 text-sm mb-1.5">Password</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.password}
                  onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                  className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-ns-gray-500 focus:outline-none focus:border-ns-violet/50 focus:ring-2 focus:ring-ns-violet/20 font-mono"
                  placeholder="Leave empty to keep current"
                />
                <button
                  onClick={handleGeneratePassword}
                  className="px-4 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                  title="Generate secure password"
                >
                  <Sparkles size={18} />
                </button>
              </div>
            </div>
          </div>
          {form.username && (
            <button
              onClick={copyCredentials}
              className="mt-4 flex items-center gap-2 text-sm text-ns-violet hover:text-white transition-colors"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy credentials to share'}
            </button>
          )}
        </div>

        {/* Project Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white">Project Details</h3>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-ns-gray-400 text-sm mb-1.5">Client Contact Name</label>
              <input
                type="text"
                value={form.clientName}
                onChange={(e) => setForm(prev => ({ ...prev, clientName: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-ns-gray-500 focus:outline-none focus:border-ns-violet/50"
                placeholder="Jane Smith"
              />
            </div>
            <div>
              <label className="block text-ns-gray-400 text-sm mb-1.5">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-ns-violet/50 cursor-pointer"
              >
                <option value="">Select status</option>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-ns-gray-400 text-sm mb-1.5">Start Date</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-ns-violet/50"
              />
            </div>
            <div>
              <label className="block text-ns-gray-400 text-sm mb-1.5">Target Completion</label>
              <input
                type="date"
                value={form.targetCompletion}
                onChange={(e) => setForm(prev => ({ ...prev, targetCompletion: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-ns-violet/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-ns-gray-400 text-sm mb-1.5">Deliverables Link</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={form.deliverablesLink}
                onChange={(e) => setForm(prev => ({ ...prev, deliverablesLink: e.target.value }))}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-ns-gray-500 focus:outline-none focus:border-ns-violet/50"
                placeholder="https://drive.google.com/..."
              />
              {form.deliverablesLink && (
                <a
                  href={form.deliverablesLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 bg-white/5 text-ns-gray-400 hover:text-white rounded-lg transition-colors"
                >
                  <ExternalLink size={18} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-ns-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-ns-violet text-white rounded-lg hover:bg-ns-violet/90 disabled:opacity-50 transition-colors font-medium"
          >
            <Save size={16} />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
