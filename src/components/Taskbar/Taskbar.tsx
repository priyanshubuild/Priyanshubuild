"use client";
import { useState } from "react";
import { taskbarData } from "./constants";

const Taskbar = () => {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 transform items-center gap-4 rounded-full border border-white/20 bg-transparent p-3 shadow-lg backdrop-blur-sm">
      {taskbarData.map((item) => (
        <a
          key={item.name}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.name}
          title={item.name}
          className="rounded-full bg-[#282828] p-2 transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:scale-105"
        >
          {item.icon}
        </a>
      ))}

      <button
        type="button"
        onClick={() => setHovered((prev) => !prev)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label="Toggle open to work badge"
        className="mr-2 ml-1 flex cursor-pointer items-center gap-2 bg-transparent border-none p-0 outline-none"
      >
        <div className="relative flex items-center justify-center">
          <span className="absolute inline-flex h-3 w-3 animate-ping rounded-full bg-green-500 opacity-75"></span>
          <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500 shadow-[0_0_8px_2px_rgba(34,197,94,0.6)]"></span>
        </div>

        <span
          className={`font-sans ml-1 overflow-hidden text-sm font-medium whitespace-nowrap text-white transition-all duration-500 ease-in-out ${
            hovered ? "max-w-xs opacity-100" : "max-w-0 opacity-0"
          }`}
        >
          Open to work
        </span>
      </button>
    </div>
  );
};

export default Taskbar;
