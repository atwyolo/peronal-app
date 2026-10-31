---
tags: [plan, home]
status: draft
date: 2026-10-30
---

# Plan: Home motion and verification pass

Add the accent wipe to the finished page, then run the checks the spec postponed. This closes the home page.

Related: [[2026-10-29-home-page-design]] ("Rendering, SEO and animation", "Verification to include in the plan"), [[Home Page Handoff]]. Previous: [[2026-10-30-home-blog]].

## Decisions

- **CSS only, as in the spec.** The rules come from `docs/design/shared/tokens.css`. Content is never hidden by JavaScript, so crawlers and visitors without JS see everything.
- **`Tile` gets an optional reveal API** (`reveal`: `load` or `scroll`, plus `index`) and maps it to the classes, `data-dir` and `--i`, so the direction is set on the server from the render index.
- **A carousel animates as one block on every breakpoint** (Claude's call): with one DOM the desktop grid is the same element.
- **i18n messages stay whole unless the numbers change.** Measured 2026-10-30: all messages are 808 bytes gzipped, those used by client components 340 bytes, about 580 with Skills and the Carousel. Task 4 measures again.

## Tasks

### Task 1: Reveal CSS and Tile API (S)

- [ ] The reveal rules are in `globals.css`; the `Tile` API from the decisions works.
- [ ] With reduced motion, or without `animation-timeline`, tiles are simply visible.

Verify: Playwright with `reducedMotion: "reduce"`. Depends on: nothing.

### Task 2: First screen, on load (S)

- [ ] Hero, photo, contacts and About use `.reveal-load`, staggered by `--i × 110 ms + 150 ms`, directions alternating.
- [ ] No layout shift, and the header stays above the shutter.

Verify: `e2e/home-motion.spec.ts`, screenshot after the animation ends. Depends on: task 1.

### Task 3: Below the fold, on scroll (S)

- [ ] Experience, Skills and Blog blocks use `.reveal`; the cards inside a carousel carry no reveal class.
- [ ] Scroll-snap inside a revealed carousel keeps working, despite `overflow: hidden` on the block. `.reveal` goes on a wrapper around `Carousel`: its `className` lands on the scrolling track, where `overflow: hidden` would stop the swipe.

Verify: Playwright mobile project, manual check in Safari (no `animation-timeline` support is the fallback path). Depends on: task 1.

### Task 4: Verification (M)

- [ ] Lighthouse on the production build: the wipe covers the photo, which is the LCP element. If LCP suffers, exclude the photo from the wipe or shorten its delay, and record the choice.
- [ ] Bundle analyzer: client JS with and without an adapter on the same component.
- [ ] Message payload measured again; narrow it with `pick` only if it became a noticeable share of the page.
- [ ] Playwright mobile project fails on hydration errors (already true through `e2e/fixtures.ts`; confirm it covers the new client leaves).
- [ ] Handoff accessibility checklist: touch targets, focus ring, labels, contrast.

Verify: numbers recorded in the spec and the journal. Depends on: tasks 2–3.

## Checkpoint

- [ ] Definition of done from `CLAUDE.md` is green.
- [ ] Spec status changes from draft, and [[Roadmap]] is updated.

## Risks

| Risk | Impact | Mitigation |
|---|---|---|
| The shutter delays LCP on the photo | High | Measured in task 4, with a fallback named there |
| `overflow: hidden` on revealed tiles clips focus rings or the carousel | Medium | Keyboard pass and Playwright in tasks 2–3 |
