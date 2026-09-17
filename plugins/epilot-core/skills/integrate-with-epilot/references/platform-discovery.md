# Discover epilot platform contracts

The bundled epilot MCP is the preferred discovery surface.

## Documentation

1. Use `search_docs` with the product concept and desired outcome.
2. Use `fetch_doc` only for the pages needed for the current decision.
3. Treat public documentation as behavior guidance, not evidence of an
   organization's configuration.

## APIs

1. Use `search_api_operations` with an outcome or domain term. Without a
   query it returns the list of services with operation counts; pass
   `service` to list one service's operations. The full catalogue does not
   fit a single result.
2. Use `describe_api_operation` before the first `call_api_operation` of an
   operation: it returns the request contract (parameters, body fields, the
   schemas they reference). Do not guess body fields or query parameters;
   most failed calls in production are guessed request shapes. Pass
   `view: full` only when response schemas are needed.
3. Use `call_api_operation` only when a live call is needed and authorized.
   Non-GET operations are writes even when named “test”, “preview”, or “sync”.
4. Pass `service` only as returned by `search_api_operations`. Service names
   are the epilot SDK and CLI client names (`entity`, `journey`,
   `organization`, `workflow-definition`); do not guess or reuse names from
   earlier sessions. When the operationId is unambiguous, `service` can be
   omitted.

## Data model and organization state

- Use `search_configuration` (type `schema`) to list the connected tenant's
  entity schemas and `get_entity_schema` for one schema's attributes.
- Use `search_configuration` to find Apps, integrations, mappings, webhooks,
  workflows, or related configuration.
- Use `get_config_dependencies` and `get_config_impact` before proposing a
  change to an existing resource.
- Read webhooks, journeys, and portal configs through `search_configuration`
  and `call_api_operation`; the generic route strips embedded credentials
  (webhook auth blocks, journey access tokens, portal Cognito details) and
  lists them as `redacted_fields`.

Call `whoami` before reporting organization-specific findings. Label
documented, observed, and inferred facts separately.

Entity reads over OAuth MCP connections are PII-anonymized by default;
`whoami` reports the mode as `entity_pii`. Masked values are the expected
behavior, not data corruption — use them as sanitized fixture shapes, and do
not attempt to reconstruct or work around the masking.
