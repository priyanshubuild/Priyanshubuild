"use client";

import { useEffect, useRef, useState } from "react";

import dynamic from "next/dynamic";
const GitHubActivity = dynamic(
  () => import("@/components/ui/github-activity"),
  { ssr: false },
);

const GITHUB_USERNAME = "priyanshubuild";

const DARK_TOKENS = {
  "--foreground": "#fafafa",
  "--color-foreground": "#fafafa",
  "--card": "#17171a",
  "--color-card": "#17171a",
  "--background": "#303036",
  "--color-background": "#303036",
  "--color-neutral-200": "#0e0e10",
} as React.CSSProperties;

const ACCENT = ["#383838", "#5c5c5d", "#838383", "#868689", "#fafafa"];

const WEEKS = 53;
const CARD_PADDING = 32;
const MIN_CELL = 11;
const MAX_CELL = 64;
const CELL_STEP = 0.25;
const SAFETY = 1;

const gapFor = (cell: number) => Math.max(2, Math.round(cell / 4));

const widthFor = (cell: number) => {
  const gap = gapFor(cell);
  return WEEKS * (cell + gap) - gap + CARD_PADDING;
};

const fitCell = (available: number) => {
  const cap = available - SAFETY;
  let best = MIN_CELL;
  for (
    let cell = MIN_CELL;
    cell <= MAX_CELL && widthFor(cell) <= cap;
    cell += CELL_STEP
  ) {
    best = cell;
  }
  return best;
};

function useFittedCell() {
  const ref = useRef<HTMLDivElement>(null);
  const [cell, setCell] = useState(MIN_CELL);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => setCell(fitCell(el.clientWidth));

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, cell] as const;
}

export default function GithubActivityCard() {
  const [ref, cellSize] = useFittedCell();
  const [near, setNear] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "500px" },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return (
    <div className="px-[3%] py-10">
      <div
        ref={ref}
        className="flex"
        style={{ minHeight: 7 * cellSize + 7 * gapFor(cellSize) + 144 }}
      >
        {near ? (
          <GitHubActivity
            username={GITHUB_USERNAME}
            accent={ACCENT}
            cellSize={cellSize}
            showMonths
            style={DARK_TOKENS}
            className="bg-[#0e0e10]"
          />
        ) : (
          <div
            aria-busy="true"
            className="relative w-full max-w-full rounded-[28px] bg-[#0e0e10] p-4"
            style={{
              ...DARK_TOKENS,
              minHeight: 7 * cellSize + 7 * gapFor(cellSize) + 144,
            }}
          >
            <p className="px-1.5 text-base font-medium text-white">
              Loading GitHub activity…
            </p>
            <div
              aria-hidden="true"
              className="mt-4 grid grid-flow-col grid-rows-7 gap-1 opacity-50"
            >
              {Array.from({ length: 371 }, (_, i) => (
                <span
                  key={i}
                  className="rounded-[3px] bg-[#383838]"
                  style={{ height: cellSize }}
                />
              ))}
            </div>
            <noscript>
              <a
                className="text-white underline"
                href="https://github.com/priyanshubuild"
              >
                View GitHub contributions
              </a>
            </noscript>
          </div>
        )}
      </div>
    </div>
  );
}
