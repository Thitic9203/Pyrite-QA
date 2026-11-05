# Pyrite Project Guide

Project-specific config for all Helix workflows in this workspace.
AI reads this file before asking any Pyrite-related question.

**Status: template.** Confirmed by the owner (2026-11-05): Jira key, QA dashboard, Qase project, TC & Result sheet, evidence Drive folder — real links are in the secrets file. Every other value is a placeholder. Ask the user once, record the answer here (placeholder form), and keep real hosts, ids and accounts in `~/.pyrite-qa-secrets/pyrite-secrets.md` — this repo is public.

## Jira

| Field | Value |
|-------|-------|
| Domain | `{JIRA_DOMAIN}` |
| Project key | `PYR` *(confirmed by owner 2026-11-05)* |
| Project ID | `{PYR_PROJECT_ID}` |
| Board ID | `{PYR_BOARD_ID}` |
| Board URL | `https://{JIRA_DOMAIN}/jira/software/projects/PYR/boards/{PYR_BOARD_ID}/backlog` |
| QA test-ready filter | *(not configured — ask user for the saved filter URL)* |
| QA dashboard | `{PYR_JIRA_DASHBOARD_URL}` *(owner, 2026-11-05)* |

### Workflow statuses

*(not configured — read the real status names from the PYR board, or ask the user, then record them here. Do not assume the OLS/MICA2 names.)*

| Status | Notes |
|--------|-------|
| `{STATUS_READY_TO_TEST}` | QA pickup point |
| `{STATUS_TESTING}` | QA in progress |
| `{STATUS_BLOCKED}` | Blocked (dev or QA) |
| `{STATUS_DONE}` | Closed |

### QA lifecycle

*(not configured — confirm with the user how a PYR ticket moves through QA, then record it here.)*

### Directed transitions (for retest-bug workflow)

*(not configured — read the real transition ids with `getTransitionsForJiraIssue` on a PYR ticket; they differ per project.)*

### Assignee during QA

*(not configured — ask user: does PYR change assignee during QA pickup/retest, or track ownership by status only?)*

## Confluence

| Field | Value |
|-------|-------|
| Space | `{PYR_CONFLUENCE_SPACE}` |
| Base URL | `https://{JIRA_DOMAIN}/wiki/spaces/{PYR_CONFLUENCE_SPACE}` |

## Figma

| Field | Value |
|-------|-------|
| Working file | `{PYR_FIGMA_FILE_URL}` |
| Main frame | `{PYR_FIGMA_NODE_ID}` |

## Test management (Qase or other)

| Field | Value |
|-------|-------|
| Tool | Qase *(owner, 2026-11-05)* |
| Project | `{PYR_TEST_MGMT_PROJECT}` |
| Milestone page | `{PYR_QASE_MILESTONE_URL}` |
| FE TC Jira-format file | `Draft_Jira_{ISSUE_KEY}.csv` |
| FE TC import file | `Import_Qase_{ISSUE_KEY}.csv` *(schema: `skills/procedures/tc-fe-prep-workflow/references/`)* |

## QA tracking sheet (ticket list + TC status)

| Field | Value |
|-------|-------|
| TC & Result sheet | `{PYR_TC_RESULT_SHEET_URL}` *(owner, 2026-11-05)* |
| Tabs / column layout | *(not configured — read the sheet header, then record here)* |

## Regression TC list

*(not configured — `{PYR_REGRESSION_SHEET}` is referenced by `CLAUDE.md` §7.)*

## Screenshot / video evidence

| Field | Value |
|-------|-------|
| Root Drive folder | `{PYR_EVIDENCE_DRIVE_URL}` *(owner, 2026-11-05)* |
| Per-ticket naming | *(not configured — ask user)* |

## Bug ticket field schema

*(not configured — ask whether PYR bugs keep Expected/Actual/Steps in custom fields or in `description`. Record field ids here; retest/verdict logic must read the right source.)*

## TC-review notification channel

*(not configured.)* `tools/ask-guard/ask_rules.js` ships with an empty fixed-channel list, so the AI may ask which channel. Once the owner confirms Pyrite's channel, record it here and add `'PYR'` to `FIXED_CHANNEL_PROJECTS`.

## Test environment

| Env | URL |
|-----|-----|
| Dev | `{PYR_DEV_URL}` |
| Staging | `{PYR_STAGING_URL}` |
| Production | `{PYR_PROD_URL}` |

### Auth / login flow

*(not configured — ask user how test accounts sign in. Never commit credentials; the agent never types passwords — see `docs/ENVIRONMENT.md`.)*

## Default assignee / reporter

*(not configured — ask user.)*

## Preferred CSV format

Default: UTF-8, comma-separated, with header row (per `references/csv-export-rules.md`).
