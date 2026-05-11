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
    formats: ["image/avif", "image/webp"],
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
    optimizePackageImports: [
      "framer-motion",
      "lucide-react",
    ],

    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },

  /**
   * SECURITY: Response headers
   */
  headers: async () => [
    {
      source: "/:path*",

      headers: [
        {
          key: "X-Frame-Options",
          value: "DENY",
        },

        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },

        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
        },

        {
          key: "Permissions-Policy",
          value:
            "geolocation=(), microphone=(), camera=()",
        },

        {
          key: "Strict-Transport-Security",
          value:
            "max-age=63072000; includeSubDomains; preload",
        },

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

        {
          key: "X-DNS-Prefetch-Control",
          value: "off",
        },

        {
          key: "Cache-Control",
          value:
            "public, max-age=31536000, immutable",
        },
      ],
    },

    {
      source: "/api/:path*",

      headers: [
        {
          key: "Cache-Control",
          value:
            "no-cache, no-store, must-revalidate",
        },
      ],
    },

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
          value:
            "public, max-age=31536000, immutable",
        },
      ],
    },
  ],

  /**
   * PRODUCTION: Redirects
   */
  redirects: async () => [
    {
      source: "/tools",
      destination: "/tools/sql",
      permanent: false,
    },
  ],

  /**
   * SAFE WEBPACK CONFIG
   */
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;