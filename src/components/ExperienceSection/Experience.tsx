import React from 'react'
import { Mail, ArrowUpRight } from 'lucide-react'

const ExperienceSection = () => {
    return (
        <div className="px-4 md:px-[3%] py-10">
            <div className="border border-white/10 bg-[#121215]/60 backdrop-blur-xl rounded-2xl p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                    <div>
                        <div className="flex items-center gap-3">
                            <h3 className="text-xl sm:text-2xl font-semibold text-white">
                                Building Technical Foundations
                            </h3>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                Open to Internships
                            </span>
                        </div>
                        <p className="text-sm text-neutral-400 mt-1 font-mono">
                            Learning &amp; Deliberate Practice · 2024 - Present
                        </p>
                    </div>

                    <a
                        href="mailto:priyanshug1408@gmail.com"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium border border-white/10 transition-colors w-fit"
                    >
                        <Mail className="w-4 h-4 text-neutral-300" />
                        <span>Get in Touch</span>
                    </a>
                </div>

                <div className="pt-6 space-y-3 text-neutral-300 text-sm sm:text-base leading-relaxed">
                    <p>
                        I do not have formal corporate work experience yet. Currently, I am dedicating my full focus to mastering core computer science fundamentals:
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5 text-neutral-400">
                        <li>
                            <strong className="text-white">Data Structures &amp; Algorithms:</strong> Consistent daily problem solving in C++ covering trees, graphs, dynamic programming, and competitive programming.
                        </li>
                        <li>
                            <strong className="text-white">Systems &amp; Environment:</strong> Developing proficiency with Linux, shell tooling, Git version control, and understanding systems from the ground up.
                        </li>
                        <li>
                            <strong className="text-white">Web Development:</strong> Learning modern frontend and full-stack development with HTML, CSS, JavaScript, React, and Next.js.
                        </li>
                    </ul>
                    <p className="text-neutral-400 pt-2 text-xs sm:text-sm italic">
                        Experience entries will be updated here as I take on internships, contract work, and industry projects.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ExperienceSection
