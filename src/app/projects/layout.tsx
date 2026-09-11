import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Showcase of engineering projects, algorithms lab in C++, Linux systems workbench, and web applications built by Priyanshu Gupta.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Projects | Priyanshu Gupta",
    description:
      "Showcase of engineering projects, algorithms lab in C++, Linux systems workbench, and web applications built by Priyanshu Gupta.",
    url: "https://priyanshugupta.com/projects",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | Priyanshu Gupta",
    description:
      "Showcase of engineering projects, algorithms lab in C++, Linux systems workbench, and web applications built by Priyanshu Gupta.",
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
