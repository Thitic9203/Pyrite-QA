#!/bin/bash
# Inject Pyrite QA workspace context at session start.
# This repo is PUBLIC — no real URLs, hosts, ids or accounts may be hardcoded here.
# Live links come from the local, untracked secrets store.
cd "$CLAUDE_PROJECT_DIR" 2>/dev/null || exit 0

# Layer 3 of the post-mortem defence: an unpaid debt from a previous session is the first
# thing this session hears, before anything else can crowd it out. Prints nothing when
# there is no debt, and can never fail the hook.
bash "$CLAUDE_PROJECT_DIR/.claude/hooks/postmortem-debt.sh" 2>/dev/null || true

echo "=== Pyrite QA Workspace ==="

SECRETS="$HOME/.pyrite-qa-secrets/pyrite-secrets.md"
if [ -f "$SECRETS" ]; then
  echo "Config store: $SECRETS (local, untracked — holds the real URLs/accounts/ids)"
  echo "Repo docs use placeholders only: <JIRA_DOMAIN> <DEV_HOST> <TEST_ACCOUNT_n> ..."
else
  echo "!!  $SECRETS not found — Pyrite links/accounts unavailable this session."
  echo "    Restore it from your password manager or ask the QA Lead; do NOT paste"
  echo "    real values into this repo, it is public."
fi
echo ""
echo "Helix commands: /helix  /tc-fe-prep  /tc-api-prep  /retest-bug  /testing-ticket  /create-bug"
echo ""

# The hand-written WIP note is a pointer, not a dump: printed in full it was 12 KB (2026-09-19)
# injected into every session and every compaction, and together with a 478 KB CLAUDE.md it made
# autocompact thrash. Its title line carries the date, which is what decides whether to open it.
if [ -f .claude/session-context.md ]; then
  echo "=== WIP Context (hand-written — not auto-loaded; open only if the task touches it) ==="
  echo "File: .claude/session-context.md ($(wc -c < .claude/session-context.md | tr -d ' ') bytes)"
  grep -m1 '^# ' .claude/session-context.md
  grep '^## ' .claude/session-context.md | head -8
fi
