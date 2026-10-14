import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects Archive",
  description:
    "Active development updates, practice repositories, and projects in progress by Priyanshu Gupta.",
  alternates: {
    canonical: "/projectspage",
  },
  openGraph: {
    title: "Projects Archive | Priyanshu Gupta",
    description:
      "Active development updates, practice repositories, and projects in progress by Priyanshu Gupta.",
    url: "https://priyanshugupta.com/projectspage",
    type: "website",
    images: [
      {
        url: "/opengraph.png",
        width: 1200,
        height: 630,
        alt: "Priyanshu Gupta portfolio",
      },
    ],
  },
};

const breadcrumbsJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://priyanshugupta.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Projects Archive",
      item: "https://priyanshugupta.com/projectspage",
    },
  ],
};

export default function ProjectsPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbsJsonLd),
        }}
      />
      {children}
    </>
  );
}
