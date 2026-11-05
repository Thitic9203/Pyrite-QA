# Plan — bootstrap the Pyrite-QA workspace

## Files touched
- From helix: `skills/` (minus review-result, test-data-prep), `commands/` (same), `references/`, `LICENSE`, `SECURITY.md`, `scripts/check-no-secrets.sh`, `scripts/gen-secret-hashes.sh`.
- From ols-qa: `CLAUDE.md`, `AGENTS.md`, `CONTEXT.md`, `.gitignore`, `.claude/settings.json`, 10 hooks in `.claude/hooks/`, `scripts/hooks/{pre-commit,pre-push}`, `scripts/{setup-hooks,list-test-suites,run-test-suites,git-env-clean,whose-change,verify-on-origin,test-combined-merge}.sh`, `tools/` guards (ask, git-staging, investigation, issue-creation, jira-ticket, postmortem, process-kill, sdd-gate, push-gate, test-isolation, combined-merge-test, verify-on-origin, worktree-attribution), `docs/POSTMORTEM_RULE.md`, `docs/post-mortem/{README,TEMPLATE,PENDING}.md` (emptied), small rule docs, `.github/workflows/tests.yml`.
- New: `references/pyrite-project-guide.md`, `README.md`, `docs/ENVIRONMENT.md`, `docs/TEST_DATA.md` (generic rules only), this SDD folder.

## Data shape
Mechanical rename in ols-qa-sourced files only: `ols-qa-secrets→pyrite-qa-secrets`, `ols-project-guide→pyrite-project-guide`, `ols-qa→pyrite-qa`, `OLS-<n>→PYR-<n>`, `OLS→Pyrite`, `ols-monorepo→{PYRITE_REPO}`. Then a hand pass over CLAUDE.md, AGENTS.md, hooks and rule docs.

## Libraries
None new. Node ≥18 (already required by the guards). CI on GitHub Actions free tier for a public repo — no new cost.

## Alternatives weighed
- Copy all of ols-qa then delete → rejected by owner (too much OLS residue).
- Start from mica2-qa → rejected: older skill layout (`skills/deprecated/`).

## What could break
- Renamed strings inside guard tests → caught by running every suite (ask-guard R5 broke and was fixed per R5).
- Hooks pointing at files not copied → R3 check.
