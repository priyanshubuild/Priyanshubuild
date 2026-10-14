"use client";
import { useEffect } from "react";
type Registry = {
  registerTool: (
    tool: {
      name: string;
      description: string;
      inputSchema: object;
      annotations: object;
      execute: (input: unknown) => Promise<unknown>;
    },
    options?: { signal: AbortSignal },
  ) => void | Promise<void>;
  unregisterTool?: (name: string) => void;
};
export default function AgentTools() {
  useEffect(() => {
    const registry =
      (document as Document & { modelContext?: Registry }).modelContext ??
      (navigator as Navigator & { modelContext?: Registry }).modelContext;
    if (typeof registry?.registerTool !== "function") return;
    const lifecycle = new AbortController();
    const names: string[] = [];
    for (const [name, description, url] of [
      [
        "get_portfolio_profile",
        "Read Priyanshu Gupta’s public identity, interests, profile links, and contact information from this portfolio.",
        "/profile.json",
      ],
      [
        "get_github_activity",
        "Read verified public GitHub contribution dates and repository commit rankings, including timestamps and partial-data status. This reads the same cached data as the GitHub section.",
        "/api/github-activity",
      ],
    ]) {
      try {
        const registration = registry.registerTool(
          {
            name,
            description,
            inputSchema: {
              type: "object",
              properties: {},
              additionalProperties: false,
            },
            annotations: {
              readOnlyHint: true,
              untrustedContentHint: name === "get_github_activity",
            },
            async execute(input: unknown) {
              if (
                !input ||
                typeof input !== "object" ||
                Array.isArray(input) ||
                Object.keys(input).length
              )
                throw new Error("This tool accepts an empty object.");
              const response = await fetch(url, {
                signal: AbortSignal.timeout(58000),
              });
              if (!response.ok && response.status !== 503)
                throw new Error("Public resource unavailable.");
              const data = await response.json();
              return {
                content: [
                  {
                    type: "text",
                    text: JSON.stringify({ status: response.status, data }),
                  },
                ],
              };
            },
          },
          { signal: lifecycle.signal },
        );
        names.push(name);
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
