# Pyrite QA Workspace

Helix QA workspace for the **Pyrite** project (Jira key `PYR`). Same layout as the ols-qa workspace, carrying only the generic Helix skills and the guard tools — no OLS data, bots or scheduled jobs.

> 🔴 **This repo is public.** Never commit passwords, tokens, real hosts, account emails, sheet/drive/figma ids or customer names. Real values live in `~/.pyrite-qa-secrets/` on your machine only.

## Quick start

1. Clone and open the folder in Claude Code (trust the folder when asked — `.claude/settings.json` wires the guards).
2. Turn on the git hooks once per clone:
   ```bash
   bash scripts/setup-hooks.sh
   ```
3. Fill `references/pyrite-project-guide.md` as you learn values — placeholders only. Real values go in `~/.pyrite-qa-secrets/pyrite-secrets.md`.
4. Run `/helix` for the menu.

## Helix commands

| Command | What it does |
|---------|-------------|
| `/helix` | Main menu — pick a workflow |
| `/tc-fe-prep` | Frontend TC from a PYR story |
| `/tc-api-prep` | API test cases from spec + Swagger |
| `/testing-ticket` | Playwright test for one PYR ticket |
| `/retest-bug` | Retest a bug or task after a dev fix |
| `/create-bug` | Open bug(s) — only after the owner says so |
| `/catch-ai` | Audit finished work before claiming done/passed |
| `/tc-review` | Review an existing TC document against the ticket |
| `/tc-change-format` | Copy TC tabs into a release template sheet |

Skill files come from **helix** (shared, generic). Change shared logic upstream; put Pyrite-only values in the guide.

## Layout

| Path | Contents |
|------|----------|
| `skills/`, `commands/`, `references/` | Helix skills (from helix) + `references/pyrite-project-guide.md` |
| `tools/` | Guard tools and their tests (ask, git-staging, investigation, issue-creation, jira-ticket, postmortem, process-kill, sdd-gate) |
| `.claude/` | Workspace settings and hooks |
| `scripts/` | Secret scan, git hooks, test runners |
| `docs/` | Rule docs, post-mortem ledger, SDD specs |

## Tests

```bash
bash scripts/run-test-suites.sh .
```

CI runs the same suites on every push and PR (`.github/workflows/tests.yml`, free on a public repo).

## Not included (OLS-only)

Discord bot and autopoll, launchd jobs, auto-update, smoke-test / review-result / sync-tc-result / test-data-prep workflows, name-guard and retest-guard, and the OLS post-mortem history. Add a Pyrite version only when the owner asks.
