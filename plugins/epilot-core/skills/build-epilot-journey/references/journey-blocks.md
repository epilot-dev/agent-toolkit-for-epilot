# Journey block catalog

Verified block shapes, as the Journey Builder emits them. Every block lives
in a step's `uischema` with `type`, `scope`, a UUID `id`, and `options`, plus
a matching key in the step's `schema.properties`.

**The copy-from-existing rule:** this catalog covers the scaffold blocks.
For every other block type (products, addresses, uploads, payment, meter
readings, consents, availability checks, custom App blocks …) read a journey
that already uses it — `search_configuration` with `type: journey`, then
`get_journey_definition` — and adapt the real options object. Block options
are rich and version-dependent; inventing them produces journeys that render
wrong even when the API accepts them.

## ContactControl

Collects customer identity. Typical options:

```json
{
  "mode": "private",
  "requireAge18": false,
  "purposeLabels": ["customer"],
  "fields": {
    "salutation": { "options": ["Mr.", "Ms. / Mrs.", "Other"] },
    "title": { "options": ["Dr.", "Prof.", "Prof. Dr."] },
    "firstName": {},
    "lastName": {},
    "birthDate": {},
    "email": {},
    "telephone": {}
  }
}
```

Only fields present in `fields` render. `purposeLabels` tags the created
contact for GDPR purposes.

## ActionBarControl

The step's navigation. One per step, with `hideNextButton: true` on the step
so default navigation does not double up:

```json
{
  "ctaButton": {
    "label": "Absenden",
    "isVisible": true,
    "actionType": "SubmitAndGoNext",
    "targetStepId": "<stepId of the next step>"
  },
  "goBackButton": { "label": "Zurück", "isVisible": false, "actionType": "GoBack" },
  "showPaper": false,
  "stickyOnMobile": true,
  "stickyOnMobileIndex": 1,
  "halfWidth": false
}
```

`actionType` values seen in production journeys: `SubmitAndGoNext` (submits
the journey and moves on — use on the final data step), `GoNext`, `GoBack`.
Keep `stickyOnMobile: true` so the CTA stays reachable on phones.

## ConfirmationMessageControl

The closing message on the confirmation step:

```json
{
  "icon": "check-circle-fill",
  "showCloseButton": true,
  "title": "Vielen Dank!",
  "text": "Wir haben Ihre Anfrage erhalten. Wir werden uns schnellstmöglich bei Ihnen melden.",
  "closeButtonText": "Zurück zur Website"
}
```

The confirmation step usually hides the stepper entirely:
`showStepper: false`, `showStepperLabels: false`, `showStepName: false`,
`showStepSubtitle: false`, `hideNextButton: true`.
