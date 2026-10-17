import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Space_Grotesk } from "next/font/google";
import AgentTools from "@/components/AgentTools";
import {
  SITE_URL,
  SITE_NAME,
  SITE_TITLE,
  SITE_DESCRIPTION,
  PERSON_ID,
  WEBSITE_ID,
  PROFILE_LINKS,
  serializeJSONLD,
} from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: true,
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#09090B",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | Priyanshu Gupta",
  },
  description: SITE_DESCRIPTION,
  applicationName: "Priyanshu Gupta Portfolio",
  authors: [{ name: "Priyanshu Gupta", url: "https://priyanshugupta.com" }],
  creator: "Priyanshu Gupta",
  publisher: "Priyanshu Gupta",
  category: "technology",
  alternates: {
    canonical: "/",
    types: { "text/markdown": "/index.md" },
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png", sizes: "96x96" }],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? {
          other: {
            "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
          },
        }
      : {}),
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
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: "/opengraph.png",
        width: 1200,
        height: 630,
        alt: "Priyanshu Gupta Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/opengraph.png"],
    creator: "@priyanshustwt",
    site: "@priyanshustwt",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": PERSON_ID,
      name: SITE_NAME,
      alternateName: "priyanshubuild",
      url: SITE_URL,
      jobTitle: "Software Developer & Systems Engineer",
      description:
        "Software Developer focused on Data Structures & Algorithms, C++, Linux systems, and modern web applications.",
      sameAs: PROFILE_LINKS,
      knowsAbout: [
        "C++",
        "Data Structures and Algorithms",
        "Linux",
        "Operating Systems",
        "Next.js",
        "React",
        "TypeScript",
        "Full Stack Web Development",
      ],
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: SITE_URL,
      name: SITE_NAME,
      alternateName: ["priyanshubuild", "priyanshugupta.com"],
      inLanguage: "en",
      description: SITE_DESCRIPTION,
      publisher: {
        "@id": PERSON_ID,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/fonts/geist-pixel-square-latin-v1.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="ai-catalog"
          href="/.well-known/ai-catalog.json"
          type="application/json"
        />
        <link
          rel="describedby"
          href="/llms.txt"
          type="text/plain"
        />
        <link
          rel="alternate"
          href="/profile.json"
          type="application/json"
          title="Priyanshu Gupta — public profile"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJSONLD(jsonLd),
          }}
        />
      </head>

      <body
        className={` ${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        {children}
        <AgentTools />
        {process.env.VERCEL === "1" && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  );
}
