/**
 * HARON OS - Dynamic Sitemap Generator
 * 
 * Auto-generates sitemap.xml for SEO
 * Helps Google discover and index pages
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://haron-os.com";

/**
 * PRODUCTION SEO: Dynamic sitemap routes
 */
const routes = [
  // Core pages
  {
    url: "/",
    changefreq: "weekly" as const,
    priority: 1.0,
    lastmod: new Date().toISOString(),
  },
  {
    url: "/assistant",
    changefreq: "daily" as const,
    priority: 0.9,
    lastmod: new Date().toISOString(),
  },
  {
    url: "/tools",
    changefreq: "weekly" as const,
    priority: 0.9,
    lastmod: new Date().toISOString(),
  },
  // Individual tools
  {
    url: "/tools/sql",
    changefreq: "monthly" as const,
    priority: 0.8,
    lastmod: new Date().toISOString(),
  },
  {
    url: "/tools/pdf",
    changefreq: "monthly" as const,
    priority: 0.8,
    lastmod: new Date().toISOString(),
  },
  {
    url: "/tools/writing",
    changefreq: "monthly" as const,
    priority: 0.8,
    lastmod: new Date().toISOString(),
  },
  {
    url: "/tools/resume",
    changefreq: "monthly" as const,
    priority: 0.8,
    lastmod: new Date().toISOString(),
  },
  {
    url: "/tools/screenshot",
    changefreq: "monthly" as const,
    priority: 0.8,
    lastmod: new Date().toISOString(),
  },
  // Dashboard
  {
    url: "/dashboard",
    changefreq: "daily" as const,
    priority: 0.7,
    lastmod: new Date().toISOString(),
  },
  // Learning & info
  {
    url: "/student",
    changefreq: "weekly" as const,
    priority: 0.7,
    lastmod: new Date().toISOString(),
  },
  {
    url: "/developer",
    changefreq: "weekly" as const,
    priority: 0.7,
    lastmod: new Date().toISOString(),
  },
  // Company pages
  {
    url: "/about",
    changefreq: "monthly" as const,
    priority: 0.7,
    lastmod: new Date().toISOString(),
  },
  {
    url: "/contact",
    changefreq: "monthly" as const,
    priority: 0.6,
    lastmod: new Date().toISOString(),
  },
  {
    url: "/privacy",
    changefreq: "yearly" as const,
    priority: 0.5,
    lastmod: new Date().toISOString(),
  },
  {
    url: "/terms",
    changefreq: "yearly" as const,
    priority: 0.5,
    lastmod: new Date().toISOString(),
  },
];

/**
 * PRODUCTION: Generate sitemap XML
 */
function generateSitemap(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `
  <url>
    <loc>${SITE_URL}${route.url}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>
`,
  )
  .join("")}
</urlset>`;
}

/**
 * PRODUCTION SEO: Sitemap API route handler
 */
export function GET() {
  const sitemap = generateSitemap();

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
    },
  });
}
