---
type: llm
---

PASS if the reply describes an integration without an App: an outbound mechanism for new orders (webhook, event, or automation calling the ERP) AND an inbound mechanism for the invoice status (epilot API update or Integration Toolkit / inbound mapping), and it mentions at least one reliability concern such as idempotency, retries, or an external ID / correlation key.
FAIL if the reply recommends building an epilot App, covers only one direction, or gives no concrete mechanism for either direction.
