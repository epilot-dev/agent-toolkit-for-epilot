# Agent Toolkit for epilot

[![Validate](https://github.com/epilot-dev/agent-toolkit-for-epilot/actions/workflows/validate.yml/badge.svg)](https://github.com/epilot-dev/agent-toolkit-for-epilot/actions/workflows/validate.yml)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![Agent Plugins 1.0](https://img.shields.io/badge/Agent%20Plugins-1.0-4C4CFF.svg)](https://agent-plugins.org/)

Give AI agents the platform knowledge and live tools they need to build Apps
and integrations on epilot and to configure the platform end to end.

The plugin appears as **epilot** and keeps `epilot-core` as its stable
technical identifier. It combines portable platform
knowledge with live tools:

- epilot MCP for current documentation, OpenAPI discovery, entity schemas, and
  connected-organization configuration;
- Volt UI MCP for current components, props, and design tokens;
- a thin platform guide plus focused skills for Apps, integrations,
  end-to-end platform configuration, journey building, and native epilot
  interface design;
- a deterministic local inspector for epilot App manifests and build inputs.

The toolkit intentionally excludes Lima, SAP, and other ERP-specific behavior.
Vendor implementations belong in separately installable plugins.

## Quick start

### Codex

Add this repository as a marketplace:

```bash
codex plugin marketplace add epilot-dev/agent-toolkit-for-epilot
```

Then open `/plugins` in Codex and install `epilot-core`.

### Claude Code

Run these commands inside Claude Code:

```text
/plugin marketplace add epilot-dev/agent-toolkit-for-epilot
/plugin install epilot-core@agent-toolkit-for-epilot
/reload-plugins
```

### ChatGPT

ChatGPT and Codex support plugins, including skills and MCP tools. Local and
Git marketplaces are authoring and team-distribution sources; adding this repo
to Codex does not publish it to a ChatGPT workspace or the universal directory.
For desktop testing, use a personal or repository marketplace. For workspace
distribution, use the workspace's supported import or publishing flow. Public
distribution requires submission and review by OpenAI.

See [OpenAI's plugin packaging guide](https://developers.openai.com/plugins/build/plugins)
for current installation and distribution steps. This repository is the source
package; it does not imply a published ChatGPT listing.

Both MCP servers are hosted over HTTPS: the epilot MCP at
`https://mcp.epilot.io/mcp` and the Volt UI MCP at
`https://volt-ui.epilot.io/api/mcp`. Neither requires a local process, so they
work in sandboxed surfaces such as Claude Cowork and ChatGPT. Only the App
inspector needs a local Node.js environment.

### Other MCP clients

Connect `https://mcp.epilot.io/mcp` in an MCP-capable client and authenticate
when prompted. Optionally add `https://volt-ui.epilot.io/api/mcp` for Volt UI
components and design tokens. Direct MCP access provides documentation, API
discovery, organization tools, and design-system lookups; it does not install
this package's skills. Available tools remain subject to the client's
capabilities and your epilot permissions.

When the epilot MCP is first used, your agent may ask you to authenticate and
select an organization. Access remains subject to your epilot permissions.

Access level is chosen on the epilot login screen when the connection is
approved: **read-only is preselected**, and read-and-write is an explicit
choice. To change it later, re-authenticate the connection and choose again.
For setups that must never write, connect the server as
`https://mcp.epilot.io/mcp?access=read` — that URL is enforced read-only
regardless of the approved consent.

## What it helps with

- Understand epilot entities, relations, journeys, workflows, automation,
  portals, Apps, and integrations.
- Decide whether a requirement belongs in native configuration, an App, or an
  external integration.
- Configure schemas, journeys, products and pricing, workflows, automations,
  portals, and permissions end to end.
- Build workflows with phases, conditional branches, retry loops, and
  automated steps from a compact process description.
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
    └── epilot-core/
        ├── plugin.json                 # portable manifest + OpenAI listing metadata
        ├── mcp.json                    # portable MCP configuration
        ├── .codex-plugin/plugin.json   # Codex manifest
        ├── .claude-plugin/plugin.json  # Claude Code manifest
        ├── .mcp.json                   # Codex and Claude MCP configuration
        └── skills/
            ├── epilot-platform-guide/
            ├── build-epilot-app/
            ├── integrate-with-epilot/
            ├── configure-epilot/
            ├── build-epilot-journey/
            ├── build-epilot-workflow/
            └── epilot-interface-designer/
```

## Language support

Skills are maintained in English and instruct the agent to respond in the
user's language. Customer-facing copy follows the requested audience or the
existing resource's locale, including consistent German du/Sie usage.
API identifiers, schema keys, enum values, and commands are not translated.

The plugin listing and friendly skill labels currently use English, while the
brand remains **epilot**. The portable manifest has no standard locale map;
do not add invented `en`/`de` objects to string fields or assume automatic
listing translation. Each skill's `agents/openai.yaml` supplies its display
name, short description, and starter prompt.

Before a release, run the [language and routing checks](tests/language-and-routing.md)
in the intended client. Structural checks do not establish model behavior.

## Prerequisites

- A supported coding agent
- Node.js 22 or newer for local validation and the App inspector
- An epilot account for organization-specific MCP operations

Documentation and API discovery may be available without organization access;
organization-specific inspection depends on authentication and permissions.

## Development

Node.js 22 or newer is required. Skill validation also needs Python 3.9+
and the pinned development dependency in `requirements-dev.txt`. These are
maintainer checks; installing the plugin does not require PyYAML.
The toolkit has no installed JavaScript package dependencies.

```bash
python3 -m pip install -r requirements-dev.txt
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
