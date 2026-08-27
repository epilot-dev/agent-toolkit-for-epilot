# Journey design conventions

A journey is a customer-facing funnel, not a form dump. These conventions are
what the Journey Builder's own scaffold and well-performing production
journeys encode. Follow them unless the user explicitly wants otherwise, and
run the checklist before handing a journey over.

## Flow

- **Fewest steps that respect topic boundaries.** One topic per step —
  product choice, address, personal data, review — and no step with a single
  trivial field. Three to six steps is the healthy range for most funnels.
- **Value before effort.** Open with the step that shows the offer or lets
  the customer make the choice they came for (product, tariff, availability).
  Ask for personal data as late as possible — contact details belong on the
  last data step, right before confirmation. Every field the customer types
  before seeing value costs conversion.
- **Always end with a confirmation step** (`ConfirmationMessageControl`):
  thank the customer, say what happens next and when, and hide the stepper on
  it. The submit action (`SubmitAndGoNext`) belongs on the step before it.
- **Progressive disclosure over long steps.** Prefer journey logics that show
  a block only when relevant (for example the installation section only when
  "with installation" was chosen) to steps that ask everyone everything.

## Navigation

- Every step gets an `ActionBarControl` with `hideNextButton: true` on the
  step — one navigation system, not two.
- CTA labels name the action, never "Weiter" on the final step: "Absenden",
  "Kostenpflichtig bestellen" (legally required wording for orders with
  payment obligation in Germany), "Angebot anfordern".
- Show the back button (`goBackButton.isVisible: true`) on every step except
  the first and the confirmation; going back must never lose entered data
  (the platform preserves it — just do not hide the button).
- Keep `stickyOnMobile: true`; the majority of journey traffic is mobile.
- Show the stepper (`showStepper: true`) on multi-step journeys so customers
  see progress; hide it on the confirmation step.

## Content and language

- Write in the customer's language; for the German market use the du/Sie
  register the organization uses elsewhere — check an existing journey's copy
  with `get_journey_definition` and match it. Never mix registers.
- Step names are short nouns ("Kontaktdaten", "Ihr Tarif"), not sentences.
- Ask only for data the organization will use. Every field needs a consumer:
  a mapping, an automation, or a human process. If nothing consumes it, drop
  the field.
- Confirmation text states what was received and what happens next
  ("Wir melden uns innerhalb von 2 Werktagen") — a concrete promise beats a
  generic thank-you.

## Visual design

- Always attach the organization's design (`settings.designId`) — it carries
  brand colors, typography, and logo. `create_journey` falls back to the
  organization design automatically; only override it deliberately.
- Designs are managed with the MCP directly: `list_designs` / `get_design`
  to pick and inspect, `create_design` for a new brand look (a palette is
  enough — typography is inherited from the default design), `update_design`
  for changes. A design is shared configuration: changing one restyles every
  journey and portal that uses it, so check `get_config_impact` (type
  `designbuilder`) first. Journey-specific fine-tuning (accent and link
  colors, font scale, custom CSS) lives in the design's `design_tokens`.
- Choose the layout per step: `MainContentCartLayout` only where a cart or
  summary belongs next to the content (product and checkout steps);
  `MainLinearLayout` everywhere else.
- Respect the design system: no per-block color or font overrides when the
  design already defines them. If the design itself is wrong, fix the design
  in epilot 360, not the journey.

## Quality checklist

Before declaring a journey done, verify:

1. Steps follow value-before-effort; contact data is on the last data step.
2. Every step has exactly one ActionBar; the final data step submits; the
   back button shows everywhere except first and confirmation steps.
3. Wiring is clean: the curated tools' validation passes without warnings.
4. Confirmation step exists, hides the stepper, and makes a concrete promise.
5. Copy register matches the organization's other journeys; CTA labels name
   actions; the payment-obligation wording is used where legally required.
6. `settings.runtimeEntities` matches what submissions should create; the
   journey stays `isActive: false` until reviewed.
7. Check impact before changing shared configuration: `get_config_impact`
   on the journey, and on any email template, product, or automation you
   touched along the way.
