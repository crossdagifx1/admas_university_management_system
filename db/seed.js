// Granular Details Report data, encoded for the SQLite build.
// These are the LITERAL values observed in the ATMS video (report §1–§6).
// The build script (build.mjs) also bridges entities from ../src/data/seed.js.

// --- §5 Levels ---------------------------------------------------------------
export const levels = [
  { id: 1, name: 'Level I' },
  { id: 2, name: 'Level II' },
  { id: 3, name: 'Level III' },
  { id: 4, name: 'Level IV' },
];

// --- §5 Training Years / Programs (REG + EXT, 2015–2018) ---------------------
export const programYears = [];
for (const year of [2015, 2016, 2017, 2018]) {
  for (const track of ['REG', 'EXT']) {
    programYears.push({ id: `${year} ${track}`, year, track });
  }
}

// --- §5 Group Types ----------------------------------------------------------
export const groupTypes = [
  { id: 1, name: 'Full Class' },
  { id: 2, name: 'Group 1' },
  { id: 3, name: 'Group 2' },
];

// --- §6 Campus ---------------------------------------------------------------
export const campuses = [
  { id: 'CMP-MISRAK', name: 'Admas University Misrak Campus', is_main: 1 },
];

// --- §6 Centers / Locations --------------------------------------------------
export const centers = [
  { id: 'CEN-MISRAK-1', code: 'Misrak-1', name: 'Misrak Center 1', campus_id: 'CMP-MISRAK' },
  { id: 'CEN-MISRAK-2', code: 'Misrak-2', name: 'Misrak Center 2', campus_id: 'CMP-MISRAK' },
  { id: 'CEN-LSM',      code: 'LSM',      name: 'LSM Center',       campus_id: 'CMP-MISRAK' },
  { id: 'CEN-KTA',      code: 'K-TA',     name: 'K-TA Center',      campus_id: 'CMP-MISRAK' },
  { id: 'CEN-MIS-01',   code: 'MIS-01',   name: 'MIS-01 Center',    campus_id: 'CMP-MISRAK' },
  { id: 'CEN-YEKA',     code: 'Yeka',     name: 'Yeka Center',      campus_id: 'CMP-MISRAK' },
];

// --- §3 Rooms (classrooms + computer labs) -----------------------------------
export const rooms = [
  { id: 'RM-101', label: '101', room_type: 'CLASSROOM',    center_id: 'CEN-MISRAK-1' },
  { id: 'RM-202', label: '202', room_type: 'CLASSROOM',    center_id: 'CEN-MISRAK-1' },
  { id: 'RM-301', label: '301', room_type: 'CLASSROOM',    center_id: 'CEN-MISRAK-2' },
  { id: 'RM-401', label: '401', room_type: 'CLASSROOM',    center_id: 'CEN-MISRAK-2' },
  { id: 'RM-LAB-201', label: 'Lab 201', room_type: 'COMPUTER_LAB', center_id: 'CEN-LSM' },
  { id: 'RM-LAB-202', label: 'Lab 202', room_type: 'COMPUTER_LAB', center_id: 'CEN-LSM' },
  { id: 'RM-LAB-203', label: 'Lab 203', room_type: 'COMPUTER_LAB', center_id: 'CEN-KTA' },
  { id: 'RM-LAB-204', label: 'Lab 204', room_type: 'COMPUTER_LAB', center_id: 'CEN-KTA' },
];

// --- §2 Sections (Year-Year-Code). Full 18-19-M1..M44 list + extras ----------
export const sections = [];
for (let n = 1; n <= 44; n++) {
  sections.push({ id: `18-19-M${n}`, year_start: 18, year_end: 19, code: `M${n}` });
}
for (const extra of [
  { id: '17-18-A1', year_start: 17, year_end: 18, code: 'A1' },
  { id: '18-19-M1', year_start: 18, year_end: 19, code: 'M1' }, // dedup-safe (upsert)
  { id: '18-19-M2', year_start: 18, year_end: 19, code: 'M2' },
  { id: '10-11-M1', year_start: 10, year_end: 11, code: 'M1' },
  { id: '10-11-A1', year_start: 10, year_end: 11, code: 'A1' },
]) {
  if (!sections.find((s) => s.id === extra.id)) sections.push(extra);
}

// --- §1 Users (IDs that double as usernames, e.g. 11553/17) ------------------
// role/type/contact mirror the §4 "Manage Users" columns.
export const users = [
  { id: 'USR-R-01', username: '11553/17', full_name: 'Trainee 11553/17', role: 'Trainee', user_type: 'Trainee', contact: '+251-900-000017' },
  { id: 'USR-R-02', username: '2031/16',  full_name: 'Trainer 2031/16',  role: 'Trainer', user_type: 'Trainer', contact: '+251-900-000016' },
  { id: 'USR-R-03', username: '11554/18', full_name: 'Trainee 11554/18', role: 'Trainee', user_type: 'Trainee', contact: '+251-900-000018' },
  { id: 'USR-R-04', username: '11553/18', full_name: 'Trainee 11553/18', role: 'Trainee', user_type: 'Trainee', contact: '+251-900-000019' },
  { id: 'USR-R-05', username: '11577/17', full_name: 'Trainee 11577/17', role: 'Trainee', user_type: 'Trainee', contact: '+251-900-000020' },
  { id: 'USR-R-06', username: '2704/16',  full_name: 'Trainer 2704/16',  role: 'Trainer', user_type: 'Trainer', contact: '+251-900-000021' },
  { id: 'USR-R-07', username: '11545/18', full_name: 'Trainee 11545/18', role: 'Trainee', user_type: 'Trainee', contact: '+251-900-000022' },
  { id: 'USR-R-08', username: '11543/18', full_name: 'Trainee 11543/18', role: 'Trainee', user_type: 'Trainee', contact: '+251-900-000023' },
];

// --- §1 Schedule with composite ID 2018 EXT-M1-01 ----------------------------
export const schedules = [
  { id: '2018 EXT-M1-01', program_year_id: '2018 EXT', section_id: '18-19-M1',
    room_id: 'RM-LAB-201', center_id: 'CEN-LSM', group_type_id: 1,
    time_slot_1: 'Mon 08:00-10:00', time_slot_2: 'Wed 08:00-10:00' },
];

export default {
  levels, programYears, groupTypes, campuses, centers, rooms, sections, users, schedules,
};
