import React from "react";
import { FolderGit2, ArrowUpRight } from "lucide-react";

const ProjectsSection = () => {
  return (
    <div className="px-4 py-10 md:px-[3%]">
      <div className="rounded-2xl border border-white/10 bg-[#121215]/60 p-6 backdrop-blur-xl sm:p-8">
        <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-semibold text-white sm:text-2xl">
                Projects in Development
              </h3>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400"></span>
                In Progress
              </span>
            </div>
            <p className="mt-1 font-mono text-sm text-neutral-400">
              Active learning, algorithmic problem solving &amp; web projects
            </p>
          </div>

          <a
            href="https://github.com/priyanshubuild"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            <FolderGit2 className="h-4 w-4 text-neutral-300" />
            <span>GitHub Profile</span>
            <ArrowUpRight className="h-4 w-4 text-neutral-400" />
          </a>
        </div>

        <div className="space-y-4 pt-6 text-sm leading-relaxed text-neutral-300 sm:text-base">
          <p>
            I am currently focusing on building core competence and do not have
            featured production deployments to display yet. Here is what I am
            actively working on:
          </p>
          <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-3">
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <span className="mb-1 block font-mono text-xs tracking-wider text-neutral-400 uppercase">
                Domain 01
              </span>
              <h4 className="mb-1 text-base font-medium text-white">
                DSA &amp; C++
              </h4>
              <p className="text-xs text-neutral-400">
                Daily algorithmic implementations and problem solving on
                LeetCode &amp; Codeforces.
              </p>
            </div>
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <span className="mb-1 block font-mono text-xs tracking-wider text-neutral-400 uppercase">
                Domain 02
              </span>
              <h4 className="mb-1 text-base font-medium text-white">
                Linux &amp; Systems
              </h4>
              <p className="text-xs text-neutral-400">
                Shell scripting, terminal productivity setups, and exploring OS
                concepts.
              </p>
            </div>
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <span className="mb-1 block font-mono text-xs tracking-wider text-neutral-400 uppercase">
                Domain 03
              </span>
              <h4 className="mb-1 text-base font-medium text-white">
                Full-Stack Web
              </h4>
              <p className="text-xs text-neutral-400">
                Building responsive web interfaces with Next.js, React, and
                modern CSS.
              </p>
            </div>
          </div>
          <p className="pt-2 text-xs text-neutral-400 italic sm:text-sm">
            Completed projects with live demos and source repositories will be
            showcased here as they ship.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectsSection;
