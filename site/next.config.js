/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' for Cloudflare Pages compatibility
  // @cloudflare/next-on-pages handles the build output
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig
