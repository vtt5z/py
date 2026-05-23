import type { Metadata } from "next";
import {
  Cairo,
  IBM_Plex_Sans_Arabic,
  Inter,
  Roboto_Mono,
  Tajawal,
} from "next/font/google";
import { createMetadata, createJsonLd } from "@/lib/seo";
import { AuthProvider } from "@/components/providers/auth-provider";
import { LanguageProvider } from "@/components/providers/language-provider";
import { PWARegister } from "@/components/pwa/pwa-register";
import { ToastProvider } from "@/components/providers/toast-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const mono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
});

const ibmArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-arabic",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "800"],
  display: "swap",
});

/**
 * PRODUCTION SEO: Comprehensive metadata
 */
const baseMetadata = createMetadata();
export const metadata: Metadata = {
  ...baseMetadata,
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${inter.variable} ${mono.variable} ${cairo.variable} ${ibmArabic.variable} ${tajawal.variable} h-full antialiased`}
    >
      <head>
        {/* PRODUCTION: JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(createJsonLd("Organization")),
          }}
        />
      </head>
      <body className="min-h-full overflow-x-hidden bg-[#02030a] text-white">
        <AuthProvider>
          <LanguageProvider>
            <ToastProvider>
              {children}
              <PWARegister />
            </ToastProvider>
          </LanguageProvider>
        </AuthProvider>
        {/* PRODUCTION: Vercel Analytics */}
        {process.env.NODE_ENV === "production" && (
          <>
            {/* Vercel Web Analytics */}
            <script
              defer
              src="https://cdn.vercel-insights.com/v1/script.js"
            />
            {/* Vercel Speed Insights */}
            <script
              defer
              src="https://cdn.vercel-insights.com/v1/speed-insights.js"
            />
          </>
        )}
      </body>
    </html>
  );
}
