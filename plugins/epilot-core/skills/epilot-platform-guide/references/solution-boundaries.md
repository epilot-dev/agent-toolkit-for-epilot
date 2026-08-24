# Choosing the solution boundary

Prefer the smallest boundary that delivers the outcome and has a clear owner.

| Boundary | Choose it when |
|---|---|
| Native configuration | Existing schemas, journeys, pricing, workflows, automation, portal, or permission features can express the outcome without custom runtime behavior |
| epilot App | Users need a custom epilot surface, installable capability, packaged permissions/options, hosted function, or marketplace lifecycle |
| Integration | Data or commands cross a system boundary and require mapping, delivery, retries, synchronization, reconciliation, or external ownership |
| App plus integration | A custom epilot interface and a separately operated external-system data path are both essential |

Ask these questions before choosing:

1. Where does the user experience live?
2. Which system owns each business object?
3. What triggers the work, and is it synchronous, event-driven, or scheduled?
4. Does another organization install and configure the capability?
5. Which permissions, secrets, deployment lifecycle, and operations team own it?

Do not build an App merely to replace supported configuration. Do not hide a
durable synchronization pipeline inside browser UI. When the answer depends on
the connected organization, inspect its schemas, installed Apps, mappings, and
flows before finalizing the boundary.
