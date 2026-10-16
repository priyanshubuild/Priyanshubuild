"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "motion/react";
import { GitBranch } from "lucide-react";
import { mergeSnapshot, type GitHubSnapshot } from "@/lib/github-data";
import { cn } from "@/lib/utils";

export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export type Contribution = {
  date: string;
  count: number;
  level: ContributionLevel;
  placeholder?: boolean;
};

export type RepoContribution = {
  name: string;
  count: number;
  logo?: React.ReactNode;
  href?: string;
};

const DEFAULT_ACCENT = "#39d353";
const DEFAULT_CELL_SIZE = 11;
const DEFAULT_LABEL = "Top repositories by commits:";
const DEFAULT_MONTHS = 12;
const WEEKS_PER_MONTH = 365.25 / 12 / 7;
const STACK_LIMIT = 3;
const MIN_CARD_WIDTH = 320;
const MIN_LABEL_WEEKS = 3;
// the p-4 on the card, both sides; the width math below has to add it back
const CARD_PADDING = 32;

const gapFor = (cellSize: number) => Math.max(2, Math.round(cellSize / 4));
// never zero: weeks.slice(-0) would hand back the whole history instead of nothing
const weeksFor = (months: number) =>
  Math.max(1, Math.ceil(months * WEEKS_PER_MONTH));

const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const SPRING = { type: "spring", bounce: 0.2, duration: 0.62 } as const;
const HEADER_SPRING = { ...SPRING, bounce: 0.45 } as const;
const ROW_SPRING = { ...SPRING, bounce: 0.26, delay: 0.08 } as const;
const ROW_OFFSET = 16;
const TOOLTIP_FADE = { duration: 0.14, ease: EASE_OUT } as const;
const TOOLTIP_EDGE = 8;
const LABEL_REVEAL = { duration: 0.45, ease: EASE_OUT } as const;

const LEVELS = [0, 1, 2, 3, 4] as const;

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function toMonthLabels(weeks: Contribution[][]) {
  const labels: (string | null)[] = weeks.map(() => null);
  const monthAt = (index: number) => weeks[index]?.[0]?.date.slice(5, 7);

  let start = 0;
  for (let i = 1; i <= weeks.length; i++) {
    if (i < weeks.length && monthAt(i) === monthAt(start)) continue;
    // a shorter run is narrower than the label itself, so it would sit under the next month
    if (i - start >= MIN_LABEL_WEEKS) {
      labels[start] = MONTH_NAMES[Number(monthAt(start)) - 1] ?? null;
    }
    start = i;
  }

  return labels;
}

const LEVEL_OPACITY: Record<ContributionLevel, number> = {
  0: 0,
  1: 0.3,
  2: 0.52,
  3: 0.76,
  4: 1,
};

type LevelStyle = { backgroundColor: string; opacity: number };

type HoveredDay = { day: Contribution; x: number; y: number };

const DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function describeDay({ count, date }: Contribution) {
  const noun = count === 1 ? "contribution" : "contributions";
  return `${count} ${noun} on ${DATE_FORMAT.format(new Date(`${date}T00:00:00`))}`;
}

function useGitHubUser(login?: string) {
  const [data, setData] = React.useState<GitHubSnapshot>();
  const [loading, setLoading] = React.useState(true);
  const [failed, setFailed] = React.useState(false);
  const [started, setStarted] = React.useState(false);
  const element = React.useRef<HTMLDivElement>(null);
  const controller = React.useRef<AbortController | null>(null);
  const refresh = React.useCallback(async () => {
    if (controller.current) return;
    const request = new AbortController();
    controller.current = request;
    setLoading(true);
    const timeout = setTimeout(() => request.abort(), 58000);
    try {
      const response = await fetch("/api/github-activity", {
        signal: request.signal,
      });
      const next = (await response.json()) as GitHubSnapshot;
      if (!next.errors || (!response.ok && response.status !== 503))
        throw new Error("Unavailable");
      setData((previous) => mergeSnapshot(previous, next));
      setFailed(false);
    } catch {
      setFailed(true);
    } finally {
      clearTimeout(timeout);
      controller.current = null;
      setLoading(false);
    }
  }, []);
  React.useEffect(() => {
    if (!login) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    if (element.current) observer.observe(element.current);
    return () => observer.disconnect();
  }, [login]);
  React.useEffect(() => {
    if (!started || !login) return;
    void refresh();
    const visible = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    const timer = setInterval(visible, 60000);
    document.addEventListener("visibilitychange", visible);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", visible);
      controller.current?.abort();
    };
  }, [started, login, refresh]);
  return { data, loading, failed, refresh, element };
}

function emptyDays(weeks: number): Contribution[] {
  const today = new Date();
  return Array.from({ length: weeks * 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (weeks * 7 - 1 - i));
    return {
      date: date.toISOString().slice(0, 10),
      count: 0,
      level: 0 as ContributionLevel,
    };
  });
}

function toScale(accent: string | string[]): LevelStyle[] {
  if (typeof accent === "string") {
    return LEVELS.map((level) => ({
      backgroundColor: accent,
      opacity: LEVEL_OPACITY[level],
    }));
  }

  const colors = accent.length > 4 ? accent : ["transparent", ...accent];
  return LEVELS.map((level) => {
    const color = colors[level] ?? colors.at(-1) ?? "transparent";
    return { backgroundColor: color, opacity: color === "transparent" ? 0 : 1 };
  });
}

function toWeeks(contributions: Contribution[]) {
  const weeks: Contribution[][] = [];
  const offset = contributions[0]
    ? new Date(`${contributions[0].date}T00:00:00Z`).getUTCDay()
    : 0;
  const padded = [
    ...Array.from({ length: offset }, () => ({
      ...contributions[0],
      count: 0,
      level: 0 as ContributionLevel,
      placeholder: true,
    })),
    ...contributions,
  ];
  for (let i = 0; i < padded.length; i += 7) weeks.push(padded.slice(i, i + 7));
  return weeks;
}

function useFittedColumns(cellSize: number, gap: number) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [columns, setColumns] = React.useState<number>();

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () =>
      setColumns(
        Math.max(1, Math.floor((el.clientWidth + gap) / (cellSize + gap))),
      );

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [cellSize, gap]);

  return [ref, columns] as const;
}

const Tooltip = ({
  hovered,
  reduceMotion,
}: {
  hovered: HoveredDay;
  reduceMotion: boolean | null;
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [left, setLeft] = React.useState(hovered.x);

  useIsoLayoutEffect(() => {
    const half = (ref.current?.offsetWidth ?? 0) / 2;
    const edge = TOOLTIP_EDGE + half;
    setLeft(Math.min(Math.max(hovered.x, edge), window.innerWidth - edge));
  }, [hovered]);

  return createPortal(
    <div
      className="pointer-events-none fixed z-50"
      style={{
        left,
        top: hovered.y,
        transform: "translate(-50%, calc(-100% - 8px))",
      }}
    >
      <motion.div
        ref={ref}
        className="bg-foreground text-background rounded-lg px-2 py-1 text-[11px] font-medium whitespace-nowrap shadow-md"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
        transition={reduceMotion ? { duration: 0 } : TOOLTIP_FADE}
      >
        {describeDay(hovered.day)}
      </motion.div>
    </div>,
    document.body,
  );
};

const ContributionGrid = ({
  contributions,
  scale,
  cellSize,
  months,
  showMonths,
  label,
  reduceMotion,
}: {
  contributions: Contribution[];
  scale: LevelStyle[];
  cellSize: number;
  months: number;
  showMonths: boolean;
  label: string;
  reduceMotion: boolean | null;
}) => {
  const weeks = React.useMemo(() => toWeeks(contributions), [contributions]);
  const gap = gapFor(cellSize);
  const [ref, columns] = useFittedColumns(cellSize, gap);
  const [hovered, setHovered] = React.useState<HoveredDay>();

  const cap = Math.min(weeks.length, weeksFor(months));
  const visible = weeks.slice(-Math.min(cap, columns ?? cap));
  const sweepEnd = 0;

  const hover = (day: Contribution) => (event: React.PointerEvent) => {
    const cell = event.currentTarget.getBoundingClientRect();
    setHovered({ day, x: cell.left + cell.width / 2, y: cell.top });
  };

  return (
    <div
      ref={ref}
      data-slot="github-activity-grid"
      role="img"
      aria-label={label}
      className="relative"
    >
      {showMonths && (
        <motion.div
          className="flex justify-center"
          style={{ gap, marginBottom: gap }}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            ...LABEL_REVEAL,
            delay: reduceMotion ? 0 : sweepEnd,
          }}
        >
          {toMonthLabels(visible).map((month, index) => (
            <div
              key={index}
              className="relative h-3 shrink-0"
              style={{ width: cellSize }}
            >
              {month && (
                <span className="absolute top-0 left-0 text-[10px] leading-none text-neutral-400">
                  {month}
                </span>
              )}
            </div>
          ))}
        </motion.div>
      )}

      <div
        className="flex justify-center overflow-hidden"
        style={{ gap }}
        onPointerLeave={() => setHovered(undefined)}
      >
        {visible.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col" style={{ gap }}>
            {week.map((day, dayIndex) => (
              <div
                key={`${day.date}-${day.placeholder ? `pad-${dayIndex}` : "day"}`}
                aria-hidden={day.placeholder || undefined}
                onPointerEnter={day.placeholder ? undefined : hover(day)}
                title={day.placeholder ? undefined : describeDay(day)}
                className="bg-foreground/[0.08] shrink-0 rounded-[3px]"
                style={{
                  width: cellSize,
                  height: cellSize,
                  visibility: day.placeholder ? "hidden" : undefined,
                }}
              >
                <div
                  className="h-full w-full rounded-[3px]"
                  style={scale[day.level] ?? scale[0]}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {hovered && (
          <Tooltip
            key="tooltip"
            hovered={hovered}
            reduceMotion={reduceMotion}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const Avatar = ({
  repo,
  layoutId,
  transition,
  className,
}: {
  repo: RepoContribution;
  layoutId: string;
  transition: Transition;
  className?: string;
}) => (
  <motion.span
    layoutId={layoutId}
    transition={transition}
    className={cn(
      "text-foreground/70 ring-background grid size-7 shrink-0 place-items-center overflow-hidden rounded-full bg-neutral-200 text-[11px] font-medium uppercase ring-2 dark:bg-neutral-800",
      "[&_img]:size-full [&_img]:object-cover [&_svg]:size-full",
      className,
    )}
  >
    {repo.logo ?? <GitBranch aria-hidden="true" className="!size-4" />}
  </motion.span>
);

const RepoRow = ({
  repo,
  layoutId,
  transition,
}: {
  repo: RepoContribution;
  layoutId: string;
  transition: Transition;
}) => {
  const className =
    "flex items-center gap-3 rounded-xl mx-2 px-2 py-2 transition-colors hover:bg-foreground/5";

  const content = (
    <>
      <Avatar repo={repo} layoutId={layoutId} transition={transition} />
      <span className="text-foreground flex-1 truncate text-sm">
        {repo.name}
      </span>
      <span className="text-foreground/70 text-sm tabular-nums">
        {repo.count.toLocaleString()}
      </span>
    </>
  );

  return repo.href ? (
    <a href={repo.href} target="_blank" rel="noreferrer" className={className}>
      {content}
    </a>
  ) : (
    <div className={className}>{content}</div>
  );
};

const Chevron = ({
  open,
  transition,
}: {
  open: boolean;
  transition: Transition;
}) => (
  <motion.svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    className="size-7 text-[#C4C9CC] dark:text-[#3E4346]"
    initial={false}
    animate={{ rotate: open ? 180 : 0 }}
    transition={transition}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m16 10-4 4-4-4" />
  </motion.svg>
);

export type GitHubActivityProps = React.ComponentProps<"div"> & {
  username?: string;
  contributions?: Contribution[];
  repos?: RepoContribution[];
  year?: number;
  accent?: string | string[];
  cellSize?: number;
  months?: number;
  showMonths?: boolean;
  label?: string;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const GitHubActivity = ({
  className,
  username,
  contributions: contributionsProp = [],
  repos: reposProp = [],
  year,
  accent = DEFAULT_ACCENT,
  cellSize = DEFAULT_CELL_SIZE,
  months = DEFAULT_MONTHS,
  showMonths = false,
  label = DEFAULT_LABEL,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  style,
  ...props
}: GitHubActivityProps) => {
  const reduceMotion = useReducedMotion();
  const uid = React.useId();
  const [openState, setOpenState] = React.useState(defaultOpen);

  const open = openProp ?? openState;
  const toggle = () => {
    if (openProp === undefined) setOpenState(!open);
    onOpenChange?.(!open);
  };

  const fetched = useGitHubUser(username);
  const placeholder = React.useMemo(
    () => (username ? emptyDays(weeksFor(months)) : []),
    [username, months],
  );

  const contributions = contributionsProp.length
    ? contributionsProp
    : (fetched.data?.calendar?.days ?? placeholder);
  const repos = reposProp.length
    ? reposProp
    : (fetched.data?.repositories?.repos.slice(0, STACK_LIMIT) ?? []);

  const scale = React.useMemo(() => toScale(accent), [accent]);
  const transition = reduceMotion ? { duration: 0 } : SPRING;
  const headerTransition = reduceMotion ? { duration: 0 } : HEADER_SPRING;
  const rowTransition = reduceMotion ? { duration: 0 } : ROW_SPRING;

  const kick = reduceMotion ? {} : { x: ROW_OFFSET, y: ROW_OFFSET };
  const listMotion = {
    initial: { opacity: 0, ...kick },
    animate: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, ...kick },
  };

  const total = React.useMemo(
    () => contributions.reduce((sum, day) => sum + day.count, 0),
    [contributions],
  );

  const hasCalendar = contributionsProp.length > 0 || !!fetched.data?.calendar;
  const heading = hasCalendar
    ? `${total} contributions${year ? ` in ${year}` : " in the past year"}`
    : fetched.loading
      ? "Loading GitHub activity…"
      : "GitHub calendar is temporarily unavailable";

  const gap = gapFor(cellSize);
  const columns = Math.min(
    Math.ceil(contributions.length / 7),
    weeksFor(months),
  );
  const width = Math.max(
    MIN_CARD_WIDTH,
    columns * (cellSize + gap) - gap + CARD_PADDING,
  );

  return (
    <div
      ref={fetched.element}
      data-slot="github-activity"
      className={cn(
        "relative max-w-full overflow-hidden rounded-[28px] bg-white p-4 dark:bg-black",
        (repos.length > 0 || username) && "pb-[76px]",
        className,
      )}
      style={{ width, ...style }}
      {...props}
    >
      <p className="text-foreground mb-4 px-1.5 text-base font-medium">
        {heading}
      </p>

      <ContributionGrid
        contributions={contributions}
        scale={scale}
        cellSize={cellSize}
        months={months}
        showMonths={showMonths}
        label={heading}
        reduceMotion={reduceMotion}
      />

      {(fetched.failed ||
        fetched.data?.errors.calendar ||
        fetched.data?.errors.repositories ||
        (fetched.data?.calendar &&
          Date.now() - Date.parse(fetched.data.calendar.fetchedAt) > 1800000) ||
        (fetched.data?.repositories &&
          Date.now() - Date.parse(fetched.data.repositories.fetchedAt) >
            1800000)) && (
        <p role="status" className="px-1.5 py-2 text-xs text-neutral-300">
          Some GitHub data is unavailable or waiting for a fresh update.{" "}
          <button
            type="button"
            onClick={() => void fetched.refresh()}
            className="underline underline-offset-2"
          >
            Try again
          </button>
        </p>
      )}
      {repos.length > 0 && (
        <motion.div
          layout
          id={`${uid}-panel`}
          data-slot="github-activity-panel"
          data-state={open ? "open" : "closed"}
          className={cn(
            "bg-card/90 absolute inset-x-3 bottom-3 overflow-hidden backdrop-blur-xl",
            open && "top-3",
          )}
          style={{ borderRadius: 18 }}
          transition={transition}
        >
          <motion.div
            layout="position"
            transition={headerTransition}
            className="flex items-center justify-between gap-3 px-4 py-3"
          >
            <span className="text-foreground truncate text-sm">{label}</span>

            <div className="flex items-center gap-3">
              {!open && (
                <div className="flex items-center">
                  {repos.slice(0, STACK_LIMIT).map((repo) => (
                    <Avatar
                      key={repo.href ?? repo.name}
                      repo={repo}
                      layoutId={`${uid}-${repo.href ?? repo.name}`}
                      transition={transition}
                      className="-ml-2 first:ml-0"
                    />
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={toggle}
                aria-expanded={open}
                aria-controls={`${uid}-panel`}
                aria-label={
                  open ? "Hide top repositories" : "Show top repositories"
                }
                className="bg-card grid size-7 shrink-0 place-items-center rounded-full"
              >
                <Chevron open={open} transition={transition} />
              </button>
            </div>
          </motion.div>

          <AnimatePresence initial={false} mode="popLayout">
            {open && (
              <motion.ul
                key="list"
                layout="position"
                {...listMotion}
                transition={rowTransition}
                className="px-0.5 pb-1"
              >
                {repos.map((repo) => (
                  <motion.li key={repo.href ?? repo.name} layout="position" transition={rowTransition}>
                    <RepoRow
                      repo={repo}
                      layoutId={`${uid}-${repo.href ?? repo.name}`}
                      transition={transition}
                    />
                  </motion.li>
                ))}
                {fetched.data?.repositories && (
                  <li className="px-4 pt-2 pb-2 text-[11px] leading-relaxed text-neutral-300">
                    All commits · all time.{" "}
                    <button
                      type="button"
                      onClick={() => void fetched.refresh()}
                      disabled={fetched.loading}
                      className="underline underline-offset-2"
                    >
                      {fetched.loading ? "Updating…" : "Refresh"}
                    </button>
                  </li>
                )}
              </motion.ul>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export { GitHubActivity };
export default GitHubActivity;
