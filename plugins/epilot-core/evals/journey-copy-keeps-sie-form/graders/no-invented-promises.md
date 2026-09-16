---
type: llm
---

Judge only the customer-facing confirmation-page copy, not the author's notes or explanations around it.

PASS if the copy is in German, addresses the customer consistently in the formal Sie form (Sie, Ihre, Ihnen), and does not state a concrete response time, deadline, or guarantee that the request did not provide (such as "innerhalb von 24 Stunden" or "in 2 Werktagen"), even if it is labelled as a placeholder. Neutral placeholders like {{Reaktionszeit}} are acceptable.
FAIL if the copy uses the informal du form (du, dein, dir), is not in German, or includes a specific response-time or delivery promise.
