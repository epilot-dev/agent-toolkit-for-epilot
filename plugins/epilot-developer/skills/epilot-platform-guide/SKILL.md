---
name: epilot-platform-guide
description: Explain epilot's platform model and route a product idea or requirement to native configuration, an epilot App, or an integration. Use for general epilot orientation, entities and schemas, relations, journeys, products, pricing, workflows, automations, portals, messaging, Apps, integrations, blueprints, and permissions, especially when the implementation boundary is unclear. Do not use as an exhaustive API or feature reference.
---

# Understand and extend the epilot platform

Give the agent enough stable context to make a good first architectural
decision without copying the epilot documentation into the prompt. Use current
documentation and live tools for changing details.

## Route the work

- Read [references/platform-model.md](references/platform-model.md) for the
  core mental model and major capability families.
- Read [references/solution-boundaries.md](references/solution-boundaries.md)
  when deciding between configuration, an App, and an integration.
- Use `build-epilot-app` after the boundary is clearly an App.
- Use `integrate-with-epilot` when an external service, script, backend, or
  data pipeline must exchange data or commands with epilot.
- Use `epilot-interface-designer` for a native-feeling custom interface.

If the user already explicitly asks to build a known App surface or a generic
integration, route directly to the focused skill.

## Knowledge strategy

Keep four sources separate:

| Source | Use it for |
|---|---|
| This skill | Stable mental model, vocabulary, and routing decisions |
| epilot docs via MCP | Current capabilities, how-to guidance, limits, and supported combinations |
| epilot OpenAPI via MCP | Exact operation IDs, parameters, payloads, and responses |
| Connected-organization MCP data | Actual schemas, entities, installed Apps, mappings, configuration, and state |

Never infer that a documented feature is configured in the connected
organization. Never generalize one organization's current configuration into
a platform rule.

## Working method

1. Restate the user outcome in platform terms: user, surface, business object,
   trigger, data movement, and ownership.
2. Use the capability map to identify likely native building blocks.
3. Search current docs for details that affect the decision.
4. Inspect live organization state only when the question depends on what is
   actually installed or configured.
5. Choose the narrowest extension boundary and hand off to the focused skill.

Do not enumerate every feature or API from memory. A short correct map plus a
current lookup is more useful than a large stale manual.
