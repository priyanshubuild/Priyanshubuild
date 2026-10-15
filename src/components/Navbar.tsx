"use client";

import React, { useState, useEffect, useRef } from "react";
import { GitHubIcon } from "@/app/icons/Githubicon";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const [stars, setStars] = useState<number | null>(null);

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [isMenuOpen]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/github-stars", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data && typeof data.stars === "number") setStars(data.stars);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  return (
    <div className="relative">
      <nav
        aria-label="Main navigation"
        className="border-borderGrey fixed top-0 left-1/2 z-50 w-full max-w-400 -translate-x-1/2 border-b-2 bg-transparent px-[2%] py-2 backdrop-blur-2xl"
      >
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="font-space-grotesk cursor-pointer text-sm font-semibold text-white transition-colors hover:text-white/80 sm:text-xl"
          >
            @code by PRIYANSHU
          </Link>

          <div className="flex items-center gap-3 sm:gap-6 lg:gap-8">
            <div className="hidden items-center gap-6 md:flex lg:gap-6">
              <a
                className="font-sans font-medium text-white/60 transition-colors hover:text-white"
                href="#projects"
              >
                Projects
              </a>

              <a
                className="font-sans font-medium text-white/60 transition-colors hover:text-white"
                href="#skills"
              >
                Skills
              </a>

              <a
                className="font-sans font-medium text-white/60 transition-colors hover:text-white"
                href="#about"
              >
                About
              </a>

              <a
                className="font-sans font-medium text-white/60 transition-colors hover:text-white"
                href="#contact"
              >
                Contact
              </a>

              <div className="hidden items-center gap-6 md:flex">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href="https://github.com/priyanshubuild"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Priyanshu Gupta GitHub profile and repository stars"
                      className="flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-[#1C1C1F]"
                    >
                      <GitHubIcon className="h-5 w-5 text-white/60 transition-colors hover:text-white" />
                      <span className="text-sm text-white/60 hover:text-white">
                        {stars ?? "--"}
                      </span>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent className="rounded-lg bg-[#fafafa] px-[17px] py-[9px] text-[15px] leading-[18px] font-medium text-[#09090b] shadow-lg">
                    {stars?.toLocaleString() ?? "--"} star
                    {stars === 1 ? "" : "s"}
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            <button
              ref={menuButton}
              onClick={toggleMenu}
              className="flex h-6 w-6 flex-col items-center justify-center space-y-1 md:hidden"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
            >
              <span
                className={`h-0.5 w-4 bg-white transition-all duration-300 ${
                  isMenuOpen ? "translate-y-1.5 rotate-45" : ""
                }`}
              />
              <span
                className={`h-0.5 w-4 bg-white transition-all duration-300 ${
                  isMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`h-0.5 w-4 bg-white transition-all duration-300 ${
                  isMenuOpen ? "-translate-y-1.5 -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>

        <div
          id="mobile-navigation"
          inert={!isMenuOpen}
          className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
            isMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t-2 border-[#1C1C1F] px-4 pb-4">
            <div className="space-y-1 pt-3">
              <a
                className="block w-full rounded-lg px-3 py-3 text-left font-sans font-medium text-white transition-colors hover:bg-[#1C1C1F] hover:text-gray-300"
                href="#projects"
                onClick={() => setIsMenuOpen(false)}
              >
                Projects
              </a>
              <a
                className="block w-full rounded-lg px-3 py-3 text-left font-sans font-medium text-white transition-colors hover:bg-[#1C1C1F] hover:text-gray-300"
                href="#skills"
                onClick={() => setIsMenuOpen(false)}
              >
                Skills
              </a>
              <a
                className="block w-full rounded-lg px-3 py-3 text-left font-sans font-medium text-white transition-colors hover:bg-[#1C1C1F] hover:text-gray-300"
                href="#about"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </a>
              <a
                className="block w-full rounded-lg px-3 py-3 text-left font-sans font-medium text-white transition-colors hover:bg-[#1C1C1F] hover:text-gray-300"
                href="#contact"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
