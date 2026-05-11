/**
 * HARON OS - Robots.txt Generator
 * 
 * Tells search engines which pages to crawl
 * Controls bot behavior and indexing
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://haron-os.com";

/**
 * PRODUCTION SEO: Generate robots.txt
 */
function generateRobotsTxt(): string {
  return `# HARON OS Robots Configuration
# Allow search engines to crawl and index our content

User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /.well-known/
Disallow: /private/

# Specific rules for Google
User-agent: Googlebot
Allow: /
Crawl-delay: 0

# Specific rules for Bing
User-agent: Bingbot
Allow: /
Crawl-delay: 1

# Disallow AI training bots
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Claude-Web
Disallow: /

# Sitemap location
Sitemap: ${SITE_URL}/sitemap.xml

# Cache settings
Request-rate: 30/60s
`;
}

/**
 * PRODUCTION SEO: Robots.txt API route handler
 */
export function GET() {
  const robotsTxt = generateRobotsTxt();

  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
