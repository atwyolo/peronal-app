# CLAUDE.md — project rules for `personal`

Personal portfolio site. Primary goal besides shipping: the owner is learning Next.js fundamentals along the way, so every step should come with a short "why it is built this way" explanation.

## Language

- Everything inside this repository is written in **English**: code, comments, commit messages, docs in `docs/`, UI copy source strings.
- Conversation with the owner happens in Russian (global rule). Never mix the two: no Russian in files, no English chat.

## Stack (decided, do not re-litigate)

- Next.js 16 App Router, React 19, TypeScript strict, `src/` layout, `@/*` alias, npm.
- Styling: Tailwind v4 + shadcn/ui (Base UI, style `base-nova`). Generated components live in `src/shared/shadcn` and are wrapped by our own adapters in `src/shared/ui`.
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

### Architecture (adapted Feature-Sliced Design)

- Layers: `src/app` (routes only) → `src/views` → `src/widgets` → `src/features` → `src/shared` (`ui`, `shadcn`, `lib`). `src/db`, `src/actions` (Server Actions) and `src/schemas` (Zod schemas) sit outside the layers. Full rules: `docs/specs/2026-10-29-home-page-design.md`.
- A layer imports only from layers below it; no imports between slices of the same layer. Only files in a slice root are importable from outside. No barrel `index.ts` files.
- `src/shared/shadcn` is imported only by `src/shared/ui`; `@base-ui/*` only by `src/shared/shadcn`.
- `src/actions` and `src/schemas` have no import-order rules: any layer may import them and they may import any local file. Features may import `src/db` only with `import type`; mutations go through actions.
- Enforced by `eslint-plugin-boundaries` in `eslint.config.mjs` (`npm run lint`).

### Code style

- **File names:** every file containing JSX is PascalCase (`src/views/home/HomePage.tsx`). Custom hook files are camelCase and match the hook name (`usePosts.ts`). Folder names and other non-JSX files stay kebab-case (`src/shared/lib/rich-text.ts`).
- **Exceptions:** Next special files keep the names Next requires (`page.tsx`, `layout.tsx`, `not-found.tsx`, ...). Generated code in `src/shared/shadcn` keeps the shadcn CLI names and style so `npx shadcn add`/`diff` keep working; the rules below do not apply to it.
- **Components** are arrow functions typed with `FC<Props>`, named exports. Props are an `interface <Name>Props` and are destructured on the first line of the body, not in the signature. Async Server Components use `FC` too (`FC` allows `Promise<ReactNode>` in React 19). Next special files assign the component to a const and `export default` it, or re-export a view: `export { HomePage as default } from "@/views/home/HomePage";`.
- **Custom hooks** type both input and output: `interface Use<Name>Params` and `interface Use<Name>`, e.g. `export const usePosts = (params: UsePostsParams): UsePosts => { const { page, limit } = params; ... }`. Params are destructured on the first line.

```tsx
interface HomePageProps {
  title: string;
}

export const HomePage: FC<HomePageProps> = (props) => {
  const { title } = props;

  return <div>{title}</div>;
};
```

### General

- Server Components by default. Add `"use client"` only where hooks, browser APIs or event handlers are required, and keep those leaves small.
- Data access goes through `src/db/` (schema, queries). Pages never import the driver directly.
- Mutations are Server Actions in `src/actions/`, validated with the form's Zod schema from `src/schemas/`, returning typed `{ ok, errors }` results for `useActionState`. Every action checks auth itself: actions are public POST endpoints, `proxy` does not protect them.
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
