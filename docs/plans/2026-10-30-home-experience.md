---
tags: [plan, home]
status: approved
date: 2026-10-30
---

# Plan: Home Experience block

Replace the temporary Experience dump with the designed block: four cards in a grid on desktop, a carousel on mobile.

Related: [[2026-10-29-home-page-design]], [[Home Page Handoff]], [[ADR-0007 Testing]]. Next: [[2026-10-30-home-skills]].

## Decisions

- **One DOM on every breakpoint.** The track is a scroll-snap row below `lg` and a 4-column grid from `lg`, in CSS. The cards are never rendered twice, and the markup does not depend on `window` (spec, "Deterministic first render").
- **Layers.** `widgets/experience/Experience.tsx` (server) reads `getExperience` and composes; `features/experience-card/ExperienceCard.tsx` is synchronous, gets data as props and renders in Vitest; `shared/ui/Carousel.tsx` is the client leaf and takes server-rendered cards as `children`.
- **Links (owner's decision).** "Learn more" goes to `/projects`, a 404 until that page exists. "All experience" goes to the same place (Claude's call, the handoff names no target).
- **Duration (owner's decision).** Calendar months of the job, counting both the first and the last, divided by 12, rounded to one decimal: `2024-11-01` to `2026-10-01` is 2. The period line reads the month and year straight from the `YYYY-MM-DD` string, so no time zone can shift them.
- **Current job.** `endDate` is nullable, although all four seeded jobs have one. `new Date()` during a static render fails under Cache Components, so "today" has to be captured inside the cached `getExperience`. It then stays frozen until the next build or tag invalidation, which is acceptable for a one-decimal value. Confirm against `node_modules/next/dist/docs/` before building it.
- **Carousel strings.** `Home.carousel` moves to a top-level `Carousel` namespace, because `shared/ui` must not know about the home page. A new `slide` message holds `{current} of {total}`.

## Tasks

### Task 1: Period and duration logic (XS)

`features/experience-card/lib/period.ts`: month/year label and duration in years. Test first.

- [x] Two dates give `MM/YYYY – MM/YYYY` parts and a value with one decimal.
- [x] A missing end date uses the passed "today".
- [x] Rounding is covered at the edges: 12 counted months are 1, 11 are 0.9.

Verify: Vitest. Depends on: nothing.

### Task 2: Card and grid replace the dump (M)

`SectionHeader` in `shared/ui`, `ExperienceCard`, `widgets/experience/Experience.tsx`, wired into `HomePage`. The dump's Experience section goes away, together with its `getExperience` call in `HomePage`. Cards stack on mobile until task 4.

- [x] Four cards with company, period, duration, description, and 3–5 skills as chips, equal height on desktop.
- [x] "Learn more" stays at the bottom of each card and points to `/{locale}/projects`.
- [x] A primary "All experience" pill sits right-aligned on desktop, full width on mobile, through a new `ButtonLink`.

Verify: `ExperienceCard.test.tsx` (test first); `e2e/home-experience.spec.ts` for the database-backed section and layout. Depends on: task 1.

Files: `src/shared/ui/SectionHeader.tsx`, `src/shared/ui/ButtonLink.tsx`, `src/features/experience-card/ExperienceCard.tsx`, `src/widgets/experience/Experience.tsx`, `src/views/home/HomePage.tsx`, `e2e/home-experience.spec.ts`.

### Task 3: Card image (S)

No job has an image yet, so the striped placeholder is what shows. The prototype's dashed border and 14 px radius join the placeholder here, as the spec planned.

- [ ] The image area is 140 px tall on mobile and 180 px on desktop.
- [ ] A missing `imageUrl` shows the placeholder with the dashed border and radius; the photo's placeholder keeps the look it has now.
- [ ] `alt` is the company name.

Verify: extend `Image.test.tsx`; screenshot in both themes. Depends on: task 2.

### Task 4: Carousel on mobile (M)

`shared/lib/carousel-index.ts` (pure), `shared/ui/Carousel.tsx` ("use client"), the messages move, then `Experience` uses it.

- [ ] Index is `round(scrollLeft / (clientWidth + gap))`, test first, including a zero width.
- [ ] Mobile shows one card per view, "1 / 4" and 44 px arrows above the track; the arrows are inactive at the ends. From `lg` the same DOM is a grid and the controls are hidden.
- [ ] `aria-roledescription="carousel"`, a region label, `aria-label` on each slide and on the arrows.

Verify: `Carousel.test.tsx` for the buttons and labels (jsdom has no layout); Playwright for real scrolling, a swipe updating the position, and the desktop grid. Depends on: task 2.

Files: `src/shared/lib/carousel-index.ts`, `src/shared/ui/Carousel.tsx`, `src/widgets/experience/Experience.tsx`, `messages/en.json`, `e2e/home-experience.spec.ts`.

## Checkpoint

- [ ] Definition of done from `CLAUDE.md` is green.
- [ ] Mobile and desktop screenshots in both themes match the handoff.
- [ ] The owner reviewed the block before Skills starts.

## Risks

| Risk | Impact | Mitigation |
|---|---|---|
| `Tile` or `overflow` breaks scroll-snap on real devices | Medium | Playwright mobile project plus a manual check on a phone |
| The first load scroll event moves the position off "1 / 4" | Low | Position starts from state, the listener only updates it; test the initial value |
| Fractional duration in `ru` and `pl` plural forms | Low | Translators supply the `other` form; the `#` value is formatted per locale |
