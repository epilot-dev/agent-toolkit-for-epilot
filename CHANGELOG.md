# Changelog

All notable changes to this project will be documented in this file. The format
is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this
project follows [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Friendly display names, descriptions, and starter prompts for all six skills.
- Consistent conversation and customer-content language guidance, with bilingual
  routing scenarios and stricter listing/MCP consistency checks.
- OpenAI listing metadata in the portable manifest, including public privacy,
  terms, and support links.
- `configure-epilot` skill for end-to-end platform configuration: schemas,
  journeys, products and pricing, workflows, automations, portals, and
  permissions.

### Changed

- Fix invalid YAML in the configuration skill description and validate all skill
  frontmatter and interface metadata in CI.
- Display the plugin as **epilot**, keeping the `epilot-core` package identifier.
- Use Business & Operations as the OpenAI listing category and shorten its tagline.
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

[Unreleased]: https://github.com/epilot-dev/agent-toolkit-for-epilot/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/epilot-dev/agent-toolkit-for-epilot/releases/tag/v0.1.0
