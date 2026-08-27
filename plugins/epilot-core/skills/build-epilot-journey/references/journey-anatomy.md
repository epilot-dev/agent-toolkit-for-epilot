# Journey anatomy

A journey definition is one JSON document. The shape below is what
`get_journey_definition` returns and what `create_journey` / `update_journey`
accept (the server injects `organizationId` and manages the signed
`publicToken`; neither appears in agent-facing payloads).

```json
{
  "name": "Wallbox bestellen",
  "steps": [ { "stepId": "…", "name": "…", "schema": {}, "uischema": {} } ],
  "logics": [],
  "rules": [],
  "contextSchema": [],
  "settings": { "designId": "…", "accessMode": "PUBLIC", "isActive": false }
}
```

## Steps

Each step is a screen. Required parts:

- `stepId` — a client-generated UUID. Generate a fresh UUID per step; other
  steps reference it (button targets, logics). Never reuse ids.
- `name` — shown in the stepper and the builder; customer-visible.
- `schema` — a JSON Schema object whose `properties` has **one key per
  block**, keyed by the block's display name (German block names like
  `"Kontakt"` are the platform convention): `{ "type": "object",
  "properties": { "Kontakt": { "type": "object" } }, "required": [] }`.
- `uischema` — the layout tree. Its typed elements are the blocks; each block
  carries `scope: "#/properties/<block name>"` pointing at the schema
  property, a client-generated `id` UUID, and a `type` plus `options`
  specific to the block.

Step-level display flags: `hideNextButton` (set `true` when the step has an
ActionBar block — otherwise two navigation buttons render), `showStepper`,
`showStepperLabels`, `showStepName`, `showStepSubtitle`.

## Layouts

The `uischema.type` decides how `elements` is structured:

- `MainLinearLayout` — `elements` is a flat array of blocks, rendered top to
  bottom. The default for content steps. `options.scale` (1–12) controls
  width.
- `MainContentCartLayout` — `elements` is an **array of arrays** (content
  columns; the builder emits four, using the first for the main column).
  Use when the step shows a shopping cart or summary sidebar next to content.

## Wiring

Three reference systems must stay consistent — the curated tools validate all
of them and reject definitions with actionable messages:

1. Every uischema block `scope` must match a `schema.properties` key.
2. Every `stepId` must be unique.
3. Every button `options.*.targetStepId` (for example the ActionBar CTA with
   `actionType: "SubmitAndGoNext"`) must reference an existing `stepId`.

## Settings

Editable fields (subset): `designId` (organization design that themes the
journey; `create_journey` falls back to the organization's design when
omitted), `accessMode` (`PUBLIC` | `PRIVATE`), `isActive`, `isPublished`,
`runtimeEntities` (`ORDER` | `OPPORTUNITY` — what a submission maps into),
`description`, `entityTags`, `filePurposes`, `useAustrianLabels`,
`enableDarkMode`, `thirdPartyCookies`, address-suggestion fields, and
`safeModeAutomation`. The signed `publicToken` is server-managed: reads never
include it and updates preserve it automatically.

## Logics, rules, context

- `logics` (v3) — `{ conditions: string[], actions: string[] }` expressions
  referencing block names; `logicsV4` — structured conditions over block or
  context facts with `action` and `triggeredOn`.
- `rules` — data injection between scopes: `{ type: "inject", sourceType:
  "journey|step|block", source, target }`.
- `contextSchema` — declared launch parameters: `{ paramKey, type,
  isRequired }`; type is an entity slug or `text`.

Copy working logic and rule shapes from an existing journey via
`get_journey_definition` before authoring new ones.
