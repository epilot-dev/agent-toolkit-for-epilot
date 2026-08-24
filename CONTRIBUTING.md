# Contributing

Thank you for helping improve the epilot Agent Toolkit. Bug reports, focused
feature requests, documentation improvements, and pull requests are welcome.

## Before you start

- Search existing issues and pull requests before opening a new one.
- Use a GitHub issue to discuss substantial new skills or architectural changes.
- Report vulnerabilities privately as described in [SECURITY.md](SECURITY.md).
- Follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Development setup

The repository requires Node.js 22 or newer and has no installed runtime
dependencies.

```bash
git clone https://github.com/epilot-dev/epilot-agent-toolkit.git
cd epilot-agent-toolkit
npm run check
```

To inspect an epilot App project with the bundled local preflight:

```bash
npm run inspect:app -- /path/to/an/epilot-app
```

## Contribution guidelines

- Keep skills focused on stable workflows, decision guidance, and source maps.
- Retrieve changing platform facts from epilot documentation, OpenAPI, schemas,
  CLI behavior, or MCP instead of copying large manuals into skills.
- Keep customer, organization, credential, and environment data out of the
  repository, tests, screenshots, and examples.
- Keep Lima, SAP, and other vendor-specific ERP behavior out of the core
  `epilot-developer` plugin. Those integrations belong in optional plugins.
- Add or update tests when behavior changes.
- Keep Codex, portable Agent Plugins, and Claude metadata consistent.

## Pull requests

Before opening a pull request:

1. Run `npm run check`.
2. Review the diff for secrets, internal URLs, customer identifiers, and local
   filesystem paths.
3. Update `CHANGELOG.md` for user-visible changes.
4. Explain the problem, the chosen boundary, and how the change was verified.

Unless explicitly stated otherwise, contributions submitted for inclusion are
licensed under the Apache License 2.0 according to its contribution terms.
