'use client'

import { useState } from 'react'
import { Send, Check, AlertCircle } from 'lucide-react'

interface FeedbackFormProps {
  token: string
}

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

export function FeedbackForm({ token }: FeedbackFormProps) {
  const [message, setMessage] = useState('')
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim()) return

    setSubmitState('submitting')
    setErrorMessage('')

    try {
      const response = await fetch('/api/feedback/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, message: message.trim() }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit feedback')
      }

      setSubmitState('success')
      setMessage('')

      // Reset to idle after 3 seconds
      setTimeout(() => setSubmitState('idle'), 3000)
    } catch (error) {
      setSubmitState('error')
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong')
    }
  }

  const characterCount = message.length
  const maxCharacters = 2000
  const isOverLimit = characterCount > maxCharacters

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Share your thoughts, questions, or feedback..."
          disabled={submitState === 'submitting' || submitState === 'success'}
          className={`
            w-full min-h-[120px] p-4 
            bg-white border rounded-xl 
            text-sm text-ns-gray-900 
            placeholder:text-ns-gray-400
            focus:outline-none focus:ring-2 focus:ring-ns-violet/20 focus:border-ns-violet
            disabled:bg-ns-gray-50 disabled:cursor-not-allowed
            resize-none
            ${isOverLimit ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-ns-gray-200'}
          `}
          rows={4}
        />
        
        {/* Character count */}
        <div className="absolute bottom-3 right-3">
          <span className={`text-xs ${isOverLimit ? 'text-red-500' : 'text-ns-gray-400'}`}>
            {characterCount}/{maxCharacters}
          </span>
        </div>
      </div>

      {/* Error message */}
      {submitState === 'error' && errorMessage && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Submit button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!message.trim() || isOverLimit || submitState === 'submitting' || submitState === 'success'}
          className={`
            inline-flex items-center gap-2 px-5 py-2.5 
            rounded-lg font-medium text-sm
            transition-all duration-200
            disabled:cursor-not-allowed
            ${submitState === 'success'
              ? 'bg-emerald-500 text-white'
              : 'bg-ns-black text-white hover:bg-ns-gray-800 disabled:bg-ns-gray-300'
            }
          `}
        >
          {submitState === 'submitting' && (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending...
            </>
          )}
          {submitState === 'success' && (
            <>
              <Check className="w-4 h-4" />
              Sent
            </>
          )}
          {(submitState === 'idle' || submitState === 'error') && (
            <>
              <Send className="w-4 h-4" />
              Send Feedback
            </>
          )}
        </button>
      </div>
    </form>
  )
}
