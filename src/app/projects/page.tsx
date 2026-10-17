"use client";
import React, { useState } from "react";
import { ExternalLink, Github, ArrowLeft } from "lucide-react";
import { GitHubIcon } from "../icons/Githubicon";
import Link from "next/link";
import Image from "next/image";
import projects from "@/data/projects.json";

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
          <div className="mx-auto max-w-5xl px-6 py-10">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <h1 className="text-4xl font-bold sm:text-6xl md:text-7xl lg:text-8xl">
                Projects
              </h1>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-[#494949] px-3 py-2 text-sm text-white transition-colors hover:text-white"
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

        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="mx-auto mb-12 flex w-fit max-w-full flex-wrap justify-center gap-1 rounded-full border border-[#1C1C1F] p-1">
            {categories.map((category) => (
              <button
                key={category.id}
                aria-pressed={selectedCategory === category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`rounded-full px-2.5 py-1.5 text-xs transition-all duration-300 sm:px-4 sm:py-2 sm:text-sm ${
                  selectedCategory === category.id
                    ? "bg-[#1C1C1C] text-white"
                    : "text-[#a3a3a3] hover:text-[#999]"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                id={project.id}
                className="group flex flex-col overflow-hidden rounded-xl border border-[#1C1C1F] bg-[#0A0A0A] transition-all duration-500 hover:-translate-y-2 hover:transform hover:border-[#333] hover:shadow-2xl hover:shadow-black/50"
              >
                <div className="relative aspect-[4/2] overflow-hidden bg-[#111]">
                  <Image
                    fill
                    sizes="(max-width: 768px) 90vw, 40vw"
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 flex items-center justify-center gap-4 bg-[#09090B]/60 opacity-0 transition-opacity duration-300 focus-within:opacity-100 group-hover:opacity-100">
                    {project.github && (
                      <a
                        href={`https://github.com/${project.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View ${project.title} ${project.github ? "source" : "demo"}`}
                        className="rounded-full bg-white/10 p-3 backdrop-blur-sm transition-colors duration-200 hover:bg-white/20"
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
                        className="rounded-full bg-white/10 p-3 backdrop-blur-sm transition-colors duration-200 hover:bg-white/20"
                      >
                        <ExternalLink size={20} className="text-white" />
                      </a>
                    )}
                  </div>

                  <div className="absolute top-4 right-4 rounded-full bg-[#09090B]/70 px-2 py-1 backdrop-blur-sm">
                    <span className="text-xs text-[#a3a3a3]">
                      {project.year}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h2 className="mb-3 text-xl font-bold transition-colors duration-300 group-hover:text-[#CCC]">
                    {project.title}
                  </h2>
                  <p className="mb-4 text-sm leading-relaxed text-[#a3a3a3]">
                    {project.description}
                  </p>
                  <p className="mb-4 text-xs text-[#a3a3a3]">
                    {project.credit}
                  </p>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-[#1C1C1F] bg-[#111] px-2 py-1 text-xs text-[#a3a3a3]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto flex w-full flex-col gap-3 sm:flex-row">
                    {project.live && (
                      <a
                        href={project.live}
                        aria-label={`Open ${project.title} website`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#333] bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] px-4 py-2 text-sm text-white transition-all duration-300 hover:border-[#444] hover:from-[#2a2a2a] hover:to-[#3a3a3a]"
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
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#333] bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] px-4 py-2 text-sm text-white transition-all duration-300 hover:border-[#444] hover:from-[#2a2a2a] hover:to-[#2a2a2a]"
                      >
                        <GitHubIcon width={16} />
                        <span>Source Code</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-20">
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
