/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Force dynamic rendering for all routes that use cookies
  experimental: {
    serverComponentsExternalPackages: ['@supabase/ssr', '@supabase/supabase-js'],
  },
  // Explicitly mark routes that should be dynamic
  // This is the recommended approach rather than individual route.ts files
  // which conflict with page.tsx files
  serverComponentsExternalPackages: ['@supabase/ssr', '@supabase/supabase-js'],
}

export default nextConfig