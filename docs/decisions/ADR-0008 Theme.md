---
tags: [adr, theme]
status: accepted
date: 2026-10-29
---

# ADR-0008 Theme

## Context
Dark, light and system themes (see [[Home Page Handoff]]), class strategy for Tailwind (`.dark` tokens in `src/app/globals.css`), no flash of the wrong theme on static pages. `next-themes` was chosen at kickoff. On 2026-10-29 we found that `next-themes` 0.4.6 (last release March 2025) renders its anti-flash `<script>` inside the React tree, and React 19 reports every `<script>` it creates on the client with a development-only console error: "Encountered a script tag while rendering React component". Production builds do not contain the check; the theme works correctly.

## Decision
Keep `next-themes` 0.4.6 (owner's decision) with a workaround inside our own provider, `src/app/_providers/ThemeProvider.tsx`:
- Settings: `attribute="class"`, `defaultTheme="system"`, `enableSystem`, `disableTransitionOnChange`.
- `scriptProps={{ type: "application/json" }}` on the client only. React skips script data blocks, so it does not report them. The server renders a normal script, which runs before paint; during hydration React reuses that element. next-themes already puts `suppressHydrationWarning` on the script, which covers the `type` difference.
- `<html suppressHydrationWarning>` in the root layout, because the script changes its class and `color-scheme` before hydration.
- The choice is stored by next-themes in `localStorage` (`theme` key); static pages cannot read cookies anyway.

## Alternatives
- `@teispace/next-themes` or `@wrksz/themes`: drop-in replacements that fix the warning, but young packages with few users.
- Own provider (~60 lines: `useServerInsertedHTML` for the script + context): no dependency, kept as the fallback plan if the workaround stops working.
- Filtering `console.error`: hides the symptom globally and is easy to break.

## Consequences
- `ThemeProvider.test.tsx` renders the provider fully on the client (the case where React creates the script) and fails if the error comes back, e.g. after a next-themes or React upgrade.
- `e2e/theme.spec.ts` covers the OS scheme, a stored choice, and the theme being applied with all JS chunks blocked (no flash).
- Revisit if next-themes ships a fix or stays unmaintained when React changes this check again.
