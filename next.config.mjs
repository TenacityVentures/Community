/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return {
      beforeFiles: [
        // Route log.10na.city/* → /log/*
        {
          source: '/:path*',
          has: [{ type: 'host', value: 'log.10na.city' }],
          destination: '/log/:path*',
        },
        // Root of log subdomain → /log
        {
          source: '/',
          has: [{ type: 'host', value: 'log.10na.city' }],
          destination: '/log',
        },
      ],
    }
  },
}

export default nextConfig
