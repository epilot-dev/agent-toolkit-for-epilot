---
name: build-epilot-journey
description: Create and modify epilot journeys — the customer-facing multi-step forms and funnels built in the Journey Builder — through the epilot MCP or CLI. Use when the user wants a new journey, changes to an existing journey's steps, blocks, logic, or design, or a review of journey quality. Covers the step/block model (schema + uischema), wiring, journey settings, and design conventions. For non-journey configuration use configure-epilot; for custom journey blocks use build-epilot-app.
---

# Build epilot journeys

Produce working, well-designed journeys in the connected organization. A
journey is a versioned configuration document: ordered steps, each carrying a
JSON Schema (one property per block) and a uischema (layout plus typed block
elements). Getting the structure right is necessary; getting the flow and
copy right is what makes the journey good. Both are this skill's job.

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

## Read first

- [references/journey-anatomy.md](references/journey-anatomy.md) — the
  definition format: steps, blocks, wiring, settings, logics. Read before
  writing any journey JSON.
- [references/journey-design.md](references/journey-design.md) — flow and
  content conventions that separate a usable journey from a technically valid
  one. Read before deciding steps and copy, and use its checklist before
  handing over.
- [references/journey-blocks.md](references/journey-blocks.md) — the verified
  block catalog and the copy-from-existing rule for everything beyond it.
- [references/journey-mappings.md](references/journey-mappings.md) — how
  submissions become entities: mapping targets, the executing automation,
  safe mode, and the simulate-first authoring loop. A journey without a
  correct mapping is not done.

## Workflow

1. **Understand the outcome.** What should the customer achieve, what data
   must reach the organization, and which entity should a submission create
   or update? Name the audience and language up front — journey copy is
   customer-facing.
2. **Discover before designing.** Existing journeys are the best source of
   proven block shapes and organizational conventions:
   - `search_configuration` with `type: journey` lists what exists;
   - `get_journey` on a comparable journey yields real steps,
     blocks, and settings to adapt;
   - `get_config_dependencies` / `get_config_impact` show what a journey is
     wired to before you change it.
3. **Design the flow** with the conventions in journey-design.md: fewest
   steps that respect topic boundaries, one clear call to action per step, a
   confirmation step at the end.
4. **Create inactive, then iterate.** `create_journey` starts journeys with
   `isActive: false` by default. Review, refine with `update_journey`, and
   only then set `settings.isActive: true`. Update replaces whole sections
   (steps, logics, rules, settings fields); read with
   `get_journey`, modify, write back.
5. **Map the submission.** Check `get_journey_mapping`: every block whose
   data the organization needs must map onto an entity attribute, and the
   executing automation must exist (create_journey sets both up; block
   changes require mapping updates). Verify attribute names against
   `get_entity_schema`, and that `settings.runtimeEntities` covers every
   mapping source (`ORDER` for product selections). A test submission is the
   definitive check — read it back with the sequence in
   journey-mappings.md, "Verifying the automation" (submission arrived,
   automation `runs`, per-action execution status, produced entities), rather
   than trusting the builder's green state.
6. **Verify.** Re-read the definition, walk the wiring (every button's
   `targetStepId` resolves, every block scope has a schema property —
   `create_journey` and `update_journey` check exactly this before any API
   call and reject with the problem list, so there is no separate validation
   tool), and run the
   design checklist. For a live check, open the journey in the epilot 360
   Journey Builder — configuration created via API appears there immediately.

## Execution tools

- **epilot MCP (preferred):** `get_journey`, `create_journey`,
  `update_journey`, `get_journey_mapping`, and `update_journey_mapping` are
  curated journey tools with structural validation and
  safe responses. Writes need the `mcp:write` consent, which the user
  chooses on the epilot approval screen (read-only is preselected); when a
  write is denied, ask the user to re-authenticate the connection and choose
  read-and-write access. Journey
  writes through the generic `call_api_operation` route are redirected to
  these tools; generic reads have the signed access token stripped.
- **epilot CLI:** `npx epilot journey getJourneyV2 / createJourneyV2 /
  updateJourneyV2` offer the raw operations for scripted use. Prefer the MCP
  tools in agent sessions: they validate wiring and never expose tokens.
- Do not guess block options. Copy them from an existing journey or the
  catalog, and use `search_docs` for feature-level behavior.
