"use client";

import { useEffect, useState } from "react";
import { GitHubIcon } from "@/app/icons/Githubicon";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function NavbarStars() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/github-stars", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data && Number.isSafeInteger(data.stars) && data.stars >= 0) setStars(data.stars);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  return (
    <TooltipProvider>
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
            <span className="text-sm text-white/60 hover:text-white">{stars ?? "--"}</span>
          </a>
        </TooltipTrigger>
        <TooltipContent className="rounded-lg bg-[#fafafa] px-[17px] py-[9px] text-[15px] leading-[18px] font-medium text-[#09090b] shadow-lg">
          {stars?.toLocaleString() ?? "--"} star{stars === 1 ? "" : "s"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
