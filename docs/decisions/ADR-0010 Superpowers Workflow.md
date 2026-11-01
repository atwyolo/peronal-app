---
tags: [adr, workflow]
status: accepted
date: 2026-10-30
---

# ADR-0010 Superpowers Workflow

Supersedes [[ADR-0009 Agent Workflow]].

## Context
`agent-skills` drove the feature workflow since 2026-10-29. On 2026-10-30 the owner decided to switch the project to `superpowers` 7.0.0, already installed for this project. It is a process plugin: brainstorming, plans, execution, TDD, debugging, verification and review. Its defaults assume commits on every task, worktrees, subagent execution and a `docs/superpowers/` folder, and all of these differ from the project rules.

## Decision
Use `superpowers` as the only workflow plugin for this project, enabled in `.claude/settings.json`; `agent-skills` is disabled there and stays installed. The skill mapping and the project overrides live in `CLAUDE.md` → "Feature workflow: superpowers":
- Discussion and spec: `brainstorming`; plan: `writing-plans`; build: `executing-plans` + `test-driven-development`; bugs: `systematic-debugging`; done check: `verification-before-completion`; review: `requesting-code-review`, `receiving-code-review`.
- Project rules win: the owner commits and Claude stages each step; no worktrees, no `finishing-a-development-branch`; specs and plans stay in the `docs/` vault; implementation is inline and explained, never through `subagent-driven-development`; Russian discussion, English files.
- `executing-plans` runs without `task-start`, `task-done`, `review-package` and its ledger: they work on commit ranges, and `review-package` refuses an empty range. The plan's checklist is the ledger, and reviews run on `git diff --cached`.

## Alternatives
- Stay on `agent-skills`: no migration, and it keeps the topic skills, but the owner chose to move.
- Both plugins: most coverage, but two overlapping workflows in one session, the problem [[ADR-0009 Agent Workflow]] avoided.
- Commit on every task so the `executing-plans` scripts work: full plugin behavior, but it takes commits away from the owner.

## Consequences
- Topic skills are gone: `frontend-ui-engineering`, `performance-optimization`, `/webperf`, `security-and-hardening`, `source-driven-development`, `documentation-and-adrs`, `doubt-driven-development`. `CLAUDE.md` keeps their intent as plain rules, and the built-in `/security-review` covers security, but accessibility and performance now depend on discipline alone.
- `/.superpowers/` is ignored by git: the brainstorming visual companion can write mockups there.
- Existing specs and plans stay valid: they name no plugin skills and have no commit steps.
- Revisit if the `executing-plans` overrides keep fighting the plugin, or before the performance and accessibility pass of the home page.
