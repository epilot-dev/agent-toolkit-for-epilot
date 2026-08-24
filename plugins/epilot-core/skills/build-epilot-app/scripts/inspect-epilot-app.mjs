#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const exists = (target) => fs.existsSync(target);
const translatedGerman = (value) =>
  Boolean(value && typeof value === "object" && typeof value.de === "string" && value.de.trim());

export function inspectEpilotApp(rootDirectory) {
  const root = path.resolve(rootDirectory);
  const errors = [];
  const warnings = [];
  const manifestPath = path.join(root, "manifest.json");

  if (!exists(manifestPath)) {
    return { root, manifestPath, errors: ["manifest.json is missing"], warnings, summary: {} };
  }

  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch (error) {
    return {
      root,
      manifestPath,
      errors: [`manifest.json is not valid JSON: ${error.message}`],
      warnings,
      summary: {},
    };
  }

  if (manifest.manifest_version !== 1) errors.push("manifest_version must be 1");
  if (typeof manifest.name !== "string" || !manifest.name.trim()) errors.push("App name is missing");
  if (!translatedGerman(manifest.description)) errors.push("App description.de is missing");
  if (!Array.isArray(manifest.components)) errors.push("components must be an array");

  const components = Array.isArray(manifest.components) ? manifest.components : [];
  const functions = Array.isArray(manifest.functions) ? manifest.functions : [];
  const identities = new Set();

  for (const [index, component] of components.entries()) {
    const label = component._dir || component.name?.en || component.name?.de || `components[${index}]`;
    if (!component.component_type) errors.push(`${label}: component_type is missing`);
    if (!translatedGerman(component.name)) warnings.push(`${label}: name.de is missing`);
    if (component.id) {
      if (identities.has(component.id)) errors.push(`${label}: duplicate component id ${component.id}`);
      identities.add(component.id);
    }
    if (component._dir) {
      const componentDirectory = path.join(root, "components", component._dir);
      if (!exists(componentDirectory)) errors.push(`${label}: components/${component._dir} is missing`);
    }
  }

  const functionNames = new Set();
  for (const [index, fn] of functions.entries()) {
    const label = fn.name || `functions[${index}]`;
    if (!fn.name) errors.push(`${label}: name is missing`);
    if (functionNames.has(fn.name)) errors.push(`${label}: duplicate function name`);
    functionNames.add(fn.name);
    if (!["workflow", "scheduled"].includes(fn.type)) errors.push(`${label}: unsupported function type ${fn.type ?? "(missing)"}`);
    if (fn.type === "scheduled" && !fn.schedule) errors.push(`${label}: scheduled function has no schedule`);
    if (!fn.handler) {
      errors.push(`${label}: handler is missing`);
    } else if (!exists(path.join(root, fn.handler))) {
      errors.push(`${label}: built handler ${fn.handler} is missing`);
    }
  }

  const logo = manifest.assets?.logo;
  if (logo && !exists(path.join(root, logo))) errors.push(`App logo ${logo} is missing`);

  const permissions = Array.isArray(manifest.permissions) ? manifest.permissions : [];
  for (const permission of permissions) {
    if (permission?.action === "*" || permission?.resource === "*") {
      warnings.push("Manifest contains a wildcard permission; verify least privilege");
      break;
    }
  }

  if (!exists(path.join(root, "package.json"))) warnings.push("package.json is missing at the App root");

  return {
    root,
    manifestPath,
    errors,
    warnings,
    summary: {
      appName: manifest.name ?? null,
      appId: manifest.app_id ?? null,
      componentCount: components.length,
      functionCount: functions.length,
      permissionCount: permissions.length,
    },
  };
}

function printReport(report, json) {
  if (json) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }
  console.log(`epilot App: ${report.summary.appName ?? "unknown"}`);
  console.log(`Root: ${report.root}`);
  console.log(`Components: ${report.summary.componentCount ?? 0}`);
  console.log(`Functions: ${report.summary.functionCount ?? 0}`);
  console.log(`Permissions: ${report.summary.permissionCount ?? 0}`);
  for (const warning of report.warnings) console.log(`WARN  ${warning}`);
  for (const error of report.errors) console.log(`ERROR ${error}`);
  console.log(report.errors.length ? "Result: failed" : "Result: passed");
}

const invokedDirectly = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  const args = process.argv.slice(2);
  const json = args.includes("--json");
  const root = args.find((arg) => arg !== "--json") || process.cwd();
  const report = inspectEpilotApp(root);
  printReport(report, json);
  process.exitCode = report.errors.length ? 1 : 0;
}
