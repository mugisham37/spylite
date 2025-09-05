import type { Metadata, Viewport } from "next";
import { Antonio } from "next/font/google";
import localFont from "next/font/local";
import { GSAPProvider } from "@/providers/GSAPProvider";
import { PerformanceProvider } from "@/providers/PerformanceProvider";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";
import "./globals.css";

// Font configurations
const antonio = Antonio({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-antonio",
});

const proximaNova = localFont({
  src: [
    {
      path: "../../public/fonts/ProximaNova-Regular.otf",
      weight: "400",
      style: "normal",
    },
  ],
  display: "swap",
  preload: true,
  variable: "--font-proxima-nova",
  fallback: ["system-ui", "arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: {
    default: "SPYLT - Premium Protein Drink",
    template: "%s | SPYLT",
  },
  description:
    "Experience the ultimate protein drink with SPYLT. Premium quality, exceptional taste, and optimal nutrition for your active lifestyle.",
  keywords: [
    "protein drink",
    "nutrition",
    "fitness",
    "health",
    "premium protein",
    "SPYLT",
    "workout supplement",
    "muscle building",
    "recovery drink",
  ],
  authors: [{ name: "SPYLT Team" }],
  creator: "SPYLT",
  publisher: "SPYLT",
  applicationName: "SPYLT",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://spylt.com"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SPYLT - Premium Protein Drink",
    description:
      "Experience the ultimate protein drink with SPYLT. Premium quality, exceptional taste, and optimal nutrition for your active lifestyle.",
    siteName: "SPYLT",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SPYLT Premium Protein Drink",
        type: "image/jpeg",
      },
    ],
    locale: "en_US",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "SPYLT - Premium Protein Drink",
    description:
      "Experience the ultimate protein drink with SPYLT. Premium quality, exceptional taste, and optimal nutrition for your active lifestyle.",
    images: [
      {
        url: "/images/twitter-image.jpg",
        alt: "SPYLT Premium Protein Drink",
      },
    ],
    creator: "@spylt",
    site: "@spylt",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
  },
  category: "food and drink",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: "light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faeade" },
    { media: "(prefers-color-scheme: dark)", color: "#222123" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${antonio.variable} ${proximaNova.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#faeade" />
        <meta name="msapplication-TileColor" content="#faeade" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

        {/* Preload critical assets for performance */}
        <link
          rel="preload"
          href="/fonts/ProximaNova-Regular.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
        <link rel="preload" href="/images/hero-bg.png" as="image" />
        <link rel="preload" href="/images/logo.png" as="image" />
        <link rel="preload" href="/images/nav-logo.svg" as="image" />

        {/* Resource hints for better performance */}
        <link rel="prefetch" href="/videos/hero-bg.mp4" />
        <link rel="prefetch" href="/images/hero-img.png" />
      </head>
      <body
        className="font-antonio antialiased bg-milk text-dark-brown"
        suppressHydrationWarning
      >
        <PerformanceProvider
          enableAssetOptimization={true}
          enableCaching={true}
          enablePerformanceMonitoring={process.env.NODE_ENV === "development"}
          enableServiceWorker={process.env.NODE_ENV === "production"}
        >
          <GSAPProvider
            enableScrollTrigger={true}
            enableScrollSmoother={true}
            enableSplitText={true}
            enableTextPlugin={true}
          >
            <div id="smooth-wrapper">
              <div id="smooth-content">{children}</div>
            </div>
            <PerformanceMonitor position="top-right" />
          </GSAPProvider>
        </PerformanceProvider>
      </body>
    </html>
  );
}
