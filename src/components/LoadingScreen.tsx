"use client";

import { useLayoutEffect, useRef } from "react";

const words = [
  "Hello",
  "Bonjour",
  "स्वागत है",
  "नमस्कार",
  "Ciao",
  "Olá",
  "おい",
  "Hallå",
  "Guten tag",
];
export default function WordPreloader({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const element = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    // CSS starts before hydration. If it has already finished, dispose of the
    // welcome immediately instead of waiting for an event that already fired.
    if (
      element.current &&
      getComputedStyle(element.current).visibility === "hidden"
    ) {
      onComplete();
    }
  }, [onComplete]);

  return (
    <div
      ref={element}
      onAnimationEnd={(event) => {
        if (
          event.target === event.currentTarget &&
          event.animationName === "portfolio-reveal"
        ) {
          onComplete();
        }
      }}
      aria-hidden="true"
      className="portfolio-preloader fixed inset-0 z-9999999999 flex items-center justify-center bg-[#09090B]"
    >
      <p className="grid text-center text-4xl tracking-tight text-white md:text-6xl">
        {words.map((word, index) => (
          <span
            key={word}
            className="portfolio-greeting col-start-1 row-start-1"
            style={{
              animationDelay: `${index * 180}ms`,
              animationDuration:
                index === words.length - 1 ? "1200ms" : "180ms",
            }}
          >
            • {word}
          </span>
        ))}
      </p>
    </div>
  );
}
