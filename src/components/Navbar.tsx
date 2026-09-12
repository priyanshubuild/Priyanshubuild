"use client";

import React, { useState, useEffect } from "react";
import CommandMenu from "./CommandMenu";
import { GitHubIcon } from "@/app/icons/Githubicon";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isCommandMenuOpen, setIsCommandMenuOpen] =
    useState<boolean>(false);
  const [stars, setStars] = useState<number | null>(null);

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleCommandMenu = (): void => {
    setIsCommandMenuOpen(!isCommandMenuOpen);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        toggleCommandMenu();
      }
    };

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (!isMobile) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (!isMobile) {
        document.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, []);

  useEffect(() => {
    const fetchGithubStars = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/repos/priyanshubuild/priyanshubuild"
        );
        if (!response.ok) {
          // fallback to user stats
          const userRes = await fetch("https://api.github.com/users/priyanshubuild/repos");
          if (userRes.ok) {
            const repos = await userRes.json();
            if (Array.isArray(repos)) {
              const total = repos.reduce((acc: number, r: { stargazers_count?: number }) => acc + (r.stargazers_count || 0), 0);
              setStars(total);
              return;
            }
          }
        }
        const data = await response.json();
        setStars(data.stargazers_count ?? 0);
      } catch (error) {
        return null;
      }
    };
    fetchGithubStars();
  }, []);

  return (
    <div className="relative">
      <div className="border-b-2 border-borderGrey px-[2%] py-2 fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-400 z-50 bg-transparent backdrop-blur-2xl">
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="font-space-grotesk text-sm font-semibold text-white sm:text-xl cursor-pointer hover:text-white/80 transition-colors"
          >
            @code by PRIYANSHU
          </Link>

          <div className="flex items-center gap-3 sm:gap-6 lg:gap-8">
            <div className="hidden items-center gap-6 md:flex lg:gap-6">
              <a
                className="font-sans font-medium text-white/60 hover:text-white transition-colors"
                href="#projects"
              >
                Projects
              </a>

              <a
                className="font-sans font-medium text-white/60 hover:text-white transition-colors"
                href="#skills"
              >
                Skills
              </a>

              <a
                className="font-sans font-medium text-white/60 hover:text-white transition-colors"
                href="#about"
              >
                About
              </a>

              <a
                className="font-sans font-medium text-white/60 hover:text-white transition-colors"
                href="#contact"
              >
                Contact
              </a>

              <div className="hidden md:flex items-center gap-6">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href="https://github.com/priyanshubuild"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Priyanshu Gupta GitHub profile and repository stars"
                      className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#1C1C1F] transition-colors"
                    >
                      <GitHubIcon className="h-5 w-5 text-white/60 hover:text-white transition-colors" />
                      <span className="text-white/60 hover:text-white text-sm">
                        {stars ?? "--"}
                      </span>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent className="rounded-lg bg-[#fafafa] px-[17px] py-[9px] text-[15px] leading-[18px] font-medium text-[#09090b] shadow-lg">
                    {stars?.toLocaleString() ?? "--"} star{stars === 1 ? "" : "s"}
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            <button
              onClick={toggleMenu}
              className="flex h-6 w-6 flex-col items-center justify-center space-y-1 md:hidden"
              aria-label="Toggle menu"
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
      </div>

      {/* <CommandMenu
        isOpen={isCommandMenuOpen}
        onClose={() => setIsCommandMenuOpen(false)}
      /> */}
    </div>
  );
};

export default Navbar;