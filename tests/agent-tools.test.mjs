import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const source = await readFile(
  new URL("../src/lib/agent-tools.ts", import.meta.url),
  "utf8",
);
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ES2022,
  },
});
const { createPublicTool } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled.outputText).toString("base64")}`
);
const definitions = JSON.parse(
  await readFile(
    new URL("../src/data/agent-tools.json", import.meta.url),
    "utf8",
  ),
);
const response = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
const activity = definitions.find(
  (tool) => tool.name === "get_github_activity",
);

test("every public tool reads its fixed resource without cookies or redirects", async () => {
  assert.equal(new Set(definitions.map((tool) => tool.name)).size, 4);
  for (const definition of definitions) {
    assert.match(
      definition.path,
      /^\/(?:profile\.json|projects\.json|llms-full\.txt|api\/github-activity)$/,
    );
    const tool = createPublicTool(
      definition,
      new AbortController().signal,
      async (path, options) => {
        assert.equal(path, definition.path);
        assert.equal(options.credentials, "omit");
        assert.equal(options.redirect, "error");
        assert.ok(options.signal instanceof AbortSignal);
        return definition.format === "text"
          ? new Response("# Guide", {
              headers: { "Content-Type": "text/plain" },
            })
          : response({ errors: { calendar: false, repositories: false } });
      },
    );
    const result = await tool.execute({});
    assert.equal(result.isError, undefined);
    const envelope = JSON.parse(result.content[0].text);
    assert.equal(
      envelope.source,
      "https://priyanshugupta.com" + definition.path,
    );
    assert.equal(envelope.status, 200);
    assert.equal(tool.annotations.readOnlyHint, true);
    assert.equal(tool.annotations.consequentialHint, false);
  }
});

test("tool input validation rejects arbitrary fields before any request", async () => {
  let calls = 0;
  const tool = createPublicTool(
    definitions[0],
    new AbortController().signal,
    async () => {
      calls++;
      return response({});
    },
  );
  for (const input of [
    null,
    undefined,
    [],
    "",
    1,
    { url: "https://example.com" },
    { message: "send" },
  ])
    await assert.rejects(tool.execute(input), /empty object/);
  assert.equal(calls, 0);
});

test("partial and unavailable activity remains marked as an error", async () => {
  for (const status of [200, 503]) {
    const tool = createPublicTool(
      activity,
      new AbortController().signal,
      async () =>
        response(
          {
            calendar: null,
            repositories: { fetchedAt: "2026-10-16T00:00:00Z", repos: [] },
            errors: { calendar: true, repositories: false },
          },
          status,
        ),
    );
    const result = await tool.execute({});
    assert.equal(result.isError, true);
    assert.equal(JSON.parse(result.content[0].text).data.calendar, null);
  }
});

test("unexpected HTTP errors, HTML and invalid JSON shapes are rejected", async () => {
  for (const reply of [
    response({}, 503),
    response({}, 404),
    new Response("<html>blocked</html>", {
      headers: { "Content-Type": "text/html" },
    }),
    response(null),
    response([]),
  ]) {
    const tool = createPublicTool(
      definitions[0],
      new AbortController().signal,
      async () => reply,
    );
    await assert.rejects(
      tool.execute({}),
      /Public resource unavailable|Unexpected public resource/,
    );
  }
});

test("page disposal and agent cancellation abort in-flight requests", async () => {
  for (const cancelPage of [true, false]) {
    const page = new AbortController();
    const agent = new AbortController();
    const tool = createPublicTool(
      activity,
      page.signal,
      async (_path, { signal }) => {
        return new Promise((_resolve, reject) => {
          const abort = () =>
            reject(new DOMException("Canceled", "AbortError"));
          if (signal.aborted) abort();
          else signal.addEventListener("abort", abort, { once: true });
        });
      },
    );
    const pending = tool.execute({}, { signal: agent.signal });
    (cancelPage ? page : agent).abort();
    await assert.rejects(pending, { name: "AbortError" });
  }
});
