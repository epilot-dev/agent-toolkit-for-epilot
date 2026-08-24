# epilot Agent Toolkit

[![Validate](https://github.com/epilot-dev/agent-toolkit-for-epilot/actions/workflows/validate.yml/badge.svg)](https://github.com/epilot-dev/agent-toolkit-for-epilot/actions/workflows/validate.yml)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![Agent Plugins 1.0](https://img.shields.io/badge/Agent%20Plugins-1.0-4C4CFF.svg)](https://agent-plugins.org/)

Give AI coding agents the platform knowledge and live tools they need to build
Apps and integrations on epilot.

The first installable plugin, `epilot-developer`, combines portable development
knowledge with live tools:

- epilot MCP for current documentation, OpenAPI discovery, entity schemas, and
  connected-organization configuration;
- Volt UI MCP for current components, props, and design tokens;
- a thin platform guide plus focused skills for Apps, integrations, and native
  epilot interface design;
- a deterministic local inspector for epilot App manifests and build inputs.

The toolkit intentionally excludes Lima, SAP, and other ERP-specific behavior.
Vendor implementations belong in separately installable plugins.

## Quick start

### Codex

Add this repository as a marketplace:

```bash
codex plugin marketplace add epilot-dev/agent-toolkit-for-epilot
```

Then open `/plugins` in Codex and install `epilot-developer`.

### Claude Code

Run these commands inside Claude Code:

```text
/plugin marketplace add epilot-dev/agent-toolkit-for-epilot
/plugin install epilot-developer@agent-toolkit-for-epilot
/reload-plugins
```

### ChatGPT and other MCP clients

ChatGPT does not install marketplace plugins, but it can use the epilot MCP
directly. Add `https://mcp.epilot.io/mcp` as a custom connector
(Settings → Connectors) and authenticate with your epilot account when
prompted. The same URL works in any MCP-capable client.

Direct MCP access provides current documentation, API discovery, and
organization inspection. The skills-based development workflows are available
in Codex and Claude Code.

When the epilot MCP is first used, your agent may ask you to authenticate and
select an organization. Access remains subject to your epilot permissions.

## What it helps with

- Understand epilot entities, relations, journeys, workflows, automation,
  portals, Apps, and integrations.
- Decide whether a requirement belongs in native configuration, an App, or an
  external integration.
- Scaffold and validate Apps with the current epilot CLI and manifest schema.
- Discover current documentation and exact OpenAPI operations through MCP.
- Inspect the connected organization's actual schemas and configuration when
  the task depends on live state.
- Design native-feeling App surfaces with current Volt UI components and tokens.

## How it works

The toolkit keeps stable routing and implementation guidance in focused skills.
Changing platform facts remain in their authoritative sources and are retrieved
only when needed:

| Source | Purpose |
| --- | --- |
| Agent skills | Stable mental models, decision rules, and delivery workflows |
| epilot MCP | Current docs, OpenAPI discovery, schemas, and organization state |
| Volt UI MCP | Current components, props, and design tokens |
| Project files and CLI | The App's actual manifest, code, and validation behavior |

## Repository structure

```text
.
├── .agents/plugins/marketplace.json  # Codex marketplace
├── .claude-plugin/marketplace.json   # Claude Code marketplace
├── .github/                          # CI and contribution templates
└── plugins/
    └── epilot-developer/
        ├── plugin.json                 # portable Agent Plugins 1.0 manifest
        ├── mcp.json                    # portable MCP configuration
        ├── .codex-plugin/plugin.json   # Codex manifest
        ├── .claude-plugin/plugin.json  # Claude Code manifest
        ├── .mcp.json                   # Codex and Claude MCP configuration
        └── skills/
            ├── epilot-platform-guide/
            ├── build-epilot-app/
            ├── integrate-with-epilot/
            └── epilot-interface-designer/
```

## Prerequisites

- A supported coding agent
- Node.js 22 or newer for local validation and the Volt UI MCP package
- An epilot account for organization-specific MCP operations

Documentation and API discovery may be available without organization access;
organization-specific inspection depends on authentication and permissions.

## Development

Node.js 22 or newer is required. The toolkit itself has no installed package
dependencies.

```bash
npm run check
npm run inspect:app -- /path/to/an/epilot-app
```

The app inspector is a fast local preflight. The epilot CLI remains
authoritative for platform validation:

```bash
npx @epilot/cli app validate
npx @epilot/cli app deploy --dry-run
```

## Source policy

Skills contain decision guidance and compact source maps, not copied platform
manuals. For changing behavior, prefer current epilot docs through MCP or
<https://docs.epilot.io/>, current CLI help, manifest schemas, and the
executable project itself. App scaffolds intentionally do not copy toolkit
skills into generated repositories.

## Contributing and support

See [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request and
[SUPPORT.md](SUPPORT.md) for the appropriate support channel. Report security
issues privately according to [SECURITY.md](SECURITY.md).

## License

Licensed under the [Apache License 2.0](LICENSE). See [NOTICE](NOTICE) for
attribution and trademark information.
