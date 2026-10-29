---
tags: [architecture, i18n]
updated: 2026-10-26
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

## Fonts
- Geist / Geist Mono cover latin, latin-ext and cyrillic: every locale except `ja`. Preloaded subsets: latin + cyrillic; the rest load on demand via `unicode-range`.
- `ja` uses the platform's Japanese UI font through a system stack (`--font-ja-system` in `src/app/globals.css`): Hiragino on Apple, Yu Gothic / Meiryo on Windows, Noto Sans CJK on Android. Chosen over Noto Sans JP via `next/font` to avoid a heavy CJK webfont (owner's decision, 2026-10-29).

Related: [[ADR-0003 Content Localization]]
