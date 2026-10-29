---
tags: [spec, home, architecture]
status: draft
date: 2026-10-29
---

# Home Page Design (draft)

Status: **brainstorming paused, not approved.** Everything under "Decided" was agreed with the owner in chat on 2026-10-28/29. "Open" lists what still has to be discussed before the spec is approved and turned into a plan (superpowers `writing-plans`).

Related: [[Home Page Handoff]] (visual contract), [[Data Model]], [[Rendering Strategy]], [[ADR-0005 UI Library]], [[ADR-0007 Testing]].

## Intent

Implement the approved home page design on top of the existing database layer, as a learning exercise in Next.js 16. The page must be fully indexable by search engines and keep the design's reveal animation for users.

## Scope

- Home page (`/[locale]`) per [[Home Page Handoff]].
- **Included now:** localization (next-intl, `[locale]` segment, 8 locales) and theme (next-themes, dark/light/system), together with the header menus.
- **Delivery:** step by step, one functionality at a time, each step ending green (tests, lint, types, build). Not everything at once.
- Out of scope: About, Projects, Blog, Contact pages; admin; uploading the photo and CV to Blob.

## Decided

### Folder structure (adapted Feature-Sliced Design)

```
src/
├─ app/        Next routes only: page/layout/loading/error/not-found, metadata, generateStaticParams; providers in app/_providers
├─ views/      page compositions ("pages" layer, renamed: src/pages would be picked up by the Next Pages Router)
├─ widgets/    large page blocks: header, hero, contacts, about, experience, skills, blog, footer
├─ features/   concrete business UI: experience card, post card, skills explorer, locale menu, theme menu
├─ shared/
│  ├─ ui/      our components and adapters over shadcn (own API)
│  ├─ shadcn/  generated shadcn components (moved from src/components/ui), private to shared/ui
│  └─ lib/     utilities: cn, locales, rich text (moved from src/lib)
├─ db/         schema, queries, seed: infrastructure outside the layers (unchanged)
├─ actions/    Server Actions, outside the layers, no import-order rules
└─ schemas/    Zod schemas shared by forms and actions, outside the layers, no import-order rules
```

- **Layer roles** (owner's definition): views = frames; widgets = large blocks (e.g. the whole Experience block: header, cards, carousel, "All experience"); features = concrete implementations of business logic (e.g. the experience card); shared = reusable, no business meaning (e.g. the tile).
- No `entities` layer: business cards live in features (owner's choice).
- **Import rule:** a layer imports only from layers below it. No feature → feature, no widget → widget imports.
- **No barrel `index.ts` files.** Import directly from component files. Reason: a barrel pulls every re-exported module into the importer's module graph, so a client component importing one helper from a barrel drags server-only/DB code with it (build error on `server-only`, or DB code in the browser bundle without it); `next dev` has no tree-shaking, so barrels also slow HMR.
- **Public files rule:** only files in a slice's root are importable from outside (e.g. `features/skills-explorer/SkillsExplorer.tsx`). Internals live in `lib/`, `model/`, `ui/` subfolders and are importable only from inside the slice.
- **Enforcement:** `eslint-plugin-boundaries` v7 in `npm run lint` (Claude's call; Steiger is the official FSD alternative): layer order, public files rule, and `@/shared/shadcn/*` importable only from `shared/ui`. Also: `@base-ui/*` importable only from `shared/shadcn`; features may import `db` only with `import type`; every file in `src/` must belong to a layer (`no-unknown-files`).
- **Naming and code style:** JSX files are PascalCase, components are `FC` arrow functions with props destructured on the first line; see `CLAUDE.md` → Code style (owner's rule, 2026-10-29).
- **Data access:** only views and widgets (Server Components) call `src/db/queries`. Features receive data as serializable props, so they stay testable in Vitest without a database.
- **Next special files** stay in `src/app`. A route file imports its view and re-exports `generateMetadata` / `generateStaticParams` when needed.
- Next.js is unopinionated about project structure and documents "project files outside `app`" as a strategy; the rules above are the explicit additions that keep it safe.

### Server and client components

- Views and widgets are Server Components. `"use client"` only on interactive leaves: skills explorer, carousel, locale menu, theme menu, mobile drawer.
- `"use client"` does not mean client-only rendering: client components are prerendered to HTML on the server and hydrated in the browser. Indexing does not depend on the server/client split.
- Server-rendered content goes into client components through `children` (interleaving), e.g. the carousel receives server-rendered cards.
- File-level rules from Next remain: a `"use client"` file must not export server code; a client component never imports a server component (pass it as `children`/props instead).
- **Deterministic first render:** never choose markup from `window` (width, storage) during render; it causes hydration mismatches. Breakpoint differences are CSS.

### Example: Skills block

```
widgets/skills/SkillsSection.tsx            server: getSkills(locale)
├─ shared/ui/SectionHeader.tsx               server
└─ shared/ui/Tile.tsx                        server, reveal animation
   └─ features/skills-explorer/SkillsExplorer.tsx   "use client": query, domain, show-all state
      ├─ shared/ui/SearchInput.tsx           adapter
      ├─ shared/ui/ToggleGroup.tsx           adapter
      └─ features/skills-explorer/ui/SkillRow.tsx
```

- HTML contains the default top 14 rows (desktop default). On mobile, rows 6–14 are hidden with CSS; both header counts ("Top 5 of N" / "Top 14 of N") are rendered and toggled by breakpoint.
- Indexing the default top is enough; the remaining skills need not be in the HTML (owner's decision).
- Filtering happens in memory on the client. Server-side filtering via `searchParams` was rejected: it would make the page dynamic.

### Rendering, SEO and animation

- Home stays **static** (prerendered at build, served from the CDN), which is server-rendered HTML for crawlers.
- **All animation is CSS only** (the `tokens.css` reveal wipe). Content is never hidden by JavaScript (no `opacity: 0` until an observer fires).
- Fallbacks from the design are kept: without scroll-timeline support tiles are simply visible; `prefers-reduced-motion` disables the wipe.

### shared/ui adapters over shadcn

- Purpose: if the UI library changes, only adapters change.
- Adapters have their **own API in design terms** and their own prop types; Base UI / shadcn types and patterns (`render` prop, compound parts) never leak out.
- Compound components become data: e.g. `Menu` takes `items`, `value`, `onValueChange`.
- An adapter is written only when it gets its first consumer.
- Adapters without state stay Server-Component-compatible (no `"use client"`); the library primitive is the client boundary.
- Expected adapters for the home page:

| Adapter | shadcn underneath | Used for |
|---|---|---|
| Button | Button | pills, round icon buttons, contacts, "Show all"; `href` renders a `next/link` |
| Menu | DropdownMenu + RadioGroup | locale and theme menus |
| Drawer | Sheet | mobile navigation |
| ToggleGroup | ToggleGroup | skill domain chips |
| SearchInput | Input | skill search |

- Own components in `shared/ui` without shadcn: Tile, Chip, SectionHeader, Carousel (CSS scroll-snap, no library).
- `components.json` aliases point to `@/shared/shadcn/ui` and `@/shared/lib`, so `npx shadcn add` writes there.

### Verification to include in the plan

- Bundle: measure client JS with and without an adapter on the same component (bundle analyzer), to confirm adapters add no meaningful weight.
- Lighthouse after layout: the first-screen wipe covers the photo, which is the LCP element.
- Playwright mobile project fails on hydration errors in the console.

## Steps

Small steps, **one step per commit** (owner's decision). Working order, the rest of it still to confirm: structure move → tokens/fonts → i18n routing → theme → header → hero/contacts/about → experience → skills → blog → footer → motion pass. i18n goes before theme because the `[locale]` segment rebuilds the root layout (Claude's call).

1. **Structure move + boundaries lint — done 2026-10-29.** shadcn → `src/shared/shadcn/ui`, `src/lib` → `src/shared/lib`, the temporary data dump → `src/views/home/HomePage.tsx` with a thin `src/app/page.tsx`, `components.json` aliases repointed, `eslint-plugin-boundaries` configured and checked against deliberate violations. `src/db/schema` and `src/db/seed` keep relative imports because drizzle-kit and tsx load them outside Next.
2. **Tokens and fonts — done 2026-10-29.** `src/app/globals.css` uses the palette and extra tokens from `docs/design/home/tokens.css` (shadcn `sidebar`/`chart` variables dropped as unused, Claude's call); the self-referencing `--font-sans` fixed; Geist preloads latin + cyrillic; Japanese falls back to a system font stack (owner's decision, see [[Localization]]). The reveal animation CSS waits for the motion step. Covered by `e2e/design-tokens.spec.ts` (palette in both themes, Geist applied).

## Open (resume here)

1. **Remaining step order** from step 2 on (see Steps).
2. **i18n details:** what `/` does (redirect to `/en` or detect from `Accept-Language`), locale cookie, `NextIntlClientProvider` messages scope for client features, localized metadata and `hreflang`.
3. **Theme details:** the handoff specifies `attribute="class"`, `enableSystem`, `defaultTheme="system"`, icon rendered after mount.
4. From the handoff: mobile menu (Sheet) contents and tablet layout were not designed; what "Learn more" on experience cards points to.
5. TDD per step: which parts get Vitest tests first (duration formatting, skill sorting/filtering, carousel index) and which get Playwright checks.
6. After the questions: write the final spec, run the builder check, get the owner's approval, then `writing-plans`.

## Calls made by Claude (to confirm on approval)

- Folder name `shared/shadcn` (over `shared/components`), `eslint-plugin-boundaries` over Steiger, moving `src/lib` to `shared/lib`.
