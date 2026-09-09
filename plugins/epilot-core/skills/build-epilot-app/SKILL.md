---
name: build-epilot-app
description: Build, extend, review, or troubleshoot an epilot App using its manifest, components, functions, App Bridge, API Proxy, and epilot CLI. Use when the user explicitly asks for an App, custom page, entity capability or widget, journey or portal block, flow action, scheduled function, App deployment, or an App that does not appear. If it is unclear whether the solution should be an App, integration, or native configuration, use epilot-platform-guide first.
---

# Build an epilot App

Produce a maintainable App that appears in the requested epilot surface and is
verified in proportion to the requested stage. This skill is the canonical
home for reusable App-building guidance; do not expect or copy a `SKILL.md`
into generated App repositories.

## Language and customer-facing content

- Respond in the user's language unless they request another language.
- Preserve API identifiers, schema keys, commands, enum values, and product
  names exactly; translate explanatory text and display labels instead.
- Write customer-facing content in the requested audience's language. When
  editing an existing journey, portal, or App, preserve its locale and the
  organization's du/Sie usage unless the user requests a change. Conversation
  language alone is not a request to translate an existing resource.
- Use the target epilot resource's supported translation fields. Keep existing
  translations and required locales; do not invent locale keys or overwrite
  another language while adding a translation.

## Route the work

- Read [references/app-surfaces.md](references/app-surfaces.md) when choosing a
  component or function type.
- Read [references/app-runtime.md](references/app-runtime.md) for App Bridge,
  permissions, API Proxy, functions, or installation options.
- Read [references/delivery.md](references/delivery.md) for local development,
  validation, deployment, installation, or troubleshooting.
- Use `epilot-interface-designer` when visual design or UX is material.

Load only the references needed for the current phase.

## Source precedence

Use the narrowest current source that can answer the question:

1. The current project's `manifest.json`, package metadata, component
   configuration, and code describe that App.
2. The manifest `$schema` and current CLI validator define valid manifest
   structure.
3. Current epilot documentation explains supported concepts and workflows.
4. Current CLI help and behavior define commands, flags, and scaffolding.
5. This skill and its references provide stable workflow and decision guidance.

Use epilot MCP `search_docs` and `fetch_doc` for current concepts. For an exact
platform API, use `search_api_operations` then `describe_api_operation`; do not
guess operation IDs, payloads, component types, limits, or permissions.

## Working method

1. Inspect the existing directory before scaffolding. If it is already an App,
   treat its manifest and implementation as the source of truth. Read
   `AGENTS.md` or similar project instructions when present, but do not require
   an App-specific skill.
2. Establish the user outcome: where it appears, who uses it, which entity or
   process context it receives, and which external or epilot data it needs.
3. Scaffold new projects and components with the current epilot CLI rather
   than recreating its templates. Preserve CLI-owned identifiers.
4. Build the smallest useful vertical slice, including loading, empty, error,
   permission, and retry states where applicable.
5. Run the bundled local inspector, the project tests/build, and
   `npx @epilot/cli app validate` before any deployment proposal.
6. Verify UI work inside the real epilot surface when access is available; a
   bare localhost render cannot prove App Bridge behavior.

## Guidance ownership

- Keep reusable epilot concepts and workflows in this plugin.
- Keep exact, changing platform facts in docs, schemas, OpenAPI, and CLI code.
- Keep App-specific architecture, commands, exceptions, and conventions in a
  small project `AGENTS.md` only when they are genuinely local to that App.
- Never generate or maintain a second copy of this skill inside an App repo.

## Authority and safety

- Local code changes and local validation do not authorize deployment.
- Before a deploy, install, configuration change, or review submission,
  confirm the target environment and the user's intent for that action.
- Treat `app deploy` as synchronization: undeclared remote components or
  functions may be removed. Use `--dry-run` before the live command.
- Never place access tokens or external credentials in source, the manifest,
  browser code, examples, logs, or screenshots.
- Request only permissions required by server-side behavior. Do not broaden a
  manifest's grants merely to work around an unexplained failure.
