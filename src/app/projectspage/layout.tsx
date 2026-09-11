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
  },
};

export default function ProjectsPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
