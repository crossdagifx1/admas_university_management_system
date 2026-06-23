-- ATMS SQLite schema — models every section of the Granular Details Report.
-- Section refs (§N) map to the report headings. Built with node:sqlite (Node 22+).

PRAGMA foreign_keys = ON;

-- ============================================================================
-- §5 SYSTEM PARAMETERS — reference tables for enumerated values
-- ============================================================================

-- Academic levels: Level I..IV
CREATE TABLE level (
  id        INTEGER PRIMARY KEY,          -- 1..4
  name      TEXT NOT NULL UNIQUE          -- 'Level I'
);

-- Training year/program: regular vs extension, e.g. (2018,'REG'), (2018,'EXT')
CREATE TABLE program_year (
  id        TEXT PRIMARY KEY,             -- '2018 REG', '2018 EXT'
  year      INTEGER NOT NULL,             -- 2018
  track     TEXT NOT NULL CHECK (track IN ('REG','EXT')),
  UNIQUE (year, track)
);

-- Group types within a class: Full Class / Group 1 / Group 2
CREATE TABLE group_type (
  id        INTEGER PRIMARY KEY,
  name      TEXT NOT NULL UNIQUE
);

-- ============================================================================
-- §6 LOCATIONS / CAMPUSES
-- ============================================================================

CREATE TABLE campus (
  id        TEXT PRIMARY KEY,             -- 'CMP-MISRAK'
  name      TEXT NOT NULL,                -- 'Admas University Misrak Campus'
  is_main   INTEGER NOT NULL DEFAULT 0    -- 1 = main campus
);

-- Centers/locations belong to a campus: Misrak-1, LSM, K-TA, MIS-01, Yeka ...
CREATE TABLE center (
  id        TEXT PRIMARY KEY,             -- 'CEN-MISRAK-1' or report code 'MIS-01'
  code      TEXT NOT NULL UNIQUE,         -- 'Misrak-1', 'LSM', 'K-TA', 'MIS-01', 'Yeka'
  name      TEXT NOT NULL,
  campus_id TEXT REFERENCES campus(id),
  location  TEXT
);

-- ============================================================================
-- §3 ROOM DETAILS — classrooms + computer labs
-- ============================================================================

CREATE TABLE room (
  id          TEXT PRIMARY KEY,           -- 'RM-101', 'RM-LAB-201'
  label       TEXT NOT NULL,              -- '101', 'Lab 201'
  room_type   TEXT NOT NULL CHECK (room_type IN ('CLASSROOM','COMPUTER_LAB','WORKSHOP')),
  capacity    INTEGER,
  center_id   TEXT REFERENCES center(id)
);

-- ============================================================================
-- DEPARTMENTS & COURSES (supporting structure from the app data dictionary)
-- ============================================================================

CREATE TABLE department (
  id    TEXT PRIMARY KEY,
  name  TEXT NOT NULL,
  code  TEXT
);

CREATE TABLE course (
  id           TEXT PRIMARY KEY,
  unit_code    TEXT,
  unit_title   TEXT NOT NULL,
  credit_hours INTEGER NOT NULL DEFAULT 0,
  total_los    INTEGER NOT NULL DEFAULT 0,
  department_id TEXT REFERENCES department(id)
);

-- ============================================================================
-- §2 CLASS SECTIONS — naming convention Year-Year-Code (e.g. 18-19-M1)
-- ============================================================================

CREATE TABLE section (
  id            TEXT PRIMARY KEY,         -- canonical code '18-19-M1'
  year_start    INTEGER,                  -- 18
  year_end      INTEGER,                  -- 19
  code          TEXT,                     -- 'M1' / 'A1'
  level_id      INTEGER REFERENCES level(id),
  department_id TEXT REFERENCES department(id),
  program_year_id TEXT REFERENCES program_year(id)
);

-- ============================================================================
-- §1 / §4 USERS — User/Trainee/Trainer IDs double as usernames (e.g. 11553/17)
-- ============================================================================

CREATE TABLE app_user (
  id            TEXT PRIMARY KEY,         -- internal 'USR-001'
  username      TEXT NOT NULL UNIQUE,     -- report username/id, e.g. '11553/17'
  full_name     TEXT NOT NULL,
  role          TEXT NOT NULL CHECK (role IN ('Admin','Coordinator','Trainer','Trainee')),
  user_type     TEXT,                     -- §4 "Role & Type" free text e.g. 'Trainer'
  contact       TEXT,                     -- §4 Manage Users "Contact"
  email         TEXT,
  department_id TEXT REFERENCES department(id),
  status        TEXT NOT NULL DEFAULT 'Active',
  created_at    TEXT
);

CREATE TABLE trainer (
  id              TEXT PRIMARY KEY,
  user_id         TEXT REFERENCES app_user(id),
  name            TEXT NOT NULL,
  staff_no        TEXT,
  department_id   TEXT REFERENCES department(id),
  employment_type TEXT,                   -- FT / PT
  present_status  TEXT,
  rating          REAL
);

-- §4 Manage Trainees: Full Name, ID Number, Sex, Level, Year, Section
CREATE TABLE trainee (
  id              TEXT PRIMARY KEY,       -- internal 'TRNE-001'
  id_number       TEXT NOT NULL UNIQUE,   -- §4 "ID Number" / username e.g. '2031/16'
  full_name       TEXT NOT NULL,
  sex             TEXT CHECK (sex IN ('M','F')),
  level_id        INTEGER REFERENCES level(id),
  year            INTEGER,                -- entry year
  section_id      TEXT REFERENCES section(id),
  department_id   TEXT REFERENCES department(id),
  city            TEXT,
  phone           TEXT,
  status          TEXT DEFAULT 'Active'
);

-- ============================================================================
-- §1 SCHEDULE/SECTION IDs — composite e.g. '2018 EXT-M1-01'
-- ============================================================================

CREATE TABLE schedule (
  id              TEXT PRIMARY KEY,       -- '2018 EXT-M1-01'
  program_year_id TEXT REFERENCES program_year(id),
  section_id      TEXT REFERENCES section(id),
  course_id       TEXT REFERENCES course(id),
  trainer_id      TEXT REFERENCES trainer(id),
  room_id         TEXT REFERENCES room(id),
  center_id       TEXT REFERENCES center(id),
  group_type_id   INTEGER REFERENCES group_type(id),
  time_slot_1     TEXT,
  time_slot_2     TEXT,
  start_date      TEXT,
  end_date        TEXT
);

-- ============================================================================
-- §4 TRAINER LOAD REPORT — yearly credit hours per program_year
-- ============================================================================

CREATE TABLE trainer_load (
  id              INTEGER PRIMARY KEY,
  trainer_id      TEXT NOT NULL REFERENCES trainer(id),
  program_year_id TEXT NOT NULL REFERENCES program_year(id),
  credit_hours    INTEGER NOT NULL DEFAULT 0,
  UNIQUE (trainer_id, program_year_id)
);

-- ============================================================================
-- §4 COC REGISTRATION FORM
-- ============================================================================

CREATE TABLE coc_registration (
  id             TEXT PRIMARY KEY,
  trainee_id     TEXT REFERENCES trainee(id),
  full_name      TEXT NOT NULL,
  current_level  INTEGER REFERENCES level(id),
  cell_phone     TEXT,
  amount_paid    REAL DEFAULT 0,
  city           TEXT,
  department_id  TEXT REFERENCES department(id),
  registration_date TEXT,
  status         TEXT DEFAULT 'Registered'
);

-- ============================================================================
-- §4 COOPERATIVE TRAINING FOLLOW-UPS
-- ============================================================================

CREATE TABLE coop_followup (
  id                TEXT PRIMARY KEY,
  trainee_id        TEXT REFERENCES trainee(id),
  trainee_name      TEXT,
  organization_name TEXT,
  visit_date        TEXT,
  outcome           TEXT,
  notes             TEXT,
  status            TEXT
);

-- ============================================================================
-- TVET REPORTS MODULE
-- ============================================================================

-- Attendance submissions
CREATE TABLE attendance (
  id          TEXT PRIMARY KEY,
  schedule_id TEXT REFERENCES schedule(id),
  trainer_id  TEXT REFERENCES trainer(id),
  date        TEXT,
  present     INTEGER DEFAULT 0,
  absent      INTEGER DEFAULT 0,
  late        INTEGER DEFAULT 0,
  total       INTEGER DEFAULT 0,
  photo_url   TEXT,
  notes       TEXT
);

-- Course coverage submissions: covered vs total Learning Outcomes (LOs)
CREATE TABLE course_coverage (
  id            TEXT PRIMARY KEY,
  schedule_id   TEXT REFERENCES schedule(id),
  trainer_id    TEXT REFERENCES trainer(id),
  course_id     TEXT REFERENCES course(id),
  total_los     INTEGER DEFAULT 0,
  covered_los   INTEGER DEFAULT 0,
  coverage_notes TEXT,
  date_submitted TEXT
);

-- Skill gap training sessions (trainee_name is often a cohort label, not a person)
CREATE TABLE skill_gap_training (
  id               TEXT PRIMARY KEY,
  trainee_name     TEXT,
  skill_area       TEXT,
  learning_outcomes TEXT,
  duration_hours   INTEGER DEFAULT 0,
  trainer_id       TEXT REFERENCES trainer(id),
  evidence_url     TEXT,
  date             TEXT
);

-- ============================================================================
-- TVET ASSESSMENT MODULE
-- ============================================================================

CREATE TABLE exam_approval (
  id             TEXT PRIMARY KEY,
  course_id      TEXT REFERENCES course(id),
  trainer_id     TEXT REFERENCES trainer(id),
  exam_type      TEXT CHECK (exam_type IN ('Theoretical','Practical')),
  status         TEXT CHECK (status IN ('Draft','Pending','Approved')),
  submission_date TEXT,
  approval_date  TEXT,
  plan_details   TEXT
);

CREATE TABLE assessment_result (
  id            TEXT PRIMARY KEY,
  title         TEXT NOT NULL,
  course_id     TEXT REFERENCES course(id),
  level_id      INTEGER REFERENCES level(id),
  section_id    TEXT REFERENCES section(id),
  avg_score     REAL,
  pass_rate     REAL,
  date_recorded TEXT,
  status        TEXT DEFAULT 'Published'
);

-- ============================================================================
-- TRAINERS EVALUATION (360°) — component scores + computed weighted total
-- ============================================================================

CREATE TABLE trainer_evaluation (
  id            TEXT PRIMARY KEY,
  trainer_id    TEXT NOT NULL REFERENCES trainer(id),
  trainee_score REAL,       -- 60% weight
  peer_score    REAL,       -- 5%
  self_score    REAL,       -- 5%
  dept_score    REAL,       -- 30%
  weighted      REAL,       -- precomputed final
  period        TEXT
);

-- ============================================================================
-- LIFELONG LEARNING (LMS) + COMPLAINTS
-- ============================================================================

CREATE TABLE webinar (
  id           TEXT PRIMARY KEY,
  title        TEXT NOT NULL,
  host         TEXT,
  start_time   TEXT,
  duration_min INTEGER,
  registrants  INTEGER DEFAULT 0,
  status       TEXT,
  join_url     TEXT
);

CREATE TABLE complaint (
  id        TEXT PRIMARY KEY,
  subject   TEXT NOT NULL,
  category  TEXT,
  raised_by TEXT,
  priority  TEXT CHECK (priority IN ('Low','Medium','High')),
  status    TEXT,
  date      TEXT
);

-- ============================================================================
-- Helpful indexes
-- ============================================================================
CREATE INDEX idx_attendance_sched  ON attendance(schedule_id);
CREATE INDEX idx_coverage_sched    ON course_coverage(schedule_id);
CREATE INDEX idx_examappr_course   ON exam_approval(course_id);
CREATE INDEX idx_result_section    ON assessment_result(section_id);
CREATE INDEX idx_eval_trainer      ON trainer_evaluation(trainer_id);
CREATE INDEX idx_trainee_section   ON trainee(section_id);
CREATE INDEX idx_schedule_trainer  ON schedule(trainer_id);
CREATE INDEX idx_schedule_room     ON schedule(room_id);
CREATE INDEX idx_load_trainer      ON trainer_load(trainer_id);
