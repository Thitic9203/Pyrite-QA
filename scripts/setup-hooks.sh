#!/usr/bin/env bash
# Activate Pyrite-QA git hooks: pre-commit (secret scan + post-mortem debt gate) and
# pre-push (every test suite on the commit being pushed). No sync to helix from this repo.
# Run once per clone:  bash scripts/setup-hooks.sh
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
chmod +x "$ROOT"/scripts/hooks/* 2>/dev/null || true
git -C "$ROOT" config core.hooksPath scripts/hooks
echo "✅ Pyrite-QA hooks active (core.hooksPath=scripts/hooks): pre-commit + pre-push."
