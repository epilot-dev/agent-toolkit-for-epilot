# Changelog

All notable changes to this project will be documented in this file. The format
is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this
project follows [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.2.0] - 2026-09-17

### Added

- Behavioral eval suite in `plugins/epilot-core/evals/` for `claude plugin eval`:
  five routing and language cases with graders and epilot MCP mocks, plus the
  manual checklist for other clients (moved from `tests/language-and-routing.md`).
- Friendly display names, descriptions, and starter prompts for all six skills.
- Consistent conversation and customer-content language guidance, with bilingual
  routing scenarios and stricter listing/MCP consistency checks.
- OpenAI listing metadata in the portable manifest, including public privacy,
  terms, and support links.
- `configure-epilot` skill for end-to-end platform configuration: schemas,
  journeys, products and pricing, workflows, automations, portals, and
  permissions.
- `build-epilot-workflow` skill for workflows of the flows system: discovery,
  the compact graph description for the epilot MCP `create_workflow` tool
  (phases, decision branches, default branches, loops, automation tasks),
  graph replacement with `update_workflow`, design conventions, and
  verification.
- `build-epilot-app` now deploys through the epilot MCP App API as part of
  its working method: create or update the configuration, presigned bundle
  upload, component registration, explicit `install`, version and
  installation re-sync, the `component_args` shape, and wiring the component
  into its surface. The CLI `app deploy` is documented as the equivalent
  path, with its pitfalls (`app deploy --help` executes a deploy; a token for
  another organization fails with `403`; deploy does not install).
- `AppBlockControl` in the journey block catalog: how a journey step embeds
  an installed App's custom journey block, and that `bundleURL` is pinned to
  an App version.
- `build-epilot-journey`: "Verifying the automation" — the read-back
  sequence after a test submission (submission arrived, `searchFlows` runs,
  `getExecutions` per-action status and outputs, produced entities), the
  rule that `settings.runtimeEntities` must cover every mapping source
  (`ORDER` for product selections), and the step-index shift after
  structural journey changes.

### Changed

- Platform discovery now tells agents to call `describe_api_operation` before
  the first `call_api_operation` of an operation and never to guess body
  fields or query parameters, matching the epilot MCP's request-contract view
  of `describe_api_operation` and its service overview for
  `search_api_operations` without a query.
- Design guidance uses `create_journey` with `design` or the generic
  `addDesign` / `updateDesign` operations; the epilot MCP no longer ships
  `create_design` and `update_design` tools.

### Fixed

- The discovery reference named a `list_entity_schemas` tool that does not
  exist; entity schemas are listed with `search_configuration` (type
  `schema`).
- The discovery reference recommended omitting the query on
  `search_api_operations` to list every operation, which exceeded the tool
  result limit.
- Fix invalid YAML in the configuration skill description and validate all skill
  frontmatter and interface metadata in CI.
- Display the plugin as **epilot**, keeping the `epilot-core` package identifier.
- Use Business & Operations as the OpenAI listing category and shorten its tagline.
- Connect the Volt UI MCP through its hosted endpoint
  `https://volt-ui.epilot.io/api/mcp` instead of a local `npx` process, so it
  works in sandboxed clients such as Claude Cowork and ChatGPT.
- Add the plugin logo and brand color to the Codex manifest and validate that
  referenced assets exist.
- Correct the ChatGPT installation documentation and describe local execution
  requirements separately from remote MCP access.
- Renamed the plugin from `epilot-developer` to `epilot-core` to cover
  configuration alongside App and integration development. The rename happened
  before any public release, so no installed plugin is affected.

## [0.1.0] - 2026-08-24

### Added

- Initial `epilot-core` plugin for Codex and Agent Plugins 1.0 clients.
- Platform routing, App building, generic integration, and interface design
  skills.
- epilot and Volt UI MCP server configuration.
- Claude Code marketplace compatibility.
- Local App manifest inspector and repository validation tests.

[Unreleased]: https://github.com/epilot-dev/agent-toolkit-for-epilot/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/epilot-dev/agent-toolkit-for-epilot/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/epilot-dev/agent-toolkit-for-epilot/releases/tag/v0.1.0
