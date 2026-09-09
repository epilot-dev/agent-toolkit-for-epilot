# Proven end-to-end process patterns

Generalized from production blueprint solutions. Confirm current mechanics in
docs before relying on exact option names.

## One anchor entity per process

Model a multi-step business process around one anchor entity (typically an
opportunity) rather than one entity per form:

- The first journey submission creates the anchor; every later submission
  maps back onto it via the journey context (the submitted opportunity ID),
  so data accumulates on one record.
- Map workflow progress onto the anchor's status, and add a tag as each
  step completes, so the record alone tells the current state.
- Encode participant roles as `_tags` on a single contact relation instead
  of one attribute per role.

## Journeys capture, mappings write, automations orchestrate

- Keep journeys thin: capture and validate input, show known data read-only
  instead of re-asking for it, and drive per-audience display logic with a
  context parameter so one journey can serve multiple entry points and
  portals instead of maintaining near-duplicates.
- Entity mappings own the submission-to-entity translation. Keep them
  versioned and test them with representative submissions.
- Most automations need only four primitive actions: map entity, send
  email, trigger workflow, and create document. If a design needs more
  exotic actions, first check whether the process model is wrong.
- For branching processes, prefer DECISION tasks inside one workflow (see
  `build-epilot-workflow`); a router automation that starts one of several
  workflows is the fallback when the branches share nothing.

## Portal wiring

Expose workflow steps to customers or installers by enabling the workflow
for the portal and assigning steps to portal-audience placeholders rather
than named users. Verify the result in the actual portal, not only in the
admin view.

## Access control

Grants follow `{domain}:{operation}` with `*` wildcards. Entity grants scope
per schema through `resource` (for example `contact:*`); attribute grants use
`{schema}:{group}:{attribute}`. System `_` metadata fields are always
returned regardless of attribute grants — do not treat attribute permissions
as a way to hide record existence. Grant the narrowest set that lets each
role complete its steps, and test with a user of that role.

## Verification checklist

A process is configured when, in the target organization: the journey
submits; the mapping writes the expected entity state; the automation fires;
the workflow appears with correct assignees; the portal shows the intended
steps; and a user with the intended role — not an admin — can complete the
happy path.
