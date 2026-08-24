---
name: configure-epilot
description: Configure the epilot platform end to end in a connected organization: entity schemas and attributes, taxonomies, journeys, entity mappings, products and pricing, automations, workflows, customer and installer portals, roles and permissions, and blueprints. Use when the user wants to set up, change, audit, or package platform configuration — including plain-language business outcomes such as "customers should be able to order X online" or "new requests should create a task for sales" — rather than build custom code. If it is unclear whether the solution should be configuration, an App, or an integration, use epilot-platform-guide first.
---

# Configure epilot end to end

Produce working, verified platform configuration in the connected
organization. Configuration is layered; build the smallest set of layers that
delivers the outcome and verify each layer before adding the next.

## Route the work

- Read [references/configuration-stack.md](references/configuration-stack.md)
  for the layer model, which tool writes each layer, and how to discover
  existing configuration and dependencies.
- Read [references/entity-model.md](references/entity-model.md) before
  creating or changing schemas, attributes, relations, taxonomies, or search
  filters.
- Read [references/process-patterns.md](references/process-patterns.md) when
  wiring a multi-step business process across journeys, mappings, automations,
  workflows, and portals.
- Use `build-epilot-app` if the outcome needs custom code or UI beyond
  supported configuration. Use `integrate-with-epilot` if an external system
  must exchange data with epilot.

## Execution tools

Configuration is executed through the public epilot CLI or the epilot APIs:

- `npx epilot <api> <operationId>` calls any epilot API operation. Use
  `--json --no-interactive` for scripted or agent-driven calls and `-d` or
  stdin for request bodies. Authenticate with `epilot auth login`, a
  `--token` flag, or the `EPILOT_TOKEN` environment variable.
- Use epilot MCP `search_docs` and `fetch_doc` for current concepts, and
  `search_api_operations` then `describe_api_operation` for exact contracts.
  Do not guess operation IDs, payload shapes, or attribute types.
- Use the connected organization's actual state — schemas, configs,
  dependencies — as the baseline. Documentation describes what is possible,
  not what this organization has.

## Working method

1. Restate the outcome as a process: who acts, on which business object,
   what triggers each step, and what the user sees at the end.
2. Inspect existing configuration before creating anything. Extend an
   existing schema, journey, or workflow when it already serves the process;
   parallel near-duplicates are a maintenance failure.
3. Plan the layer sequence bottom-up: data model first, then capture, then
   process, then access. Name every resource clearly and consistently.
4. Apply one layer at a time and verify it — an API read-back plus, where
   possible, the real UI surface — before configuring the layer above it.
5. Check dependencies before changing shared resources: a schema attribute,
   automation, or template may be used by journeys, portals, or workflows
   you did not author.
6. When the result should be reusable across organizations or environments,
   package it as a blueprint instead of leaving manual setup steps.

## Authority and safety

- Every write hits a live organization. Before the first mutation, confirm
  the organization, environment, the resources to be created or changed, and
  the user's intent for that specific change.
- Read access does not authorize writes. Auditing and planning are safe by
  default; creating, updating, and deleting are not.
- Prefer additive changes. Deleting or renaming schema attributes, roles, or
  shared templates can silently break journeys, mappings, and automations;
  inspect usage first and state the blast radius.
- Configuration may reference secrets and personal data. Never print secret
  values, tokens, or customer records into output, examples, or commits.
- Do not enable beta or flag-gated features, or rely on them in delivered
  configuration, unless the user explicitly confirms their availability in
  the target organization.
