---
tags: [plan, home]
status: draft
date: 2026-10-30
---

# Plan: Home Skills block

Replace the temporary Skills dump with the `SkillsExplorer`: search, domain chips, top-N list, show-all toggle.

Related: [[2026-10-29-home-page-design]] (section "Example: Skills block"), [[Home Page Handoff]]. Previous: [[2026-10-30-home-experience]]. Next: [[2026-10-30-home-blog]].

## Decisions

- **Filtering stays in client memory.** `searchParams` would make the page dynamic (spec). The HTML holds the default top 14 rows.
- **Top 5 / top 14 is CSS.** Rows 6–14 are hidden below `lg`, and both header counts are rendered and toggled by breakpoint, so the first render does not read the width.
- **Numbers and labels come from the data.** The handoff says 41 skills, the database has 42; nothing is hard-coded. Domain labels come translated from `getSkills`, so only `all` stays in `Home.skills.categories`, and the other keys are removed.
- **New shadcn components:** `input` and `toggle-group`, through `npx shadcn add`. They sit on Base UI, which is already installed; if the command wants a new package, stop and discuss it first.

## Tasks

### Task 1: Filter logic (S)

`features/skills-explorer/lib/filter-skills.ts`, pure functions, test first.

- [ ] Search is a case-insensitive substring match, combined with the selected domain.
- [ ] The order from `getSkills` is kept.
- [ ] A function picks the header state: top N, all, filtered, and the show-all toggle is hidden while a filter is active.

Verify: Vitest. Depends on: nothing.

### Task 2: Skill row (S)

`features/skills-explorer/ui/SkillRow.tsx`: name, 10-segment bar, mono `n/10`.

- [ ] Segments up to the level use `brand`, the rest `placeholder`.
- [ ] `role="meter"` with `aria-valuenow`, `aria-valuemax` and the `levelAria` label.
- [ ] Levels 0 and 10 render correctly.

Verify: `SkillRow.test.tsx`, test first. Depends on: nothing.

### Task 3: Search and toggle adapters (S)

`shared/ui/SearchInput.tsx`, `shared/ui/ToggleGroup.tsx` with data-style props, no Base UI types in their API.

- [ ] `SearchInput` has a visually hidden label, the icon, and the focus ring from the handoff.
- [ ] `ToggleGroup` is single-select with `items`, `value`, `onValueChange`, and each item shows a count in mono. A press on the active chip does not leave the group empty.

Verify: Vitest for both. Depends on: nothing.

### Task 4: Explorer replaces the dump (M)

`features/skills-explorer/SkillsExplorer.tsx` ("use client"), `widgets/skills/SkillsSection.tsx`, wired into `HomePage`; the dump's Skills section goes away. Mobile layout first.

- [ ] Search, chips, the toggle and the empty state work together; the header count follows them.
- [ ] Default view: 5 rows on mobile, 14 on desktop, all 14 in the HTML.
- [ ] The count line is `aria-live="polite"`, so a screen reader hears the result of a search.

Verify: `SkillsExplorer.test.tsx` for state, test first; `e2e/home-skills.spec.ts` for CSS visibility at both widths and for the database-backed counts. Depends on: tasks 1–3.

Files: `src/features/skills-explorer/SkillsExplorer.tsx`, `src/widgets/skills/SkillsSection.tsx`, `src/views/home/HomePage.tsx`, `messages/en.json`, `e2e/home-skills.spec.ts`.

### Task 5: Desktop layout (S)

- [ ] One tile, 28 px padding, grid `280px | 1fr`, gap 40 px, a divider between the sides.
- [ ] Rows in two columns, gap 18 × 40 px, each row `150px | 1fr | 44px`.
- [ ] Long skill names do not overflow the 150 px column in any seeded row.

Verify: Playwright at 1280 and 1024; screenshot in both themes. Depends on: task 4.

## Checkpoint

- [ ] Definition of done from `CLAUDE.md` is green.
- [ ] Keyboard pass: search, chips and the toggle work without a mouse.
- [ ] The owner reviewed the block before Blog starts.

## Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Hidden rows and the two counts confuse screen readers | Medium | CSS `display: none` removes them from the accessibility tree; assert with `getByRole` in both projects |
| A filtered list on mobile still applies the "hide rows 6–14" rule | Medium | The rule applies only to the default view; covered in `e2e/home-skills.spec.ts` |
