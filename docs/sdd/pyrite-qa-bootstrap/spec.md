# Spec — bootstrap the Pyrite-QA workspace

## Problem
The owner asked (2026-11-05) for a new GitHub repo `Pyrite-QA`, the same kind of workspace as ols-qa but for the Pyrite project. Decisions from the owner (popup, 2026-11-05): public repo · copy structure + generic Helix skills only · Jira key `PYR` · "Pyrite" is a project name, not a customer name.

## Rules
**R1.** When the workspace is created, it must carry the generic Helix skills, commands and references taken from helix (source: helix main, 2026-11-05), and must not carry the OLS-only workflows (smoke-test, review-result, sync-tc-result, test-data-prep, content-takedown).
**R2.** It must carry the workspace scaffolding of ols-qa (CLAUDE.md, AGENTS.md, CONTEXT.md, `.claude/settings.json`, session hooks, git hooks, post-mortem ledger) with OLS names replaced by Pyrite, and must not carry OLS bots, launchd/auto-update jobs, OLS post-mortem reports, name-guard, retest-guard, agent-dispatch-guard (OLS-environment-specific checks) or the Discord guard.
**R3.** Every hook wired in `.claude/settings.json` must point at a file that exists in the repo, and every guard tool it calls must ship with its tests.
**R4.** Pyrite-specific values must live only in `references/pyrite-project-guide.md`; only `PYR` is filled, everything unconfirmed stays a `{PLACEHOLDER}` (source: owner decision R0 — never guess). Real values stay in `~/.pyrite-qa-secrets/`.
**R5.** ask-guard must not claim a fixed TC-review channel for Pyrite while none is confirmed: the shipped fixed-channel list is empty; tests switch `PYR` on through `ASK_GUARD_FIXED_PROJECTS`, which can only add projects (stricter, never looser).
**R6.** Before the first push the tree must pass `scripts/check-no-secrets.sh` and a manual sweep for OLS/customer names, and every suite of `scripts/run-test-suites.sh` must be green.

## Edge cases
- No base branch on the first push: the SDD files land in an earlier commit than the code they govern.
- Helix-sourced files mention "ols-qa workspace" for OLS-only options; they are left as-is so the files stay in sync with helix.

## Done when
- `gh repo view Thitic9203/Pyrite-QA` shows a public repo with `main`.
- A fresh clone: `bash scripts/setup-hooks.sh` succeeds, `bash scripts/run-test-suites.sh .` is green, `bash scripts/check-no-secrets.sh` exits 0.
- No hook in `.claude/settings.json` points at a missing file.
