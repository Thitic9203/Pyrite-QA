# Tasks — bootstrap the Pyrite-QA workspace

| # | Task | Rule | Test that fails first | Done when |
|---|------|------|-----------------------|-----------|
| T1 | Copy helix skills/commands/references minus OLS-only | R1 | `ls skills` shows review-result → must not | OLS-only skills absent |
| T2 | Copy ols-qa scaffolding + guards with tests, empty the ledger | R2, R3 | postmortem-guard suite fails without `PENDING.md` | all suites listed and green |
| T3 | Prune hooks not shipped from settings.json | R3 | hook path check lists missing files | zero missing paths |
| T4 | Rename OLS→Pyrite, hand-fix docs | R2, R4 | sweep shows OLS names | sweep clean outside helix files |
| T5 | Empty fixed-channel list in ask-guard, test via env | R5 | ask-guard R5 tests fail after rename | 79/79 pass, default list `[]` |
| T6 | Write project guide, README, SDD | R4 | — | files present |
| T7 | Secret scan + suites, create public repo, push, verify fresh clone | R6 | — | Done-when lines in spec.md all true |
