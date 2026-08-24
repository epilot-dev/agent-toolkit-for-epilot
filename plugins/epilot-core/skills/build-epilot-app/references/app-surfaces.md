# Choosing an App surface

Start from where the capability belongs in the user journey, not from a
component type name. Confirm current availability with epilot docs or CLI help.

| Desired outcome | Typical App primitive |
|---|---|
| Tab, group, or compact widget on an entity detail page | `CUSTOM_CAPABILITY` |
| Dedicated page in epilot navigation | `CUSTOM_PAGE` |
| Interactive element inside a journey | `CUSTOM_JOURNEY_BLOCK` |
| Widget inside a customer portal | `CUSTOM_PORTAL_BLOCK` |
| Call an external endpoint from a flow | external `CUSTOM_FLOW_ACTION` |
| Run epilot-hosted logic from a flow | workflow function plus its flow-action component |
| Run bounded work on a schedule | scheduled App function |
| Call an external API without exposing credentials to browser code | `API_PROXY` |
| Change supported portal behavior through remote hooks | `PORTAL_EXTENSION` |
| Supply products from an external catalog | `EXTERNAL_PRODUCT_CATALOG` |

One App may contain several cohesive components. Split Apps when their
installation audience, permissions, lifecycle, or ownership differs.

## Scaffolding

Use the CLI so its templates and manifest schema remain current:

```bash
npx @epilot/cli app init <app-name>
npx @epilot/cli app add-component <component-name> --type <TYPE>
npx @epilot/cli app add-function <function-name> --type workflow
npx @epilot/cli app add-function <function-name> --schedule "rate(30 minutes)"
```

Do not hand-create a replacement template when the CLI supports the requested
primitive. A generated App intentionally has no `SKILL.md`; this plugin supplies
the reusable guidance. Use `npx @epilot/cli app --help` and current docs when
flags differ.

Authoritative pages:

- <https://docs.epilot.io/docs/apps/components/overview/>
- <https://docs.epilot.io/docs/apps/cli/>
- <https://docs.epilot.io/docs/apps/app-manifest/>
