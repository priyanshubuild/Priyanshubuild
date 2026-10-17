"use client";

import { useCallback, useLayoutEffect, useState } from "react";
import { usePathname } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";

// The root layout persists during App Router navigation. The greeting therefore
// has one lifecycle per document, rather than a new lifecycle on every Home visit.
export default function WelcomeSession() {
  const pathname = usePathname();
  const [showWelcome, setShowWelcome] = useState(true);
  const finishWelcome = useCallback(() => {
    document.documentElement.dataset.portfolioWelcome = "done";
    setShowWelcome(false);
  }, []);

  useLayoutEffect(() => {
    if (
      pathname !== "/" ||
      document.documentElement.dataset.portfolioWelcome !== "play"
    ) {
      finishWelcome();
    }

    const restore = (event: PageTransitionEvent) => {
      if (event.persisted) finishWelcome();
    };
    window.addEventListener("pageshow", restore);
    window.addEventListener("pagehide", finishWelcome);
    return () => {
      window.removeEventListener("pageshow", restore);
      window.removeEventListener("pagehide", finishWelcome);
    };
  }, [pathname, finishWelcome]);

  return showWelcome ? <LoadingScreen onComplete={finishWelcome} /> : null;
}
