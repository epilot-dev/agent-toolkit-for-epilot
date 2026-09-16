# Development and delivery

## Local loop

1. Install dependencies using the package manager selected by the scaffold.
2. Run the project build and tests.
3. Use `npx @epilot/cli app dev` for the current component when it must run in
   a real epilot iframe and organization context.
4. Run the bundled inspector and `npx @epilot/cli app validate`.

The local standalone preview is useful for component states, but it does not
prove App Bridge, organization data, permissions, options, or host sizing.

Browser components must ship as one self-contained `bundle.js`: inline CSS
and assets (for Vite, `assetsInlineLimit: () => true` inlines models and
images as data URLs). The documented size guidance is 500 KB; a 3D or map
library will exceed it — say so instead of shipping it silently.

## Pre-deployment evidence

Run, in this order:

```bash
npm run build
node <plugin-skill>/scripts/inspect-epilot-app.mjs .
npx @epilot/cli app validate
```

Then confirm who will deploy where: MCP `whoami` (organization, `mcp:write`)
and, only if the CLI is going to deploy, `npx @epilot/cli auth status`
(organization id and token expiry — an expired or other-organization token
fails with a bare `403` on the first App API call). Explain what the sync
will add, update, or delete before running it.

## Deploy through the epilot MCP

There is no curated MCP tool for Apps; deployment uses the generic route
(`search_api_operations` → `describe_api_operation` → `call_api_operation`,
service `app`). The sequence below is what the CLI does internally, so
`manifest.json` stays the source of truth: write the resulting `app_id` and
version back into it afterwards.

One step needs a shell: the presigned S3 upload. `createBundleUploadUrl`,
`createZipUploadUrl`, and `createLogoUploadUrl` return `PUT` URLs (valid 30
minutes); upload with
`curl -X PUT -H "Content-Type: application/javascript" --data-binary @dist/bundle.js "<upload_url>"`.
`CUSTOM_PAGE`-style directory artifacts must be zipped locally first.

### New App

1. `createConfiguration` — `{ name, description: { de, en }, category }` from
   the manifest. Returns `app_id`; the platform creates version `0.0.1`
   automatically (`listVersions` shows it with no components).
2. `createBundleUploadUrl` — path `appId`, body
   `{ version: "0.0.1", component_id: "<manifest component id>" }`. Use the
   manifest's component `id` verbatim: the same value must be used here and
   when registering the component, or the bundle lands under a different
   path than the component points to. Returns `upload_url` and
   `component_url` (`https://cdn.app.sls.epilot.io/<app_id>/<version>/<component_id>/bundle.js`).
3. `PUT` the bundle to `upload_url`; a `GET` on `component_url` must return
   the file before continuing.
4. `createComponent` — path `appId` + `version`, body is the manifest
   component without `assets` and `_dir`, with `configuration.component_url`
   set to the URL from step 2. A journey block's configuration is
   `{ component_url, component_tag, component_args }`; the response echoes it
   plus a read-only `component_size`.
5. `install` — path `appId`, body `{ version: "0.0.1" }`. Until this runs the
   App is invisible in Journey Builder, entity pages, and portals. Check the
   response's `installer_org_id` against `whoami`.
6. Write `app_id` and the version into `manifest.json`.

Functions, permission grants, and a blueprint reference go on the version
with `patchVersion` (`functions[].code` is the built handler source). The
CLI additionally provisions a developer-organization role for manifest
`permissions` through a non-public operation; for an App that needs
permissions, tell the user before choosing the MCP route.

### Existing App

- `getConfiguration` → `latest_version`, `public_versions`. If the latest
  version is public (locked) or a new version is wanted, `cloneVersion`
  (patch bump) and target the clone. `cloneVersion` is refused while
  development mode is on; `patchMetadata` `{ "dev_mode": false }` clears it.
- `patchMetadata` for name, description, category, `logo_url_key`.
- Per component: `createBundleUploadUrl` + `PUT`, then `patchComponent` with
  the new `component_url` (or `createComponent` for a component new in this
  version). Remove components no longer in the manifest with
  `deleteComponent`, as the CLI does on every deploy.
- Re-sync the installation with `patchInstallation` `{ version }` (or
  `promoteVersion`). Re-syncing disables the installation until an admin
  saves the App's configuration in epilot (Settings → Apps) — say so.

### Nested shapes `describe_api_operation` does not expand

Copy them from an installed App: `listInstallations` →
`apps[].components[].configuration`. `component_args` entries carry `key`,
`label` and `description` as `{ de, en }`, `required`, and a `type` of
`text`, `boolean`, `enum` (`options[{ id, label }]`, `isMulti`) or
`block_reference` (`allowed_types`).

## Deploy with the CLI

`npx @epilot/cli app deploy` runs the same synchronization from
`manifest.json` when the CLI is logged in to the target organization. Use
`--dry-run` first; `--new-version` forces a clone, and `--changelog "<what
changed>"` (max 250 characters) stores a description on the version — derive
it from the actual diff. Do not run `app deploy --help` inside an App
directory: current CLI versions execute the deploy instead of printing help.
The CLI re-syncs an existing installation but does not install a new App;
install it explicitly (MCP `install` or the installation view in epilot).

## Wire the component into its surface

- **Journey block**: a step embeds an installed App's block as an
  `AppBlockControl` element whose options carry `appId`, `componentId`,
  `bundleURL` (= `component_url`), `tagName` (= `component_tag`) and the App
  `name`, with the block name as an `object` property in the step schema.
  The verified shape is in
  `build-epilot-journey/references/journey-blocks.md`; use `get_journey` and
  `update_journey` to place it. `bundleURL` is pinned to a version, so a new
  App version means updating every journey that embeds the block
  (`get_config_impact`, type `app`).
- **Entity capability**: the capability's `allowed_schemas` decide where it
  appears; open a record of that schema to verify.
- **Portal block / flow action / scheduled function**: verify in the target
  portal, the flow builder, and App Insights respectively.

## After deployment

Verify the actual surface, not the API response alone:

- entity capabilities on an appropriate schema and record;
- custom pages in navigation;
- journey blocks in Journey Builder and in a rendered journey step;
- portal blocks in the target portal;
- flow actions in the flow builder;
- scheduled functions and failures in App Insights.

Marketplace review is a separate external submission. Do it only when
explicitly requested and after documentation, security, accessibility, and
visual QA are complete.

Current CLI reference: <https://docs.epilot.io/docs/apps/cli/>.
