# Plan — markdown links must point at tracked files

## Files touched
- `tools/link-check/check.js` (from ols-qa) — add `--tracked`: read `git -C <root> ls-files -z` once (clean git env), build a set of files + parent dirs; scan only tracked `.md`; existence = membership.
- `tools/link-check/check.test.js` (from ols-qa) — drop the `helix-link-check.sh` wrapper cases (wrapper not in this repo); add R2–R4 known-answer cases.
- `tools/link-check/repo_links.test.js` — new suite: runs `check.js <repo> --tracked`, fails on exit ≠ 0 (R5, picked up by `scripts/list-test-suites.sh` via `*.test.js`).
- Broken targets: copy helix `scripts/export-*.py`, `docs/{pluton-ship-checklist,skill-rules-authoring,tc-quality-full,new-skill-template}.md`, `hooks/session-start`; write a Pyrite `docs/DOC-MAP.md`; add `## Install (one-time)` to README; drop links to OLS post-mortems/specs in guard READMEs (plain text "ols-qa …" instead).

## Libraries
None. Node built-ins only.

## Alternatives weighed
- Separate tracked-check script → rejected: two link parsers would drift.
- Delete broken links in helix files → rejected: forks the files from helix.

## What could break
- `ls-files` on a repo mid-merge lists conflicted paths once per stage — set dedupes.
