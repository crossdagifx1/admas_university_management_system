// Builds db/atms.db from schema.sql + report literals (db/seed.js) + bridged
// app entities (src/data/seed.js), validates every identifier, and prints a
// verification report. Run: node db/build.mjs   (or: npm run db:build)

import { DatabaseSync } from 'node:sqlite';
import { readFileSync, rmSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import report from './seed.js';
import * as Q from './queries.js';
import V from './validators.js';
import appSeed, { EVAL_WEIGHTS } from '../src/data/seed.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(HERE, 'atms.db');
const SCHEMA = readFileSync(join(HERE, 'schema.sql'), 'utf8');

if (existsSync(DB_PATH)) rmSync(DB_PATH);
const db = new DatabaseSync(DB_PATH);
db.exec(SCHEMA);

const tx = (fn) => { db.exec('BEGIN'); try { fn(); db.exec('COMMIT'); } catch (e) { db.exec('ROLLBACK'); throw e; } };
const ins = (sql) => db.prepare(sql);
const levelIdByName = new Map(report.levels.map((l) => [l.name, l.id]));
const sexCode = (s) => (s ? (s[0].toUpperCase() === 'F' ? 'F' : 'M') : null);
const APP_RM = (id) => `APP-${id}`; // app rooms namespaced to avoid PK clash with report rooms

// ---------------------------------------------------------------------------
// 1) Reference + report literals (§5, §6, §3, §2, §1)
// ---------------------------------------------------------------------------
tx(() => {
  const L = ins('INSERT INTO level(id,name) VALUES (?,?)');
  report.levels.forEach((l) => L.run(l.id, l.name));

  const PY = ins('INSERT INTO program_year(id,year,track) VALUES (?,?,?)');
  report.programYears.forEach((p) => PY.run(p.id, p.year, p.track));

  const G = ins('INSERT INTO group_type(id,name) VALUES (?,?)');
  report.groupTypes.forEach((g) => G.run(g.id, g.name));

  const CMP = ins('INSERT INTO campus(id,name,is_main) VALUES (?,?,?)');
  report.campuses.forEach((c) => CMP.run(c.id, c.name, c.is_main));

  const CEN = ins('INSERT INTO center(id,code,name,campus_id) VALUES (?,?,?,?)');
  report.centers.forEach((c) => CEN.run(c.id, c.code, c.name, c.campus_id));

  const RM = ins('INSERT INTO room(id,label,room_type,center_id) VALUES (?,?,?,?)');
  report.rooms.forEach((r) => RM.run(r.id, r.label, r.room_type, r.center_id));

  const SEC = ins('INSERT OR IGNORE INTO section(id,year_start,year_end,code) VALUES (?,?,?,?)');
  report.sections.forEach((s) => SEC.run(s.id, s.year_start, s.year_end, s.code));

  const U = ins('INSERT INTO app_user(id,username,full_name,role,user_type,contact) VALUES (?,?,?,?,?,?)');
  report.users.forEach((u) => U.run(u.id, u.username, u.full_name, u.role, u.user_type, u.contact));

  const SCH = ins(`INSERT INTO schedule(id,program_year_id,section_id,room_id,center_id,group_type_id,time_slot_1,time_slot_2)
                   VALUES (?,?,?,?,?,?,?,?)`);
  report.schedules.forEach((s) => SCH.run(s.id, s.program_year_id, s.section_id, s.room_id, s.center_id, s.group_type_id, s.time_slot_1, s.time_slot_2));

  // Promote report slash-ID users into trainer / trainee rows so they exist as
  // first-class records (audit gap: usernames had no trainer/trainee row).
  const RTR = ins('INSERT INTO trainer(id,user_id,name) VALUES (?,?,?)');
  const RTRNE = ins('INSERT INTO trainee(id,id_number,full_name,year) VALUES (?,?,?,?)');
  let ti = 0, ei = 0;
  report.users.forEach((u) => {
    if (u.role === 'Trainer') RTR.run(`TR-R-${String(++ti).padStart(2,'0')}`, u.id, u.full_name);
    else if (u.role === 'Trainee') RTRNE.run(`TRNE-R-${String(++ei).padStart(2,'0')}`, u.id_number ?? u.username, u.full_name, V.parseUserId(u.username)?.entryYear ?? null);
  });
});

// ---------------------------------------------------------------------------
// 2) Bridge app entities (merge) from src/data/seed.js
// ---------------------------------------------------------------------------
tx(() => {
  const D = ins('INSERT INTO department(id,name,code) VALUES (?,?,?)');
  appSeed.departments.forEach((d) => D.run(d.id, d.name, d.code));

  // app centers (distinct ids from report centers)
  const CEN = ins('INSERT OR IGNORE INTO center(id,code,name,campus_id,location) VALUES (?,?,?,?,?)');
  appSeed.centers.forEach((c) => CEN.run(c.id, c.id, c.name, 'CMP-MISRAK', c.location));

  // app rooms namespaced
  const RM = ins('INSERT INTO room(id,label,room_type,capacity,center_id) VALUES (?,?,?,?,?)');
  appSeed.rooms.forEach((r) => {
    const type = /lab/i.test(r.roomNumber) ? 'COMPUTER_LAB' : /workshop/i.test(r.roomNumber) ? 'WORKSHOP' : 'CLASSROOM';
    RM.run(APP_RM(r.id), r.roomNumber, type, r.capacity, r.centerId);
  });

  const C = ins('INSERT INTO course(id,unit_code,unit_title,credit_hours,total_los,department_id) VALUES (?,?,?,?,?,?)');
  appSeed.courses.forEach((c) => C.run(c.id, c.unitCode, c.unitTitle, c.creditHours, c.totalLos, c.departmentId));

  // distinct app section codes -> section rows
  const SEC = ins('INSERT OR IGNORE INTO section(id,department_id) VALUES (?,?)');
  const seen = new Set();
  appSeed.trainees.forEach((t) => { if (!seen.has(t.sectionCode)) { seen.add(t.sectionCode); SEC.run(t.sectionCode, t.departmentId); } });

  const U = ins('INSERT INTO app_user(id,username,full_name,role,user_type,contact,email,department_id,status,created_at) VALUES (?,?,?,?,?,?,?,?,?,?)');
  appSeed.users.forEach((u) => U.run(u.id, u.username, u.fullName, u.role, u.role, u.mobileNumber, u.email, u.departmentId, u.status, u.createdAt));

  const TR = ins('INSERT INTO trainer(id,user_id,name,staff_no,department_id,employment_type,present_status,rating) VALUES (?,?,?,?,?,?,?,?)');
  appSeed.trainers.forEach((t) => TR.run(t.id, t.userId, t.name, t.staffNo, t.departmentId, t.employmentType, t.presentStatus, t.rating));

  const T = ins('INSERT INTO trainee(id,id_number,full_name,sex,level_id,year,section_id,department_id,city,phone,status) VALUES (?,?,?,?,?,?,?,?,?,?,?)');
  appSeed.trainees.forEach((t) => T.run(t.id, t.studentId, t.fullName, sexCode(t.sex), levelIdByName.get(t.academicLevel) ?? null, Number(t.entryYear), t.sectionCode, t.departmentId, t.city, t.phone, t.status));

  // §4 Trainer Load — synthesize 2018 REG/EXT loads from app credit totals (demo)
  const creditByTrainer = new Map();
  appSeed.schedules.forEach((s) => {
    const cr = appSeed.courses.find((c) => c.id === s.courseId)?.creditHours || 0;
    creditByTrainer.set(s.trainerId, (creditByTrainer.get(s.trainerId) || 0) + cr);
  });
  const TL = ins('INSERT INTO trainer_load(trainer_id,program_year_id,credit_hours) VALUES (?,?,?)');
  for (const [trainerId, total] of creditByTrainer) {
    TL.run(trainerId, '2018 REG', total);
    TL.run(trainerId, '2018 EXT', Math.floor(total / 3));
  }

  const COC = ins('INSERT INTO coc_registration(id,trainee_id,full_name,current_level,cell_phone,amount_paid,city,department_id,registration_date,status) VALUES (?,?,?,?,?,?,?,?,?,?)');
  appSeed.cocRegistrations.forEach((c) => {
    const trainee = appSeed.trainees.find((t) => t.id === c.traineeId);
    COC.run(c.id, c.traineeId, c.traineeName, levelIdByName.get(c.level) ?? null, c.phone, c.amountPaid, trainee?.city ?? 'Addis Ababa', c.departmentId, c.registrationDate, c.status);
  });

  const CF = ins('INSERT INTO coop_followup(id,trainee_id,trainee_name,organization_name,visit_date,outcome,notes,status) VALUES (?,?,?,?,?,?,?,?)');
  appSeed.coopFollowups.forEach((c) => CF.run(c.id, c.traineeId, c.traineeName, c.organizationName, c.visitDate, c.outcome, c.notes, c.status));

  // app schedules (needed before attendance/coverage which reference them)
  const SCH = ins(`INSERT INTO schedule(id,program_year_id,section_id,course_id,trainer_id,room_id,center_id,time_slot_1,time_slot_2,start_date,end_date)
                   VALUES (?,?,?,?,?,?,?,?,?,?,?)`);
  appSeed.schedules.forEach((s) => SCH.run(s.id, `${s.entryYear} REG`, s.sectionCode, s.courseId, s.trainerId, APP_RM(s.roomId), s.centerId, s.scheduleTime1, s.scheduleTime2, s.startDate, s.endDate));

  const AT = ins('INSERT INTO attendance(id,schedule_id,trainer_id,date,present,absent,late,total,photo_url,notes) VALUES (?,?,?,?,?,?,?,?,?,?)');
  appSeed.attendanceRecords.forEach((a) => AT.run(a.id, a.scheduleId, a.trainerId, a.date, a.present, a.absent, a.late, a.total, a.photoUrl, a.notes));

  const CC = ins('INSERT INTO course_coverage(id,schedule_id,trainer_id,course_id,total_los,covered_los,coverage_notes,date_submitted) VALUES (?,?,?,?,?,?,?,?)');
  appSeed.courseCoverage.forEach((c) => CC.run(c.id, c.scheduleId, c.trainerId, c.courseId, c.totalLos, c.coveredLos, c.coverageNotes, c.dateSubmitted));

  const SG = ins('INSERT INTO skill_gap_training(id,trainee_name,skill_area,learning_outcomes,duration_hours,trainer_id,evidence_url,date) VALUES (?,?,?,?,?,?,?,?)');
  appSeed.skillGapTraining.forEach((s) => SG.run(s.id, s.traineeName, s.skillArea, s.learningOutcomes, s.durationHours, s.trainerId, s.evidenceUrl, s.date));

  const EA = ins('INSERT INTO exam_approval(id,course_id,trainer_id,exam_type,status,submission_date,approval_date,plan_details) VALUES (?,?,?,?,?,?,?,?)');
  appSeed.examApprovals.forEach((e) => EA.run(e.id, e.courseId, e.trainerId, e.examType, e.status, e.submissionDate, e.approvalDate ?? null, e.planDetails));

  const AR = ins('INSERT INTO assessment_result(id,title,course_id,level_id,section_id,avg_score,pass_rate,date_recorded,status) VALUES (?,?,?,?,?,?,?,?,?)');
  appSeed.assessmentResults.forEach((r) => AR.run(r.id, r.title, r.courseId, levelIdByName.get(r.level) ?? null, r.sectionCode, r.avgScore, r.passRate, r.dateRecorded, r.status));

  const TE = ins('INSERT INTO trainer_evaluation(id,trainer_id,trainee_score,peer_score,self_score,dept_score,weighted,period) VALUES (?,?,?,?,?,?,?,?)');
  appSeed.trainerEvaluations.forEach((e) => {
    const w = e.trainee*EVAL_WEIGHTS.trainee + e.peer*EVAL_WEIGHTS.peer + e.self*EVAL_WEIGHTS.self + e.department*EVAL_WEIGHTS.department;
    TE.run(e.id, e.trainerId, e.trainee, e.peer, e.self, e.department, Math.round(w*10)/10, e.period);
  });

  const WB = ins('INSERT INTO webinar(id,title,host,start_time,duration_min,registrants,status,join_url) VALUES (?,?,?,?,?,?,?,?)');
  appSeed.webinars.forEach((w) => WB.run(w.id, w.title, w.host, w.startTime, w.durationMin, w.registrants, w.status, w.joinUrl));

  const CMP = ins('INSERT INTO complaint(id,subject,category,raised_by,priority,status,date) VALUES (?,?,?,?,?,?,?)');
  appSeed.complaints.forEach((c) => CMP.run(c.id, c.subject, c.category, c.raisedBy, c.priority, c.status, c.date));
});

// ---------------------------------------------------------------------------
// 3) Validate every identifier against the §1–§3 format rules
// ---------------------------------------------------------------------------
const checks = [];
const check = (name, ok, detail = '') => checks.push({ name, ok, detail });

report.users.forEach((u) => check(`userId ${u.username}`, V.isUserId(u.username)));
report.schedules.forEach((s) => check(`scheduleId ${s.id}`, V.isScheduleId(s.id)));
report.sections.filter((s) => s.code).forEach((s) => check(`section ${s.id}`, V.isSectionCode(s.id)));
report.rooms.forEach((r) => {
  const c = V.classifyRoom(r.label);
  check(`room ${r.label}`, c.type === r.room_type, `expected ${r.room_type} got ${c.type}`);
});

const failed = checks.filter((c) => !c.ok);

// ---------------------------------------------------------------------------
// 4) Verification report
// ---------------------------------------------------------------------------
const count = (t) => db.prepare(`SELECT COUNT(*) n FROM ${t}`).get().n;
const TABLES = ['level','program_year','group_type','campus','center','room','department','course','section','app_user','trainer','trainee','schedule','trainer_load','coc_registration','coop_followup','attendance','course_coverage','skill_gap_training','exam_approval','assessment_result','trainer_evaluation','webinar','complaint'];

db.exec('PRAGMA foreign_keys = ON');
const fkProblems = db.prepare('PRAGMA foreign_key_check').all();

console.log('\n=== ATMS DB BUILD =========================================');
console.log('db file:', DB_PATH);
console.log('\nRow counts:');
TABLES.forEach((t) => console.log(`  ${t.padEnd(18)} ${count(t)}`));

console.log(`\nForeign-key integrity: ${fkProblems.length ? fkProblems.length + ' ORPHANS' : 'OK (no orphans)'}`);
if (fkProblems.length) console.table(fkProblems);

console.log(`\nIdentifier validation: ${checks.length - failed.length}/${checks.length} passed`);
if (failed.length) { console.log('  FAILURES:'); failed.forEach((f) => console.log(`   ✗ ${f.name} ${f.detail}`)); }
else console.log('  ✓ all report identifiers conform to §1–§3 formats');

const show = (title, sql, n = 5) => {
  console.log(`\n--- ${title} (top ${n}) ---`);
  console.table(db.prepare(sql + (/LIMIT/i.test(sql) ? '' : ` LIMIT ${n}`)).all());
};
show('§4 Manage Users', Q.MANAGE_USERS);
show('§4 Manage Trainees', Q.MANAGE_TRAINEES);
show('§4 Trainer Load Report', Q.TRAINER_LOAD);
show('§4 COC Registrations', Q.COC_REGISTRATIONS);
show('§4 Cooperative Training Follow-ups', Q.COOP_FOLLOWUPS);

console.log('\n--- §6 Centers by campus ---');
console.table(db.prepare(`SELECT c.code AS Center, c.name AS Name, cm.name AS Campus
  FROM center c LEFT JOIN campus cm ON cm.id = c.campus_id ORDER BY c.code`).all());

console.log(`\nSections 18-19-M1..M44 stored: ${db.prepare("SELECT COUNT(*) n FROM section WHERE id LIKE '18-19-M%'").get().n}`);
console.log('=== DONE ==================================================\n');

db.close();
if (failed.length || fkProblems.length) process.exit(1);
