---
tags: [design, handoff]
updated: 2026-11-01
---

# Design handoff

Approved designs for the public site, ready to implement. Every page is mobile-first, has dark and light themes, and is localized through next-intl (copy in English; other locales fall back to `en`).

## Pages and order

| # | Page | Route | Spec | Rendering |
|---|---|---|---|---|
| 1 | Home | `/[locale]` | [[Home Page Handoff]] | static |
| 2 | Projects (work experience) | `/[locale]/projects` | [[Projects Page Handoff]] | static now, ISR once it reads the DB |
| 3 | About | `/[locale]/about` | [[About Page Handoff]] | static |
| 4 | Skills | `/[locale]/skills` | [[Skills Page Handoff]] | static now, ISR once it reads the DB |
| 5 | Blog list | `/[locale]/blog` | [[Blog Page Handoff]] | ISR |

Contact and the post page (`/blog/[slug]`) are not designed yet. Admin uses stock shadcn components.

Implement Home first: it introduces the tokens, the header with the locale and theme menus, tiles, chips and buttons that every other page reuses.

## Shared files (`shared/`)

| File | Use |
|---|---|
| `tokens.css` | Colors for both themes, radii, fonts, and the reveal animation. Merge into `src/app/globals.css`. |
| `content.ts` | All copy and data for every page, typed. Move to `src/content/site.ts`; it is the static source until Stage 3 (DB). |
| `messages.en.json` | UI strings for next-intl, one namespace per page. Merge into `messages/en.json`. |

Each page folder has `screens/` (PNG renders) and `prototype.dc.html` (the prototype source, only for looking up exact values; it does not run outside the design tool; its top toolbar is prototype-only).

Screens per page: `desktop-dark-1…5.png` and `phone-dark-1…5.png` are the same page scrolled from top (1) to bottom (5); `*-light-1.png` shows the light theme. Home has full-page renders instead.

## Site-wide rules

- **Header**, sticky on every page. Nav: Home · About · Projects · Skills · Blog · Contact. The active item is `text-brand` with a `deco` underline. Some prototype screens predate the Skills item; the six-item nav is correct.
- **No footer** on any page. Pages end with their last section.
- **Section labels** are mono, uppercase, 11–12 px, `muted-foreground`. Page heroes: mono label, an h1 at 56 px desktop / 36 px phone, and a one-line intro.
- **Sticky side panels** (Skills, Blog) sit at `top: 20px` inside the content column on desktop. On phone they become normal blocks above the list; Blog adds the collapsing behaviour described in its spec.
- **Chips:** filter chips are pills, 36 px tall, mono 12 px. Active filter: `bg-selected text-selected-foreground`. Tag chips: `brand` text on a `card-border` outline; an active tag is filled with `brand`.
- **Links** like "Read more →" / "Learn more →" are `text-brand`, 600 weight, with a 2 px `deco` underline offset 5 px.
- **Anchors:** every work place has an id (`glovo`, `sony`, `epam`, `omega-r`); Home links to `/projects#<id>`. Anchored sections need `scroll-margin-top` equal to the header height (plus any sticky bar).
- **Motion** respects `prefers-reduced-motion`: reveals and progress animations are skipped, content is visible immediately.
- **All text is server-rendered.** Filters and scroll effects are small client components layered on top. With JavaScript off, every page still reads as a plain article or list.

## Kickoff prompt (one page at a time)

> Read `CLAUDE.md`, `docs/Home.md`, `docs/design/README.md` and `docs/design/<Page> Page Handoff.md`, then look at the screenshots in `docs/design/<page>/screens/`. Implement the page following its "Scope and order" section, one step at a time. Before each step, briefly explain the approach and the Next.js concepts involved, and wait for my OK. Use `docs/design/shared/` as the source of truth for tokens, content and messages. Use the page's `prototype.dc.html` only to look up exact values. Don't commit.
