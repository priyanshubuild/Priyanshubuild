import React from 'react'
import { FolderGit2, ArrowUpRight } from 'lucide-react'
import RingButton from './RingButton'

const ProjectsSection = () => {
  return (
    <div id="projects" className="px-4 md:px-[3%] py-10">
      <div className="border border-white/10 bg-[#121215]/60 backdrop-blur-xl rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-xl sm:text-2xl font-semibold text-white">
                Projects in Development
              </h3>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                In Progress
              </span>
            </div>
            <p className="text-sm text-neutral-400 mt-1 font-mono">
              Active learning, algorithmic problem solving &amp; web projects
            </p>
          </div>

          <a
            href="https://github.com/priyanshubuild"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium border border-white/10 transition-colors w-fit"
          >
            <FolderGit2 className="w-4 h-4 text-neutral-300" />
            <span>GitHub Profile</span>
            <ArrowUpRight className="w-4 h-4 text-neutral-400" />
          </a>
        </div>

        <div className="pt-6 space-y-4 text-neutral-300 text-sm sm:text-base leading-relaxed">
          <p>
            I am currently focusing on building core competence and do not have featured production deployments to display yet. Here is what I am actively working on:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="border border-white/5 bg-white/[0.02] rounded-xl p-4">
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider block mb-1">Domain 01</span>
              <h4 className="text-white font-medium text-base mb-1">DSA &amp; C++</h4>
              <p className="text-xs text-neutral-400">
                Daily algorithmic implementations and problem solving on LeetCode &amp; Codeforces.
              </p>
            </div>
            <div className="border border-white/5 bg-white/[0.02] rounded-xl p-4">
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider block mb-1">Domain 02</span>
              <h4 className="text-white font-medium text-base mb-1">Linux &amp; Systems</h4>
              <p className="text-xs text-neutral-400">
                Shell scripting, terminal productivity setups, and exploring OS concepts.
              </p>
            </div>
            <div className="border border-white/5 bg-white/[0.02] rounded-xl p-4">
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider block mb-1">Domain 03</span>
              <h4 className="text-white font-medium text-base mb-1">Full-Stack Web</h4>
              <p className="text-xs text-neutral-400">
                Building responsive web interfaces with Next.js, React, and modern CSS.
              </p>
            </div>
          </div>
          <p className="text-neutral-400 pt-2 text-xs sm:text-sm italic">
            Completed projects with live demos and source repositories will be showcased here as they ship.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProjectsSection