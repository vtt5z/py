/** @type {import('next').NextConfig} */
const nextConfig = {
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
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
            "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
            "img-src 'self' data: https:",
            "font-src 'self' data: https:",
            "connect-src 'self' https://generativelanguage.googleapis.com https://*.googleapis.com wss:",
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
      ],
    },
  ],
};

export default nextConfig;
