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

## Workflow

1. **Understand the outcome.** What should the customer achieve, what data
   must reach the organization, and which entity should a submission create
   or update? Name the audience and language up front — journey copy is
   customer-facing.
2. **Discover before designing.** Existing journeys are the best source of
   proven block shapes and organizational conventions:
   - `search_configuration` with `type: journey` lists what exists;
   - `get_journey_definition` on a comparable journey yields real steps,
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
   `get_journey_definition`, modify, write back.
5. **Verify.** Re-read the definition, walk the wiring (every button's
   `targetStepId` resolves, every block scope has a schema property — the
   curated tools validate this and return actionable errors), and run the
   design checklist. For a live check, open the journey in the epilot 360
   Journey Builder — configuration created via API appears there immediately.

## Execution tools

- **epilot MCP (preferred):** `get_journey_definition`, `create_journey`,
  `update_journey` are curated journey tools with structural validation and
  safe responses. The default MCP connection is read-only; writes need the
  write-enabled connection URL and the `mcp:write` consent. Journey
  operations through the generic `call_api_operation` route are blocked by
  design — raw Journey API responses embed signed access tokens.
- **epilot CLI:** `npx epilot journey getJourneyV2 / createJourneyV2 /
  updateJourneyV2` offer the raw operations for scripted use. Prefer the MCP
  tools in agent sessions: they validate wiring and never expose tokens.
- Do not guess block options. Copy them from an existing journey or the
  catalog, and use `search_docs` for feature-level behavior.
