# Visual and interaction QA

Do not treat a successful build as visual verification.

## States

- Loading, empty, populated, long-content, partial-data, error, offline, and
  permission-denied states render intentionally.
- Async actions prevent accidental duplicates and expose progress.
- Errors explain what happened, what was preserved, and what the user can do.

## Accessibility

- Keyboard-only navigation reaches and operates every action.
- Focus order follows the visual order and focus remains visible.
- Controls have programmatic names; errors and status changes are announced.
- Text and UI contrast meet WCAG AA; meaning is not color-only.
- Modal focus is trapped and restored; destructive actions use an appropriate
  confirmation pattern.

## Host behavior

- Verify iframe height and scrolling in the real epilot surface.
- Verify narrow and wide layouts, zoom, and long German translations.
- Verify realistic entity fields, permissions, installation options, and
  external-system latency.
- Check the browser console in the component's iframe context when applicable.

Capture screenshots for the key states when handing off material UI work.
