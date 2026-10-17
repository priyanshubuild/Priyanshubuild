"use client";
import { useEffect } from "react";
import definitions from "@/data/agent-tools.json";
import { createPublicTool, type ToolRegistry } from "@/lib/agent-tools";
export default function AgentTools() {
  useEffect(() => {
    const registry =
      (document as Document & { modelContext?: ToolRegistry }).modelContext ??
      (navigator as Navigator & { modelContext?: ToolRegistry }).modelContext;
    if (typeof registry?.registerTool !== "function") return;
    const lifecycle = new AbortController();
    const names: string[] = [];
    for (const definition of definitions) {
      try {
        const registration = registry.registerTool(
          createPublicTool(definition, lifecycle.signal),
          { signal: lifecycle.signal },
        );
        names.push(definition.name);
        void Promise.resolve(registration).catch(() => {});
      } catch {
        /* Browsers without a compatible registry keep the ordinary interface. */
      }
    }
    return () => {
      lifecycle.abort();
      for (const name of names) {
        try {
          registry.unregisterTool?.(name);
        } catch {}
      }
    };
  }, []);
  return null;
}
