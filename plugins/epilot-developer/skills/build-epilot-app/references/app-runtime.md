# App runtime and data boundaries

## Manifest ownership

`manifest.json` is the declarative source of truth. Preserve identifiers
written by the CLI, keep required translations, and edit component
configuration in the location used by the generated project. Deployment is a
sync, not a merge. Validate exact fields against the manifest `$schema` rather
than a copied example.

Run the inspector before platform validation:

```bash
node scripts/inspect-epilot-app.mjs /path/to/app
```

## Browser surfaces

Components rendered inside epilot communicate with their host using the App
Bridge. Start from the generated component implementation and current App
Bridge docs. Handle initialization failure, visibility changes, content
height, installation options, and absent context as real UI states.

Use data already delivered by the surface context when the documented
contract provides it. Do not add broad API permissions or duplicate network
calls until the current runtime contract shows they are necessary.

## External systems and secrets

Use an `API_PROXY` when browser code must call a credentialed external API.
Keep secret values in installation configuration or epilot environment-secret
facilities, never in the manifest or bundle. Validate the external API's auth,
request, and response contract independently before building UI or mappings
around it.

## Functions

App Functions contain server-side behavior:

- `workflow` functions are invoked through a referencing flow-action
  component and receive the triggering context.
- `scheduled` functions run once per installation on their declared schedule.

Keep work bounded and idempotent. Use checkpoints or pagination for syncs,
classify retryable failures, and avoid assuming an App function has unlimited
runtime. Consult current limits and runtime fields before implementation:
<https://docs.epilot.io/docs/apps/functions/overview/>.

## Permissions

Grant the minimum server-side actions and resources the App actually needs.
Connect permissions to explicit code paths and tests. Treat a 401/403 as an
authentication, environment, installation, or permission diagnosis—not as a
reason to add wildcard grants.
