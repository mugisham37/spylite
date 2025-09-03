import type { Metadata } from "next";
import { Antonio } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import GSAPProvider from "@/components/providers/GSAPProvider";
import GSAPErrorBoundary from "@/components/error/GSAPErrorBoundary";

// Configure Antonio font from Google Fonts
const antonio = Antonio({
  variable: "--font-antonio",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

// Configure ProximaNova local font
const proximaNova = localFont({
  src: "./fonts/ProximaNova-Regular.otf",
  variable: "--font-proxima-nova",
  display: "swap",
  preload: true,
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "GSAP Awwwards Website",
  description:
    "A sophisticated GSAP-powered website built with Next.js featuring complex animations, scroll effects, and responsive design",
  keywords: [
    "GSAP",
    "Next.js",
    "React",
    "Animation",
    "Scroll Effects",
    "Awwwards",
  ],
  authors: [{ name: "GSAP Awwwards Team" }],
  creator: "GSAP Awwwards Team",
  publisher: "GSAP Awwwards",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gsap-awwwards.vercel.app",
    title: "GSAP Awwwards Website",
    description:
      "A sophisticated GSAP-powered website built with Next.js featuring complex animations, scroll effects, and responsive design",
    siteName: "GSAP Awwwards Website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GSAP Awwwards Website",
    description:
      "A sophisticated GSAP-powered website built with Next.js featuring complex animations, scroll effects, and responsive design",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${antonio.variable} ${proximaNova.variable}`}>
      <body className="antialiased">
        <GSAPErrorBoundary>
          <GSAPProvider>{children}</GSAPProvider>
        </GSAPErrorBoundary>
      </body>
    </html>
  );
}
