import type { Metadata } from "next";
import projects from "@/data/projects.json";
import {
  SITE_URL,
  SITE_NAME,
  PERSON_ID,
  WEBSITE_ID,
  serializeJSONLD,
} from "@/lib/site";

const title = "Projects & C++ Practice";
const description =
  "Explore Priyanshu Gupta's public work: C++ practice, a team AI interview agent, a Next.js portfolio and a college frontend project. Source code and project links.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: `${title} | ${SITE_NAME}`,
    description,
    url: `${SITE_URL}/projects`,
    siteName: SITE_NAME,
    locale: "en_US",
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
  twitter: {
    card: "summary_large_image",
    images: ["/opengraph.png"],
    title: `${title} | ${SITE_NAME}`,
    description,
    creator: "@priyanshustwt",
  },
};

const projectsJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${SITE_URL}/projects#webpage`,
      url: `${SITE_URL}/projects`,
      name: `${title} | ${SITE_NAME}`,
      description,
      inLanguage: "en",
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": PERSON_ID },
      breadcrumb: { "@id": `${SITE_URL}/projects#breadcrumbs` },
      mainEntity: { "@id": `${SITE_URL}/projects#project-list` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE_URL}/projects#breadcrumbs`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Projects",
          item: `${SITE_URL}/projects`,
        },
      ],
    },
    {
      "@type": "ItemList",
      "@id": `${SITE_URL}/projects#project-list`,
      numberOfItems: projects.length,
      itemListElement: projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "SoftwareSourceCode",
          "@id": `${SITE_URL}/projects#${project.id}`,
          url: `${SITE_URL}/projects#${project.id}`,
          name: project.title,
          description: project.description,
          codeRepository: `https://github.com/${project.github}`,
          programmingLanguage: project.programmingLanguages,
          image: `${SITE_URL}${project.image}`,
          creditText: project.credit,
        },
      })),
    },
  ],
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJSONLD(projectsJsonLd),
        }}
      />
      {children}
    </>
  );
}
