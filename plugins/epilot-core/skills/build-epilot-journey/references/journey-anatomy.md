# Journey anatomy

A journey definition is one JSON document. The shape below is what
`get_journey` returns and what `create_journey` / `update_journey`
accept (the server injects `organizationId` and manages the signed
`publicToken`; neither appears in agent-facing payloads).

```json
{
  "name": "Wallbox bestellen",
  "steps": [ { "stepId": "…", "name": "…", "schema": {}, "uischema": {} } ],
  "logicsV4": {},
  "validationRules": {},
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

## Logics, validation, rules, context

- `logicsV4` — the logic the Journey Builder writes, keyed by logic id. Each
  entry has `id`, `action`, `triggeredOn` (`on-value-changed` |
  `on-click-next`), `conditions` (OR-groups of AND-clauses, each `{ fact:
  { referenceType, referenceId, path? }, operator, value }`), and
  action-specific `settings`. Actions: `display-condition`,
  `display-field-condition`, `required-condition`,
  `required-field-condition`, `readonly-condition`, `show-options`,
  `filter-condition`, `content-condition`, `prefill`, `data-injection`,
  `jump-to-step`, `skip-step`. Facts read a `block` (by the uischema
  element `id`), a `context-parameter` (by its `id`), a `datasource`,
  `global`, or `environment` value; settings name the target with
  `targetBlock` / `targetField`, `sourceBlock`, `targetStep`, or
  `skipSteps`. Prefilling is `prefill` (a fixed or context-derived value) or
  `data-injection` (copy one block's value into another).
- `validationRules` — bindings of validation rules to blocks, keyed by block
  id: a rule id or ordered list of rule ids for the whole block, or
  `{ field: ruleId | ruleIds }` per field. The rules themselves live in the
  Validation Rules API: list them with `call_read_api_operation
  getValidationRules`, create one with `call_api_operation
  createValidationRule`, then bind its id here.
- `logics` (v3, legacy) — `{ conditions: string[], actions: string[] }`
  expressions referencing block names. Prefer `logicsV4` for anything new.
- `rules` — data injection between scopes: `{ type: "inject", sourceType:
  "journey|step|block", source, target }`.
- `contextSchema` — declared launch parameters: `{ id, paramKey, type,
  isRequired, shouldLoadEntity }`; type is an entity slug or `text`;
  `shouldLoadEntity` makes the runtime load the entity whose id is passed.

Every section is replaced as a whole by `update_journey`: to change one
logic, read `logicsV4` with `get_journey`, modify it, and send the full
object back. `create_journey` and `update_journey` check that every block,
step, and context parameter a logic or binding references exists in the
steps being written, that every validation rule id exists in the
organization, and reject sections they do not know instead of dropping
them. An update whose steps remove a block that stored logics still target
is rejected; send the pruned `logicsV4` in the same call. Datasource facts
are not checked.

Copy working logic and binding shapes from an existing journey via
`get_journey` before authoring new ones.
