import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-ns-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-ns-gray-100 mx-auto mb-6">
          <Image
            src="/assets/nss-logo.png"
            alt=""
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-2xl font-display font-bold text-ns-gray-900 mb-3">
          Project Not Found
        </h1>
        <p className="text-ns-gray-500 mb-6">
          This project link may have expired or be invalid. 
          If you think this is an error, please contact us.
        </p>
        <a
          href="mailto:hello@neversmall.com.au"
          className="inline-flex items-center justify-center px-5 py-2.5 bg-ns-black text-white rounded-lg font-medium text-sm hover:bg-ns-gray-800 transition-colors"
        >
          Contact Support
        </a>
      </div>
    </main>
  )
}
