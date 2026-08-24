# Interface principles

## Match the surface

- Entity capability tab or group: optimize repeated operational work; keep the
  main entity context visible and avoid duplicating information already shown.
- Entity widget: one glanceable status or action, not a miniature full page.
- Custom page: provide page hierarchy, navigation context, filters, and durable
  state for a broader workflow.
- Journey block: optimize the end-customer task, validation, mobile layout,
  localization, and conversion flow.
- Portal block: prioritize self-service clarity, trust, and responsive touch
  targets.
- Configuration UI: use progressive disclosure and explain downstream effects.

## Use the system

- Prefer Volt UI components before custom controls.
- Use semantic color, spacing, typography, and elevation tokens returned by
  Volt UI MCP; do not copy raw values from screenshots.
- Use the icon system already present in the scaffold.
- Preserve the scaffold's style-import and class-prefixing setup.
- Use one clear primary action per local decision area.
- Keep status labels readable without relying on color alone.

## Interaction quality

- Show skeletons for known loading layouts and explicit empty states with a
  next action.
- Keep validation next to the affected field and preserve entered values.
- Include retry and recovery paths for external-system failures.
- Prefer compact, scannable layouts for operational entity work; use more
  guidance for configuration and end-customer experiences.
- Write concise labels in the user's language and test expansion in German.
