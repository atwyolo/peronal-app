---
tags: [adr, forms]
status: accepted
date: 2026-10-26
---

# ADR-0006 Forms

## Context
Public contact form and many admin forms; validation must match on client and server.

## Decision
React Hook Form + Zod via `@hookform/resolvers`. Each form has one Zod schema in `src/schemas/`, imported by both the client form and the Server Action. Server Actions return `{ ok: true, data } | { ok: false, fieldErrors, formError }`; client maps field errors back into RHF with `setError`.

## Alternatives
- Plain `useActionState` + native validation: enough for one form, painful for an admin with dozens.
- TanStack Form: capable, smaller ecosystem; shadcn's form helpers target RHF.

## Consequences
- shadcn `Field`/`Form` components wrap RHF; keep that integration in one shared component.
- Progressive enhancement is partial: forms still post without JS, but client-side UX needs hydration.
