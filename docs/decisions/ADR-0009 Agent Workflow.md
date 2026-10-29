---
tags: [adr, workflow]
status: accepted
date: 2026-10-29
---

# ADR-0009 Agent Workflow

## Context
Claude Code works on this project through a skills plugin that defines the feature workflow. Since 2026-10-28 that was `superpowers` (obra/superpowers): brainstorming, plans, inline execution, TDD, verification, code review. On 2026-10-29 the owner installed `agent-skills` (addyosmani/agent-skills): 25 skills over the whole lifecycle, plus topic skills superpowers lacks (frontend UI and accessibility, web performance, security, API design, ADRs) and reviewer agents. Both plugins cover spec, planning, TDD and review, partly under the same skill names, so running both makes skill selection ambiguous.

## Decision
Use `agent-skills` for this project and disable `superpowers` in `.claude/settings.json` (owner's decision). The skill mapping and the project overrides live in `CLAUDE.md` → "Feature workflow: agent-skills":
- Discussion before code: `interview-me`, `idea-refine`; spec: `spec-driven-development`; plan: `planning-and-task-breakdown`; build: `incremental-implementation` + `test-driven-development`; UI: `frontend-ui-engineering`; APIs: `source-driven-development`; bugs: `debugging-and-error-recovery`; review: `code-review-and-quality`; decisions: `documentation-and-adrs`; later stages: `performance-optimization`, `security-and-hardening`, `doubt-driven-development`.
- Project rules win: the owner commits and Claude stages each step (the plugin's commit steps and `/build auto` are not used); specs, plans and ADRs stay in the `docs/` vault instead of `SPEC.md` / `tasks/`; inline, explained implementation; Russian discussion, English files.

## Alternatives
- Keep `superpowers`: more mature as a process (official Anthropic directory, ~308k stars vs ~112k), but no topic skills for performance, accessibility or security.
- Both plugins, superpowers as the process and agent-skills for topics: most coverage, but two overlapping workflows in one session.

## Consequences
- Earlier specs and journal entries mention superpowers skills (`brainstorming`, `writing-plans`); they describe how that work was done and are not rewritten.
- The home page spec is still a draft; finishing it now goes through `spec-driven-development` and `planning-and-task-breakdown` with the vault paths above.
- Revisit if the overrides keep fighting the plugin (e.g. its commit or `tasks/` conventions).
