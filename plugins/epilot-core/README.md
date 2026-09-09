# epilot

Configure business processes, build journeys and Apps, and connect external
systems to epilot. The visible name is **epilot**; the package ID remains
`epilot-core`.

## Skills

- `epilot-platform-guide` explains epilot's stable mental model and decides
  whether a solution belongs in platform configuration, an App, or an
  integration.
- `build-epilot-app` chooses the correct App surface, scaffolds with the
  epilot CLI, and guides local development, validation, and delivery.
- `integrate-with-epilot` connects external services directly through epilot
  APIs, webhooks, events, mappings, and synchronization patterns without
  requiring an App or assuming a particular ERP.
- `configure-epilot` sets up the platform end to end: entity schemas,
  journeys, products and pricing, workflows, automations, portals, and
  permissions, using the connected organization's actual state.
- `build-epilot-journey` creates and updates customer-facing forms and funnels.
- `epilot-interface-designer` uses Volt UI components and tokens to make App
  interfaces feel native, accessible, and task-oriented.

## Tools

- `epilot` MCP: current docs, OpenAPI operations, schemas, and live
  organization configuration.
- `volt-ui` MCP: current component APIs and design tokens.
- `inspect-epilot-app.mjs`: local manifest/build-input preflight.

Reusable agent guidance lives in this plugin. Projects created by
`epilot app init` should contain only their implementation and project-specific
instructions; they do not need a generated `SKILL.md`.

Live writes, deployments, installations, and marketplace submissions remain
separate actions and require explicit user intent and a confirmed environment.
