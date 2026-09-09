---
name: integrate-with-epilot
description: Connect an external service, backend, script, middleware, ETL job, or webhook to or from epilot using public APIs, SDKs, events, webhooks, mappings, or synchronization. Use for direct inbound, outbound, or bidirectional connectivity that does not require an epilot App, and for deciding whether Batch API or Integration Toolkit is a better mechanism. Do not use for custom epilot UI or vendor-specific Lima, SAP, or ERP semantics.
---

# Integrate with epilot

Produce a source-backed connection whose data ownership, trigger, mapping,
delivery, recovery, and operational state are explicit. The normal deployment
boundary is an external service or job: it does not need an App manifest,
installation lifecycle, or epilot UI component.

## Language and customer-facing content

- Respond in the user's language unless they request another language.
- Preserve API identifiers, schema keys, commands, enum values, and product
  names exactly; translate explanatory text and display labels instead.
- Write customer-facing content in the requested audience's language. When
  editing an existing journey, portal, or App, preserve its locale and the
  organization's du/Sie usage unless the user requests a change. Conversation
  language alone is not a request to translate an existing resource.
- Use the target epilot resource's supported translation fields. Keep existing
  translations and required locales; do not invent locale keys or overwrite
  another language while adding a translation.

## Route the work

- Read [references/integration-patterns.md](references/integration-patterns.md)
  to choose direct API, webhook, event, batch, managed mapping, or hosted
  behavior.
- Read [references/platform-discovery.md](references/platform-discovery.md)
  when finding current docs, schemas, events, APIs, or connected-organization
  configuration through MCP.
- Read [references/integration-mappings.md](references/integration-mappings.md)
  when authoring or changing Integration Toolkit inbound mappings — the
  simulate-first workflow, mapping syntax map, and relation handling.
- Read [references/reliability.md](references/reliability.md) when implementing
  delivery, synchronization, mapping, security, monitoring, or recovery.

Load only the references required by the request.

## Connectivity modes

- **Into epilot:** an external caller authenticates, discovers the target
  schema and exact API contract, and creates or updates entities, relations, or
  other supported resources.
- **Out of epilot:** epilot emits an event or webhook, or a configured workflow
  invokes an external endpoint. The receiver validates authenticity and
  acknowledges only after durable acceptance.
- **Bidirectional:** combine event-driven changes with checkpoints and periodic
  reconciliation. Define ownership per field to prevent update loops.
- **Bulk migration or export:** use the documented batch or bulk mechanism when
  its limits and failure model fit better than repeated single-resource calls.

## Working method

1. Define the contract before implementation: system of record per field,
   direction, trigger, correlation key, ordering needs, expected volume,
   freshness, deletion behavior, and failure owner.
2. Choose the smallest boundary that satisfies the contract. A direct API
   client, webhook receiver, or scheduled external worker is valid and often
   needs neither an App nor Integration Toolkit.
3. Discover exact epilot operations and schemas through the bundled MCP. Use
   current documentation or OpenAPI output rather than remembered endpoints.
4. Inspect the connected organization's actual schemas and configuration when
   the implementation depends on them. Do not treat generic documentation as
   proof that a tenant is configured a certain way.
5. Probe the external system's authentication and one representative read in
   a safe environment before building mappings around assumed payloads.
6. Create fixtures from sanitized real shapes, implement mapping tests, and
   preserve unknown, optional, null, and deletion behavior deliberately.
7. Implement idempotency, retry classification, checkpoints, observability,
   and a replay or reconciliation path before calling the connection done.
8. Validate locally, then verify in the intended non-production environment.

## Escalate the boundary only when needed

- Choose Integration Toolkit when its managed mappings, synchronization, and
  monitoring match the operating model better than external code.
- Choose an App Function when epilot-hosted execution and an App installation
  lifecycle are desired.
- Use `build-epilot-app` when users need a custom surface or installable App
  capability in addition to the data connection.

## State and authority boundaries

- Documentation establishes platform behavior; MCP organization tools
  establish the connected organization's current configuration. Keep those
  findings separate.
- A resource visible in an organization is not proof that its downstream
  system is healthy or that credentials work.
- API discovery and read-only inspection do not authorize writes, webhook
  creation, configuration changes, synchronization, or replay.
- Before any live mutation, confirm organization, environment, resource,
  expected effect, and recovery approach. Inspect dependency impact when
  changing existing configuration.
- Never display or copy secret-bearing webhook, token, environment, or App
  configuration.
