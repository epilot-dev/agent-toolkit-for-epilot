# epilot platform model

## Core mental model

epilot is an extensible platform whose shared business data is represented as
entities. Schemas define entity types and fields; relations connect records;
permissions govern which identities can act on which resources. This shared
model lets configuration, Apps, and integrations operate on the same business
objects.

## Capability map

| Need | Start with |
|---|---|
| Model customers, contracts, opportunities, meters, or domain records | Entity schemas, attributes, and relations |
| Capture demand or guide a customer through an offer | Journeys, products, pricing, and submissions |
| Coordinate internal work and business state | Workflows, automations, tasks, and events |
| Serve customers after acquisition | Customer Portal, messages, documents, and supported portal extensions |
| Add a custom employee or customer interface | An epilot App surface |
| Exchange data or execute behavior in another system | Integration patterns and platform APIs |
| Package reusable configuration | Blueprints or other supported configuration packaging |
| Restrict access | Roles, permissions, grants, and App installation permissions |

This is a navigation map, not a feature contract. Search current epilot docs
before relying on exact names, limits, lifecycle behavior, or supported
combinations.

## Configuration graph

Organization-specific schemas, relations, Apps, mappings, integrations, flows,
and settings form a connected configuration graph. Use the epilot MCP to
inspect that graph when implementation depends on the organization's current
state. Treat permission errors as unknown state, not evidence that a resource
does not exist.
