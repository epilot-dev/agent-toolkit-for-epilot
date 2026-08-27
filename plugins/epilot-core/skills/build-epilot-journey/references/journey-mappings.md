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
   definitive check is a test submission on the live journey: the expected
   entities must appear.
4. **After changing blocks, revisit the mapping.** Adding or renaming blocks
   with `update_journey` does not update the mapping; check
   `get_journey_mapping` and map new blocks explicitly.
5. **Respect safe mode.** When `safeModeAutomation` is on, store mapping
   versions if asked, but leave the automation alone and tell the user why.

The mapping attribute syntax (paths into submission values, operations like
append, relation handling, line items) is documented in the epilot product
documentation — use `search_docs` for "inbound mapping syntax" rather than
guessing operations.
