---
name: epilot-interface-designer
description: Design, implement, or review the user interface of an epilot App so it feels native, accessible, responsive, and task-oriented. Use for Volt UI component selection, design tokens, forms, data tables, loading and error states, App surface layout, or visual QA. Do not use for backend-only integrations with no interface.
---

# Design an epilot App interface

Deliver an interface appropriate to its epilot surface and user task. Reuse
current Volt UI primitives and tokens rather than recreating the design system.

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

## Use the live design-system tool

The plugin bundles the official Volt UI MCP server. Use:

- `search_components` then `get_component` for current components and props;
- `search_tokens` then `get_token` for current semantic design tokens;
- list operations only when search terms are not yet known.

Inspect the target project's `package.json` before choosing imports. Existing
App templates may use `@epilot/volt-ui`, while current design-system sources
use `@epilot/volt-ui-react`; follow the package actually installed and do not
mix their APIs from memory.

## Route the review

- Read [references/interface-principles.md](references/interface-principles.md)
  before designing or materially restructuring a surface.
- Read [references/visual-qa.md](references/visual-qa.md) before declaring UI
  work complete.

## Working method

1. Identify the surface, primary user, primary action, density, and available
   space before choosing a layout.
2. Search Volt UI for existing primitives and semantic tokens.
3. Implement the complete state model: loading, empty, populated, partial,
   validation, permission, recoverable failure, and unavailable integration.
4. Keep dangerous or irreversible actions visually distinct and explain their
   effect at action time.
5. Test keyboard operation, focus, accessible names, contrast, responsive
   behavior, long German labels, and realistic data volume.
6. Render inside the actual epilot host surface when App Bridge or container
   sizing affects the result.

Do not hardcode credentials, tenant details, or sample PII into the interface.
