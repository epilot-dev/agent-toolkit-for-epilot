# Language and skill routing checks

Run these scenarios in fresh chats in every client targeted for release.
Use the plugin's installed copy. Provide only the prompt and stated fixture;
keep the expected behavior out of the model's input. These cases are manual
behavioral checks, not part of `npm run check` and not a record of passed tests.

Record the client/version, model, plugin revision, selected skills, tool calls,
output, and pass/fail for each case. Use fixtures or a test organization, with
no live mutations. Evaluate the observable outcome, not exact wording.

| Case | Prompt and fixture | Expected behavior |
| --- | --- | --- |
| German routing | "Kunden sollen online einen Netzanschluss beantragen. Welche Teile davon können wir direkt in epilot konfigurieren? Bitte nur beraten." | Responds in German; uses the platform guide and configuration guidance as needed; distinguishes native configuration from an App or integration; performs no writes. |
| Journey register | "Entwirf eine neue deutsche Bestätigungsseite im Stil unserer Journey. Nur Text, nichts speichern." Existing copy: "Bitte geben Sie Ihre Kontaktdaten ein." | Uses journey guidance; writes German copy consistently in Sie form; invents no response-time promise; performs no writes. |
| Different output language | "Erstelle drei englische Labels für einen neuen Tarifvergleich. Erkläre deine Auswahl auf Deutsch. Nur Entwurf." | English labels and German explanation; keeps the two language requirements separate. |
| Preserve existing locale | "Improve the wording of this journey; keep its current language and tone. Draft only." Fixture: locale `de-DE`, heading "Dein Tarif", label "Deine E-Mail-Adresse". | German customer copy in du form, even though the request is English; no whole-resource translation and no writes. |
| Preserve identifiers | "Erkläre diese Zuordnung auf Deutsch, ohne sie zu ändern: customer_number -> customer_number; status = active; locale = de-DE." | German explanation; all supplied identifiers and enum values remain byte-for-byte unchanged. |
| Preserve translations | "Ergänze den deutschen Anzeigenamen, ohne andere Sprachen zu verändern. Nur JSON ausgeben." Fixture: `{"name":{"en":"Customer portal","fr":"Portail client"}}`. | Adds `name.de` with a German label and retains the existing keys and values; does not turn the resource into a plugin manifest. |
| Discovery boundary | "Übersetze: The meeting starts tomorrow." | Gives the German translation without activating epilot skills or calling epilot tools. |
| App routing | "Ich brauche ein eigenes Widget auf einer epilot-Entität. Skizziere die Umsetzung, ohne Dateien zu ändern." | Uses App guidance, with interface guidance where useful; responds in German and respects the planning-only scope. |

Packaging checks and these language checks cover different concerns. A passing
manifest validator is not evidence that a model selected the right skill or
preserved the customer's locale.
