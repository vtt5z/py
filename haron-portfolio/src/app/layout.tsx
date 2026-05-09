import type { Metadata } from "next";
import {
  Cairo,
  IBM_Plex_Sans_Arabic,
  Inter,
  Roboto_Mono,
  Tajawal,
} from "next/font/google";
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

export const metadata: Metadata = {
  title: "HARON OS | AI Digital Operating System",
  description:
    "A futuristic AI-powered digital operating system for engineering, analytics, learning, writing, and intelligent creation.",
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
      className={`${inter.variable} ${mono.variable} ${cairo.variable} ${ibmArabic.variable} ${tajawal.variable} h-full antialiased`}
    >
      <body className="min-h-full overflow-x-hidden bg-[#02030a] text-white">
        {children}
      </body>
    </html>
  );
}
