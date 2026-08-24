#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const plugin = path.join(root, "plugins", "epilot-core");
const failures = [];
const readJson = (relative) => JSON.parse(fs.readFileSync(path.join(root, relative), "utf8"));
const requireFile = (relative) => {
  if (!fs.existsSync(path.join(root, relative))) failures.push(`Missing ${relative}`);
};

for (const relative of [
  "LICENSE",
  "NOTICE",
  "README.md",
  "SECURITY.md",
  ".github/workflows/validate.yml",
  ".agents/plugins/marketplace.json",
  ".claude-plugin/marketplace.json",
  "plugins/epilot-core/plugin.json",
  "plugins/epilot-core/mcp.json",
  "plugins/epilot-core/.codex-plugin/plugin.json",
  "plugins/epilot-core/.claude-plugin/plugin.json",
  "plugins/epilot-core/.mcp.json",
  "plugins/epilot-core/skills/epilot-platform-guide/SKILL.md",
  "plugins/epilot-core/skills/build-epilot-app/SKILL.md",
  "plugins/epilot-core/skills/integrate-with-epilot/SKILL.md",
  "plugins/epilot-core/skills/configure-epilot/SKILL.md",
  "plugins/epilot-core/skills/epilot-interface-designer/SKILL.md",
]) requireFile(relative);

const marketplace = readJson(".agents/plugins/marketplace.json");
if (marketplace.name !== "agent-toolkit-for-epilot") failures.push("Unexpected marketplace name");
if (marketplace.plugins?.length !== 1 || marketplace.plugins[0]?.name !== "epilot-core") {
  failures.push("Marketplace must expose only epilot-core");
}

const claudeMarketplace = readJson(".claude-plugin/marketplace.json");
if (claudeMarketplace.name !== "agent-toolkit-for-epilot") failures.push("Unexpected Claude marketplace name");
if (claudeMarketplace.owner?.name !== "epilot") failures.push("Claude marketplace owner is missing");
if (claudeMarketplace.plugins?.length !== 1 || claudeMarketplace.plugins[0]?.name !== "epilot-core") {
  failures.push("Claude marketplace must expose only epilot-core");
}
if (claudeMarketplace.plugins?.[0]?.source !== "./plugins/epilot-core") {
  failures.push("Claude marketplace source is incorrect");
}

const portable = readJson("plugins/epilot-core/plugin.json");
const codex = readJson("plugins/epilot-core/.codex-plugin/plugin.json");
const claude = readJson("plugins/epilot-core/.claude-plugin/plugin.json");
if (portable.name !== "epilot-core" || codex.name !== "epilot-core") failures.push("Plugin names do not match");
if (claude.name !== "epilot-core") failures.push("Claude plugin name does not match");
if (portable.version !== codex.version) failures.push("Portable and Codex versions differ");
if (portable.version !== claude.version) failures.push("Portable and Claude versions differ");
if (codex.interface?.defaultPrompt?.length > 3) failures.push("Codex default prompts must not exceed three entries");

for (const [label, manifest] of [["portable", portable], ["Codex", codex], ["Claude", claude]]) {
  if (manifest.repository !== "https://github.com/epilot-dev/agent-toolkit-for-epilot") {
    failures.push(`${label} manifest repository is incorrect`);
  }
  if (manifest.license !== "Apache-2.0") failures.push(`${label} manifest license is incorrect`);
  if (manifest.homepage !== "https://docs.epilot.io/agent-toolkit") failures.push(`${label} manifest homepage is incorrect`);
}

const packageJson = readJson("package.json");
if (packageJson.license !== "Apache-2.0") failures.push("package.json license is incorrect");
if (packageJson.private !== true) failures.push("package.json must prevent accidental npm publication");

const licenseText = fs.readFileSync(path.join(root, "LICENSE"), "utf8");
if (!licenseText.includes("Apache License") || !licenseText.includes("Version 2.0")) {
  failures.push("LICENSE is not Apache-2.0 text");
}

for (const relative of ["plugins/epilot-core/mcp.json", "plugins/epilot-core/.mcp.json"]) {
  const config = readJson(relative);
  if (config.mcpServers?.epilot?.url !== "https://mcp.epilot.io/mcp") failures.push(`${relative}: epilot MCP missing`);
  if (!config.mcpServers?.["volt-ui"]) failures.push(`${relative}: Volt UI MCP missing`);
}

const sourceText = fs.readFileSync(path.join(root, "README.md"), "utf8") +
  fs.readFileSync(path.join(plugin, "README.md"), "utf8") +
  fs.readdirSync(path.join(plugin, "skills"), { recursive: true })
    .filter((entry) => typeof entry === "string" && entry.endsWith(".md"))
    .map((entry) => fs.readFileSync(path.join(plugin, "skills", entry), "utf8"))
    .join("\n");
// Markers of internal-only knowledge (repos, tools, infra, tenants) that must
// never ship in public toolkit guidance. Keep this list growing.
for (const forbidden of [
  "epilot-lima",
  "NKZ-V2",
  "search-lima-docs",
  "/Users/",
  "BEGIN PRIVATE KEY",
  "gitlab",
  "GitLab",
  "atlassian",
  "epilot360-",
  "svc-",
  "dev.sls.epilot",
  "launchdarkly",
  "LaunchDarkly",
  "20000776",
]) {
  if (sourceText.includes(forbidden)) failures.push(`Non-public artifact remains: ${forbidden}`);
}

if (failures.length) {
  for (const failure of failures) console.error(`ERROR ${failure}`);
  process.exit(1);
}
console.log("Toolkit structure is valid.");
