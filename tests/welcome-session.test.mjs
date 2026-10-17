import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const source = await readFile(
  new URL("../src/lib/welcome-session.ts", import.meta.url),
  "utf8",
);
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ES2022,
  },
});
const { WELCOME_BOOTSTRAP, WELCOME_STORAGE_KEY } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled.outputText).toString("base64")}`
);
function visit(
  storage,
  pathname = "/",
  reduced = false,
  navigationType = "navigate",
) {
  const document = { documentElement: { dataset: {} } };
  runInNewContext(WELCOME_BOOTSTRAP, {
    document,
    location: { pathname },
    window: { matchMedia: () => ({ matches: reduced }) },
    performance: { getEntriesByType: () => [{ type: navigationType }] },
    sessionStorage: storage,
  });
  return document.documentElement.dataset.portfolioWelcome;
}
const tab = () => {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
};

test("first Home visit plays once; return visits skip before paint", () => {
  const storage = tab();
  assert.equal(visit(storage), "play");
  assert.equal(storage.getItem(WELCOME_STORAGE_KEY), "1");
  assert.equal(visit(storage), "skip");
  assert.equal(visit(storage, "/projects"), "skip");
  assert.equal(visit(storage), "skip");
});
test("an explicit Home reload replays; internal navigation and Back still skip", () => {
  const storage = tab();
  assert.equal(visit(storage), "play");
  assert.equal(visit(storage), "skip");
  assert.equal(visit(storage, "/", false, "reload"), "play");
  assert.equal(visit(storage), "skip");
  assert.equal(visit(storage, "/", false, "back_forward"), "skip");
  assert.equal(visit(storage, "/projects", false, "reload"), "skip");
  assert.equal(visit(storage, "/", true, "reload"), "skip");
});
test("a fresh tab gets its own welcome without resetting another tab", () => {
  const first = tab();
  const second = tab();
  assert.equal(visit(first), "play");
  assert.equal(visit(second), "play");
  assert.equal(visit(first), "skip");
});
test("entry on Projects skips a later Home welcome in that same tab", () => {
  const storage = tab();
  assert.equal(visit(storage, "/projects"), "skip");
  assert.equal(visit(storage), "skip");
});
test("reduced motion and unavailable storage show the page immediately", () => {
  assert.equal(visit(tab(), "/", true), "skip");
  assert.equal(
    visit({
      getItem() {
        throw new Error("Storage blocked");
      },
    }),
    "skip",
  );
  assert.equal(
    visit({
      getItem() {
        return null;
      },
      setItem() {
        throw new Error("Storage blocked");
      },
    }),
    "skip",
  );
});
