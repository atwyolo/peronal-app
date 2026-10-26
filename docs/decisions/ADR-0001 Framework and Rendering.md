---
tags: [adr]
status: accepted
date: 2026-10-26
---

# ADR-0001 Framework and Rendering

## Context
A personal site with SSR was requested, with learning Next.js as an explicit goal. Hosting on Vercel.

## Decision
Next.js 16 App Router with Server Components. TypeScript strict, `src/` directory, Tailwind v4, npm. Mix static, ISR and dynamic rendering per route (see [[Rendering Strategy]]).

## Alternatives
- Pages Router with `getServerSideProps`: still supported but legacy; teaches outdated patterns.
- Remix / Astro: fine tools, but the stated goal is Next.js.

## Consequences
- Must read `node_modules/next/dist/docs/` before coding; Next 16 changed APIs (`proxy` instead of `middleware`, cache semantics, typed routes).
- Vercel-native features (ISR, Blob, Marketplace) are available with zero config.
