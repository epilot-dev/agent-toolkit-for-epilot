---
name: build-epilot-app
description: Build, extend, review, or troubleshoot an epilot App using its manifest, components, functions, App Bridge, API Proxy, the epilot MCP App API, the epilot CLI, and Volt UI for native-feeling interfaces. Use when the user explicitly asks for an App, custom page, entity capability or widget, journey or portal block, flow action, scheduled function, App deployment, an App that does not appear, or the design, Volt UI component selection, accessibility, or visual QA of an App interface. If it is unclear whether the solution should be an App, integration, or native configuration, use epilot-platform-guide first.
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
  validation, deployment through the epilot MCP or the CLI, installation,
  wiring the component into its surface, and troubleshooting.
- Read [references/interface-principles.md](references/interface-principles.md)
  before designing or materially restructuring any component that renders UI
  (capability, page, journey block, portal block, configuration UI).
- Read [references/visual-qa.md](references/visual-qa.md) before declaring UI
  work complete.

Load only the references needed for the current phase.

## Source precedence

Use the narrowest current source that can answer the question:

1. The current project's `manifest.json`, package metadata, component
   configuration, and code describe that App.
2. The manifest `$schema` and current CLI validator define valid manifest
   structure.
3. Current epilot documentation explains supported concepts and workflows.
4. The App API contract (`search_api_operations` → `describe_api_operation`,
   service `app`) and current CLI help define deployment operations, payloads,
   commands, and scaffolding.
5. This skill and its references provide stable workflow and decision guidance.

Use epilot MCP `search_docs` and `fetch_doc` for current concepts. For an exact
platform API, use `search_api_operations` then `describe_api_operation`; do not
guess operation IDs, payloads, component types, limits, or permissions. Where
`describe_api_operation` does not expand a nested schema (component
configuration, `component_args`), copy the shape from an installed App
(`listInstallations`) instead of inventing it.

## Working method

1. Inspect the existing directory before scaffolding. If it is already an App,
   treat its manifest and implementation as the source of truth. Read
   `AGENTS.md` or similar project instructions when present, but do not require
   an App-specific skill.
2. Establish the user outcome: where it appears, who uses it, which entity or
   process context it receives, and which external or epilot data it needs.
3. Scaffold new projects and components with the current epilot CLI templates
   (`app init`, `app add-component`, `app add-function`) — these are local and
   need no login. Preserve CLI-owned identifiers; the component `id` in the
   manifest is the id the platform will know the component by.
4. Build the smallest useful vertical slice. For components that render UI,
   follow "Build the interface" below so the result feels native to its
   epilot surface.
5. Run the bundled local inspector, the project build, and
   `npx @epilot/cli app validate`. Confirm the target organization with MCP
   `whoami` (and `npx @epilot/cli auth status` if the CLI will deploy).
6. Deploy through the epilot MCP App API as described in delivery.md —
   create or update the configuration, upload the bundle to the presigned URL,
   register the component, then **install** the version in the organization.
   The CLI's `app deploy` performs the same synchronization when the user
   prefers it and has a CLI login for that organization; neither path installs
   the App by itself.
7. Wire the component into its surface (journey step, portal, entity schema,
   flow) and verify it inside the real epilot surface; a bare localhost render
   cannot prove the host contract. Run the visual-qa checklist for material
   UI work.

## Build the interface

Every component that renders UI must feel native to its epilot surface,
accessible, responsive, and task-oriented. Reuse current Volt UI primitives and
tokens rather than recreating the design system.

Use the hosted Volt UI MCP (`https://volt-ui.epilot.io/api/mcp`, connected by
this plugin):

- `search_components` then `get_component` for current components and props;
- `search_tokens` then `get_token` for current semantic design tokens;
- list operations only when search terms are not yet known.

Inspect the target project's `package.json` before choosing imports. Existing
App templates may use `@epilot/volt-ui`, while current design-system sources
use `@epilot/volt-ui-react`; follow the package actually installed and do not
mix their APIs from memory.

Method:

1. Identify the surface, primary user, primary action, density, and available
   space before choosing a layout (see interface-principles.md).
2. Search Volt UI for existing primitives and semantic tokens.
3. Implement the complete state model: loading, empty, populated, partial,
   validation, permission, recoverable failure, and unavailable integration.
4. Keep dangerous or irreversible actions visually distinct and explain their
   effect at action time.
5. Test keyboard operation, focus, accessible names, contrast, responsive
   behavior, long German labels, and realistic data volume (see visual-qa.md).
6. Render inside the actual epilot host surface when App Bridge or container
   sizing affects the result.

Do not hardcode credentials, tenant details, or sample PII into the interface.

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
- Deployment is synchronization: components or functions missing from the
  manifest may be removed from the version. With the CLI use `--dry-run`
  before the live command, and never run `app deploy --help` inside an App
  directory — current CLI versions execute the deploy instead of printing help.
- The epilot MCP and the CLI authenticate separately and tokens cannot be
  exchanged between them; both must point at the organization the user means.
- Never place access tokens or external credentials in source, the manifest,
  browser code, examples, logs, or screenshots.
- Request only permissions required by server-side behavior. Do not broaden a
  manifest's grants merely to work around an unexplained failure.
