#!/usr/bin/env node
'use strict';
/* Repo gate (spec docs/sdd/md-link-check R1, R5): every relative link in a tracked *.md file
 * points at a tracked file. Runs check.js --tracked on this repo; any exit other than 0 fails.
 *
 *   node tools/link-check/repo_links.test.js
 */
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..', '..');
const env = Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith('GIT_')));
const r = spawnSync(process.execPath, [path.join(__dirname, 'check.js'), ROOT, '--tracked'], { encoding: 'utf8', env });
process.stdout.write(r.stdout || '');
process.stderr.write(r.stderr || '');
if (r.status === 0 && /^LINK-CHECK OK [1-9]\d* links/m.test(r.stdout)) {
  console.log('repo-links: 1/1 passed');
} else {
  console.log(`repo-links: FAIL (exit ${r.status})`);
  process.exit(1);
}
