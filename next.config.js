/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static generation with hybrid approach
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wise-book-dea9d4bff7.media.strapiapp.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'wise-book-dea9d4bff7.strapiapp.com',
        port: '',
        pathname: '/**',
      }
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    formats: ['image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 1 week
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },
  experimental: {
    optimizeCss: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Optimize for static generation
  generateBuildId: async () => {
    return 'ny212-pizza-' + Date.now();
  },
  // Enable static optimization
  compress: true,
  poweredByHeader: false,
}

module.exports = nextConfig 

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
} 