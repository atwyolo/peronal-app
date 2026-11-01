---
tags: [architecture, i18n]
updated: 2026-11-01
---

# Localization

Two layers, two mechanisms:

1. **UI strings** (nav, buttons, labels, validation messages): `next-intl`, one JSON file per locale in `messages/`, routed via `src/app/[locale]/`.
2. **Content** (projects, posts, bio): translation tables in Postgres, see [[Data Model]].

## Locales

`en` (default and fallback), `ru`, `pt`, `es`, `de`, `fr`, `ja`, `pl`.

Chosen for job-market relevance: markets where the local language matters in hiring (DACH, France, Spain/LatAm, Brazil, Japan, Poland). English covers NL, Nordics, Israel, India, Singapore. Candidates for later: `it`, `nl`, `ko`, `zh`.

## Rules

- Adding a locale = one config entry + one messages file. Content may stay untranslated; fallback to `en` keeps pages whole.
- URL prefix for every locale, including the default (`/en/...`), to keep routing uniform and caching simple.
- `lang` attribute and `hreflang` alternates come from the locale segment.
- Dates/numbers formatted with `Intl` through `next-intl` helpers, never by hand.
- A path without a locale (`/`, `/blog`) is redirected by `src/proxy.ts`: `NEXT_LOCALE` cookie first, then `Accept-Language`, then `en` (owner's decision, 2026-10-29). An unknown locale (`/xx`) is treated as a path and ends in a 404 under `/en/xx`.
- `NEXT_LOCALE` is set only when the visitor picks a locale other than their browser language, and lives one year (owner's decision; see the privacy item in [[Open Questions]]).
- `messages/en.json` is the only complete messages file. Other locales contain only translated keys; `src/shared/lib/i18n/request.ts` deep-merges them over English, empty strings count as missing.
- The locale is read from the root `[locale]` segment through `next/root-params` (next-intl's recommended setup with Cache Components), so every locale is prerendered.
- A language switch is client navigation with `router.replace`, not a full load: the root layout remounts, module state survives, attributes set on `<html>` by hand are cleared, and the old locale leaves no history entry (measured 2026-11-01).
- Config lives in `src/shared/lib/i18n/`: `routing.ts`, `request.ts`, `navigation.ts` (locale-aware `Link`, `useRouter`), `app-config.d.ts` (typed locales and message keys).

## Fonts
- Geist / Geist Mono cover latin, latin-ext and cyrillic: every locale except `ja`. Preloaded subsets: latin + cyrillic; the rest load on demand via `unicode-range`.
- `ja` uses the platform's Japanese UI font through a system stack (`--font-ja-system` in `src/app/globals.css`): Hiragino on Apple, Yu Gothic / Meiryo on Windows, Noto Sans CJK on Android. Chosen over Noto Sans JP via `next/font` to avoid a heavy CJK webfont (owner's decision, 2026-10-29).

Related: [[ADR-0003 Content Localization]]
