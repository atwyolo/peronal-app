---
tags: [plan, home]
status: done
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

- **Full-width desktop (owner's decision, added after task 2).** From `lg` there is no maximum width: 20 px on the left, 60 px on the right. Done before task 3, because card sizes depend on it.
- **Placeholder frame (Claude's call, task 3).** A `framed` prop on `Image`, not a class from the parent: only `Image` knows a load failed. A framed placeholder has the prototype's 1 px lines, because wide stripes in the same color hide the dashes of the border; the photo keeps its own stripes. The prototype's "COMPANY IMAGE" text is left out. A real image gets the same 14 px radius.
- **Carousel semantics (Claude's call, task 4).** `role="group"`, which the ARIA carousel pattern allows, not `region`: the section around it is already a region with the same name. On desktop the roles stay in the DOM on the grid, the price of one DOM. The position comes only from the scroll offset, read through `useSyncExternalStore`, because the track scrolls before hydration; arrows just scroll. They use `aria-disabled`, so the keyboard focus survives the last slide, and the dimming is dropped on keyboard focus, so the ring stays readable. Smooth scrolling is CSS, so reduced motion needs no JavaScript.

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

- [x] The image area is 140 px tall on mobile and 180 px on desktop.
- [x] A missing `imageUrl` shows the placeholder with the dashed border and radius; the photo's placeholder keeps the look it has now.
- [x] `alt` is the company name.

Verify: extend `Image.test.tsx`; screenshot in both themes. Depends on: task 2.

### Task 4: Carousel on mobile (M)

`shared/lib/carousel-index.ts` (pure), `shared/ui/Carousel.tsx` ("use client"), the messages move, then `Experience` uses it.

- [x] Index is `round(scrollLeft / (clientWidth + gap))`, test first, including a zero width.
- [x] Mobile shows one card per view, "1 / 4" and 44 px arrows above the track; the arrows are inactive at the ends. From `lg` the same DOM is a grid and the controls are hidden.
- [x] `aria-roledescription="carousel"`, a region label, `aria-label` on each slide and on the arrows.

Verify: `Carousel.test.tsx` for the buttons and labels (jsdom has no layout); Playwright for real scrolling, a swipe updating the position, and the desktop grid. Depends on: task 2.

Files: `src/shared/lib/carousel-index.ts`, `src/shared/ui/Carousel.tsx`, `src/widgets/experience/Experience.tsx`, `messages/en.json`, `e2e/home-experience.spec.ts`.

## Checkpoint

- [x] Definition of done from `CLAUDE.md` is green.
- [x] Mobile and desktop screenshots in both themes match the handoff.
- [x] Manual check on an iPhone in Safari, since the automated runs are Chromium only: arrows stop exactly on a card, a swipe right after an arrow does not jump back, the position is right after a rotation. Done by the owner against the dev server (2026-10-31); the rotation then turned out wrong and is fixed, see "Fixed after the checkpoint". The iPad rotation across `lg` was measured in Playwright's WebKit instead: card 3 stays on 800 → 1100 → 800 px.
- [x] The owner reviewed the block before Skills starts (block closed by the owner, 2026-10-31).

## Deferred

**Closed until the admin (owner's decision, 2026-10-31):** card images. `glovo.png` needs a new export, because the logo sits above the center and the top of its pin is cut between 720 and 1023 px. Sony, EPAM and Omega-R have no image yet and show the placeholder. The owner completes and corrects the content in the admin. Rules: step 8.4 of [[2026-10-29-home-page-design]].

**Closed without code (owner's decision, 2026-10-31).** Measured on a production build in Playwright's WebKit 27.2 and Chromium 156.

- `scrollToSlide` computes the target from the rounded `clientWidth`. Not reproduced: WebKit corrects a programmatic `scrollTo` with snap too (1110 requested, 1108 reached), and the fourth card stops under 1 px off in both engines at a fractional width. Seven iPhone widths from 375 to 440 px give 0.
- `getCarouselIndex` assumes a slide is as wide as the track. With `px-4` on the track the position stays right on all four slides; the rounding first fails on the seventh slide. So the track never gets horizontal padding: the rule is in [[2026-10-29-home-page-design]], section "shared/ui adapters over shadcn", and on the `className` prop.
- A double tap on an arrow moves one card instead of two when the second tap comes less than about 100 ms after the first (WebKit: 83 ms moves one, 100 ms two; Chromium: 100 ms one, 120 ms two). The next tap makes up for it.

## Fixed after the checkpoint

**Slides after a rotation (fixed, owner's decision, 2026-10-31).** The owner saw two slides at once on an iPhone after turning it to landscape; a swipe fixed it. Reproduced in the iOS 26.5 simulator (iPhone 17, real rotation, a production build, cards reached with the arrows):

- Portrait to landscape: the offset stayed at 382, 764 and 1146 px on cards 2, 3 and 4 instead of moving to the new positions, for at least 2 s. The track showed parts of two slides, on card 4 not even the fourth one. No `scroll` event fired, so the position kept its old value.
- Landscape to portrait: the 1400 px of card 3 did not fit and were clamped to card 4.
- `scroll-behavior` is not the cause: with `auto` set before the turn the result is the same. Why the engine leaves the offset is unknown, so the fix does not depend on it.
- Playwright's WebKit and Chromium both move to the new position, so the automated runs cannot show this bug. The e2e tests switch snap off in Chromium to get the same state.

**Fix.** `Carousel` remembers the slide and a `ResizeObserver` on the track scrolls back to it when the width changes. Alternatives: `orientationchange` misses a window resize and iPad Split View; removing smooth scrolling changes nothing; computing the slide from the old width breaks in Chromium, which has already moved.

- `scrollTo` uses `behavior: "instant"`, because `auto` means the CSS smooth scrolling here.
- A scroll while the width differs from the remembered one is ignored: it is the clamp, not a move to another slide.
- No `scrollTo` when the track is within 2 px of the target. Calling it on an offset iOS has just clamped there threw the track back to 2100 px, past its end, and left it blank on card 4 in every run that made the call. The 2 px cover a rounded `clientWidth` on a fractional width. Only the simulator can show this: every Chromium test stayed green with the blank track.

**Verified** in the same simulator on the final build: cards 2–4 both ways, ten extra turns on card 4, real touch swipes up to card 4 in landscape and a turn back. Offsets 700/1400/2100 and 382/764/1146, 0 blank readings of 61. Earlier builds of the fix need a warning: one run showed two blank tracks on addresses already opened with the unguarded build, and Safari is proven to serve such a cached page. A direct retry of that address did not reproduce it, so the cache is the likely cause, not a proven one. Later runs use `no-store`.

## Risks

| Risk | Impact | Mitigation |
|---|---|---|
| `Tile` or `overflow` breaks scroll-snap on real devices | Medium | Playwright mobile project plus a manual check on a phone |
| A swipe before hydration leaves the position on "1 / 4" | Low | The position is read from the track, so React corrects it right after hydration; covered in `Carousel.test.tsx` |
| Fractional duration in `ru` and `pl` plural forms | Low | Translators supply the `other` form; the `#` value is formatted per locale |
