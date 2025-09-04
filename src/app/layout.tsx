import type { Metadata } from "next";
import { Antonio } from "next/font/google";
import localFont from "next/font/local";
import { GSAPProvider } from "@/providers/GSAPProvider";
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
});

export const metadata: Metadata = {
  title: "SPYLT - Premium Protein Drink",
  description:
    "Experience the ultimate protein drink with SPYLT. Premium quality, exceptional taste, and optimal nutrition for your active lifestyle.",
  keywords: "protein drink, nutrition, fitness, health, premium protein, SPYLT",
  authors: [{ name: "SPYLT Team" }],
  creator: "SPYLT",
  publisher: "SPYLT",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
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
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SPYLT - Premium Protein Drink",
    description:
      "Experience the ultimate protein drink with SPYLT. Premium quality, exceptional taste, and optimal nutrition for your active lifestyle.",
    images: ["/images/twitter-image.jpg"],
  },
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${antonio.variable} ${proximaNova.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="font-antonio antialiased">
        <GSAPProvider
          enableScrollTrigger={true}
          enableScrollSmoother={true}
          enableSplitText={true}
          enableTextPlugin={true}
        >
          {children}
        </GSAPProvider>
      </body>
    </html>
  );
}
