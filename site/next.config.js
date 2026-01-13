/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Note: Removed 'output: export' to enable API routes
  // Cloudflare Pages handles this via @cloudflare/next-on-pages
}

module.exports = nextConfig
