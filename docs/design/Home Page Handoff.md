---
tags: [design, handoff, home]
status: approved
updated: 2026-10-28
---

# Home Page Handoff

Approved design of the home page (`/[locale]`), ready to implement. Mobile-first, two themes, eight locales. The design was iterated in a Claude Design canvas; this note is the implementation contract.

Related: [[Roadmap]], [[Rendering Strategy]], [[Localization]], [[Data Model]], [[ADR-0005 UI Library]].

## Files in `docs/design/home/`

| File | What it is | Use |
|---|---|---|
| `screens/home-{mobile,desktop}-{dark,light}.png` | Full-page renders of the approved design (390 px and 1280 px) | Visual reference. The photo tile is blank only because the image did not load in the renderer. |
| `prototype.dc.html` | Source of the interactive prototype | Exact values (sizes, spacing, colors) when a screenshot is ambiguous. Not runnable outside the design tool; the top toolbar (device / theme / replay) is prototype-only. |
| `tokens.css` | Color, radius and font tokens for both themes + the reveal animation | Merge into `src/app/globals.css`. |
| `content.ts` | All copy and data shown on the page, typed | Move to `src/content/home.ts` as the static source until Stage 3. |
| `messages.en.json` | UI strings for next-intl | Merge into `messages/en.json`; other locales start as copies (fallback to `en`). |

## Scope and order

This touches Roadmap stages 1 and 2. Suggested order, each step ending green (`lint`, `tsc`, `build`):

1. Tokens and fonts (`globals.css`, `layout.tsx`), `next-themes` provider. Fix the existing font mismatch: `layout.tsx` defines `--font-geist-sans`, but `@theme` reads `--font-sans`.
2. Header: sticky bar, nav, locale menu, theme menu, mobile menu trigger.
3. Hero + photo + contacts + About (static, server components).
4. Experience: desktop grid, mobile carousel.
5. Skills explorer (client).
6. Blog preview: desktop grid, mobile carousel.
7. Reveal animation, reduced-motion check, accessibility pass.
8. i18n wiring (`[locale]` segment, `generateStaticParams`), locale switcher navigation.

Rendering: home is **static** per locale (see [[Rendering Strategy]]). Everything interactive is a small client leaf; the page itself stays a Server Component.

## Breakpoints and grid

- Base (mobile, designed at 390 px): content padding 16 px, 2-column bento grid, gap 12 px. In practice every tile spans both columns; keep the 2-column grid for future half-width tiles.
- `lg` (≥ 1024 px, designed at 1280 px): container `max-width: 1200px`, side padding 40 px, 4-column grid, gap 16 px.
- 768–1023 px was not designed: use the mobile layout with the container capped at ~720 px and centered.

## Header (sticky, full width)

- Surface `bg-card`, bottom border `card-border`. Height 64 px mobile, 72 px desktop. `position: sticky; top: 0`.
- Left: full name "Mikhail Aleksandrov", 600 weight, 17 px mobile / 20 px desktop, links to `/[locale]`.
- Desktop: nav Home · About · Projects · Blog · Contact (15 px, gap 28 px). Active item: `text-brand`, 600, underline in `deco`, 3 px thick, offset 8 px.
- Right controls, all in `text-brand`:
  - **Locale menu.** Mobile: 44 px round icon button showing the code ("EN"). Desktop: pill button, code + chevron-down.
  - **Theme menu.** Mobile: 44 px round button. Desktop: pill, icon + chevron. The icon shows the *resolved* theme: moon for dark, sun for light.
  - Mobile only: hamburger (44 px round, `text-foreground`). **The open menu was not designed** — use a shadcn Sheet from the right with the same nav items, active item styled as on desktop.
- Menus (both): popover anchored bottom-right, 8 px gap, min-width 210 px, padding 6 px, radius 16 px, `bg-popover`, border `card-border`, soft shadow. Items 40 px tall, radius 10 px, hover `bg-accent`. Selected item: `text-brand` + check icon at the end.
  - Theme items: Dark, Light, System. System shows a mono hint "now dark/light" (`text-muted-foreground`, 11 px).
  - Locale items: native names (English, Русский, Português, Español, Deutsch, Français, 日本語, Polski) with the code as a mono hint.
  - Build with the Base UI menu from shadcn (`DropdownMenu` + `DropdownMenuRadioGroup`). Base UI uses the `render` prop, not `asChild`.
  - Theme: `next-themes` with `attribute="class"`, `enableSystem`, `defaultTheme="system"`. Render the icon only after mount, to avoid a hydration mismatch.
  - Locale: next-intl navigation `router.replace(pathname, { locale })`, keeping the current path.

## Section order

**Mobile:** hero → photo → contacts → About → Experience (carousel) → Skills → Blog (carousel) → footer.

**Desktop:** a 4-column row with the photo and contacts in column 1 and the hero plus About in columns 2–4. Below it: Experience (4 cards), Skills (full width), Blog (featured card spanning 2 columns plus 2 cards), footer.

Section headers: a mono label (`Geist Mono`, 11 px mobile / 12 px desktop, uppercase, letter-spacing .08em, `text-muted-foreground`), with a count on the right where shown. Header padding is 12 px on top for mobile and 32 px for desktop.

### Tile (shared)

`bg-card`, 1 px border `card-border`, radius 20 px (mobile) / 24 px (desktop), padding 16–20 px mobile / 24–36 px desktop, vertical flex with gap 8–16 px. Image placeholders are striped (`placeholder` lines) with a dashed border and radius 14 px.

### Hero

- H1 "Mikhail Aleksandrov": 700 weight, tracking −.04em. Size 36 px with line-height 1 on mobile; 64 px with line-height .95 on desktop.
- Headline: "Senior Frontend Software Engineer, 8+ years", in `foreground-soft`, 16 / 20 px.
- Tag chips (React.js, Redux, Next.js, NestJS, TypeScript, Express): mono 12–13 px, pill, border `card-border`, text `brand`, weight 500. Chips show **colored text only**, no fill, in both themes.

### Photo

Mobile: square (`aspect-ratio: 1`). Desktop: fills column 1 above the contacts, at least 380 px tall. `object-fit: cover; object-position: 50% 12%`. Use `next/image` with `priority`, since it is the LCP element.

### Contacts and CV (stacked, full tile width, gap 12 px)

Compact brand buttons, 56 px tall, radius 16 px, label 17 px / 700:

| Button | Background / text | Left mark | Label | Link |
|---|---|---|---|---|
| WhatsApp | `whatsapp` / `whatsapp-foreground` | 36 px white rounded plate, chat glyph in `whatsapp-icon` | "WhatsApp" | `https://wa.me/37493310039`, title = phone |
| Mail | `gmail` / white | 40 px envelope, red fill, white 2.5 px outline | mailbox name "mikhail.aleksandrov.job" (part before `@`, may wrap at dots on desktop) | `mailto:` |
| LinkedIn | `linkedin` / white | 36 px white plate, "in" glyph in `linkedin` | "LinkedIn" | profile URL |
| Download CV | `primary` / `primary-foreground` | download icon | "Download CV" + mono "PDF" on the right | `/cv/Mikhail_Aleksandrov_CV.pdf` with `download` |

Each button has an arrow-up-right icon on the right (CV: the "PDF" mark) and an `aria-label` from messages. Brand colors are the same in both themes. Icons are generic glyphs, not official logos; swap in brand-kit SVGs (or `simple-icons`) if wanted.

### About

- Label "About", then the lead paragraph: 17 px mobile, 20 px desktop.
- "A few results I'm proud of:" in 600 weight, followed by three bullet items. Each bullet is an 8 px square, radius 2 px, in `deco`.
- Mobile: a secondary pill button "Read more" linking to `/about`.
- Desktop: the extra paragraph from `content.ts` is shown instead, in `foreground-soft`, 16 px / 1.6.

### Experience

- Card content:
  - image placeholder: 140 px tall on mobile, 180 px on desktop;
  - company name: 18 / 20 px, 600;
  - mono period line `MM/YYYY – MM/YYYY · N years`. Compute the duration in years with one decimal and format it with next-intl (`{years, plural, …}`);
  - description of up to 3 sentences: 14 px / 1.5, `foreground-soft`;
  - 3–5 skill tags as chips;
  - "Learn more →" link at the bottom (`mt-auto`).
- Link style, shared with "Read more →" in the blog: `text-brand`, 600 weight, underline in `deco`, 2 px thick, offset 5 px.
- Desktop: a 4-column grid with equal-height cards, then a primary pill "All experience" aligned right below the grid.
- Mobile: a **carousel** (see below), then a full-width primary pill "All experience". The section header has no link.

### Skills (client component `SkillsExplorer`)

- Data comes from `skills` (41 items).
  - Default order: level descending, then the `sort` order, then name.
  - Default view shows the top 5 on mobile and the top 14 on desktop (two full columns of 7).
  - Header count reads "Top 5 of 41" or "Top 14 of 41"; "41 skills" when expanded; "N of 41" when filtered.
- Controls:
  - Search: pill input with a search icon, 44 px, `bg-background`, border `card-border`. Focus ring: `brand` border plus a 3 px glow at 25%. Visually hidden label "Search skills". Matching is a case-insensitive substring.
  - Domain chips: All · Core · Frameworks · Frontend · Tools, each followed by its count in mono at 70% opacity ("All 41", "Core 5", …). It is a single-select toggle group; use the Base UI toggle group from shadcn. Chips are pills, 36 px tall, wrapping onto new lines. The active chip uses `bg-selected text-selected-foreground`.
  - Toggle: a primary pill "Show all 41 skills" / "Show top N", hidden while a search or domain filter is active.
  - Empty state: "No skills match “{query}”."
- Skill row:
  - name: 500 weight;
  - 10-segment bar: segments filled up to the level in `brand`, the rest in `placeholder`; 8 px tall with 3 px gaps on mobile, 10 px tall with 4 px gaps on desktop;
  - mono "n/10" in `muted-foreground`;
  - `role="meter"` with `aria-valuenow`, or an `aria-label` from messages.
- Mobile layout: one tile containing the search, then the chips, then rows (name and value on one line, the bar below), then the toggle.
- Desktop layout: one tile, padding 28 px, grid `280px | 1fr`, gap 40 px.
  - Left: the search, a "Domain" label, the chips (wrapping), the toggle. A 1 px `card-border` divider separates it from the right side.
  - Right: rows in two columns, gap 18 × 40 px. Each row is a grid `150px | 1fr | 44px`.

### Blog preview

- Shows the 3 latest posts. The section header has no controls.
- Post card:
  - date: mono label, formatted with next-intl `format.dateTime`;
  - title (h3): 17–19 px mobile, 18 px desktop; the featured card uses 22 px;
  - excerpt: 2–3 sentences, 15 px / 1.55, `foreground-soft`;
  - tag chips **under the text** (several per post);
  - "Read more →" link.
- Desktop: a 4-column grid, then a primary pill "All posts" aligned right.
  - The first post spans 2 columns: a 220 px wide cover on the left, content on the right.
  - The other two posts are single-column cards without a cover.
- Mobile: a carousel, then a full-width primary pill "All posts". Only the first post has a 150 px cover.

### Mobile carousel (shared by Experience and Blog)

- Shows one card per view. Use CSS scroll-snap (`overflow-x: auto; scroll-snap-type: x mandatory`, card `flex: 0 0 100%`, `scroll-snap-align: start`, gap 12 px) with a hidden scrollbar. No carousel library is needed.
- Controls sit **above** the track, right under the section header, all in `text-brand`:
  - the position "1 / 4" on the left, in mono, 600 weight;
  - previous and next buttons on the right: 44 px round, border and icon in `brand`, at 35% opacity and inactive at the ends.
- Arrows scroll to the neighbouring card with smooth behaviour. Touch swipe updates the position through a scroll listener: index = `round(scrollLeft / (clientWidth + gap))`.
- Cards in one track share the height of the tallest one.
- Accessibility: the region gets `aria-roledescription="carousel"` and a label; each slide gets `aria-label="{n} of {total}"`; arrows have `aria-label`s from messages.
- It is a small `"use client"` component taking server-rendered children.

### Footer

`© Mikhail Aleksandrov` on the left and the locale codes in mono on the right (`EN · RU · PT · ES · DE · FR · JA · PL`), 13 px, `muted-foreground`. The codes may link to the same page in each locale, which also helps crawlers.

## Motion: accent wipe

- Every tile and carousel reveals with a full-cover shutter in `shutter` that slides off, with `transform: scaleX(1 → 0)` on `::after`.
- Directions alternate tile by tile: even index slides right (`data-dir="r"`), odd slides left (`data-dir="l"`). Set this server-side from the render index; no JS is needed.
- First screen (`.reveal-load`): plays on load for 0.7 s with `cubic-bezier(.75,0,.2,1)`, staggered by `--i × 110 ms + 150 ms`. Covers hero, photo, contacts and About.
- Everything below (`.reveal`): scroll-driven with `animation-timeline: view()` and range `entry 15% → entry 100%`. Browsers without support show the tiles immediately.
- Carousels animate as one block, so the cards inside them carry no reveal class.
- All of it is wrapped in `prefers-reduced-motion: no-preference`. CSS is in `tokens.css`.

## Accessibility checklist

- Touch targets ≥ 44 px (all buttons, chips 36 px tall inside a tile are acceptable with 6 px gaps).
- Visible focus: `ring` color, 3 px.
- Icon-only buttons have labels; decorative icons `aria-hidden`.
- Contrast checked: `brand` on card is 6.7:1 in light and 12.7:1 in dark. Muted text is ≥ 5.5:1. Text on the contact buttons is ≥ 4.7:1. Yellow is never used for text.
- `lang` and `hreflang` come from the locale segment. Mobile menus trap focus (Sheet / Menu do this).

## Data and content

- Until Stage 3, read from `src/content/home.ts`. Keep component props in the shapes defined there, so swapping in Drizzle queries later doesn't touch the UI.
- The Data Model needs these additions; record them in [[Data Model]] when Stage 3 starts:
  - `experience`: `image`, a tag relation to `skills` (many-to-many), and `description` limited to 3 sentences (plain text is enough on the home page).
  - `posts`: `cover`, `tags` (a `tags` table plus `post_tags`).
- Owner TODOs (marked in `content.ts`): the photo file, the CV PDF, the Omega-R description, the experience tag lists, real skill levels (currently only 5 are set; the rest are placeholder 6), and real posts.

## Open questions (add to [[Open Questions]])

- The mobile menu (Sheet) contents and the tablet layout were not designed. Proposed defaults are above.
- What the "Learn more" links on experience cards point to: an `/about` anchor or per-company pages?
- Should the hero chips come from `skills` (top N) or stay a hand-picked list?

## Kickoff prompt for the Claude Code session

> Read `CLAUDE.md`, `docs/Home.md` and `docs/design/Home Page Handoff.md`, then look at the screenshots in `docs/design/home/screens/`. Implement the home page following the "Scope and order" section, one step at a time. Before each step, briefly explain the approach and the Next.js concepts involved, and wait for my OK. Use `tokens.css`, `content.ts` and `messages.en.json` from `docs/design/home/` as the sources of truth. Use `prototype.dc.html` only to look up exact values. Don't commit.
