# Development and delivery

## Local loop

1. Install dependencies using the package manager selected by the scaffold.
2. Run the project build and tests.
3. Use `npx @epilot/cli app dev` for the current component when it must run in
   a real epilot iframe and organization context.
4. Run the bundled inspector and `npx @epilot/cli app validate`.

The local standalone preview is useful for component states, but it does not
prove App Bridge, organization data, permissions, options, or host sizing.

## Pre-deployment evidence

Run, in this order:

```bash
npm run build
node <plugin-skill>/scripts/inspect-epilot-app.mjs .
npx @epilot/cli app validate
npx @epilot/cli app deploy --dry-run
```

Adapt the build command to the project. A dry run is read-only evidence, not a
deployment authorization.

## Live actions

Before live deploy or install, identify the authenticated user, organization,
environment, App, and version. Reauthenticate when necessary without exposing
the token. Explain what the sync will add, update, or delete.

When a deploy creates a new version (`--new-version`, or automatically because
the latest version is public and locked), you can optionally pass a short
changeset description with `--changelog "<what changed>"` (max 250 characters).
The deploy works without it, but providing one is recommended: it is stored on
the version and shown in the App's version list. Derive it from the actual
diff, not a generic phrase.

After an authorized deployment, verify the actual surface:

- entity capabilities on an appropriate schema and record;
- custom pages in navigation;
- journey blocks in Journey Builder;
- portal blocks in the target portal;
- flow actions in the flow builder;
- scheduled functions and failures in App Insights.

Marketplace review is a separate external submission. Do it only when
explicitly requested and after documentation, security, accessibility, and
visual QA are complete.

Current CLI reference: <https://docs.epilot.io/docs/apps/cli/>.
