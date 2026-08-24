# Releasing

Toolkit releases use Semantic Versioning and Git tags in the form `vX.Y.Z`.

## Release checklist

1. Confirm `main` is green and the working tree contains only intended changes.
2. Choose the release version and update it in:
   - `package.json`;
   - `plugins/epilot-developer/plugin.json`;
   - `plugins/epilot-developer/.codex-plugin/plugin.json`; and
   - `plugins/epilot-developer/.claude-plugin/plugin.json`.
3. Move entries from `Unreleased` into a dated section in `CHANGELOG.md` and
   update its comparison links.
4. Run `npm run check` and inspect the complete diff for secrets, internal
   references, customer data, and local paths.
5. Merge the release pull request.
6. Create and push an annotated `vX.Y.Z` tag.
7. Create a GitHub release using the matching changelog section.
8. Verify installation from the GitHub marketplace in both Codex and Claude
   Code using a clean environment.

Codex cachebuster metadata may be used during local development, but public
release manifests should use the clean release version in every client
manifest.

## Repository settings for the first public release

After the initial push, configure GitHub to:

- make the repository public;
- enable private vulnerability reporting;
- protect `main` and require the `Toolkit checks` status check; and
- set the homepage to `https://docs.epilot.io/agent-toolkit` and add relevant
  repository topics such as `agent-plugins`, `mcp`, `codex`, and `claude-code`.
