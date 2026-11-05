#!/usr/bin/env node
'use strict';
/* Known-answer tests for tools/link-check/check.js (plain and --tracked modes).
 * A fixture tree with exactly one broken file link and one broken anchor that must be found,
 * beside every case that must not be flagged (http/mailto, placeholders, valid relative,
 * valid anchor, links inside fenced code and inline code, symlinked and nested-checkout copies).
 *
 *   node tools/link-check/check.test.js
 */
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..', '..');
const CHECK = path.join(__dirname, 'check.js');
const { slugify, extractLinks } = require('./check.js');

const CLEAN_ENV = Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith('GIT_')));

let failed = 0;
let ran = 0;
const tmpDirs = [];
function check(name, fn) {
  ran++;
  try {
    fn();
    console.log(`  ok   ${name}`);
  } catch (e) {
    failed++;
    console.log(`  FAIL ${name}\n       ${String(e.message).split('\n').join('\n       ')}`);
  }
}
function tmp() {
  const d = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'link-check-')));
  tmpDirs.push(d);
  return d;
}
function write(root, rel, body) {
  fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
  fs.writeFileSync(path.join(root, rel), body);
}
function run(cmd, args, env = {}) {
  const r = spawnSync(cmd, args, { encoding: 'utf8', env: { ...CLEAN_ENV, ...env } });
  if (r.error) throw r.error;
  return r;
}
const lines = (s) => s.trim().split('\n');

function goodTree() {
  const d = tmp();
  write(d, 'references/target.md', '# Target Heading\n\n## Step 2: Do it (now)\n\n## ขั้นตอน ทดสอบ\n\n<a name="custom-anchor"></a>\n');
  write(d, 'references/plain.txt', 'x\n');
  write(d, 'skills/a/SKILL.md', [
    '# A',
    '[web](https://example.com/x) and [mail](mailto:a@b.c)',
    '[ph]({ISSUE_KEY}.md) and [angle](<PLACEHOLDER>) and [p2](path/{name}.md)',
    '[rel](../../references/target.md) ![img](../../references/plain.txt "title")',
    '[anchor](../../references/target.md#step-2-do-it-now) [thai](../../references/target.md#ขั้นตอน-ทดสอบ)',
    '[html](../../references/target.md#custom-anchor) [self](#a) [root](/references/plain.txt)',
    '[dir](../../references/)',
    '`[code](missing-inline.md)`',
    '```md',
    '[fenced](missing-fenced.md)',
    '```',
    '~~~',
    '[tilde](missing-tilde.md)',
    '~~~',
    '[ref]: ../../references/target.md',
  ].join('\n'));
  return d;
}

// --- known answer: must-not-flag ------------------------------------------------------------
check('clean tree: exit 0, OK line counts links and files', () => {
  const d = goodTree();
  const r = run('node', [CHECK, d]);
  assert.strictEqual(r.status, 0, r.stdout);
  assert.strictEqual(r.stdout.trim(), 'LINK-CHECK OK 9 links in 2 files');
});

// --- known answer: must-find ----------------------------------------------------------------
check('one broken file link: exit 1, file:line -> target, BROKEN 1', () => {
  const d = goodTree();
  write(d, 'commands/c.md', '# C\n\nsee [gone](../references/missing.md) and [ok](../references/target.md)\n');
  const r = run('node', [CHECK, d]);
  assert.strictEqual(r.status, 1, r.stdout);
  assert.deepStrictEqual(lines(r.stdout), ['commands/c.md:3 -> ../references/missing.md', 'LINK-CHECK BROKEN 1']);
});

check('heading with inline code: anchor resolves only with the code text kept', () => {
  const d = goodTree();
  write(d, 'docs/h.md', '## Convert `<br>` now\n\n[ok](#convert-br-now)\n[bad](#convert--now)\n');
  const r = run('node', [CHECK, d]);
  assert.strictEqual(r.status, 1, r.stdout);
  assert.deepStrictEqual(lines(r.stdout), ['docs/h.md:4 -> #convert--now', 'LINK-CHECK BROKEN 1']);
});

check('broken anchor on an existing file is found', () => {
  const d = goodTree();
  write(d, 'docs/d.md', '[x](../references/target.md#no-such-heading)\n');
  const r = run('node', [CHECK, d]);
  assert.strictEqual(r.status, 1, r.stdout);
  assert.deepStrictEqual(lines(r.stdout), ['docs/d.md:1 -> ../references/target.md#no-such-heading', 'LINK-CHECK BROKEN 1']);
});

check('link that escapes the root is broken even if the file exists outside', () => {
  const d = goodTree();
  const outside = path.join(path.dirname(d), path.basename(d) + '-outside.md');
  fs.writeFileSync(outside, 'x');
  tmpDirs.push(outside);
  write(d, 'README.md', `[out](../${path.basename(outside)})\n`);
  const r = run('node', [CHECK, d]);
  assert.strictEqual(r.status, 1, r.stdout);
  assert.match(r.stdout, /^README\.md:1 -> \.\.\//m);
});

check('symlinked dirs and nested checkouts are not scanned twice / at all', () => {
  const d = goodTree();
  fs.symlinkSync(path.join(d, 'skills'), path.join(d, 'linked-skills'));
  write(d, '.worktrees/wt/x.md', '[x](missing.md)\n');
  write(d, 'nested/.git', 'gitdir: elsewhere\n');
  write(d, 'nested/y.md', '[y](missing.md)\n');
  const r = run('node', [CHECK, d]);
  assert.strictEqual(r.status, 0, r.stdout);
  assert.strictEqual(r.stdout.trim(), 'LINK-CHECK OK 9 links in 2 files');
});

// --- CANNOT-VERIFY --------------------------------------------------------------------------
check('missing root: exit 2 CANNOT-VERIFY', () => {
  const r = run('node', [CHECK, path.join(tmp(), 'nope')]);
  assert.strictEqual(r.status, 2);
  assert.match(r.stdout, /^CANNOT-VERIFY root unreadable/);
});
check('no root argument: exit 2', () => {
  const r = run('node', [CHECK]);
  assert.strictEqual(r.status, 2);
  assert.match(r.stdout, /^CANNOT-VERIFY no root given/);
});
check('root with no markdown: exit 2, never OK over nothing', () => {
  const d = tmp();
  write(d, 'a.txt', 'x');
  const r = run('node', [CHECK, d]);
  assert.strictEqual(r.status, 2);
  assert.match(r.stdout, /^CANNOT-VERIFY no markdown files/);
});

// --- units ----------------------------------------------------------------------------------
check('slugify follows GitHub rules (punctuation dropped, Thai kept, spaces to -)', () => {
  assert.strictEqual(slugify('Step 2: Do it (now)'), 'step-2-do-it-now');
  assert.strictEqual(slugify('`code` and **bold**'), 'code-and-bold');
  assert.strictEqual(slugify('ขั้นตอน ทดสอบ'), 'ขั้นตอน-ทดสอบ');
  assert.strictEqual(slugify('[Link](x.md) text'), 'link-text');
  assert.strictEqual(slugify('Mandatory: convert `<br>` before posting (all options)'), 'mandatory-convert-br-before-posting-all-options');
  assert.strictEqual(slugify('A <em>b</em> c'), 'a-b-c');
});
check('extractLinks skips fences and inline code, reads reference definitions', () => {
  const got = extractLinks('a [x](y.md)\n```\n[z](w.md)\n```\n`[q](r.md)`\n[id]: s.md\n').map((l) => `${l.line}:${l.target}`);
  assert.deepStrictEqual(got, ['1:y.md', '6:s.md']);
});

// --- --tracked (spec docs/sdd/md-link-check R2-R4) ------------------------------------------
function gitTree() {
  const d = tmp();
  for (const a of [['init', '-q'], ['config', 'user.email', 't@example.invalid'], ['config', 'user.name', 't']]) {
    const g = run('git', ['-C', d, ...a]);
    assert.strictEqual(g.status, 0, g.stderr);
  }
  write(d, '.gitignore', 'hidden-guide.md\nlocal-note.md\n');
  write(d, 'tracked.md', '# T\n');
  write(d, 'docs/a.md', '# A\n');
  write(d, 'README.md', '[t](tracked.md) [dir](docs/) [h](hidden-guide.md)\n');
  write(d, 'hidden-guide.md', '# present on disk, ignored by git\n');
  write(d, 'local-note.md', '[gone](nowhere.md)\n');
  const add = run('git', ['-C', d, 'add', 'README.md', 'tracked.md', 'docs/a.md', '.gitignore']);
  assert.strictEqual(add.status, 0, add.stderr);
  return d;
}
check('R2: an ignored file that exists on disk is OK without --tracked', () => {
  const r = run('node', [CHECK, gitTree()]);
  // plain mode scans local-note.md too, so its broken link is reported; the hidden guide is not
  assert.deepStrictEqual(lines(r.stdout), ['local-note.md:1 -> nowhere.md', 'LINK-CHECK BROKEN 1']);
});
check('R2: the same ignored file is BROKEN with --tracked; tracked file and dir are OK', () => {
  const r = run('node', [CHECK, gitTree(), '--tracked']);
  assert.strictEqual(r.status, 1, r.stdout);
  assert.deepStrictEqual(lines(r.stdout), ['README.md:1 -> hidden-guide.md', 'LINK-CHECK BROKEN 1']);
});
check('R3: --tracked does not scan an untracked markdown file', () => {
  const d = gitTree();
  write(d, 'README.md', '[t](tracked.md)\n');
  const r = run('node', [CHECK, d, '--tracked']);
  assert.strictEqual(r.status, 0, r.stdout);
  assert.strictEqual(r.stdout.trim(), 'LINK-CHECK OK 1 links in 3 files');
});
check('R4: --tracked on a directory that is not a git repo -> CANNOT-VERIFY exit 2', () => {
  const d = goodTree();
  const r = run('node', [CHECK, d, '--tracked']);
  assert.strictEqual(r.status, 2, r.stdout);
  assert.match(r.stdout, /^CANNOT-VERIFY git ls-files failed/);
});

for (const d of tmpDirs) fs.rmSync(d, { recursive: true, force: true });
console.log(`link-check: ${ran - failed}/${ran} passed`);
if (ran === 0 || failed) process.exit(1);
