import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProjectStatusCard } from '@/components/client-hub/ProjectStatusCard'
import { UpdatesTimeline } from '@/components/client-hub/UpdatesTimeline'
import { FeedbackForm } from '@/components/client-hub/FeedbackForm'
import { DeliverableLinks } from '@/components/client-hub/DeliverableLinks'
import Image from 'next/image'

interface ProjectData {
  name: string
  status: string
  clientName: string
  startDate: string | null
  targetCompletion: string | null
  deliverablesLink: string | null
  lastUpdated: string | null
}

interface Update {
  id: string
  title: string
  message: string
  type: string
  from: string
  date: string | null
}

interface PageProps {
  params: { token: string }
}

export const metadata: Metadata = {
  title: 'Project Hub',
  description: 'View your project status and updates',
  robots: { index: false, follow: false },
}

// Revalidate every 5 minutes
export const revalidate = 300

async function getProjectData(token: string): Promise<{
  project: ProjectData
  updates: Update[]
} | null> {
  // Use relative URL for server-side fetch during build
  // and absolute URL at runtime
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
    (typeof window === 'undefined' ? 'http://localhost:3000' : '')
  
  try {
    const res = await fetch(`${baseUrl}/api/project/${token}/`, {
      next: { revalidate: 300 },
    })

    if (!res.ok) return null
    return res.json()
  } catch (error) {
    console.error('Error fetching project:', error)
    return null
  }
}

export default async function ClientProjectPage({ params }: PageProps) {
  const { token } = params

  // Basic token validation
  if (!token || token.length < 20) {
    notFound()
  }

  const data = await getProjectData(token)

  if (!data) {
    notFound()
  }

  const { project, updates } = data

  return (
    <main className="min-h-screen bg-ns-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-ns-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-ns-gray-100 flex-shrink-0">
              <Image
                src="/assets/nss-logo.png"
                alt=""
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs font-semibold tracking-widest text-ns-gray-500 uppercase">
              NeverSmall Studios
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-ns-gray-900">
            {project.name}
          </h1>
          {project.clientName && (
            <p className="text-ns-gray-500 mt-1">
              Project for {project.clientName}
            </p>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Status Card */}
        <section aria-labelledby="status-heading">
          <h2 id="status-heading" className="sr-only">Project Status</h2>
          <ProjectStatusCard
            status={project.status}
            startDate={project.startDate}
            targetCompletion={project.targetCompletion}
            lastUpdated={project.lastUpdated}
          />
        </section>

        {/* Deliverables Link */}
        {project.deliverablesLink && (
          <section aria-labelledby="deliverables-heading">
            <h2 id="deliverables-heading" className="text-lg font-semibold text-ns-gray-900 mb-3">
              Deliverables
            </h2>
            <DeliverableLinks url={project.deliverablesLink} />
          </section>
        )}

        {/* Updates Timeline */}
        <section aria-labelledby="updates-heading">
          <h2 id="updates-heading" className="text-lg font-semibold text-ns-gray-900 mb-4">
            Project Updates
          </h2>
          <UpdatesTimeline updates={updates} />
        </section>

        {/* Feedback Form */}
        <section aria-labelledby="feedback-heading">
          <h2 id="feedback-heading" className="text-lg font-semibold text-ns-gray-900 mb-4">
            Share Feedback
          </h2>
          <div className="bg-white border border-ns-gray-200 rounded-xl p-4 sm:p-6">
            <p className="text-sm text-ns-gray-500 mb-4">
              Questions or thoughts? Let us know below.
            </p>
            <FeedbackForm token={token} />
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-ns-gray-200 bg-white py-6 mt-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-ns-gray-500 text-sm">
            NeverSmall Studios
          </p>
          <p className="text-ns-gray-400 text-xs mt-1">
            Questions? Email{' '}
            <a 
              href="mailto:hello@neversmall.com.au" 
              className="text-ns-violet hover:underline"
            >
              hello@neversmall.com.au
            </a>
          </p>
        </div>
      </footer>
    </main>
  )
}
