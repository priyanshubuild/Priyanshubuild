"use client";

import { useState, type CSSProperties } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Braces,
  CodeXml,
  Github,
  Layers3,
  LayoutGrid,
  PanelsTopLeft,
  ShoppingBag,
  Terminal,
} from "lucide-react";
import Link from "next/link";
import Container from "@/components/Container";
import RingButton from "@/components/RingButton";
import projects from "@/data/projects.json";
import styles from "./projects.module.css";

const categories = [
  { id: "all", name: "All", icon: LayoutGrid },
  { id: "algorithms", name: "C++ & DSA", icon: CodeXml },
  { id: "fullstack", name: "Full Stack", icon: Layers3 },
  { id: "frontend", name: "Frontend", icon: PanelsTopLeft },
];
const projectIcons: Record<string, typeof CodeXml> = {
  "cpp-practice": Terminal,
  "ai-interview-agent": Layers3,
  portfolio: Braces,
  "storefront-practice": ShoppingBag,
};

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const filteredProjects = projects.filter(
    (project) =>
      selectedCategory === "all" || project.category === selectedCategory,
  );

  return (
    <Container className={styles.page}>
      <div className={styles.shell}>
        <nav aria-label="Project navigation" className={styles.navigation}>
          <Link href="/" className={styles.brand}>
            @code by PRIYANSHU
          </Link>
          <RingButton text="Back home" href="/" icon={ArrowLeft} size="sm" />
        </nav>

        <main id="main-content" className={styles.content}>
          <header className={styles.header}>
            <p className={styles.eyebrow}>Practice. Build. Understand.</p>
            <h1>Projects</h1>
            <p className={styles.introduction}>
              Public projects, coursework and ongoing practice by Priyanshu
              Gupta.
            </p>
          </header>

          <div className={styles.toolbar}>
            <div
              role="group"
              aria-label="Filter projects by category"
              className={styles.dock}
            >
              {categories.map(({ id, name, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={selectedCategory === id}
                  aria-controls="project-collection"
                  onClick={() => setSelectedCategory(id)}
                  className={styles.filter}
                >
                  <Icon size={15} aria-hidden="true" />
                  <span>{name}</span>
                </button>
              ))}
            </div>
            <p
              className={styles.count}
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              <span aria-hidden="true">
                {String(filteredProjects.length).padStart(2, "0")}
              </span>
              <span className="sr-only">{filteredProjects.length}</span>{" "}
              {filteredProjects.length === 1 ? "project" : "projects"}
            </p>
          </div>

          <div
            id="project-collection"
            className={styles.grid}
            key={selectedCategory}
          >
            {filteredProjects.map((project, index) => {
              const originalIndex = projects.indexOf(project);
              const Icon = projectIcons[project.id] || CodeXml;
              return (
                <article
                  key={project.id}
                  id={project.id}
                  aria-labelledby={`${project.id}-title`}
                  className={styles.card}
                  style={{ "--project-order": index } as CSSProperties}
                >
                  <div className={styles.cardTop}>
                    <span className={styles.projectIcon}>
                      <Icon size={19} aria-hidden="true" />
                    </span>
                    <span className={styles.projectNumber} aria-hidden="true">
                      {String(originalIndex + 1).padStart(2, "0")} /{" "}
                      {project.year}
                    </span>
                  </div>
                  <h2 id={`${project.id}-title`}>{project.title}</h2>
                  <p className={styles.description}>{project.description}</p>
                  {project.credit && (
                    <p className={styles.credit}>{project.credit}</p>
                  )}
                  <ul
                    className={styles.technologies}
                    aria-label={`${project.title} technologies`}
                  >
                    {project.technologies.map((tech) => (
                      <li key={tech}>{tech}</li>
                    ))}
                  </ul>
                  <div className={styles.actions}>
                    <RingButton
                      href={`https://github.com/${project.github}`}
                      text="Source code"
                      ariaLabel={`View ${project.title} source on GitHub`}
                      target="_blank"
                      rel="noopener noreferrer"
                      icon={Github}
                      size="sm"
                    />
                    {project.live && (
                      <a
                        href={project.live}
                        aria-label={`Open ${project.title} website`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.demo}
                      >
                        View site <ArrowUpRight size={16} aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          <footer className={styles.footer}>
            <p>Understand first. Build second.</p>
            <Link href="/#contact" className={styles.demo}>
              Let&apos;s connect <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </footer>
        </main>
      </div>
    </Container>
  );
}
