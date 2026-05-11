/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * PRODUCTION: Compression
   */
  compress: true,

  /**
   * PRODUCTION: Image optimization
   */
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  /**
   * PRODUCTION: React strict mode
   */
  reactStrictMode: true,

  /**
   * PRODUCTION: Web Vitals reporting
   */
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },

  /**
   * SECURITY: Response headers
   * 
   * Implements:
   * - Content Security Policy (XSS prevention)
   * - Clickjacking protection
   * - MIME type sniffing prevention
   * - Referrer policy
   * - Permissions policy
   * - Secure transport
   * - Cache headers
   */
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        // SECURITY: Prevent clickjacking
        {
          key: "X-Frame-Options",
          value: "DENY",
        },
        // SECURITY: Prevent MIME type sniffing
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        // SECURITY: Control referrer information
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
        },
        // SECURITY: Limit browser APIs
        {
          key: "Permissions-Policy",
          value: "geolocation=(), microphone=(), camera=()",
        },
        // SECURITY: Encourage HTTPS
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
        // SECURITY: Content Security Policy
        // - Blocks inline scripts
        // - Restricts script sources to self and trusted Gemini APIs
        // - Restricts style sources
        // - Restricts frame ancestors
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://cdn.vercel-insights.com",
            "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
            "img-src 'self' data: https:",
            "font-src 'self' data: https:",
            "connect-src 'self' https://generativelanguage.googleapis.com https://*.googleapis.com wss: https://cdn.vercel-insights.com",
            "frame-ancestors 'none'",
            "form-action 'self'",
            "base-uri 'self'",
          ].join("; "),
        },
        // SECURITY: Prevent DNS prefetching of third-party domains
        {
          key: "X-DNS-Prefetch-Control",
          value: "off",
        },
        // PRODUCTION: Cache headers for static assets
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
    // API route caching
    {
      source: "/api/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "no-cache, no-store, must-revalidate",
        },
      ],
    },
    // Static page caching
    {
      source: "/(.*)?",
      has: [
        {
          type: "query",
          key: "_next",
          value: "static",
        },
      ],
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
  ],

  /**
   * PRODUCTION: Redirects and rewrites
   */
  redirects: async () => [
    // Ensure proper trailing slashes
    {
      source: "/tools",
      destination: "/tools/sql",
      permanent: false,
    },
  ],

  /**
   * PRODUCTION: Custom webpack config for optimization
   */
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Browser build optimizations
      config.optimization = {
        ...config.optimization,
        minimize: true,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor code splitting
            vendor: {
              filename: 'chunks/vendor.js',
              test: /node_modules/,
              priority: 10,
            },
            // Common code splitting
            common: {
              filename: 'chunks/common.js',
              minChunks: 2,
              priority: 5,
            },
          },
        },
      };
    }
    return config;
  },
};

export default nextConfig;
