# Connection reliability checklist

## Contract

- Stable correlation key and explicit source-of-truth ownership.
- Versioned request, response, and event fixtures.
- Defined behavior for optional, null, unknown, and deleted fields.
- Mapping tests for representative and boundary cases.

## Delivery

- Idempotency at the receiving side.
- Bounded concurrency and documented rate-limit behavior.
- Retry only transient failures, with backoff and jitter.
- Dead-letter or quarantine path for permanent failures.
- Checkpoint or cursor that advances only after durable success.
- Reconciliation job for missed, delayed, or out-of-order events.

For epilot webhooks, verify signatures according to current documentation and
ensure the HTTP server accepts the documented transfer behavior. Keep external
credentials in the external runtime's secret manager; use epilot-managed
secret fields only when epilot configuration needs to make the call.

## Operations

- Structured logs containing correlation identifiers but no secrets or PII.
- Metrics for attempted, succeeded, retried, failed, delayed, and backlogged
  work.
- Actionable alerts tied to an owner and runbook.
- Replay that is scoped, auditable, rate-limited, and idempotent.
- Health that distinguishes transport availability from business-level
  acceptance.

## Security

- Least-privilege service identity, token, or documented authentication method.
- Secrets stored server-side and rotated independently of code.
- Explicit environment separation and no production fallback.
- Sanitized fixtures and diagnostics.
- Dependency-impact inspection before changing shared epilot configuration.

Do not report a connection as verified merely because an HTTP request returned
2xx. Validate the documented business response and resulting state on the
authoritative side.
