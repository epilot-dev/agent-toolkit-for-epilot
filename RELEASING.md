# Releasing

Toolkit releases use Semantic Versioning and Git tags in the form `vX.Y.Z`.

## Release checklist

1. Confirm `main` is green and the working tree contains only intended changes.
2. Choose the release version and update it in:
   - `package.json`;
   - `plugins/epilot-core/plugin.json`;
   - `plugins/epilot-core/.codex-plugin/plugin.json`; and
   - `plugins/epilot-core/.claude-plugin/plugin.json`.
3. Move entries from `Unreleased` into a dated section in `CHANGELOG.md` and
   update its comparison links.
4. Run `npm run check` and inspect the complete diff for secrets, internal
   references, customer data, and local paths.
5. Merge the release pull request.
6. Create and push an annotated `vX.Y.Z` tag.
7. Create a GitHub release using the matching changelog section.
8. Verify installation from the GitHub marketplace in both Codex and Claude
   Code using a clean environment.
9. Run [language and routing checks](tests/language-and-routing.md) in the
   intended clients and record results for the release revision. Test ChatGPT
   separately when distributing there; local installation is not publication.

For a public OpenAI directory submission, verify the current listing limits
and the applicability of the linked privacy/terms notices to the integration.
The checked-in links are existing epilot notices, not plugin-specific terms.
Submit the remote MCP endpoint with its skills; resolve the local Volt UI
dependency for the intended execution environment before claiming parity.

Keep `plugin.json`'s `extensions.com.openai.interface` and the Codex fallback
in sync. The root extension also supplies `supportURL`; the older compatibility
manifest omits that field for legacy ingestion. `npm run check` checks this
relationship and the portable/compatibility MCP server definitions.

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
