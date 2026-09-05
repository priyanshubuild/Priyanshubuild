"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy } from "lucide-react";

const email = "priyanshug1408@gmail.com";
const repo = "https://github.com/priyanshubuild/priyanshubuild";

type FootLink = { text: string; href?: string; copy?: boolean; underline?: boolean };
type FootColumn = { title: string; links: FootLink[] };

const columns: FootColumn[] = [
  {
    title: "Crafted by",
    links: [
      { text: "Priyanshu Gupta", href: "https://x.com/priyanshustwt", underline: true },
      { text: email, href: `mailto:${email}`, copy: true },
    ],
  },
  {
    title: "Profiles",
    links: [
      { text: "GitHub", href: "https://github.com/priyanshubuild" },
      { text: "LeetCode", href: "https://leetcode.com/u/Priyanshuguptaleetcode/" },
      { text: "Codeforces", href: "https://codeforces.com/profile/priyanshuguptacf" },
      { text: "LinkedIn", href: "https://www.linkedin.com/in/priyanshubuild/" },
    ],
  },
  {
    title: "Colophon",
    links: [
      { text: "Next.js", href: "https://nextjs.org" },
      { text: "TypeScript", href: "https://www.typescriptlang.org" },
      { text: "Tailwind CSS", href: "https://tailwindcss.com" },
      { text: "Deployed on Vercel", href: "https://vercel.com" },
    ],
  },
  {
    title: "Project",
    links: [
      { text: "Source code", href: repo },
      { text: "priyanshugupta.com", href: "https://priyanshugupta.com" },
    ],
  },
];

const iconVariants = {
  initial: { y: 8, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -8, opacity: 0 },
};

const ContactSection = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section className="relative overflow-hidden bg-[#09090B] text-white">
      <div className="px-[3%] pt-20 pb-0 sm:pt-24">
        {/* columned link footer */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-geist-pixel text-xs tracking-widest text-secondary uppercase">
                {col.title}
              </h3>
              <ul className="mt-4 flex flex-col gap-2 font-geist-mono text-sm">
                {col.links.map((item, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className={`truncate text-white transition-colors hover:text-secondary ${item.underline ? "link-underline" : ""}`}
                      >
                        {item.text}
                      </a>
                    ) : (
                      <span className="text-white">{item.text}</span>
                    )}

                    {item.copy && (
                      <button
                        onClick={handleCopy}
                        aria-label="Copy email"
                        className="relative inline-flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden text-gray-500 transition-colors hover:text-white"
                      >
                        <AnimatePresence mode="wait">
                          {copied ? (
                            <motion.span
                              key="check"
                              variants={iconVariants}
                              initial="initial"
                              animate="animate"
                              exit="exit"
                              transition={{ duration: 0.12 }}
                              className="absolute"
                            >
                              <Check className="h-3.5 w-3.5 text-green-500" />
                            </motion.span>
                          ) : (
                            <motion.span
                              key="copy"
                              variants={iconVariants}
                              initial="initial"
                              animate="animate"
                              exit="exit"
                              transition={{ duration: 0.18 }}
                              className="absolute"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* slim bottom strip */}
        <div className="mt-12 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#1C1C1F] pt-6 font-geist-mono text-xs text-secondary sm:text-sm">
          <span>© {new Date().getFullYear()} Priyanshu Gupta</span>
        </div>
      </div>

      {/* giant clipped wordmark bleeding off the bottom edge */}
      <p
        aria-hidden="true"
        className="pointer-events-none mt-16 -mb-[0.22em] text-center font-space-grotesk text-[clamp(2.5rem,24vw,30rem)] leading-[0.7] font-bold tracking-tighter text-[#141418] select-none"
      >
        PRIYANSHU
      </p>
    </section>
  );
};

export default ContactSection;
