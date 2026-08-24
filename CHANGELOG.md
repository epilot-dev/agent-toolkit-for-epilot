# Changelog

All notable changes to this project will be documented in this file. The format
is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this
project follows [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- `configure-epilot` skill for end-to-end platform configuration: schemas,
  journeys, products and pricing, workflows, automations, portals, and
  permissions.

### Changed

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
