"use client";
import React, { useState, type CSSProperties } from "react";
import { ExternalLink, Github, ArrowLeft } from "lucide-react";
import { GitHubIcon } from "../icons/Githubicon";
import Link from "next/link";
import Image from "next/image";
import projects from "@/data/projects.json";
import styles from "./projects.module.css";

const ProjectsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All" },
    { id: "algorithms", name: "C++ & DSA" },
    { id: "fullstack", name: "Full Stack" },
    { id: "frontend", name: "Frontend" },
  ];

  const filteredProjects =
    selectedCategory === "all"
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

  return (
    <main
      id="main-content"
      className="font-space-grotesk mx-auto bg-[#09090B] bg-[repeating-linear-gradient(45deg,#000_0px,#000_7px,#1C1C1F_7px,#1C1C1F_8px)]"
    >
      <div className="mx-auto w-[92%] border-r-2 border-l-2 border-[#1C1C1F] bg-[#09090B] text-white sm:w-[90%] lg:w-[80%]">
        <div className="border-b border-[#1C1C1F]">
          <div className="mx-auto max-w-5xl px-5 py-8 sm:px-6">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <h1 className="text-4xl font-bold sm:text-6xl md:text-7xl lg:text-8xl">
                Projects
              </h1>
              <Link
                href="/"
                className={`inline-flex items-center gap-2 rounded-lg border-2 border-[#494949] px-3 py-2 text-sm text-white ${styles.back}`}
              >
                <ArrowLeft size={18} /> Back
              </Link>
            </div>
            <p className="max-w-2xl text-base text-[#a3a3a3] sm:text-xl">
              Public projects, coursework and ongoing practice by Priyanshu
              Gupta.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-[1000px] px-4 py-7 sm:px-6">
          <div
            role="group"
            aria-label="Filter projects by category"
            className={`mx-auto mb-8 flex w-fit max-w-full flex-wrap justify-center gap-1 rounded-full border border-[#1C1C1F] p-1 ${styles.capsule}`}
          >
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                aria-pressed={selectedCategory === category.id}
                aria-controls="project-collection"
                onClick={() => setSelectedCategory(category.id)}
                className={`rounded-full px-2.5 py-1.5 text-xs transition-colors duration-300 sm:px-4 sm:py-2 sm:text-sm ${
                  selectedCategory === category.id
                    ? "bg-[#1C1C1C] text-white"
                    : "text-[#a3a3a3] hover:text-white"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <p
            className="sr-only"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {filteredProjects.length}{" "}
            {filteredProjects.length === 1 ? "project" : "projects"} shown
          </p>
          <div
            id="project-collection"
            key={selectedCategory}
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
          >
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className={styles.entry}
                style={{ "--project-order": index } as CSSProperties}
              >
                <article
                  id={project.id}
                  aria-labelledby={`${project.id}-title`}
                  className={`group flex h-full flex-col overflow-hidden rounded-xl border border-[#1C1C1F] bg-[#0A0A0A] ${styles.card}`}
                >
                  <div className="relative aspect-[4/2] overflow-hidden bg-[#111]">
                    <Image
                      fill
                      sizes="(max-width: 767px) 90vw, (max-width: 1023px) 42vw, (max-width: 1250px) 36vw, 466px"
                      src={project.image}
                      alt=""
                      loading="lazy"
                      className={`h-full w-full object-cover ${styles.cover}`}
                    />

                    <div
                      className={`absolute inset-0 flex items-center justify-center gap-3 ${styles.overlay}`}
                    >
                      {project.github && (
                        <a
                          href={`https://github.com/${project.github}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`View ${project.title} ${project.github ? "source" : "demo"}`}
                          className={`rounded-full border border-white/15 bg-[#1c1c1f]/90 p-2.5 text-white backdrop-blur-sm ${styles.overlayAction}`}
                        >
                          <Github size={20} className="text-white" />
                        </a>
                      )}
                      {project.live && (
                        <a
                          href={project.live}
                          aria-label={`Open ${project.title} website`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`rounded-full border border-white/15 bg-[#1c1c1f]/90 p-2.5 text-white backdrop-blur-sm ${styles.overlayAction}`}
                        >
                          <ExternalLink size={20} className="text-white" />
                        </a>
                      )}
                    </div>

                    <div className="pointer-events-none absolute top-3 right-3 rounded-full bg-[#09090B]/70 px-2 py-1 backdrop-blur-sm">
                      <span className="text-[10px] text-[#a3a3a3]">
                        {project.year}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <h2
                      id={`${project.id}-title`}
                      className="mb-2 text-lg leading-snug font-semibold tracking-tight text-[#f4f4f5]"
                    >
                      {project.title}
                    </h2>
                    <p className="mb-3 text-[13px] leading-relaxed text-[#a3a3a3]">
                      {project.description}
                    </p>
                    {project.credit && (
                      <p className="mb-3 text-[11px] leading-relaxed text-[#a3a3a3]">
                        {project.credit}
                      </p>
                    )}

                    <ul
                      className="mb-4 flex flex-wrap gap-1.5"
                      aria-label={`${project.title} technologies`}
                    >
                      {project.technologies.map((tech) => (
                        <li
                          key={tech}
                          className="rounded-full border border-[#1C1C1F] bg-[#111] px-2 py-0.5 text-[11px] leading-5 text-[#a3a3a3]"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto flex w-full gap-2">
                      {project.live && (
                        <a
                          href={project.live}
                          aria-label={`Open ${project.title} website`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex min-h-9 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#333] bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] px-2 py-1.5 text-xs text-white ${styles.action}`}
                        >
                          <ExternalLink size={16} />
                          View Site
                        </a>
                      )}
                      {project.github && (
                        <a
                          href={`https://github.com/${project.github}`}
                          aria-label={`View ${project.title} source on GitHub`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex min-h-9 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#333] bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] px-2 py-1.5 text-xs text-white ${styles.action}`}
                        >
                          <GitHubIcon width={16} />
                          <span>Source Code</span>
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>

          <div className="pt-12 pb-3" aria-hidden="true">
            <div className="flex items-center justify-center">
              <div className="h-1 w-1 rounded-full bg-[#333]"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProjectsPage;
