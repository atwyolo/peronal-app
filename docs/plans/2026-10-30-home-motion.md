---
tags: [plan, home]
status: active
date: 2026-10-30
updated: 2026-11-01
---

# Plan: Home motion and verification pass

Run the accent wipe once on every block when the page opens, then run the checks the spec postponed. This closes the home page.

Related: [[2026-10-29-home-page-design]] ("Rendering, SEO and animation", "Verification to include in the plan"), [[Home Page Handoff]]. Previous: [[2026-10-30-home-blog]].

## Decisions

- **One wipe on load, all at once (owner's decision, 2026-11-01).** This replaces the design's stagger and its scroll-driven reveal, which looked risky. Every block plays `wipe` for 0.7 s with `cubic-bezier(0.75, 0, 0.2, 1)` after 150 ms. `--i`, `view()` and `@supports` are gone, so there is no frozen shutter on a large screen and no fallback path. Blocks below the fold finish out of sight.
- **Once per page load, a reload plays it again (owner's decision, 2026-11-01).** Links, the back button and a language switch do not. `cacheComponents` hides a left route with `display: none`, and showing it restarts a CSS animation, so CSS alone cannot do this. The client leaf `shared/ui/RevealOnce.tsx` waits for the wipes to end and sets `data-revealed` on `<html>`, and the shutter rule requires that attribute to be absent. A language switch remounts the root layout and clears the attributes of `<html>` without a full load, so the leaf keeps a module variable and sets the attribute again in a layout effect, before the paint. JavaScript only switches the decoration off and never hides content: without it the wipe plays on each load. A reload is the only way back: `sessionStorage` would survive it, and telling a reload from a first visit before the paint needs an inline script.
- **What wipes (owner's decisions):** the header, Hero, the photo, each contact button, About, each Experience card, the Skills tile, each post card. Section headers, pills and carousel controls do not.
- **The same on every width** (Claude's call). With one DOM the cards wipe one by one on phones too, so `Carousel` needs no wrapper and its track stays untouched.
- **Two classes** (Claude's call): `.reveal` and `.reveal-left`, passed through `className`. This replaces the helper approved earlier: without `--i` there is nothing to compute.
- **Directions alternate** (Claude's call), as in the design: `.reveal` slides off to the right, `.reveal-left` to the left. Fixed in the markup for single blocks, `index % 2` for cards. The header slides left, opposite the Hero under it.
- **`overflow: clip`, not `hidden` (approved by the owner, 2026-11-01).** A time-based wipe works with either, but `hidden` makes every block a scroll container for no reason. It would also break a future `view()` reveal: measured in Chromium 156 and WebKit 27.2, with `hidden` the shutter stays at 0 at every scroll position, with `clip` it goes 1, 0.96, 0.33, 0 as the block enters. `tokens.css` and the prototype both have `hidden`.
- **The photo stays under the shutter (owner's decision, 2026-11-01).** It is fully visible at 850 ms. LCP cannot show this: a test page in Chromium reported 8 ms with and without the shutter.
- **i18n messages stay whole unless the numbers change.** Measured 2026-10-30: all messages are 808 bytes gzipped, those used by client components 340 bytes, about 580 with Skills and the Carousel. Task 2 measures again.

## Tasks

### Task 1: The wipe on every block (M)

`src/app/globals.css`, the blocks above, `shared/ui/RevealOnce.tsx`, `e2e/home-motion.spec.ts`, [[Home Page Handoff]].

- [x] The rules are in `globals.css`. With reduced motion blocks are simply visible.
- [x] The blocks from the decisions carry `.reveal`, and all of them start together. `Carousel` and its slides carry nothing.
- [x] Directions alternate.
- [x] The wipe plays once per page load: a link, the back button and a language switch do not start it, a reload does.
- [x] The header wipes too and stays sticky.
- [x] No layout shift, the header stays above the shutter, clicks pass through it.
- [x] [[Home Page Handoff]] and the spec record the deviations from the design.

Verify: `e2e/home-motion.spec.ts`, screenshots in both themes. Depends on: nothing.

### Task 2: Verification (M)

- [ ] Lighthouse on the production build. LCP does not see the shutter, so the time the photo is fully open is recorded as well.
- [ ] Bundle analyzer: client JS with and without an adapter on the same component.
- [ ] Message payload measured again; narrow it with `pick` only if it became a noticeable share of the page.
- [ ] Playwright mobile project fails on hydration errors (already true through `e2e/fixtures.ts`; confirm it covers the new client leaves).
- [ ] Handoff accessibility checklist: touch targets, focus ring, labels, contrast. Contrast runs after the wipe: `axe-core` counts an opaque `::after` over the text and ignores its `transform`.
- [ ] iOS simulator: the wipe plays, swipes and rotation still work.

Verify: numbers recorded in the spec and the journal. Depends on: Task 1.

## Checkpoint

- [ ] Definition of done from `CLAUDE.md` is green.
- [ ] Spec status changes from draft, and [[Roadmap]] is updated.

## Deferred (from the review of Task 1)

- Contact directions are fixed per contact. Without one contact two neighbours share a direction, and the alternation test fails.
- The tests do not read the shutter's color or size; screenshots cover them.
- A language switch in the middle of the wipe has no e2e test; by reading the code the mark still lands before the paint.
- The 1 px `card-border` stays visible over the shutter: `clip` cuts at the padding box, as `hidden` does in `tokens.css`.
- `overflow: clip` cuts a long unbroken word in a card title instead of letting it overflow. Check it when translated titles exist; `[overflow-wrap:anywhere]` on the title is the fix.

## Risks

| Risk | Impact | Mitigation |
|---|---|---|
| The photo is covered for 850 ms and no metric shows it | Medium, accepted by the owner | The time is recorded in Task 2 |
| `overflow: clip` on a block clips a focus ring inside it | Medium | Keyboard pass in Task 2 |
