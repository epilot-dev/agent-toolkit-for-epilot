# Choosing a connection pattern

Choose based on ownership and operational behavior, not the external product's
name.

| Requirement | Prefer |
|---|---|
| External service reads or writes epilot resources | Public APIs and typed SDKs |
| External service receives epilot changes near real time | Documented webhooks or events |
| epilot configuration invokes an external endpoint | A supported workflow HTTP action or webhook mechanism |
| External worker performs scheduled import, export, or reconciliation | Public APIs plus an external scheduler and durable checkpoint |
| Reduce request overhead for supported bulk work | Batch or bulk API |
| Standardized mapped push/pull synchronization with managed monitoring | Integration Toolkit |
| Run small logic inside epilot as part of an installable package | App Function |
| Submit data from an external form or frontend | Supported third-party journey APIs |
| Show an external-system workflow inside epilot | App component plus API Proxy or backend |

A direct API client, webhook receiver, or externally scheduled worker does not
require an epilot App. Combine mechanisms only when the lifecycle warrants it;
a common robust design uses events for low latency and scheduled API-based
reconciliation for missed or delayed changes.

## Decision questions

- Which system owns each field and identifier?
- Is the flow inbound, outbound, or bidirectional?
- Does the receiver support push, or must it poll?
- What ordering, latency, throughput, and rate limits apply?
- Where are mappings versioned and tested?
- What does an operator see when delivery fails?
- How is an item replayed without creating duplicates?
- How are credentials rotated without a code release?
- Who deploys and operates the external runtime?

Start with <https://docs.epilot.io/docs/integrations/overview/> and verify the
selected mechanism's current contract before implementation.
