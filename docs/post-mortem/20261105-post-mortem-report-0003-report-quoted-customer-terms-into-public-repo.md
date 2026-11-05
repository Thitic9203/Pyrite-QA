# Post-Mortem Report #0003 — รายงาน post-mortem ยกคำค้นที่มีชื่อลูกค้าขึ้น repo public

**ระบบ:** Pyrite QA workspace
**สภาพแวดล้อมที่ได้รับผลกระทบ:** repo Pyrite-QA (public) — commit `71a7c80` บน main
**วันที่เกิดเหตุ:** 2026-11-05
**วันที่ค้นพบ:** 2026-11-05
**วันที่จัดทำรายงาน:** 2026-11-05
**ผู้จัดทำ:** Claude (ในเซสชันของเจ้าของงาน)
**ระดับความรุนแรง:** High — ชื่อลูกค้าของอีกโปรเจกต์ขึ้น repo สาธารณะ ซึ่ง `CLAUDE.md` §5 ห้าม และยังค้างอยู่ใน history จนกว่าจะเขียน history ใหม่
**ประเภท:** อื่นๆ — ข้อมูลต้องห้ามหลุดขึ้น repo public

---

## สรุปสั้น (Executive Summary)

ตอนเขียนรายงาน #0002 ผมยกคำสั่ง `grep` ที่ใช้กวาด history มาเป็นหลักฐานทั้งบรรทัด ซึ่ง pattern ของคำสั่งนั้นมีชื่อลูกค้าและชื่อ env ของ OLS อยู่ข้างใน
`check-no-secrets.sh` ปล่อยผ่าน เพราะ hash set ที่ยกมาจาก ols-qa ไม่มีคำเหล่านี้ (ใน ols-qa คำเหล่านี้ใช้ได้ตามปกติ) ไฟล์จึงขึ้น main ใน `71a7c80`
แก้ไฟล์ปัจจุบันเป็น placeholder แล้ว เพิ่ม hash ของคำเหล่านี้ และเพิ่มเทสต์ known-answer เข้าชุดเทสต์ ส่วนการเอาออกจาก history ต้องรอเจ้าของงานอนุมัติ force-push

---

## 1. ปัญหา (Problem Statement)

- `rtk proxy git log -p --all` เจอ 2 บรรทัดในไฟล์รายงาน #0002 (บรรทัด "ยืนยันแล้วด้วย" และบล็อกหลักฐาน)
- `git ls-files -z | xargs -0 bash scripts/check-no-secrets.sh` ที่ `49a58e8` → `[guard] clean` ทั้งที่มีคำต้องห้าม

**สิ่งที่ควรจะเป็น:** `CLAUDE.md` §5 "ห้าม commit: … ชื่อลูกค้า/พนักงาน … ใช้ `<ORG>` `{ISSUE_KEY}` … ค่าจริงอยู่ `~/.pyrite-qa-secrets/` เท่านั้น" และ `docs/POSTMORTEM_RULE.md` "repo public: รายงานห้ามมี … ชื่อผู้ใช้"

---

## 2. ไทม์ไลน์ (Timeline)

| เวลา | เหตุการณ์ |
|------|-----------|
| 2026-11-05 ก่อน 10:52 | เขียนรายงาน #0002 ยกคำสั่ง grep ทั้งบรรทัด |
| 2026-11-05 หลัง 10:52 | **commit `71a7c80` และ push ขึ้น main (public)** — secret scan ผ่าน |
| 2026-11-05 หลัง 10:52 | push `49a58e8` · ตรวจจาก clone ใหม่ เจอ 2 บรรทัด — Claude จับได้เอง |
| 2026-11-05 หลัง 10:52 | แจ้งเจ้าของงาน แก้ไฟล์ เพิ่ม hash + เทสต์ |

---

## 3. สาเหตุโดยละเอียด (Root Cause Analysis)

### 5 Whys

1. **ทำไมชื่อลูกค้าขึ้น repo?** — เพราะรายงานยกคำสั่ง grep ที่มีชื่อนั้นใน pattern
2. **ทำไมยก pattern จริง?** — เพราะต้องการแนบ "คำสั่งที่รันจริง" เป็นหลักฐานตาม §0 โดยไม่ได้คิดว่าตัว pattern ก็คือข้อมูลต้องห้าม
3. **ทำไม pre-commit ไม่บล็อก?** — เพราะ hash set ที่ยกจาก ols-qa ไม่มีคำเหล่านี้ (ols-qa ใช้คำเหล่านี้ได้)
4. **ทำไม hash set ไม่มี?** — เพราะตอน bootstrap ไม่ได้นิยามว่าใน repo นี้ "ข้อมูลของ OLS" นับเป็นข้อมูลต้องห้ามด้วย และไม่มีเทสต์ที่ยืนยันว่าสแกนเนอร์บล็อกคำเหล่านั้น
5. **ทำไมไม่มีเทสต์?** — เพราะ bootstrap ยกสแกนเนอร์มาแล้วทดสอบแค่ว่า "repo สแกนผ่าน" ไม่ได้ทดสอบว่า "ของต้องห้ามสแกนไม่ผ่าน" (ไม่มี known-negative ตาม §0)

**ทำไมชั้นป้องกันที่มีอยู่ถึงไม่จับ:** pre-commit สแกนผ่านเพราะไม่มี hash · CI สแกนด้วยสคริปต์เดียวกัน · การกวาด history ตอน bootstrap ทำก่อนรายงานนี้จะมี

---

## 4. ผลกระทบ (Impact)

| ด้าน | ผลกระทบ |
|------|---------|
| ผู้ใช้งานจริง / ลูกค้า | ชื่อลูกค้าของ OLS อ่านได้สาธารณะใน history ของ Pyrite-QA (ชื่อเดียวกันมีอยู่ใน ols-qa ที่เป็น public อยู่แล้ว) — ไม่มีรหัสผ่านหรือ host |
| เจ้าของงาน | ต้องตัดสินว่าจะเขียน history ใหม่หรือไม่ |
| ข้อมูล / ระบบ | ไม่มี secret ที่ต้อง rotate |
| ความเชื่อถือของงานรอบนั้น | ผลของ secret scan ก่อนหน้านี้ใช้ได้เฉพาะคำที่มี hash — ตรวจซ้ำทั้ง tree แล้วหลังเพิ่ม hash |

---

## 5. แนวทางการแก้ไข (Fix)

- รายงาน #0002: แทน pattern ด้วย `'<OLS_CUSTOMER_TERMS>'` (2 จุด)
- `scripts/check-no-secrets.sh`: เพิ่ม hash ของคำลูกค้า/env ของ OLS 5 ตัว

**ยืนยันแล้วด้วย:** ไฟล์ที่มีคำต้องห้าม → rc=1 · ไฟล์ placeholder → rc=0 · `git ls-files -z | xargs -0 bash scripts/check-no-secrets.sh` → `clean — 226 file(s)` · `node tools/secret-scan/customer_terms.test.js` → `7/7 passed`

---

## 6. แนวทางการป้องกันไม่ให้เกิดปัญหาซ้ำ (Prevention)

| # | มาตรการ | ชนิด | สถานะ |
|---|---------|------|-------|
| P1 | hash ของคำลูกค้า/env ของ OLS ใน `scripts/check-no-secrets.sh` — pre-commit และ CI บล็อก | เครื่องมือ | ทำแล้ว |
| P2 | `tools/secret-scan/customer_terms.test.js` — known-answer (ต้องบล็อก 6 · ต้องผ่าน 1) อยู่ในชุดเทสต์ ถ้าใครลบ hash เทสต์แดง | เทส + CI | ทำแล้ว |
| P3 | `docs/POSTMORTEM_RULE.md`: หลักฐานที่เป็นคำสั่งค้นต้องใช้ placeholder แทนคำที่ค้น | กฎ | ทำแล้ว |

**กฎที่เพิ่มจากเหตุนี้:** `docs/POSTMORTEM_RULE.md` บรรทัด repo public · `tools/secret-scan/customer_terms.test.js`
ข้อจำกัดที่วัดแล้ว: สแกนเนอร์ตัดคำด้วย `[A-Za-z0-9][A-Za-z0-9._@+-]{2,}` คำที่ติดกับ `-` หรือ `.` จะเป็น token ยาวกว่าและไม่ตรง hash

---

## 7. การตรวจจับปัญหา (Detection)

- **ใครจับได้ / จับได้ยังไง:** Claude ตอนกวาด history จาก clone ใหม่ (ไม่ผ่าน rtk) หลัง push
- **ใช้เวลาเท่าไหร่กว่าจะรู้:** ภายในงานเดียวกัน หลัง push 2 commit
- **รอบหน้าอะไรจะจับได้เร็วกว่านี้:** P1 บล็อกตั้งแต่ pre-commit

---

## 8. บทเรียนที่ได้ (Lessons Learned)

### สิ่งที่ทำได้ดี
- กวาด history จาก clone ใหม่แบบไม่ย่อ ตามกฎที่เพิ่งเพิ่มจาก #0002 — จึงจับได้

### สิ่งที่ต้องปรับปรุง
- ตัวสแกนที่ยกมาต้องทดสอบด้วยของต้องห้ามของ repo ใหม่ ไม่ใช่แค่ดูว่า repo สแกนผ่าน

---

## 9. Action Items

| # | Action | ผู้รับผิดชอบ | ความสำคัญ | สถานะ |
|---|--------|--------------|-----------|-------|
| 1 | hash + known-answer test | Claude | High | Done |
| 2 | ตัดสินว่าจะเขียน history ใหม่ (force-push main) เพื่อเอาคำออกจาก `71a7c80` หรือไม่ | เจ้าของงาน | High | Open |

---

## 10. Technical Appendix

**ไฟล์ที่เปลี่ยน:**
- `docs/post-mortem/20261105-post-mortem-report-0002-history-sweep-read-rtk-compacted-git-log.md` — pattern → placeholder
- `scripts/check-no-secrets.sh` — hash 5 ตัว
- `tools/secret-scan/customer_terms.test.js` — known-answer test ใหม่
- `docs/POSTMORTEM_RULE.md` — กฎหลักฐานคำค้น

**Commit:** commit ที่เพิ่มรายงานนี้ · ต้นเหตุ `71a7c80`

**หลักฐาน:**
```
$ bash scripts/check-no-secrets.sh must-catch.md ; echo $?
1
$ bash scripts/check-no-secrets.sh must-pass.md ; echo $?
0
```
