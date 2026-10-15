"use client";
import React, { useState, useRef, useEffect } from "react";
import { Check, Copy } from "lucide-react";

const email = "priyanshug1408@gmail.com";
const repo = "https://github.com/priyanshubuild/priyanshubuild";

type FootLink = {
  text: string;
  href?: string;
  copy?: boolean;
  underline?: boolean;
  excludeFromSnippet?: boolean;
};
type FootColumn = { title: string; links: FootLink[] };

const columns: FootColumn[] = [
  {
    title: "Crafted by",
    links: [
      {
        text: "Priyanshu Gupta",
        href: "https://x.com/priyanshustwt",
        underline: true,
      },
      { text: email, href: `mailto:${email}`, copy: true },
    ],
  },
  {
    title: "Profiles",
    links: [
      { text: "GitHub", href: "https://github.com/priyanshubuild" },
      {
        text: "LeetCode",
        href: "https://leetcode.com/u/Priyanshuguptaleetcode/",
      },
      {
        text: "Codeforces",
        href: "https://codeforces.com/profile/priyanshuguptacf",
      },
      { text: "LinkedIn", href: "https://www.linkedin.com/in/priyanshubuild/" },
    ],
  },
  {
    title: "Colophon",
    links: [
      { text: "Next.js", href: "https://nextjs.org" },
      { text: "TypeScript", href: "https://www.typescriptlang.org" },
      { text: "Tailwind CSS", href: "https://tailwindcss.com" },
      {
        text: "Design credit (Swami Malode)",
        href: "https://github.com/swamimalode07/swamii.me",
        excludeFromSnippet: true,
      },
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

const ContactSection = () => {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    },
    [],
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setCopyError("");
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopyError(
        "Copy unavailable. Use the email link or select the address.",
      );
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#09090B] text-white">
      <p className="sr-only" role="status">
        {copyError || (copied ? "Email copied." : "")}
      </p>
      <div className="px-[3%] pt-20 pb-0 sm:pt-24">
        {/* columned link footer */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-geist-pixel text-secondary text-xs tracking-widest uppercase">
                {col.title}
              </h3>
              <ul className="font-geist-mono mt-4 flex flex-col gap-2 text-sm">
                {col.links.map((item, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    {item.href ? (
                      <a
                        href={item.href}
                        target={
                          item.href.startsWith("http") ? "_blank" : undefined
                        }
                        rel="noopener noreferrer"
                        className={`hover:text-secondary truncate text-white transition-colors ${item.underline ? "link-underline" : ""}`}
                      >
                        <span data-nosnippet={item.excludeFromSnippet ? "" : undefined}>
                          {item.text}
                        </span>
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
                        <span
                          key={copied ? "check" : "copy"}
                          className="email-copy-icon absolute"
                        >
                          {copied ? (
                            <Check className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </span>
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* slim bottom strip */}
        <div className="font-geist-mono text-secondary mt-12 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#1C1C1F] pt-6 text-xs sm:text-sm">
          <span>© {new Date().getFullYear()} Priyanshu Gupta</span>
        </div>
      </div>

      {/* giant clipped wordmark bleeding off the bottom edge */}
      <p
        aria-hidden="true"
        role="presentation"
        data-decoration="PRIYANSHU"
        className="footer-signature font-space-grotesk pointer-events-none mt-16 -mb-[0.22em] text-center text-[clamp(2.5rem,24vw,30rem)] leading-[0.7] font-bold tracking-tighter text-[#141418] select-none"
      ></p>
    </section>
  );
};

export default ContactSection;
