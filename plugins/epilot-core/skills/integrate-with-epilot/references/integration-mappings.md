# Author Integration Toolkit inbound mappings

Inbound mappings translate external (typically ERP) events into epilot entity
updates. This is the workflow and mental model; confirm exact syntax in the
current docs: search_docs "integration toolkit inbound mapping", and the pages
under <https://docs.epilot.io/docs/integrations/integration-toolkit/>.

## Mental model

- One **use case** = one external event type (for example "CustomerChanged").
  Its configuration maps one payload to **multiple entities**, and one entity
  configuration can fan out over array data.
- Processing order per entity: payload → optional entity-level
  `jsonataExpression` (pre-process, normalize, fan out) → `fields` mappings →
  entity update.
- Configuration shape: `{ entities: [{ entity_schema, unique_ids,
  jsonataExpression, enabled, mode, scope, fields }], meter_readings: [...] }`.
- `unique_ids` identify the target record. Use stable business keys (customer
  number, contract number), never display names. Relations to other entities
  resolve through the *target's* unique ids at processing time.

## The authoring loop: simulate before you store

1. Inspect the target schemas first (`get_entity_schema`). A mapping that
   writes attributes missing from the schema stores invisible data.
2. Draft the mapping for one representative, sanitized payload.
3. **Simulate** — `simulateMappingV2` (`POST /v2/erp/updates/mapping_simulation`)
   takes `{ event_configuration, payload, format }` and returns the computed
   `entity_updates` (entity_slug, unique_identifiers, attributes) and
   `meter_readings_updates` **without persisting anything**. From a shell:
   `cat body.json | npx epilot erp-integration simulateMappingV2`.
4. Check the simulation output: do unique identifiers resolve, are attribute
   values typed correctly, do relations appear, does conditional `enabled`
   logic fire as intended?
5. Re-simulate with boundary payloads: missing optional fields, nulls, empty
   arrays, and the deletion case. Keep these payloads as fixtures.
6. Only then store the configuration as a new version, send one real test
   event in a non-production organization, and verify the resulting entity
   state — not just an accepted HTTP response.

## Syntax map (verify details in current docs)

| Element | Options |
|---|---|
| Field mapping types | simple `field`; JSONPath (`field` starting `$`); `jsonataExpression`; `constant`; `file_proxy_url` |
| Conditionality | `enabled` as boolean or JSONata — on fields, entities, and relations |
| Operation modes | `upsert` (default), `delete`, `purge`, `upsert-prune-scope-purge`, `upsert-prune-scope-delete` (prune modes require `scope`) |
| Array and relation ops | `_set` replaces; `_append` adds with dedupe by entity id; `_append_all` allows duplicates |
| Relation references | `$relation_ref` borrows a field by path from another entity, resolved all-or-nothing, with `_id` preservation |

## Practices that prevent rework

- Normalize early in the entity-level JSONata instead of repeating logic in
  many field expressions.
- Record provenance with a `constant` (for example `_source`).
- Treat every mode other than `upsert` as destructive: prune and purge modes
  delete records. Simulate first and confirm scope before storing.
- One use case per event type; resist a single mega-mapping with heavy
  conditional logic across unrelated events.
- Mapping configurations are versioned — store a new version rather than
  editing blind, so history and rollback stay available.
