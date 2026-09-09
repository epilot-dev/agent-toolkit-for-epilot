# Workflow anatomy

`create_workflow` accepts a compact description and compiles it into a flow
template of the flows system (version v3). You describe intent — which task
comes next, which branch loops back to where — and the tool emits the
template conventions the backend expects.

```json
{
  "name": "Lead qualification",
  "description": "Optional, shown in the builder",
  "trigger": { "type": "manual", "entitySchema": "opportunity" },
  "phases": [{ "id": "qualify", "name": "Qualifizierung", "next": "close" }],
  "tasks": [
    { "id": "call", "name": "Kunden anrufen", "type": "MANUAL", "phase": "qualify", "next": "offer" },
    { "id": "offer", "name": "Angebot senden", "type": "MANUAL", "phase": "qualify" },
    { "id": "close", "name": "Abschluss", "type": "MANUAL" }
  ],
  "enabled": false,
  "dryRun": true
}
```

## Trigger

| type | fields | when |
| --- | --- | --- |
| `manual` | `entitySchema` | Users start it from the entity. Good default while a process is new. |
| `automation` | `triggers` (automation API trigger objects) | Starts on entity events. Most common: `{ "type": "entity_operation", "configuration": { "schema": "opportunity", "operations": ["createEntity"] } }`. Narrow with `filter_config` so it does not start on every update. |
| `journey_automation` | `entitySchema` | Started by a journey's automation; pair it with the journey's mapping so the anchor entity exists. |

For `automation` the backend creates a trigger automation named after the
workflow with a `trigger-workflow` action. Its id comes back as
`automations.trigger.automation_id`. Use `describe_api_operation` for
`createFlow` on the automation service to see the trigger schemas.

## Tasks

Every task has `id` (stable, your choice, letters/digits/`_`/`-`), `name`,
`type`, optional `phase`, and `next`. A task without `next` ends its path.
Optional fields: `description`, `assigned_to` (user ids or
`{ "variable": "{{entity.owner}}" }`), `due_date_config`, and any other
published Task field, which is forwarded unchanged.

| type | extra fields | notes |
| --- | --- | --- |
| `MANUAL` | — | A person completes it. |
| `AUTOMATION` | `action` or `automationFlowId`, `trigger_mode`, `schedule` | `action` is an automation API action object (`{ "type": "send-email", "config": { "email_template_id": "…" } }`); the backend creates the automation and links it. `automationFlowId` links an existing automation instead. |
| `DECISION` | `branches`, `defaultBranch`, `mode`, `parallelBranches`, `loop` | Routes the flow. See below. |
| `AI_AGENT` | `agent` with `agent_id` | Runs a configured AI agent. |

## Phases

A phase groups tasks (`task.phase`). It needs at least one task and exactly
one start task: the member no other member points to. When all its tasks are
done the flow continues at the phase's `next`; a phase without `next` ends
the flow. A task inside a phase may point at a task in another phase or at a
phase id.

## Decisions, branches, default

```json
{
  "id": "segment", "name": "Kundentyp?", "type": "DECISION",
  "branches": [
    { "id": "private", "name": "Privatkunde", "next": "welcome",
      "statements": [{
        "source": { "origin": "trigger", "origin_type": "entity", "schema": "opportunity",
                    "attribute": "customer_type", "attribute_type": "select" },
        "operator": "equals", "values": ["PRIVATE"] }] }
  ],
  "defaultBranch": { "name": "Geschäftskunde", "next": "key_account" }
}
```

- `mode: "automatic"` (default) evaluates statements; every branch needs at
  least one. `mode: "manual"` lets a user pick the branch and branches must
  have no statements.
- `match: "all"` (AND, default) or `"any"` (OR) combines a branch's
  statements.
- `defaultBranch` is taken when nothing matches. It counts toward the minimum
  of two branches. Always add one to an automatic decision so no case gets
  stuck.
- `parallelBranches: false` (default) runs only the first matching branch;
  `true` runs every matching branch at once.
- A branch's `next` is a task id, a phase id, or `null` to end that path.

### Statement fields

- `source.origin`: `trigger` (the entity the workflow runs on). `origin_type`
  is `entity`, `schema` the entity slug, `attribute` the attribute name.
- `source.attribute_type` must match the schema attribute's type: `string`,
  `text`, `number`, `boolean`, `date`, `datetime`, `select`, `multiselect`,
  `radio`, `status`, `tags`, `relation`, `relation_user`, `country`, `email`,
  `phone`, `purpose`, `label`, `price`, `product`. Read it from
  `get_entity_schema`.
- `operator`: `equals`, `not_equals`, `any_of`, `none_of`, `contains`,
  `not_contains`, `starts_with`, `ends_with`, `greater_than`, `less_than`,
  `greater_than_or_equals`, `less_than_or_equals`, `is_empty`,
  `is_not_empty`.
- `values`: strings. For relative dates set `value_type: "relative_date"` and
  `values: ["today"]`.

## Loops

A loop is a DECISION branch that jumps back to an earlier task, with a cap:

```json
{
  "id": "reached", "name": "Kunde erreicht?", "type": "DECISION", "mode": "manual",
  "branches": [{ "id": "yes", "name": "Ja", "next": "segment" }],
  "defaultBranch": { "name": "Nein, erneut versuchen", "next": "note" },
  "loop": { "branch": "default", "restartAt": "call", "maxIterations": 3,
            "exit": { "name": "Nicht erreichbar", "next": "close_lost" } }
}
```

- `branch` names the repeating branch by id or name; `"default"` means the
  default branch.
- `restartAt` is the task the loop jumps back to. The loop branch's path must
  end by pointing at it (here `note` has no `next`, so it returns to `call`
  automatically). A decision may restart at itself.
- `exit` is where the flow continues once `maxIterations` is reached. The
  tool adds this as an extra branch.
- Any cycle that is not a declared loop is rejected. Nested loops are allowed;
  a task can belong to only one loop.

## What the tool emits

For the curious, or when reading a stored template: a synthetic `trigger`
node with one edge to `start`; phase edges to the start task and onward;
conditions on the decision with edges referencing them by `condition_id`;
the default branch as a `none-met-*` condition on an edge flagged
`none_met: true`; loops as `loop_config`, one `exit-loop-*` condition, and one
`loop-edge-*` back edge. `dryRun` returns this template and the generated
ids so you can read the stored version later.
