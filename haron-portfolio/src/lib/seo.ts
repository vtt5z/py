/**
 * HARON OS - SEO Metadata Configuration
 * 
 * Provides:
 * - Global metadata
 * - OpenGraph tags
 * - Twitter cards
 * - Structured data (JSON-LD)
 * - Social preview support
 */

import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://haron-os.com";
const SITE_NAME = "HARON OS";

/**
 * PRODUCTION SEO: Global metadata template
 */
export function createMetadata(overrides?: Partial<Metadata>): Metadata {
  return {
    title: {
      template: `%s | ${SITE_NAME}`,
      default: "HARON OS | AI Digital Operating System",
    },
    description:
      "HARON OS is a production-grade AI operating system for developers, engineers, and creators. Featuring Gemini-powered tools for coding, analysis, writing, learning, and intelligent automation.",
    keywords: [
      "HARON OS",
      "AI operating system",
      "Gemini AI",
      "developer tools",
      "AI assistant",
      "engineering platform",
      "AI workspace",
      "coding assistant",
      "AI productivity",
      "SaaS platform",
    ],
    authors: [{ name: "HARON OS Team" }],
    creator: "HARON OS",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: SITE_URL,
      title: "HARON OS - AI Operating System for Developers",
      description:
        "Production-grade AI platform with Gemini-powered tools for engineering, analytics, writing, and automation.",
      siteName: SITE_NAME,
      images: [
        {
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: "HARON OS - AI Operating System",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "HARON OS - AI Operating System",
      description:
        "Production-grade AI platform for developers. AI tools for coding, analysis, and automation.",
      creator: "@haronos",
      images: [`${SITE_URL}/twitter-image.png`],
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    alternates: {
      canonical: SITE_URL,
      languages: {
        en: SITE_URL,
        ar: `${SITE_URL}/ar`,
      },
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/apple-icon.png",
    },
    ...overrides,
  };
}

/**
 * PRODUCTION SEO: Page-specific metadata
 */
export const pageMetadata = {
  home: {
    title: "HARON OS | AI Digital Operating System",
    description:
      "Enterprise-grade AI operating system for developers. Powered by Gemini. Workspace, tools, and assistant for engineering.",
  },
  workspace: {
    title: "Workspace | HARON OS",
    description:
      "Your personal AI workspace. Organize, manage, and track your AI projects and tasks in HARON OS.",
  },
  assistant: {
    title: "AI Assistant | HARON OS",
    description:
      "Chat with HARON, your AI assistant powered by Gemini. Get instant help with coding, analysis, and more.",
  },
  tools: {
    title: "AI Tools | HARON OS",
    description:
      "Powerful AI tools for developers: SQL Generator, PDF Analyzer, Writing Assistant, Resume Builder, Screenshot Analysis.",
  },
  about: {
    title: "About | HARON OS",
    description:
      "Learn about HARON OS, a production-grade AI operating system built for developers and engineers.",
  },
  contact: {
    title: "Contact | HARON OS",
    description: "Get in touch with the HARON OS team. We'd love to hear from you.",
  },
  privacy: {
    title: "Privacy Policy | HARON OS",
    description: "HARON OS privacy policy and data protection information.",
  },
  terms: {
    title: "Terms of Service | HARON OS",
    description:
      "HARON OS terms of service and legal agreements.",
  },
};

/**
 * PRODUCTION SEO: JSON-LD Structured Data
 */
export function createJsonLd(type: "Organization" | "WebSite" | "Article", data?: Record<string, unknown>) {
  const baseOrganization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description:
      "Production-grade AI operating system with Gemini-powered tools for developers.",
    sameAs: [
      "https://twitter.com/haronos",
      "https://github.com/haronos",
      "https://linkedin.com/company/haronos",
    ],
  };

  const schemas: Record<string, Record<string, unknown>> = {
    Organization: baseOrganization,
    WebSite: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
        },
      },
    },
    Article: {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: data?.title || "HARON OS Blog",
      description: data?.description || "",
      image: data?.image || `${SITE_URL}/og-image.png`,
      datePublished: data?.datePublished || new Date().toISOString(),
      author: {
        "@type": "Organization",
        name: SITE_NAME,
      },
    },
  };

  return schemas[type] || baseOrganization;
}

/**
 * PRODUCTION SEO: Robots and sitemap configuration
 */
export const seoConfig = {
  sitemapBaseUrl: SITE_URL,
  robotsTxt: {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api", "/admin", "/.well-known"],
      },
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  },
  priorityRoutes: [
    { path: "/", priority: 1.0 },
    { path: "/assistant", priority: 0.9 },
    { path: "/tools", priority: 0.9 },
    { path: "/workspace", priority: 0.8 },
    { path: "/about", priority: 0.7 },
    { path: "/contact", priority: 0.7 },
  ],
};

/**
 * PRODUCTION SEO: Generate meta tags for social sharing
 */
export function generateSocialMeta(
  title: string,
  description: string,
  imageUrl?: string,
) {
  return {
    ogTitle: title,
    ogDescription: description,
    ogImage: imageUrl || `${SITE_URL}/og-image.png`,
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: imageUrl || `${SITE_URL}/twitter-image.png`,
  };
}
