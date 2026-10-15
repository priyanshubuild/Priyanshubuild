import React from "react";
type SkillPillProps = { skillName: string; icon?: React.ReactNode };
export default function SkillPill({ skillName, icon }: SkillPillProps) {
  return (
    <div className="skill-pill bg-grey flex w-fit cursor-pointer items-center gap-2 overflow-hidden rounded-lg px-2 py-1 text-sm md:px-4 md:py-2">
      <div
        aria-hidden="true"
        className="relative h-4 w-4 flex-shrink-0 overflow-hidden md:h-6 md:w-6"
      >
        <span className="skill-icon-first absolute inset-0 flex items-center justify-center">
          {icon}
        </span>
        <span className="skill-icon-second absolute inset-0 flex items-center justify-center">
          {icon}
        </span>
      </div>
      <span className="font-medium whitespace-nowrap">{skillName}</span>
    </div>
  );
}
