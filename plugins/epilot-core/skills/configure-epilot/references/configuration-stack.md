# The epilot configuration stack

Configuration is layered. Each layer has a writable public API, reachable via
`npx epilot <group> <operationId>` or the corresponding REST API.

| Layer | Configures | CLI group |
|---|---|---|
| Data model | Schemas, attributes, groups, capabilities, taxonomies | `entity` |
| Catalog | Products, prices, taxes, coupons — these are entities | `entity` |
| Capture | Journeys and their steps, blocks, logic, design | `journey` |
| Mapping | Journey submissions and events into entities | `entity-mapping` |
| Automation | Event-triggered flows of actions | `automation` |
| Process | Workflow and flow definitions, closing reasons | `workflow-definition` |
| Access surfaces | End-customer and installer portals, pages, widgets | `customer-portal` |
| Communication | Email templates and settings, notifications | `email-template`, `email-settings`, `notification` |
| Access control | Roles, grants, assignments | `permissions` |
| Secrets and variables | Environment variables and secrets | `environments` |
| Packaging | Blueprints: export, version, patch, install | `blueprint-manifest` |

Pricing runtime operations (`pricing`: catalog search, cart checkout, price
calculation) consume the catalog; the catalog itself is configured through
`entity` because products, prices, taxes, and coupons are entities.

## Discover before you create

- `configuration-hub` lists configuration across types and answers the two
  questions that must precede any change to a shared resource:
  `getConfigDependencies` (what this depends on) and `getConfigUsedBy`
  (what breaks if this changes).
- `entity listSchemas` / `getSchema` show the current data model;
  `getSchemaVersions` shows its history.
- Search current docs through the epilot MCP for layer capabilities and
  limits; verify exact operations with `describe_api_operation`.

## Packaging and promotion

Blueprints capture a coherent set of configuration — schemas, journeys,
mappings, automations, workflows, templates, variables — as an installable,
versioned unit. Use them to move configuration between environments or
organizations and to publish reusable solutions. Validate (`validateBlueprint`)
and preview (`getBlueprintPreview`, `preInstallBlueprint`) before installing
into a target organization. A blueprint install is a bulk write: apply the
same confirmation discipline as any other mutation, and state what the
blueprint does not set up (manual prerequisites) rather than implying a
complete turnkey result.
