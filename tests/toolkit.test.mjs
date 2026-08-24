import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { inspectEpilotApp } from "../plugins/epilot-core/skills/build-epilot-app/scripts/inspect-epilot-app.mjs";

const makeRoot = () => fs.mkdtempSync(path.join(os.tmpdir(), "epilot-app-inspector-"));

test("accepts a coherent built App project", () => {
  const root = makeRoot();
  fs.mkdirSync(path.join(root, "components", "status", "dist"), { recursive: true });
  fs.mkdirSync(path.join(root, "functions", "sync", "dist"), { recursive: true });
  fs.writeFileSync(path.join(root, "package.json"), "{}\n");
  fs.writeFileSync(path.join(root, "functions", "sync", "dist", "handler.js"), "export async function handler() {}\n");
  fs.writeFileSync(path.join(root, "manifest.json"), JSON.stringify({
    manifest_version: 1,
    name: "Status App",
    description: { de: "Status anzeigen", en: "Show status" },
    components: [{ id: "one", component_type: "CUSTOM_CAPABILITY", name: { de: "Status" }, _dir: "status" }],
    functions: [{ name: "sync", type: "scheduled", schedule: "rate(30 minutes)", handler: "./functions/sync/dist/handler.js" }],
    permissions: [],
  }));
  const report = inspectEpilotApp(root);
  assert.deepEqual(report.errors, []);
  assert.equal(report.summary.componentCount, 1);
  assert.equal(report.summary.functionCount, 1);
  assert.ok(!report.warnings.some((message) => message.includes("SKILL.md")));
});

test("reports unsafe or incomplete manifest inputs", () => {
  const root = makeRoot();
  fs.writeFileSync(path.join(root, "manifest.json"), JSON.stringify({
    manifest_version: 2,
    name: "",
    description: { en: "Only English" },
    components: [
      { id: "duplicate", component_type: "CUSTOM_PAGE", name: {}, _dir: "missing" },
      { id: "duplicate", name: { de: "Broken" } },
    ],
    functions: [{ name: "job", type: "scheduled", handler: "./dist/missing.js" }],
    permissions: [{ action: "*", resource: "*" }],
  }));
  const report = inspectEpilotApp(root);
  assert.ok(report.errors.some((message) => message.includes("manifest_version")));
  assert.ok(report.errors.some((message) => message.includes("duplicate component id")));
  assert.ok(report.errors.some((message) => message.includes("built handler")));
  assert.ok(report.warnings.some((message) => message.includes("wildcard permission")));
});
