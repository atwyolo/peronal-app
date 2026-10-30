---
tags: [adr, workflow]
status: accepted
date: 2026-10-29
---

# ADR-0009 Agent Workflow

## Context
Claude Code works on this project through a skills plugin that defines the feature workflow. On 2026-10-29 the owner installed `agent-skills` (addyosmani/agent-skills): 25 skills over the whole lifecycle, including topic skills (frontend UI and accessibility, web performance, security, API design, ADRs) and reviewer agents. A second workflow plugin would cover the same spec, planning, TDD and review stages, partly under the same skill names, and make skill selection ambiguous.

## Decision
Use `agent-skills` as the only workflow plugin for this project, enabled in `.claude/settings.json` (owner's decision). The skill mapping and the project overrides live in `CLAUDE.md` → "Feature workflow: agent-skills":
- Discussion before code: `interview-me`, `idea-refine`; spec: `spec-driven-development`; plan: `planning-and-task-breakdown`; build: `incremental-implementation` + `test-driven-development`; UI: `frontend-ui-engineering`; APIs: `source-driven-development`; bugs: `debugging-and-error-recovery`; review: `code-review-and-quality`; decisions: `documentation-and-adrs`; later stages: `performance-optimization`, `security-and-hardening`, `doubt-driven-development`.
- Project rules win: the owner commits and Claude stages each step (the plugin's commit steps and `/build auto` are not used); specs, plans and ADRs stay in the `docs/` vault instead of `SPEC.md` / `tasks/`; inline, explained implementation; Russian discussion, English files.

## Alternatives
- A process-only plugin: mature as a workflow, but no topic skills for performance, accessibility or security.
- Two plugins, one for the process and agent-skills for topics: most coverage, but two overlapping workflows in one session.

## Consequences
- The home page spec is still a draft; finishing it now goes through `spec-driven-development` and `planning-and-task-breakdown` with the vault paths above.
- Revisit if the overrides keep fighting the plugin (e.g. its commit or `tasks/` conventions).
