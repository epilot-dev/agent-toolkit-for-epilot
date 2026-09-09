# Workflow design

Conventions that separate a workflow people actually use from one that is
merely valid. Confirm current option names in docs before relying on them.

## Model the process, not the org chart

- One anchor entity per workflow, usually the opportunity. Tasks read and
  write that record; map progress onto its status so the record alone tells
  the state.
- Fewest tasks that still give one owner per step. Merge steps the same
  person does in one sitting; split steps that hand over to someone else.
- Use phases when the business talks in stages ("Qualifizierung",
  "Installation", "Abrechnung"). Skip them for short linear processes.
- Prefer one workflow with DECISION tasks over several near-identical
  workflows. Use separate workflows only when branches share nothing.
- Route with the first matching branch (`parallelBranches: false`). Parallel
  branches are for genuinely concurrent work such as "notify sales" and
  "order hardware" at the same time.
- Every automatic decision gets a `defaultBranch`. A case whose data matches
  no branch must still go somewhere a person can see.
- Loops model retries with a cap: call again up to three times, then close
  as lost. Put the human step (leave a note, reschedule) on the loop branch
  so each iteration leaves a trace.

## Automation tasks and their ids

| action type | needs | find it with |
| --- | --- | --- |
| `send-email` | `config.email_template_id` | `search_configuration` type `emailtemplate` |
| `trigger-webhook` | webhook config id | type `webhook` |
| `map-entity` | mapping config reference | type `entity_mapping` |
| `create-document` | document template id | type `document_template` |
| `trigger-workflow` | `config.target_workflow` | type `flow_template` |

Get the exact config shape from `describe_api_operation` for `createFlow` on
the automation service. Never invent config fields; an automation with a wrong
config is created successfully and fails only at run time.

Automation tasks default to `trigger_mode: "automatic"`; set `"manual"` when
a person should start the automated step deliberately. Use `schedule` for
delays (`{ "mode": "delayed", "duration": 2, "unit": "days" }`).

## Assignment and due dates

- Assign by role or variable, not by named user, wherever possible:
  `{ "variable": "{{entity.owner}}" }` follows the record's owner.
- Due dates as `due_date_config` relative to workflow start, a task, or a
  phase, so they hold for every execution.
- Tasks customers or installers should see are enabled for the portal on the
  task (`ecp`, `installer`); verify in the actual portal.

## Pitfalls the compiler cannot catch

- A statement whose `attribute_type` does not match the schema evaluates as
  not met and silently falls to the default branch. Read the schema first.
- Renaming or deleting an attribute after the workflow exists breaks its
  statements without any error; run `get_config_impact` on the schema before
  such changes.
- An `automation` trigger on `updateEntity` without a `filter_config`
  starts a new execution on every edit of every record of that schema.
- Enabled workflows count against the organization's workflow quota; keep
  drafts disabled and delete abandoned experiments.
- `updateFlowTemplate` replaces the whole template. Always PUT the full
  stored document with its `updated_at`; a stale write returns 409.

## Verification checklist

A workflow is done when, in the target organization:

- `create_workflow` returned `structure.healed: false`, an `automation_id`
  for the trigger (type `automation`) and for every AUTOMATION task;
- the flow builder shows the intended graph with no unconnected nodes;
- a test execution on a representative entity routes through each branch you
  can provoke, the loop exits after `maxIterations`, and the automation tasks
  produce their effect (an email in the outbox, a webhook delivery, an entity
  update);
- a user with the intended role, not an admin, can complete the happy path.
