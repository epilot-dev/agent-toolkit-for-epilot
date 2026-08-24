# Discover epilot platform contracts

The bundled epilot MCP is the preferred discovery surface.

## Documentation

1. Use `search_docs` with the product concept and desired outcome.
2. Use `fetch_doc` only for the pages needed for the current decision.
3. Treat public documentation as behavior guidance, not evidence of an
   organization's configuration.

## APIs

1. Use `list_available_apis` when the owning service is unknown.
2. Use `search_api_operations` with an outcome or domain term.
3. Use `describe_api_operation` for the exact request, response, auth, and
   identifiers before writing a client.
4. Use `call_api_operation` only when a live call is needed and authorized.
   Non-GET operations are writes even when named “test”, “preview”, or “sync”.

## Data model and organization state

- Use `list_entity_schemas` and `get_entity_schema` for the connected tenant's
  actual entity model.
- Use `search_configuration` to find Apps, integrations, mappings, webhooks,
  workflows, or related configuration.
- Use `get_config_dependencies` and `get_config_impact` before proposing a
  change to an existing resource.
- Use curated tools such as `list_webhooks`, `list_workflows`, or
  `list_automations` when their credential-safe projection covers the need.

Call `whoami` before reporting organization-specific findings. Label
documented, observed, and inferred facts separately.
