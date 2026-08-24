#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const plugin = path.join(root, "plugins", "epilot-developer");
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
  "plugins/epilot-developer/plugin.json",
  "plugins/epilot-developer/mcp.json",
  "plugins/epilot-developer/.codex-plugin/plugin.json",
  "plugins/epilot-developer/.claude-plugin/plugin.json",
  "plugins/epilot-developer/.mcp.json",
  "plugins/epilot-developer/skills/epilot-platform-guide/SKILL.md",
  "plugins/epilot-developer/skills/build-epilot-app/SKILL.md",
  "plugins/epilot-developer/skills/integrate-with-epilot/SKILL.md",
  "plugins/epilot-developer/skills/epilot-interface-designer/SKILL.md",
]) requireFile(relative);

const marketplace = readJson(".agents/plugins/marketplace.json");
if (marketplace.name !== "epilot-agent-toolkit") failures.push("Unexpected marketplace name");
if (marketplace.plugins?.length !== 1 || marketplace.plugins[0]?.name !== "epilot-developer") {
  failures.push("Marketplace must expose only epilot-developer");
}

const claudeMarketplace = readJson(".claude-plugin/marketplace.json");
if (claudeMarketplace.name !== "epilot-agent-toolkit") failures.push("Unexpected Claude marketplace name");
if (claudeMarketplace.owner?.name !== "epilot") failures.push("Claude marketplace owner is missing");
if (claudeMarketplace.plugins?.length !== 1 || claudeMarketplace.plugins[0]?.name !== "epilot-developer") {
  failures.push("Claude marketplace must expose only epilot-developer");
}
if (claudeMarketplace.plugins?.[0]?.source !== "./plugins/epilot-developer") {
  failures.push("Claude marketplace source is incorrect");
}

const portable = readJson("plugins/epilot-developer/plugin.json");
const codex = readJson("plugins/epilot-developer/.codex-plugin/plugin.json");
const claude = readJson("plugins/epilot-developer/.claude-plugin/plugin.json");
if (portable.name !== "epilot-developer" || codex.name !== "epilot-developer") failures.push("Plugin names do not match");
if (claude.name !== "epilot-developer") failures.push("Claude plugin name does not match");
if (portable.version !== codex.version) failures.push("Portable and Codex versions differ");
if (portable.version !== claude.version) failures.push("Portable and Claude versions differ");
if (codex.interface?.defaultPrompt?.length > 3) failures.push("Codex default prompts must not exceed three entries");

for (const [label, manifest] of [["portable", portable], ["Codex", codex], ["Claude", claude]]) {
  if (manifest.repository !== "https://github.com/epilot-dev/epilot-agent-toolkit") {
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

for (const relative of ["plugins/epilot-developer/mcp.json", "plugins/epilot-developer/.mcp.json"]) {
  const config = readJson(relative);
  if (config.mcpServers?.epilot?.url !== "https://mcp.epilot.io/mcp") failures.push(`${relative}: epilot MCP missing`);
  if (!config.mcpServers?.["volt-ui"]) failures.push(`${relative}: Volt UI MCP missing`);
}

const sourceText = fs.readFileSync(path.join(plugin, "README.md"), "utf8") +
  fs.readdirSync(path.join(plugin, "skills"), { recursive: true })
    .filter((entry) => typeof entry === "string" && entry.endsWith(".md"))
    .map((entry) => fs.readFileSync(path.join(plugin, "skills", entry), "utf8"))
    .join("\n");
for (const forbidden of ["epilot-lima", "NKZ-V2", "search-lima-docs", "/Users/", "BEGIN PRIVATE KEY"]) {
  if (sourceText.includes(forbidden)) failures.push(`Non-public artifact remains: ${forbidden}`);
}

if (failures.length) {
  for (const failure of failures) console.error(`ERROR ${failure}`);
  process.exit(1);
}
console.log("Toolkit structure is valid.");
