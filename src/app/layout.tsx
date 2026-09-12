import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Space_Grotesk } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GeistPixelSquare } from "geist/font/pixel";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
      { url: "/favicon.ico" },
      { url: "/favicon.png", type: "image/png" },
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
        url: "/official/opengraphh.jpg",
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
    images: ["/official/opengraphh.jpg"],
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
      image: "https://priyanshugupta.com/official/logo.png",
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
    {
      "@type": "ProfilePage",
      "@id": "https://priyanshugupta.com/#profilepage",
      url: "https://priyanshugupta.com",
      name: "Priyanshu Gupta — Software Developer & Systems Engineer",
      mainEntity: {
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
        <link rel="preconnect" href="https://github-contributions-api.jogruber.de" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://github-contributions-api.jogruber.de" />
        <link rel="preconnect" href="https://api.github.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.github.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      </head>

      <body
        className={` ${geistSans.variable} ${geistMono.variable} ${GeistPixelSquare.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <TooltipProvider>{children}</TooltipProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
