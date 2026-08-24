# Entity model rules for configuration

## Schemas and attributes

- Everything is an entity with a schema, and the schema drives storage, UI
  rendering, and search. **Only attributes defined in the schema are
  searchable through the Entity API** — data written to undeclared fields is
  stored but effectively invisible to search and filters.
- Prefer extending an existing schema over creating a new one when the
  business object is genuinely the same thing. Check
  `listAvailableCapabilities` and the current schema before adding.
- Any attribute type becomes a list via `repeatable: true`; items carry
  `_id` and `_tags`, and `has_primary` marks a primary item.
- Confirm exact attribute-type names and value shapes from the current
  schema API or docs before writing; do not recite types from memory.

## Relations

- `$relation` links entities. Per-link `_tags` can encode roles, so one
  relation attribute can represent several semantic actors (for example
  applicant, installer, operator) without extra attributes.
- `$relation_ref` borrows a field from another entity by path — reuse a
  billing account's payment method instead of copying it.
- `hydrate=true` on reads resolves both kinds in place. Configure
  `reverse_attributes` when both sides should see the link.

## Taxonomies

Labels and purposes are taxonomy classifications with full CRUD and bulk
move/merge. Use consistent slug conventions and treat tags as part of the
configuration contract: automations and filters that match on tags break
when tags are renamed casually.

## Search and filter behavior

Entity search is Elasticsearch-backed, which leaks into configuration:

- Text fields are analyzed: matching on `name` is a partial-word match;
  matching on `name.keyword` is exact. When in doubt, use `.keyword`.
- Filters compare stored option values, not display labels. A select
  attribute stores its value; the label is presentation.
- In journey and list filters, conditions inside a group combine with AND;
  separate groups combine with OR.
- Relation attributes store entity IDs; filter through the relation path
  (for example `contacts.email`), not by display name.
