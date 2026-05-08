import type { Metadata } from "next";
import {
  Cairo,
  Geist,
  Geist_Mono,
  IBM_Plex_Sans_Arabic,
  Tajawal,
} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
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

export const metadata: Metadata = {
  title: "Haron Mohammed | Software Engineer & Data Analyst",
  description:
    "A cinematic bilingual portfolio for Haron Mohammed, Software Engineer, Full Stack Developer, and Data Analyst.",
  icons: {
    icon: "/favicon.ico",
  },
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
      className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable} ${ibmArabic.variable} ${tajawal.variable} h-full antialiased`}
    >
      <body className="min-h-full overflow-x-hidden bg-[#02030a] text-white">
        {children}
      </body>
    </html>
  );
}
