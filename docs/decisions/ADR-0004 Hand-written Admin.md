---
tags: [adr, admin]
status: accepted
date: 2026-10-26
---

# ADR-0004 Hand-written Admin

## Context
Admin needs: login form, menu mirroring the site structure, per-entity forms, rich text in some fields, multilingual editing.

## Decision
Write the admin ourselves under `/admin`: Auth.js v5 (credentials provider, JWT session cookie), route protection in `proxy`, Server Actions for CRUD, React Hook Form + Zod forms, Tiptap 3 editor storing JSON, TanStack Table for lists.

## Alternatives
- Payload CMS 3 (Next-native, Lexical editor, field localization, auth out of the box): strongest alternative, recommended by Claude, but rejected by the owner in favour of learning auth, forms and mutations in Next.js first-hand.

## Consequences
- Significantly more code than Payload; accepted for the learning value.
- Security is on us: password hashing (argon2/bcrypt), CSRF via Server Actions' built-in origin check, rate limiting on login.
- Single seeded admin user initially; user management is an open question.
