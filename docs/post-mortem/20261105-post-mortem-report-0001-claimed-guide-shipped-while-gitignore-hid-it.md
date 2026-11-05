# Post-Mortem Report #0001 — รายงานว่า project guide อยู่ใน repo ทั้งที่ .gitignore ซ่อนไฟล์ไว้

**ระบบ:** Pyrite QA workspace
**สภาพแวดล้อมที่ได้รับผลกระทบ:** repo Pyrite-QA (main `e472f23` → `b3b2602`)
**วันที่เกิดเหตุ:** 2026-11-05
**วันที่ค้นพบ:** 2026-11-05
**วันที่จัดทำรายงาน:** 2026-11-05
**ผู้จัดทำ:** Claude (ในเซสชันของเจ้าของงาน)
**ระดับความรุนแรง:** Medium — คนที่ clone repo ไปจะไม่มีไฟล์ตั้งค่าที่ CLAUDE.md สั่งให้อ่านก่อนทำงานทุกครั้ง แต่ยังไม่มีใครใช้ repo ก่อนแก้
**ประเภท:** เดาแล้วพูดเหมือนรู้

---

## สรุปสั้น (Executive Summary)

ตอนสร้าง Pyrite-QA ผมแทนคำ `OLS` เป็น `Pyrite` แบบ mechanical ในทุกไฟล์ที่ยกมาจาก ols-qa รวมถึง `.gitignore` ทำให้กฎ `/references/*OLS-*` กลายเป็น `/references/*Pyrite-*` ซึ่งบน macOS (filesystem ไม่สนตัวพิมพ์) ไปตรงกับ `pyrite-project-guide.md` ไฟล์จึงไม่ถูก commit
หลังจากนั้นผมรายงานเจ้าของงานว่าไฟล์ตั้งค่าอยู่ที่ path นั้น โดยตรวจแค่ว่ามีไฟล์ในเครื่อง ไม่ได้ตรวจว่ามันถูก track ใน git
แก้แล้วใน `b636b6f` · เพิ่มตัวตรวจลิงก์ `node tools/link-check/check.js <root> --tracked` (ทุกลิงก์ใน markdown ต้องชี้ไปไฟล์ที่ git track) เข้าชุดเทสต์แล้ว — รันกับ `b3b2602` จับได้ `CLAUDE.md:7 -> references/pyrite-project-guide.md`

---

## 1. ปัญหา (Problem Statement)

- `git ls-files references/pyrite-project-guide.md` ที่ `b3b2602` ได้ 0 บรรทัด
- `git check-ignore -v references/pyrite-project-guide.md` → `.gitignore:61:/references/*Pyrite-*`
- ข้อความถึงเจ้าของงานหลัง push ครั้งแรกบอกว่า "ไฟล์ตั้งค่าโปรเจกต์อยู่ที่ `references/pyrite-project-guide.md`" โดยไม่ได้บอกว่าไฟล์ไม่อยู่บน GitHub

**สิ่งที่ควรจะเป็น:** ไฟล์ที่ `CLAUDE.md` สั่งให้อ่านต้องอยู่ใน repo และคำว่า "อยู่ที่ …" ต้องตรวจจาก origin ไม่ใช่จากเครื่อง (`CLAUDE.md` §0 "ตรวจแล้ว ต้องแนบ path:line / คำสั่ง+output" · §4 เคลมว่าขึ้น main ต้องผ่าน `verify-on-origin.sh`)

---

## 2. ไทม์ไลน์ (Timeline)

| เวลา | เหตุการณ์ |
|------|-----------|
| 2026-11-05 ก่อน 10:34 | แทนคำ OLS→Pyrite ด้วย perl ในไฟล์ที่ยกจาก ols-qa รวม `.gitignore` |
| 2026-11-05 10:35 | commit `e472f23` — guide ไม่ถูก stage เพราะถูก ignore |
| 2026-11-05 หลัง 10:35 ก่อน 10:39 | **รายงานเจ้าของงานว่าไฟล์ตั้งค่าอยู่ที่ `references/pyrite-project-guide.md`** |
| 2026-11-05 10:39 | commit `b3b2602` — ยังไม่มี guide |
| 2026-11-05 หลัง 10:39 ก่อน 10:47 | `git add references/pyrite-project-guide.md` ถูกปฏิเสธว่า "ignored" ตอนบันทึกลิงก์ QA ที่เจ้าของงานให้ — Claude จับได้เอง |
| 2026-11-05 10:47 | commit `b636b6f` แก้กฎเป็น `*PYR-*` และ commit guide · `verify-on-origin.sh` → `ON-ORIGIN` |

---

## 3. สาเหตุโดยละเอียด (Root Cause Analysis)

### 5 Whys

1. **ทำไม guide ไม่ขึ้น repo?** — เพราะ `.gitignore` ignore ไฟล์นั้น
2. **ทำไม `.gitignore` ignore ไฟล์นั้น?** — เพราะกฎ `*OLS-*` ถูกแทนเป็น `*Pyrite-*` และบน macOS ตรงกับ `pyrite-…` แบบไม่สนตัวพิมพ์
3. **ทำไมกฎถูกแทน?** — เพราะการแทนคำ mechanical ใช้กับทุกไฟล์ รวมถึงไฟล์ที่เป็นรูปแบบ (pattern) ไม่ใช่ข้อความ
4. **ทำไมไม่มีใครเห็นก่อนรายงาน?** — เพราะผมตรวจแค่ "ลิงก์ชี้ไปไฟล์ที่มีในเครื่อง" (`test -e`) ไม่ได้ตรวจ "ไฟล์ถูก git track"
5. **ทำไมตรวจแค่นั้น?** — เพราะไม่มีตัวตรวจอัตโนมัติที่เทียบลิงก์ใน markdown กับ `git ls-files` · การตรวจจาก clone ใหม่ก็ไม่ได้เปิดไฟล์ที่ CLAUDE.md อ้าง

**ทำไมชั้นป้องกันที่มีอยู่ถึงไม่จับ:** ชุดเทสต์ 16 ชุดไม่มีชุดไหนตรวจลิงก์เอกสาร · secret scan ตรวจแต่ไฟล์ที่ track · การตรวจจาก clone ใหม่รันแค่ setup/เทสต์/สแกน ไม่ได้ตรวจลิงก์

---

## 4. ผลกระทบ (Impact)

| ด้าน | ผลกระทบ |
|------|---------|
| ผู้ใช้งานจริง / ลูกค้า | ไม่ถึง — ยังไม่มีใคร clone ไปใช้ระหว่าง 10:35–10:47 |
| เจ้าของงาน | ได้ข้อมูลผิดหนึ่งข้อในรายงานสรุป |
| ข้อมูล / ระบบ | ไม่เสียหาย ไฟล์อยู่ในเครื่องครบ |
| ความเชื่อถือของงานรอบนั้น | ผล "ตรวจจาก clone ใหม่" ไม่ได้ครอบเรื่องเอกสาร ต้องตรวจซ้ำด้วยตัวตรวจลิงก์ |

---

## 5. แนวทางการแก้ไข (Fix)

- `.gitignore` เปลี่ยน `/references/*Pyrite-*` → `/references/*PYR-*` (ไฟล์ข้อมูลตาม ticket key) — commit `b636b6f`
- commit `references/pyrite-project-guide.md` — commit `b636b6f`

**ยืนยันแล้วด้วย:** `gh api repos/Thitic9203/Pyrite-QA/contents/references/pyrite-project-guide.md --jq .name` → `pyrite-project-guide.md`

---

## 6. แนวทางการป้องกันไม่ให้เกิดปัญหาซ้ำ (Prevention)

| # | มาตรการ | ชนิด | สถานะ |
|---|---------|------|-------|
| P1 | `tools/link-check/` — ทุกลิงก์ relative ในไฟล์ `.md` ที่ track ต้องชี้ไปไฟล์ที่ `git ls-files` มีอยู่ (ไฟล์ที่มีแค่ในเครื่องนับว่าพัง) รันใน pre-push และ CI (spec `docs/sdd/md-link-check`) | เครื่องมือ + เทส + CI | ทำแล้ว |
| P2 | `CLAUDE.md` §4: ก่อนแทนคำแบบ mechanical ต้องตัด `.gitignore` และไฟล์ pattern ออก แล้วตรวจด้วย `git check-ignore` ทุกไฟล์ที่ CLAUDE.md อ้าง | กฎ | ทำแล้ว |

**กฎที่เพิ่มจากเหตุนี้:** `CLAUDE.md` §4 บรรทัด "แทนคำแบบ mechanical" · `tools/link-check/link_check.js`

---

## 7. การตรวจจับปัญหา (Detection)

- **ใครจับได้ / จับได้ยังไง:** Claude จับได้เองตอน `git add` ไฟล์ guide แล้วถูกปฏิเสธ
- **ใช้เวลาเท่าไหร่กว่าจะรู้:** ไม่เกิน 12 นาที (commit 10:35 → แก้ 10:47 ตามเวลา commit)
- **รอบหน้าอะไรจะจับได้เร็วกว่านี้:** P1 ทำให้ pre-push ล้มตั้งแต่ push ครั้งแรก เพราะ CLAUDE.md ลิงก์ไปไฟล์ที่ไม่ได้ track

---

## 8. บทเรียนที่ได้ (Lessons Learned)

### สิ่งที่ทำได้ดี
- เมื่อ `git add` ถูกปฏิเสธ หาต้นเหตุด้วย `git check-ignore -v` แทนการ `git add -f`

### สิ่งที่ต้องปรับปรุง
- คำว่า "อยู่ที่ …" ต้องตรวจจาก origin ไม่ใช่จากเครื่อง
- การแทนคำ mechanical ห้ามแตะไฟล์ที่เป็น pattern

---

## 9. Action Items

| # | Action | ผู้รับผิดชอบ | ความสำคัญ | สถานะ |
|---|--------|--------------|-----------|-------|
| 1 | เพิ่ม `tools/link-check/` + เทสต์ + ผูกเข้าชุดเทสต์ | Claude | High | Done |
| 2 | เพิ่มกฎใน `CLAUDE.md` §4 | Claude | Medium | Done |

---

## 10. Technical Appendix

**ไฟล์ที่เปลี่ยน:**
- `.gitignore` — กฎ ignore ของไฟล์ตาม ticket key
- `references/pyrite-project-guide.md` — commit ขึ้น repo

**Commit:** `b636b6f`

**หลักฐาน:**
```
$ git check-ignore -v references/pyrite-project-guide.md
.gitignore:61:/references/*Pyrite-*	references/pyrite-project-guide.md
```
