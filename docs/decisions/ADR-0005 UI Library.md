---
tags: [adr, ui]
status: accepted
date: 2026-10-26
---

# ADR-0005 UI Library

## Context
Need an accessible component set that fits Tailwind v4, React Hook Form, dark mode, and admin needs (tables, dialogs, sidebars).

## Decision
shadcn/ui 4.x on Base UI (default since July 2026), style `base-nova`, base color `neutral`, CSS variables for theming. Companions: `lucide-react` icons, `sonner` toasts, TanStack Table, `next-themes`.

## Alternatives (weekly npm downloads, Oct 2026)
- HeroUI 3 (~0.5M): polished, React Aria based, but smaller community and its own form layer.
- Mantine 9 (~1.7M): large catalog, but its own styling system competes with Tailwind and its own form lib duplicates RHF.
- Chakra 3 (~1M): runtime CSS, awkward with RSC and Tailwind.
- React Aria Components (~3.3M): best a11y, but unstyled → slower to start.
- MUI 9 (~6M): Material design, CSS-in-JS runtime; wrong fit for a Tailwind project.

## Consequences
- Components are copied into `src/shared/shadcn/ui` (moved from `src/components/ui` on 2026-10-29) and owned; updates are manual via the shadcn CLI. App code uses them only through adapters in `src/shared/ui`.
- Base UI, not Radix: use `render` prop instead of `asChild`; check shadcn docs for Base UI variants when adding components.
