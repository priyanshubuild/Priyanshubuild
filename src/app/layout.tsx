import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Space_Grotesk } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Syne } from "next/font/google";
import { GeistPixelSquare, GeistPixelGrid, GeistPixelCircle, GeistPixelTriangle, GeistPixelLine } from 'geist/font/pixel';
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

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-syne",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Priyanshu Gupta — Software Developer & Systems Engineer",
  description: "Portfolio of Priyanshu Gupta. Software Developer focused on Data Structures & Algorithms, C++, Linux systems, and modern web applications.",
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
    "Software Engineer",
    "Full Stack Developer",
    "DSA",
    "C++",
    "Linux Systems",
    "Competitive Programming",
    "Next.js Portfolio",
    "React Developer",
    "Tailwind CSS",
  ],
  openGraph: {
    title: "Priyanshu Gupta — Software Developer & Systems Engineer",
    description: "Software Developer focused on Data Structures & Algorithms, C++, Linux systems, and modern web applications.",
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
    description: "Software Developer focused on Data Structures & Algorithms, C++, Linux systems, and modern web applications.",
    images: ["/official/opengraphh.jpg"],
    creator: "@priyanshustwt",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://priyanshugupta.com" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Priyanshu Gupta",
              url: "https://priyanshugupta.com",
              sameAs: [
                "https://github.com/priyanshubuild",
                "https://leetcode.com/u/Priyanshuguptaleetcode/",
                "https://codeforces.com/profile/priyanshuguptacf",
                "https://www.codechef.com/users/priyanshucf",
                "https://www.linkedin.com/in/priyanshubuild/",
                "https://x.com/priyanshustwt",
              ],
              jobTitle: "Software Developer & Engineer",
              description: "Software Developer focused on Data Structures & Algorithms, C++, Linux systems, and modern web applications.",
            }),
          }}
        />
      </head>

      <body className={` ${geistSans.variable} ${geistMono.variable} ${GeistPixelSquare.variable} ${spaceGrotesk.variable} ${syne.variable} antialiased`}>
        <TooltipProvider>
          {children}
        </TooltipProvider>
        <Analytics />
        {/* <CustomCursor /> */}
      </body>
    </html>
  );
}
