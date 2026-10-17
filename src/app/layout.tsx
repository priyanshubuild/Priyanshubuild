import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Space_Grotesk } from "next/font/google";
import AgentTools from "@/components/AgentTools";
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
  metadataBase: new URL("https://priyanshugupta.com"),
  title: {
    default: "Priyanshu Gupta — Software Developer & Systems Engineer",
    template: "%s | Priyanshu Gupta",
  },
  description:
    "Portfolio of Priyanshu Gupta. Software Developer focused on Data Structures & Algorithms, C++, Linux systems, and modern web applications.",
  applicationName: "Priyanshu Gupta Portfolio",
  authors: [{ name: "Priyanshu Gupta", url: "https://priyanshugupta.com" }],
  creator: "Priyanshu Gupta",
  publisher: "Priyanshu Gupta",
  category: "technology",
  alternates: {
    canonical: "/",
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "96x96" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  keywords: [
    "Priyanshu Gupta",
    "priyanshubuild",
    "Software Developer",
    "Systems Engineer",
    "Data Structures & Algorithms",
    "DSA",
    "C++",
    "C++20",
    "Linux Systems",
    "Competitive Programming",
    "LeetCode",
    "Codeforces",
    "CodeChef",
    "Next.js Portfolio",
    "React Developer",
    "Tailwind CSS",
    "TypeScript",
    "Full Stack Engineer",
    "Vercel Deployment",
  ],
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
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
    title: "Priyanshu Gupta — Software Developer & Systems Engineer",
    description:
      "Software Developer focused on Data Structures & Algorithms, C++, Linux systems, and modern web applications.",
    url: "https://priyanshugupta.com",
    siteName: "Priyanshu Gupta",
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
    title: "Priyanshu Gupta — Software Developer & Systems Engineer",
    description:
      "Software Developer focused on Data Structures & Algorithms, C++, Linux systems, and modern web applications.",
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
      "@id": "https://priyanshugupta.com/#person",
      name: "Priyanshu Gupta",
      alternateName: "priyanshubuild",
      url: "https://priyanshugupta.com",
      jobTitle: "Software Developer & Systems Engineer",
      description:
        "Software Developer focused on Data Structures & Algorithms, C++, Linux systems, and modern web applications.",
      sameAs: [
        "https://github.com/priyanshubuild",
        "https://leetcode.com/u/Priyanshuguptaleetcode/",
        "https://codeforces.com/profile/priyanshuguptacf",
        "https://www.codechef.com/users/priyanshucf",
        "https://www.linkedin.com/in/priyanshubuild/",
        "https://x.com/priyanshustwt",
      ],
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
      "@id": "https://priyanshugupta.com/#website",
      url: "https://priyanshugupta.com",
      name: "Priyanshu Gupta",
      description:
        "Portfolio of Priyanshu Gupta. Software Developer focused on Data Structures & Algorithms, C++, Linux systems, and modern web applications.",
      publisher: {
        "@id": "https://priyanshugupta.com/#person",
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
          rel="alternate"
          href="/profile.json"
          type="application/json"
          title="Priyanshu Gupta — public profile"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
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
