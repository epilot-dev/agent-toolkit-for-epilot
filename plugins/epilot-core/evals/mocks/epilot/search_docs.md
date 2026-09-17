---
type: fixed
---

Results for "{{input.query}}":

1. Journeys — customer-facing multi-step forms built in the Journey Builder. A journey submission creates or updates entities (contact, opportunity, order) through an entity mapping.
2. Workflows (Prozesse) — internal task graphs with phases, decision branches and automation tasks; started manually, by an automation, or from a journey submission.
3. Automations — event-driven flows: trigger (entity created/updated, journey submitted) → actions (create task, send email, start workflow, call webhook).
4. Apps — custom code surfaces: entity tabs/widgets, custom journey blocks, portal widgets, flow actions, scheduled functions. Declared in manifest.json, deployed with the epilot CLI.
5. Integration Toolkit — inbound/outbound mappings and webhooks for exchanging data with external systems without an App.
