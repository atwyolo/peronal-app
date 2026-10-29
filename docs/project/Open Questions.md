---
tags: [project]
updated: 2026-10-29
---

# Open Questions

- Blog authoring: everything through the admin editor, or allow importing Markdown? (Default: editor only.)
- Media: do we need image uploads in Stage 6, or links only until Vercel Blob is wired in Stage 7?
- Privacy notice (by Stage 5, contact form): mention the one-year `NEXT_LOCALE` cookie that remembers a language the visitor picked; a persistent preference cookie is commonly accepted under ePrivacy only when users are informed. The form itself collects name and email, which GDPR covers anyway.
- Contact notifications: save-to-DB only at first; add Resend later?
- Domain name for the Vercel project.
- Should a second admin user ever exist? Affects whether we build user management or seed one account.

Resolved questions move into an ADR in `decisions/`.
