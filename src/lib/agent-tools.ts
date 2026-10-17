export type PublicToolDefinition = {
  name: string;
  description: string;
  path: string;
  format: string;
};

export type ToolExecutionContext = { signal?: AbortSignal };
export type PublicTool = {
  name: string;
  description: string;
  inputSchema: object;
  annotations: object;
  execute: (input: unknown, context?: ToolExecutionContext) => Promise<unknown>;
};

export type ToolRegistry = {
  registerTool: (
    tool: PublicTool,
    options?: { signal: AbortSignal },
  ) => void | Promise<void>;
  unregisterTool?: (name: string) => void;
};

// Definitions are local and fixed: callers cannot supply a URL or credentials.
export function createPublicTool(
  definition: PublicToolDefinition,
  lifecycle: AbortSignal,
  fetchResource: typeof fetch = fetch,
): PublicTool {
  return {
    name: definition.name,
    description: definition.description,
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
    annotations: {
      readOnlyHint: true,
      consequentialHint: false,
      untrustedContentHint: definition.path === "/api/github-activity",
    },
    async execute(input, context) {
      if (
        !input ||
        typeof input !== "object" ||
        Array.isArray(input) ||
        Reflect.ownKeys(input).length
      )
        throw new Error("This tool accepts an empty object.");
      const controller = new AbortController();
      const cancel = () => controller.abort();
      const signals = [lifecycle, context?.signal].filter(
        (signal): signal is AbortSignal => !!signal,
      );
      for (const signal of signals) {
        if (signal.aborted) cancel();
        signal.addEventListener("abort", cancel, { once: true });
      }
      const timeout = setTimeout(cancel, 58000);
      try {
        const response = await fetchResource(definition.path, {
          signal: controller.signal,
          credentials: "omit",
          redirect: "error",
          headers: {
            Accept:
              definition.format === "json" ? "application/json" : "text/plain",
          },
        });
        const activity = definition.path === "/api/github-activity";
        if (!response.ok && !(activity && response.status === 503))
          throw new Error("Public resource unavailable.");
        const contentType = response.headers.get("content-type") || "";
        if (
          !(
            definition.format === "json"
              ? /application\/json/i
              : /text\/(?:plain|markdown)/i
          ).test(contentType)
        )
          throw new Error("Unexpected public resource format.");
        const data =
          definition.format === "json"
            ? await response.json()
            : await response.text();
        if (
          definition.format === "json" &&
          (!data || typeof data !== "object" || Array.isArray(data))
        )
          throw new Error("Unexpected public resource data.");
        const partial =
          activity &&
          (response.status === 503 ||
            data.errors?.calendar !== false ||
            data.errors?.repositories !== false);
        return {
          ...(partial ? { isError: true } : {}),
          content: [
            {
              type: "text",
              text: JSON.stringify({
                source: `https://priyanshugupta.com${definition.path}`,
                status: response.status,
                data,
              }),
            },
          ],
        };
      } finally {
        clearTimeout(timeout);
        for (const signal of signals)
          signal.removeEventListener("abort", cancel);
      }
    },
  };
}
