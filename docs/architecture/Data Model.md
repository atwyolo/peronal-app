---
tags: [architecture, database]
updated: 2026-10-26
---

# Data Model

Draft — finalized in Stage 3. Pattern: every entity with user-facing text has a sibling translation table. See [[ADR-0003 Content Localization]].

## Entities

- `profile` (singleton) + `profile_translations`: headline, bio (rich text JSON), location.
- `projects` + `project_translations`: slug, url, repo_url, year, featured, sort; title, summary, body (rich text).
- `skills` + `skill_translations`: category, level, sort; name.
- `experience` + `experience_translations`: company, start_date, end_date, sort; role, description (rich text).
- `posts` + `post_translations`: slug, published_at, status; title, excerpt, body (rich text). `post_views` counter.
- `contact_messages`: name, email, message, locale, created_at, read_at.
- `users`: admin accounts for Auth.js credentials (email, password_hash).

## Translation table shape

```
<entity>_translations
  id            serial pk
  <entity>_id   fk → <entity>.id on delete cascade
  locale        text  (enum of supported locales)
  ...fields
  unique (<entity>_id, locale)
```

Fallback: query the requested locale, fall back to `en` per row when missing. Admin shows a "falls back to English" badge for untranslated fields.

Rich text is stored as Tiptap JSON (`jsonb` is fine *here*: it is a document, not a localization strategy).
