#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isDeepStrictEqual } from "node:util";

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
  "plugins/epilot-core/skills/build-epilot-journey/SKILL.md",
  "plugins/epilot-core/skills/build-epilot-workflow/SKILL.md",
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

// Root OpenAI metadata is canonical for portable hosts. The fallback keeps the
// same presentation except supportURL, which older compatibility validators
// do not accept. See OpenAI's plugin packaging and submission error references.
const listing = portable.extensions?.["com.openai"]?.interface;
if (!listing || typeof listing !== "object" || Array.isArray(listing)) {
  failures.push("Portable OpenAI listing metadata is missing");
} else {
  const { supportURL, ...fallbackListing } = listing;
  if (!isDeepStrictEqual(fallbackListing, codex.interface)) {
    failures.push("Portable and Codex listing metadata differ");
  }
  if (listing.displayName !== claude.displayName) failures.push("Client display names differ");
  if (marketplace.plugins?.[0]?.category !== listing.category) failures.push("Marketplace category differs from listing");
  // These are the final public-directory limits, stricter than local ingestion.
  for (const [field, limit] of Object.entries({
    displayName: 30, shortDescription: 30, longDescription: 4000, developerName: 80,
  })) {
    const value = listing[field];
    if (typeof value !== "string" || !value.trim() || [...value].length > limit) {
      failures.push(`Listing ${field} must contain 1-${limit} characters`);
    }
  }
  for (const field of ["websiteURL", "privacyPolicyURL", "termsOfServiceURL", "supportURL"]) {
    try {
      const value = listing[field];
      if (typeof value !== "string" || value.length > 1024) throw new Error();
      const url = new URL(value);
      if (url.protocol !== "https:" || url.username || url.password) throw new Error();
    } catch {
      failures.push(`Listing ${field} must be an HTTPS URL of at most 1024 characters`);
    }
  }
  if (!Array.isArray(listing.defaultPrompt) || listing.defaultPrompt.length > 3 ||
      listing.defaultPrompt.some((prompt) => typeof prompt !== "string" || !prompt.trim() ||
        [...prompt].length > 128 || /[\r\n]/.test(prompt))) {
    failures.push("Listing must have at most three single-line starter prompts of 1-128 characters");
  }
}

for (const entry of fs.readdirSync(path.join(plugin, "skills"), { withFileTypes: true })) {
  if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
  requireFile(`plugins/epilot-core/skills/${entry.name}/agents/openai.yaml`);
}

// Codex requires visual assets to be plugin-relative "./" paths that resolve to real files.
for (const field of ["composerIcon", "logo", "logoDark"]) {
  const value = codex.interface?.[field];
  if (value === undefined) continue;
  if (typeof value !== "string" || !value.startsWith("./")) {
    failures.push(`Codex interface.${field} must be a relative path starting with ./`);
  } else if (!fs.existsSync(path.join(plugin, value))) {
    failures.push(`Codex interface.${field} points to a missing file: ${value}`);
  }
}
for (const shot of codex.interface?.screenshots ?? []) {
  if (typeof shot !== "string" || !shot.startsWith("./assets/") || !shot.endsWith(".png")) {
    failures.push(`Codex screenshot must be a PNG under ./assets/: ${shot}`);
  } else if (!fs.existsSync(path.join(plugin, shot))) {
    failures.push(`Codex screenshot points to a missing file: ${shot}`);
  }
}
if (codex.interface?.brandColor !== undefined && !/^#[0-9A-Fa-f]{6}$/.test(codex.interface.brandColor)) {
  failures.push("Codex interface.brandColor must be a 6-digit hex color");
}

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
const portableMcp = readJson("plugins/epilot-core/mcp.json");
const compatibilityMcp = readJson("plugins/epilot-core/.mcp.json");
if (portableMcp.$schema !== "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json") {
  failures.push("Portable MCP schema is missing");
}
const normalizedServers = Object.fromEntries(Object.entries(portableMcp.mcpServers).map(([name, server]) => {
  const { type, ...config } = server;
  if (type === "streamable-http") config.type = "http";
  else if (type !== "stdio") failures.push(`Unsupported portable MCP transport for ${name}`);
  return [name, config];
}));
if (!isDeepStrictEqual(normalizedServers, compatibilityMcp.mcpServers)) {
  failures.push("Portable and compatibility MCP connections differ");
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
