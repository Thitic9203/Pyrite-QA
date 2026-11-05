#!/usr/bin/env node
'use strict';
/* Known-answer test for scripts/check-no-secrets.sh (post-mortem #0003): OLS customer / env
 * names must be blocked in this public repo. The terms are assembled at run time so the
 * literal never lands in a tracked file.
 *
 *   node tools/secret-scan/customer_terms.test.js
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const SCAN = path.join(__dirname, '..', '..', 'scripts', 'check-no-secrets.sh');
const env = Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith('GIT_')));
const terms = [['nd', 'lp'], ['obec', 'training'], ['train', 'ing69']].map((p) => p.join(''));
let ran = 0, failed = 0;
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'secret-scan-'));
function scan(body) {
  fs.writeFileSync(path.join(dir, 'f.md'), body);
  return spawnSync('bash', [SCAN, 'f.md'], { cwd: dir, encoding: 'utf8', env }).status;
}
function t(name, ok) { ran++; if (ok) console.log(`  ok   ${name}`); else { failed++; console.log(`  FAIL ${name}`); } }
for (const w of terms) {
  t(`blocks "${w[0]}…" in a grep pattern`, scan(`grep -E '${w}|x'\n`) === 1);
  t(`blocks "${w[0]}…" in upper case`, scan(`${w.toUpperCase()} host\n`) === 1);
}
t('passes a placeholder', scan("grep -E '<OLS_CUSTOMER_TERMS>'\n") === 0);
fs.rmSync(dir, { recursive: true, force: true });
console.log(`customer-terms: ${ran - failed}/${ran} passed`);
if (ran === 0 || failed) process.exit(1);
