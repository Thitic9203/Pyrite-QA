# Spec — markdown links must point at tracked files

## Problem
Post-mortem #0001 (2026-11-05): `CLAUDE.md` linked `references/pyrite-project-guide.md`, the file existed on disk, but `.gitignore` hid it, so a clone had no guide. catch-ai the same day found 14 relative links pointing at files that do not exist (`node tools/link-check/check.js .` → `LINK-CHECK BROKEN 14`).

## Rules
**R1.** When the suites run, every relative link in a tracked `*.md` file must point at a path that exists — reusing the ols-qa checker `tools/link-check/check.js` (rules in its header: schemes, `<…>` and `{placeholder}` targets ignored; anchors must match a heading).
**R2.** With `--tracked`, a target counts as existing only if `git ls-files` lists it (or, for a directory, lists a file under it). A file that exists only on disk — ignored or untracked — is broken.
**R3.** With `--tracked`, only tracked `*.md` files are scanned, so a local-only note never fails the gate.
**R4.** If git cannot be read in `--tracked` mode, the checker must exit 2 (`CANNOT-VERIFY`), never 0.
**R5.** The check runs inside `scripts/run-test-suites.sh` as a test suite, so pre-push and CI both enforce it.

## Edge cases
- Links inside fenced code or inline code are not links (inherited rule).
- Links in helix-sourced files to helix-only docs: the target file is copied in, not the link deleted, so the files stay in sync with helix.

## Done when
- Known-answer test: an ignored-but-present target is BROKEN under `--tracked` and OK without it; a tracked target is OK; a non-repo root under `--tracked` exits 2.
- `node tools/link-check/check.js . --tracked` → `LINK-CHECK OK` on main.
- `bash scripts/run-test-suites.sh .` green and lists the link-check suite.
