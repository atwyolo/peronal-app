# CLAUDE.md — project rules for `personal`

Personal portfolio site. Primary goal besides shipping: the owner is learning Next.js fundamentals along the way, so every step should come with a short "why it is built this way" explanation.

## Language

- Everything inside this repository is written in **English**: code, comments, commit messages, docs in `docs/`, UI copy source strings.
- Conversation with the owner happens in Russian (global rule). Never mix the two: no Russian in files, no English chat.

## Stack (decided, do not re-litigate)

- Next.js 16 App Router, React 19, TypeScript strict, `src/` layout, `@/*` alias, npm.
- Styling: Tailwind v4 + shadcn/ui (Base UI, style `base-nova`). Components live in `src/components/ui` and are owned code.
- Data: Neon Postgres via Vercel Marketplace, Drizzle ORM with `@neondatabase/serverless` (HTTP driver). One database for local dev, previews and production; schema synced with `drizzle-kit push`, no migration files (see ADR-0002).
- i18n: `next-intl` for UI strings. DB content is localized through **translation tables** (`<entity>_translations` with `locale` column), never jsonb. Locales: `en` (default, fallback), `ru`, `pt`, `es`, `de`, `fr`, `ja`, `pl`.
- Forms: React Hook Form + Zod (`zodResolver`). Zod schemas are the single source of validation on both client and server.
- Tests: Vitest + React Testing Library (colocated `*.test.ts(x)`), Playwright in `e2e/` against a production build.
- Admin: hand-written under `/admin`. Auth.js v5 credentials login, routes protected in proxy. Rich text: Tiptap 3, stored as JSON, rendered server-side on the public site.
- Theme: `next-themes`, class strategy, respects system preference.
- Hosting: Vercel Hobby. Filesystem is read-only at runtime; uploads go to Vercel Blob.

## Before writing code

- Read the matching guide in `node_modules/next/dist/docs/` first. Next 16 APIs differ from older versions (see `AGENTS.md`).
- Discuss approach and alternatives before implementing anything non-trivial (global rule). Confirm, then code.
- Check `docs/Home.md` for the current roadmap, decisions (ADRs) and open questions. Update them when a decision changes.

## Feature workflow: superpowers

The `superpowers` plugin is enabled for this project (`.claude/settings.json`). Use it for every feature: `brainstorming` → `writing-plans` → `executing-plans` → `verification-before-completion`. Use `systematic-debugging` for bugs and `requesting-code-review` before handing work over.

Project rules win where the plugin's defaults differ:

- **No commits, branches or worktrees.** The owner manages git. Skip every "commit" step in specs and plans, do not run `using-git-worktrees` or `finishing-a-development-branch`; work in the current checkout and end by reporting the delta for the owner to commit.
- **Specs and plans live in the vault**, in English, with frontmatter and `[[wikilinks]]`: `docs/specs/YYYY-MM-DD-<topic>.md` and `docs/plans/YYYY-MM-DD-<feature>.md` (not `docs/superpowers/...`). Link them from `docs/Home.md`.
- **Learning first.** Execute plans inline (`executing-plans`), not through `subagent-driven-development`, so every step is visible and explained to the owner. Brainstorming is the "discuss before coding" step; the conversation stays in Russian.
- **Tests** (ADR-0007). `test-driven-development` applies to logic and client components with Vitest. Async Server Components and database-backed pages are verified with Playwright, which must never write to the database (it is the production one). Verification before completion: `npm run test:run`, `npm run test:e2e`, `npm run lint`, `npx tsc --noEmit`, `npm run build`.

## Conventions

- Server Components by default. Add `"use client"` only where hooks, browser APIs or event handlers are required, and keep those leaves small.
- Data access goes through `src/db/` (schema, queries). Pages never import the driver directly.
- Mutations are Server Actions in `src/actions/`, validated with Zod, returning typed `{ ok, errors }` results for `useActionState`.
- Rendering intent is explicit per route: static, ISR (`revalidate`), or dynamic. Note it in a one-line comment at the top of the page file.
- Commits: Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`). The owner manages git; do not commit or push unless asked. Never put Claude session links into commits, PRs or issues.

## Commands

```bash
npm run dev      # dev server (Turbopack)
npm run build    # production build, also runs type check
npm run lint     # eslint
npx tsc --noEmit # standalone type check
npm test         # Vitest in watch mode
npm run test:run # Vitest once
npm run test:e2e # Playwright against a production build (first time: npx playwright install chromium)
npm run db:push  # sync schema to the database (shows SQL, asks to confirm)
npm run db:seed  # fill an empty database
npm run db:studio # browse data
```

## Docs vault

`docs/` is an Obsidian-style vault: Markdown with `[[wikilinks]]`, YAML frontmatter, one topic per note. Entry point is `docs/Home.md`. Record architectural decisions as ADRs in `docs/decisions/`, session summaries in `docs/journal/`, learning notes in `docs/learning/`.
