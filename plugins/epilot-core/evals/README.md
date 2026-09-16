# Behavioral checks for epilot-core

This directory holds the plugin's behavioral test suite: realistic prompts,
the expected routing and language behavior, and graders that score what the
model produced. It complements `npm run check`, which validates packaging
only. A passing manifest validator is not evidence that a model selected the
right skill or preserved the customer's locale.

The cases are client-neutral. Claude Code runs them automatically with
`claude plugin eval`; for Codex and ChatGPT, run the same prompts by hand
using the table below. No client loads this directory into model context.

## Run automatically (Claude Code)

Requires Claude Code 2.1.269 or later. Every run is a real model call on your
account. Run from the plugin root:

```bash
cd plugins/epilot-core
claude plugin eval . --no-publish --threshold 0.8 --max-cost-usd 20
```

Each case runs three times with the plugin and three times without it, so the
summary shows what the plugin contributed (`Δ`). A full run of the current
suite is about 30 agent runs and roughly 6 USD.

Useful variants:

```bash
# one case, one run, no baseline: cheap iteration on a grader or description
claude plugin eval . --case routes-custom-widget-to-app --runs 1 --ablation none

# keep each run's transcript for inspection
claude plugin eval . --keep-temp
```

Results land in `results/<timestamp>/` with `aggregate-result.json` and a
self-contained `report.html`. The `results/` directory is ignored by git.

### Mocks

`mocks/epilot/` answers the epilot MCP tools `search_docs`, `fetch_doc`,
`search_configuration`, and `whoami` with fixed text, so runs never contact a
live organization. The Volt UI server has no mock and is not started. Pass
`--allow-real-servers` only when you deliberately want live tool access.

### Reading the result

- `tool_used: Skill` graders are indicators, not scored, in a two-arm run.
  They tell you whether the plugin's skill fired on natural phrasing.
- A `Δ` near zero with the skill indicator passing means the model already
  handles the prompt well; the plugin's value is consistency and routing.
- A failing skill indicator is usually a `description` problem in the skill's
  `SKILL.md`. Adjust the description and re-run the same case.

## Cases

| Case | Prompt (fixture) | Expected behavior |
| --- | --- | --- |
| `routes-business-outcome-to-configuration` | "Customers should be able to request a heat pump inspection on our website, and every new request should automatically create a task for our sales team. What do we set up in epilot for this? Advice only." | Uses `configure-epilot` or `epilot-platform-guide`; proposes a journey plus an automation or workflow; no App; no writes. |
| `routes-custom-widget-to-app` | "Ich brauche ein eigenes Widget auf einer epilot-Entität, das Daten aus unserem internen System anzeigt. Skizziere die Umsetzung, ohne Dateien zu ändern." | Uses `build-epilot-app`; answers in German; frames the solution as an App (manifest, entity surface, CLI deployment); creates no files. |
| `routes-erp-sync-to-integration` | "Our ERP needs to receive every new order created in epilot and later push the invoice status back onto that order. We don't want to build an epilot App. How should we wire this?" | Uses `integrate-with-epilot`; outbound and inbound mechanism; mentions idempotency, retries, or a correlation key; no App. |
| `journey-copy-keeps-sie-form` | "Entwirf eine neue deutsche Bestätigungsseite im Stil unserer Journey. Nur Text, nichts speichern." Existing copy: "Bitte geben Sie Ihre Kontaktdaten ein." | Uses journey guidance; German copy consistently in Sie form; no invented response-time promise; no writes. |
| `ignores-unrelated-translation` | "Übersetze: The meeting starts tomorrow." | Translates directly without activating any epilot skill or tool. |

## Manual checks for other clients

Run these in fresh chats in every client targeted for release, using the
plugin's installed copy. Provide only the prompt and stated fixture; keep the
expected behavior out of the model's input. Record the client and version,
model, plugin revision, selected skills, tool calls, output, and pass/fail.
Use fixtures or a test organization, with no live mutations. Evaluate the
observable outcome, not exact wording.

Run the five cases above, plus these language cases that are not yet
automated:

| Case | Prompt and fixture | Expected behavior |
| --- | --- | --- |
| German routing | "Kunden sollen online einen Netzanschluss beantragen. Welche Teile davon können wir direkt in epilot konfigurieren? Bitte nur beraten." | Responds in German; uses the platform guide and configuration guidance as needed; distinguishes native configuration from an App or integration; performs no writes. |
| Different output language | "Erstelle drei englische Labels für einen neuen Tarifvergleich. Erkläre deine Auswahl auf Deutsch. Nur Entwurf." | English labels and German explanation; keeps the two language requirements separate. |
| Preserve existing locale | "Improve the wording of this journey; keep its current language and tone. Draft only." Fixture: locale `de-DE`, heading "Dein Tarif", label "Deine E-Mail-Adresse". | German customer copy in du form, even though the request is English; no whole-resource translation and no writes. |
| Preserve identifiers | "Erkläre diese Zuordnung auf Deutsch, ohne sie zu ändern: customer_number -> customer_number; status = active; locale = de-DE." | German explanation; all supplied identifiers and enum values remain byte-for-byte unchanged. |
| Preserve translations | "Ergänze den deutschen Anzeigenamen, ohne andere Sprachen zu verändern. Nur JSON ausgeben." Fixture: `{"name":{"en":"Customer portal","fr":"Portail client"}}`. | Adds `name.de` with a German label and retains the existing keys and values; does not turn the resource into a plugin manifest. |

## Adding a case

Create `evals/<case-name>/prompt.md` with the prompt as a user would type it,
never naming the skill, and one grader per file under `graders/`. Pair one
grader on the result (`llm` rubric or `regex`) with one on how the model got
there (`tool_used: Skill`). Prefer `regex` for long output and short concrete
PASS/FAIL rubrics for `llm` graders. Add the case to the table above so the
manual script for other clients stays complete.
