# ATMS Database Layer (`db/`)

A standalone SQLite database that encodes **every section of the Granular Details
Report** and merges in the existing React app's seed entities. Built with Node's
built-in `node:sqlite` (Node 22+) — **no new dependencies**.

## Build / run

```bash
npm run db:build       # or: node db/build.mjs
```

This (re)creates `db/atms.db`, validates every identifier, and prints a
verification report (row counts, validator pass/fail, and the §4 module reports).

## Files

| File | Purpose |
| :--- | :--- |
| `schema.sql`   | Full schema. Each table is annotated with the report section (§N) it models. |
| `seed.js`      | The **literal** report values (§1–§6): user IDs like `11553/17`, schedule `2018 EXT-M1-01`, sections `18-19-M1..M44`, REG/EXT program years, campuses/centers (`Misrak-1`, `LSM`, `K-TA`, `MIS-01`, `Yeka`), rooms incl. `Lab 201`. |
| `validators.js`| Pure regex validators/parsers for the §1–§3 identifier formats. |
| `queries.js`   | The §4 module reports as parameterized SQL (Manage Users, Manage Trainees, Trainer Load, COC, Coop Follow-ups). |
| `build.mjs`    | Creates the DB, seeds report + bridged app data, validates IDs, prints the report. |
| `atms.db`      | Generated SQLite file (git-ignored; rebuild any time). |

## Report → schema mapping

| Report section | Tables |
| :--- | :--- |
| §1 ID Types & Formats | `app_user.username`, `trainee.id_number`, `schedule.id` + `validators.js` |
| §2 Class Sections | `section` (`year_start`, `year_end`, `code`) |
| §3 Room Details | `room` (`room_type` = CLASSROOM / COMPUTER_LAB / WORKSHOP) |
| §4 Trainer/Trainee Fields | `app_user`, `trainee`, `trainer`, `trainer_load`, `coc_registration`, `coop_followup` + `queries.js` |
| §5 System Parameters | `level`, `program_year` (REG/EXT), `group_type` |
| §6 Locations / Campuses | `campus`, `center` |
| TVET Reports module | `attendance`, `course_coverage`, `skill_gap_training` |
| TVET Assessment module | `exam_approval`, `assessment_result` |
| Trainers Evaluation (360°) | `trainer_evaluation` (precomputed weighted score) |
| LMS + Complaints | `webinar`, `complaint` |

The build runs `PRAGMA foreign_key_check` and exits non-zero on any orphan row or
identifier-format failure, so `npm run db:build` doubles as an integrity test.

## Identifier formats (validated on every build)

| Format | Example | Validator |
| :--- | :--- | :--- |
| User/Trainee/Trainer ID | `11553/17` | `isUserId` / `parseUserId` |
| Schedule/Section ID | `2018 EXT-M1-01` | `isScheduleId` / `parseScheduleId` |
| Class section | `18-19-M1` | `isSectionCode` / `parseSectionCode` |
| Room | `101`, `Lab 201` | `classifyRoom` |

```js
import V from './db/validators.js';
V.parseScheduleId('2018 EXT-M1-01');
// { year: 2018, track: 'EXT', sectionCode: 'M1', sequence: 1, programYearId: '2018 EXT' }
```

## Querying the DB

```js
import { DatabaseSync } from 'node:sqlite';
import Q from './db/queries.js';
const db = new DatabaseSync('db/atms.db');
console.table(db.prepare(Q.TRAINER_LOAD).all());
```

## Notes on the merge

- Report literals and app entities coexist. App rooms are namespaced (`APP-…`) so
  they don't collide with the report's room numbers.
- `trainer_load` rows for `2018 REG`/`2018 EXT` are **synthesized** from the app's
  course credit hours to make the §4 Trainer Load pivot meaningful — clearly demo data.
- The app frontend is untouched; this layer is additive. To feed the live UI from
  the DB, export `atms.db` to JSON and load it in `DataContext` (not done here).
