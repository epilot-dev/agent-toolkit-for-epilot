# Journey entity mappings

A journey without a mapping collects submissions that create nothing. The
mapping is what turns submitted block values into entities — an opportunity,
a contact, an order — and it is a first-class part of journey authoring.

## The model

- Every journey references a **versioned mapping config**
  (`settings.mappingsAutomationId`). It lists **targets**: one per entity the
  submission should create or update, each with `target_schema` (entity slug)
  and `mapping_attributes` mapping journey block values onto entity
  attributes.
- An **automation** with a `journey_submission` trigger executes the mapping:
  one action per target (`map-entity`; orders use `cart-checkout`),
  referencing the mapping config id, target, and version.
- `settings.safeModeAutomation: true` means the organization manages that
  automation manually — tooling must never create or modify it.

## Tools

- `create_journey` creates the journey **with** an automatic mapping derived
  from its blocks and the executing automation, so submissions work
  immediately. Pass `createMappingAutomation: false` only when mappings are
  managed elsewhere.
- `get_journey_mapping` shows the current targets, their mapping attributes,
  the config version, safe-mode state, and the executing automation.
- `update_journey_mapping` stores the modified targets as a new version and
  keeps the automation in sync (creating it when missing, preserving
  user-added actions like emails). Concurrent edits are detected — on a
  version conflict, re-read and reapply.

## Authoring workflow

1. **Read before writing.** `get_journey_mapping` on the journey, and on a
   comparable journey to copy proven mapping-attribute shapes.
2. **Every attribute needs a source and a consumer.** Map a block value only
   onto an entity attribute that exists (`get_entity_schema`) and matches the
   type. Unmapped required blocks and dangling targets are both defects.
3. **Verify attributes before storing.** There is no dry-run for journey
   mappings (`simulateMappingV2` belongs to Integration Toolkit inbound
   mappings, not journeys). Check every target attribute against
   `get_entity_schema`, then store with `update_journey_mapping`. The
   definitive check is a test submission on the live journey, read back as
   described in [Verifying the automation](#verifying-the-automation).
4. **Runtime entities must match the mapping.** `settings.runtimeEntities`
   decides which entities the journey app creates during the session and
   hands to the mapping as sources. Mapping attributes that copy from
   `order.*` (`order.products.$relation`, `order.prices.$relation`) or
   relation attributes with `source_filter.schema: order` need `ORDER`;
   `journey_context.opportunity_id` / `opportunity._id` need `OPPORTUNITY`.
   Without the runtime entity the source is simply empty: the action still
   reports `success`, the opportunity is created, and the selected products
   never appear anywhere. A journey with a product-selection block and no
   `ORDER` runtime entity is a defect even when every execution succeeds.
5. **After changing blocks or steps, revisit the mapping.** Adding or
   renaming blocks with `update_journey` does not map them; check
   `get_journey_mapping` and map new blocks explicitly. Mapping paths address
   steps by index (`submission.steps[5]['Kontakt']`), so inserting or
   removing a step shifts every path after it — after a structural change,
   confirm with `get_journey_mapping` that the indices point at the intended
   blocks (the curated tools re-sync the mapping version; verify rather than
   assume).
6. **Respect safe mode.** When `safeModeAutomation` is on, store mapping
   versions if asked, but leave the automation alone and tell the user why.

## Verifying the automation

`get_journey_mapping` proves the mapping and its automation *exist*, not that
they *work*. Health is read back through the generic route
(`call_api_operation`) after a test submission — an enabled automation with
`runs: 0`, or a `success` execution that produced an entity with empty
relations, both look fine in the builder and are broken. Walk this sequence:

1. **Did a submission arrive?** Entity API `searchEntities` with
   `q: "_schema:submission AND journey_name:\"<journey name>\""`, sorted
   `_created_at:desc`. No submission after a test means the journey never
   submitted — a runtime problem (a failing block, a required field, a
   disabled journey), not an automation problem. Open the journey app to
   reproduce before touching the mapping. The submission's
   `mapped_entities.$relation` lists what the mapping produced and
   `_validation_warnings` what it rejected.
2. **Is the automation attached and firing?** Automation API `searchFlows`
   with `trigger_source_id=<journeyId>` and `include_flows=true`: exactly one
   flow with a `journey_submission` trigger, `enabled: true`, and a `runs`
   count that grows with each submission. `runs: 0` after submissions means
   the trigger's `source_id` does not match the journey or the flow is
   disabled (`disable_details` names who disabled it and when).
3. **What did the execution do?** Automation API `getExecutions` with
   `entity_id=<submission id>` and `include_flows=true`: `execution_status`
   for the run and, per action, `execution_status`, `outputs.entities`
   (the entities the `map-entity` action created or matched) and the error
   on failure. Journey-mapping actions carry `allow_failure: true`, so a
   failed target does not fail the run — read every action, not just the
   run status. `retriggerAction` re-runs a single failed action.
4. **Is the data actually there?** `getEntity` on each produced entity and
   check the attributes and relations the organization needs — customer
   relation, line items / products, the mapped block values. Missing
   relations with a `success` status point at the runtime-entity rule above
   or at a mapping source path that no longer matches the step layout.

Report the finding at the level the user experiences it: "the automation does
nothing" usually resolves to one of no submission, `runs: 0`, a failed
action, or an empty source — name which, with the ids, before proposing a
change. Configuration Hub (`get_config_dependencies` on the journey) links
the journey to its `entity_mapping`; when the Hub is unavailable, the steps
above need no index and still work.

The mapping attribute syntax (paths into submission values, operations like
append, relation handling, line items) is documented in the epilot product
documentation — use `search_docs` for "inbound mapping syntax" rather than
guessing operations.
