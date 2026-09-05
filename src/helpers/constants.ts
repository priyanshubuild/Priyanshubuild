export type Project = {
  id: number;
  name: string;
  description: string;
  image: string;
  link: string;
  github?: string;
  status?: "live" | "discontinued" | "building";
  projectBg: string;
};

export const projects: Project[] = [
  {
    id: 0,
    name: "DSA & Algorithms Lab",
    description: "A comprehensive repository of algorithmic problem solving, core data structures, and competitive programming solutions in modern C++.",
    image: "/Project/ProjectImages/mach.png",
    link: "https://github.com/priyanshubuild",
    github: "https://github.com/priyanshubuild",
    status: "live",
    projectBg: "/Project/ProjectBackground/mach.png",
  },
  {
    id: 1,
    name: "Linux & Systems Workbench",
    description: "System exploration tools, custom shell scripts, and Linux command-line utilities configured for daily developer workflows.",
    image: "/Project/ProjectImages/ghosttype.png",
    link: "https://github.com/priyanshubuild",
    github: "https://github.com/priyanshubuild",
    status: "live",
    projectBg: "/Project/ProjectBackground/ghosttype.png",
  },
  {
    id: 2,
    name: "Interactive Portfolio",
    description: "Modern, high-performance developer portfolio built with Next.js 15, React 19, Tailwind CSS v4, and fluid micro-animations.",
    image: "/Project/ProjectImages/layers.png",
    link: "https://priyanshugupta.com",
    github: "https://github.com/priyanshubuild/priyanshubuild",
    status: "live",
    projectBg: "/Project/ProjectBackground/layers.png",
  },
  {
    id: 3,
    name: "Web Dev & UI Engineering",
    description: "Full-stack web explorations and interactive UI components focusing on speed, accessible markup, and smooth user experience.",
    image: "/Project/ProjectImages/vidstudio.png",
    link: "https://priyanshugupta.com",
    github: "https://github.com/priyanshubuild",
    status: "live",
    projectBg: "/Project/ProjectBackground/vidstudio.png",
  },
];
