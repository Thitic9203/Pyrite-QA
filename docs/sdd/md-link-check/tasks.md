# Tasks — markdown links must point at tracked files

| # | Task | Rule | Test that fails first | Done when |
|---|------|------|-----------------------|-----------|
| T1 | Add `--tracked` to check.js | R2, R3, R4 | ignored target reported OK | known-answer cases pass |
| T2 | Trim wrapper cases, add tracked cases | R2–R4 | — | `node tools/link-check/check.test.js` green |
| T3 | Repo suite `repo_links.test.js` | R1, R5 | suite fails with 14 broken | suite listed + green |
| T4 | Fix every broken target | R1 | T3 red | `LINK-CHECK OK` |
