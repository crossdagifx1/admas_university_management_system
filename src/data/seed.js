// Central seed dataset for the ADMAS University TVET Management System (ATMS).
// Models mirror the data dictionary in the implementation plan. Values use the
// Ethiopian academic context (E.C. = Ethiopian Calendar) seen in the source Access DB.

export const ACADEMIC_YEAR = '2017 E.C';
export const SEMESTER = 'Semester I';

export const departments = [
  { id: 'DEP-01', name: 'Information Technology', code: 'ICT' },
  { id: 'DEP-04', name: 'Accounting & Finance', code: 'ACC' },
  { id: 'DEP-07', name: 'Business Administration', code: 'BUS' },
];

export const centers = [
  { id: 'CEN-01', name: 'Main Campus', location: 'Megenagna, Addis Ababa' },
  { id: 'CEN-02', name: 'Mexico Branch', location: 'Mexico Square, Addis Ababa' },
  { id: 'CEN-03', name: 'Kality Branch', location: 'Kality, Addis Ababa' },
];

export const rooms = [
  { id: 'RM-101', roomNumber: 'B-101', capacity: 40, centerId: 'CEN-01' },
  { id: 'RM-102', roomNumber: 'B-102', capacity: 35, centerId: 'CEN-01' },
  { id: 'RM-201', roomNumber: 'LAB-1', capacity: 30, centerId: 'CEN-01' },
  { id: 'RM-202', roomNumber: 'LAB-2', capacity: 30, centerId: 'CEN-02' },
  { id: 'RM-301', roomNumber: 'C-301', capacity: 45, centerId: 'CEN-02' },
  { id: 'RM-401', roomNumber: 'W-1 (Workshop)', capacity: 25, centerId: 'CEN-03' },
];

// Raw input data for the 42 trainers provided by the user.
// NOTE: Phone numbers have been masked/anonymized for privacy protection.
const rawTrainers = [
  { name: 'ABEBAW DEMEKE', phone: '+251-9XX-0001', dept: 'BUS', type: 'PT' },
  { name: 'ABEBE SHITU', phone: '+251-9XX-0002', dept: 'BUS', type: 'FT', isCoordinator: true },
  { name: 'ABERA BEKELE', phone: '+251-9XX-0003', dept: 'BUS', type: 'PT' },
  { name: 'ABRAHAM GETNET', phone: '+251-9XX-0004', dept: 'ACC', type: 'PT' },
  { name: 'AMAR ADEM', phone: '+251-9XX-0005', dept: 'BUS', type: 'FT' },
  { name: 'AMARE YERDAW', phone: '+251-9XX-0006', dept: 'BUS', type: 'PT' },
  { name: 'AMARE ZELEKE', phone: '+251-9XX-0007', dept: 'BUS', type: 'FT' },
  { name: 'AWOL BELACHEW', phone: '+251-9XX-0008', dept: 'BUS', type: 'PT' },
  { name: 'AYALNEH MUCHE', phone: '+251-9XX-0009', dept: 'ACC', type: 'FT', isCoordinator: true },
  { name: 'BELAYHUN ADMASU', phone: '+251-9XX-0010', dept: 'BUS', type: 'PT' },
  { name: 'BINIAM ABAYU', phone: '+251-9XX-0011', dept: 'ICT', type: 'PT', isCoordinator: true },
  { name: 'BREKTI TEKLEMICHAEL', phone: '+251-9XX-0012', dept: 'ICT', type: 'PT' },
  { name: 'DAWIT DEME', phone: '+251-9XX-0013', dept: 'ICT', type: 'PT' },
  { name: 'DAWIT MULUGETA', phone: '+251-9XX-0014', dept: 'BUS', type: 'FT' },
  { name: 'DAWIT TAREKEGN', phone: '+251-9XX-0015', dept: 'ACC', type: 'PT' },
  { name: 'DEBAS GETAHUN', phone: '+251-9XX-0016', dept: 'ACC', type: 'PT' },
  { name: 'DEJEN EZEZ', phone: '+251-9XX-0017', dept: 'ACC', type: 'PT' },
  { name: 'DEMIS TALEGETA', phone: '+251-9XX-0018', dept: 'ACC', type: 'PT' },
  { name: 'DESSIE ZEWEDU', phone: '+251-9XX-0019', dept: 'ACC', type: 'PT' },
  { name: 'ELIAS WORKU', phone: '+251-9XX-0020', dept: 'ICT', type: 'PT' },
  { name: 'EMALAF HIRUY', phone: '+251-9XX-0021', dept: 'ACC', type: 'FT' },
  { name: 'ESAYAS MELES', phone: '+251-9XX-0022', dept: 'ACC', type: 'FT' },
  { name: 'ESUBALEW MESFIN', phone: '+251-9XX-0023', dept: 'ICT', type: 'FT' },
  { name: 'EYOB ABRAHAM', phone: '+251-9XX-0024', dept: 'ICT', type: 'FT' },
  { name: 'EYOB TEFERA', phone: '+251-9XX-0025', dept: 'ICT', type: 'PT' },
  { name: 'GETAHUN FANTAHUN', phone: '+251-9XX-0026', dept: 'ACC', type: 'FT' },
  { name: 'HIWOT BAHERU', phone: '+251-9XX-0027', dept: 'BUS', type: 'PT' },
  { name: 'Kifle G/medihen', phone: '+251-9XX-0028', dept: 'BUS', type: 'PT' },
  { name: 'KINDEYE MEKURIYA', phone: '+251-9XX-0029', dept: 'ACC', type: 'PT' },
  { name: 'LEMA KEMBIRA', phone: '+251-9XX-0030', dept: 'BUS', type: 'PT' },
  { name: 'LIJALEM TADESE', phone: '+251-9XX-0031', dept: 'ACC', type: 'PT' },
  { name: 'LINGEREW MINALU', phone: '+251-9XX-0032', dept: 'ACC', type: 'FT' },
  { name: 'MENGESTU MULUNEH', phone: '+251-9XX-0033', dept: 'ACC', type: 'PT' },
  { name: 'MULUGETA BEKELE', phone: '+251-9XX-0034', dept: 'BUS', type: 'FT' },
  { name: 'REDIET TESFAYE', phone: '+251-9XX-0035', dept: 'BUS', type: 'FT' },
  { name: 'SENAY BEGASHAW', phone: '+251-9XX-0036', dept: 'BUS', type: 'PT' },
  { name: 'SOLOMON ANDARGE', phone: '+251-9XX-0037', dept: 'ACC', type: 'PT' },
  { name: 'SOLOMON BRIHANU', phone: '+251-9XX-0038', dept: 'BUS', type: 'PT' },
  { name: 'SURAFEL HAILEYESUS', phone: '+251-9XX-0039', dept: 'ACC', type: 'FT' },
  { name: 'TADESSE MENGISTU', phone: '+251-9XX-0040', dept: 'ICT', type: 'FT' },
  { name: 'YIHENEW BELAY', phone: '+251-9XX-0041', dept: 'BUS', type: 'PT' },
  { name: 'YOHANNES TESFAYE', phone: '+251-9XX-0042', dept: 'ICT', type: 'PT' }
];

const deptMap = {
  'ICT': 'DEP-01',
  'ACC': 'DEP-04',
  'BUS': 'DEP-07'
};

const formatPhone = (p) => {
  if (p === 'Missing') return 'Missing';
  return `+251-9${p.slice(1, 3)}-${p.slice(3)}`;
};

// Generate trainers list
export const trainers = rawTrainers.map((t, idx) => {
  const idNum = idx + 1;
  const trId = `TR-${String(idNum).padStart(2, '0')}`;
  const usrId = `USR-${String(idNum + 1).padStart(3, '0')}`; // USR-001 is admin
  
  return {
    id: trId,
    userId: usrId,
    name: t.name,
    staffNo: `STF-${1000 + idNum}`,
    departmentId: deptMap[t.dept],
    employmentType: t.type,
    presentStatus: t.isCoordinator ? 'Coordinator' : 'Active',
    rating: Number((4.0 + (idNum % 10) * 0.1).toFixed(1)) // deterministic mock ratings
  };
});

// Generate users list
export const users = [
  {
    id: 'USR-001',
    username: 'admin_cross',
    fullName: 'Dagmawi Amare',
    email: 'dagmawi.a@admas.edu.et',
    role: 'Admin',
    departmentId: null,
    mobileNumber: '+251-911-000001',
    status: 'Active',
    createdAt: '2024-09-01'
  },
  ...rawTrainers.map((t, idx) => {
    const idNum = idx + 1;
    const usrId = `USR-${String(idNum + 1).padStart(3, '0')}`;
    
    // Generate username: e.g. "ABEBAW DEMEKE" -> "a.demeke"
    const parts = t.name.toLowerCase().split(' ');
    const username = parts.length > 1 ? `${parts[0][0]}.${parts[parts.length - 1]}` : parts[0];
    
    return {
      id: usrId,
      username,
      fullName: t.name,
      email: `${parts.join('.')}@admas.edu.et`,
      role: t.isCoordinator ? 'Coordinator' : 'Trainer',
      departmentId: deptMap[t.dept],
      mobileNumber: formatPhone(t.phone),
      status: 'Active',
      createdAt: '2024-09-01'
    };
  })
];

// --- Courses / Units ---------------------------------------------------------
export const courses = [
  { id: 'CRS-01', unitCode: 'ICT-L3-01', unitTitle: 'Database Administration', creditHours: 5, departmentId: 'DEP-01', totalLos: 8 },
  { id: 'CRS-02', unitCode: 'ICT-L3-02', unitTitle: 'Web Development Fundamentals', creditHours: 6, departmentId: 'DEP-01', totalLos: 10 },
  { id: 'CRS-03', unitCode: 'ICT-L4-01', unitTitle: 'Network Administration', creditHours: 5, departmentId: 'DEP-01', totalLos: 9 },
  { id: 'CRS-04', unitCode: 'ACC-L3-01', unitTitle: 'Peachtree Accounting', creditHours: 5, departmentId: 'DEP-04', totalLos: 8 },
  { id: 'CRS-05', unitCode: 'BUS-L2-01', unitTitle: 'Business Communication', creditHours: 4, departmentId: 'DEP-07', totalLos: 6 },
  { id: 'CRS-06', unitCode: 'BUS-L3-01', unitTitle: 'Principles of Management', creditHours: 5, departmentId: 'DEP-07', totalLos: 8 },
];

// --- Trainees ----------------------------------------------------------------
const traineeSeed = [
  ['TRN-2017-001', 'Rahel', 'Bekele', 'Female', 'Level III', 'ICT-3A', 'DEP-01'],
  ['TRN-2017-002', 'Samuel', 'Girma', 'Male', 'Level III', 'ICT-3A', 'DEP-01'],
  ['TRN-2017-003', 'Lidya', 'Mekonnen', 'Female', 'Level IV', 'ICT-4A', 'DEP-01'],
  ['TRN-2017-004', 'Yonas', 'Alemu', 'Male', 'Level II', 'BUS-2A', 'DEP-07'],
  ['TRN-2017-005', 'Meron', 'Tesfaye', 'Female', 'Level III', 'BUS-3A', 'DEP-07'],
  ['TRN-2017-006', 'Dawit', 'Haile', 'Male', 'Level III', 'ACC-3A', 'DEP-04'],
  ['TRN-2017-007', 'Hewan', 'Tadesse', 'Female', 'Level III', 'ACC-3A', 'DEP-04'],
  ['TRN-2017-008', 'Bereket', 'Solomon', 'Male', 'Level II', 'BUS-2A', 'DEP-07'],
  ['TRN-2017-009', 'Eden', 'Wolde', 'Female', 'Level II', 'BUS-2A', 'DEP-07'],
  ['TRN-2017-010', 'Nahom', 'Daniel', 'Male', 'Level IV', 'ICT-4A', 'DEP-01'],
  ['TRN-2017-011', 'Saron', 'Getachew', 'Female', 'Level III', 'ACC-3A', 'DEP-04'],
  ['TRN-2017-012', 'Abel', 'Mulugeta', 'Male', 'Level III', 'ACC-3A', 'DEP-04'],
  ['TRN-2017-013', 'Frehiwot', 'Negash', 'Female', 'Level II', 'BUS-2A', 'DEP-07'],
  ['TRN-2017-014', 'Kaleb', 'Yohannes', 'Male', 'Level III', 'ICT-3A', 'DEP-01'],
  ['TRN-2017-015', 'Tigist', 'Abera', 'Female', 'Level II', 'BUS-2A', 'DEP-07'],
];

export const trainees = traineeSeed.map(([studentId, firstName, lastName, sex, level, section, departmentId], i) => ({
  id: `TRNE-${String(i + 1).padStart(3, '0')}`,
  studentId,
  firstName,
  lastName,
  fullName: `${firstName} ${lastName}`,
  sex,
  academicLevel: level,
  sectionCode: section,
  departmentId,
  entryYear: '2017',
  city: 'Addis Ababa',
  phone: `+251-9${String(11 + i)}-${String(100000 + i * 137).slice(0, 6)}`,
  emergencyContactName: `${lastName} Family`,
  emergencyContactPhone1: `+251-911-${String(200000 + i * 311).slice(0, 6)}`,
  status: 'Active',
}));

// --- Schedules ---------------------------------------------------------------
// Using trainers: TR-11 (Biniam Abayu - ICT), TR-12 (Brekti Teklemichael - ICT),
// TR-13 (Dawit Deme - ICT), TR-01 (Abebaw Demeke - BUS), TR-02 (Abebe Shitu - BUS),
// TR-04 (Abraham Getnet - ACC), TR-09 (Ayalneh Muche - ACC), TR-03 (Abera Bekele - BUS), TR-05 (Amar Adem - BUS).
export const schedules = [
  { id: 'SCH-01', entryYear: '2017', sectionCode: 'ICT-3A', courseId: 'CRS-01', trainerId: 'TR-11', roomId: 'RM-201', centerId: 'CEN-01', scheduleTime1: 'Mon 08:00-10:00', scheduleTime2: 'Wed 08:00-10:00', startDate: '2024-10-07', endDate: '2025-01-24' },
  { id: 'SCH-02', entryYear: '2017', sectionCode: 'ICT-3A', courseId: 'CRS-02', trainerId: 'TR-12', roomId: 'RM-201', centerId: 'CEN-01', scheduleTime1: 'Tue 10:00-12:00', scheduleTime2: 'Thu 10:00-12:00', startDate: '2024-10-08', endDate: '2025-01-25' },
  { id: 'SCH-03', entryYear: '2017', sectionCode: 'ICT-4A', courseId: 'CRS-03', trainerId: 'TR-13', roomId: 'RM-101', centerId: 'CEN-01', scheduleTime1: 'Mon 10:00-12:00', scheduleTime2: 'Fri 08:00-10:00', startDate: '2024-10-07', endDate: '2025-01-24' },
  { id: 'SCH-04', entryYear: '2017', sectionCode: 'BUS-2A', courseId: 'CRS-05', trainerId: 'TR-01', roomId: 'RM-401', centerId: 'CEN-03', scheduleTime1: 'Mon 08:00-11:00', scheduleTime2: 'Wed 08:00-11:00', startDate: '2024-10-07', endDate: '2025-01-24' },
  { id: 'SCH-05', entryYear: '2017', sectionCode: 'BUS-3A', courseId: 'CRS-06', trainerId: 'TR-02', roomId: 'RM-401', centerId: 'CEN-03', scheduleTime1: 'Tue 08:00-11:00', scheduleTime2: 'Thu 08:00-11:00', startDate: '2024-10-08', endDate: '2025-01-25' },
  { id: 'SCH-06', entryYear: '2017', sectionCode: 'ACC-3A', courseId: 'CRS-04', trainerId: 'TR-04', roomId: 'RM-202', centerId: 'CEN-02', scheduleTime1: 'Mon 13:00-15:00', scheduleTime2: 'Wed 13:00-15:00', startDate: '2024-10-07', endDate: '2025-01-24' },
  { id: 'SCH-07', entryYear: '2017', sectionCode: 'ACC-3A', courseId: 'CRS-04', trainerId: 'TR-09', roomId: 'RM-301', centerId: 'CEN-02', scheduleTime1: 'Tue 13:00-15:00', scheduleTime2: 'Fri 13:00-15:00', startDate: '2024-10-08', endDate: '2025-01-25' },
  { id: 'SCH-08', entryYear: '2017', sectionCode: 'BUS-2A', courseId: 'CRS-05', trainerId: 'TR-03', roomId: 'RM-102', centerId: 'CEN-01', scheduleTime1: 'Thu 10:00-12:00', scheduleTime2: '', startDate: '2024-10-10', endDate: '2025-01-23' },
  { id: 'SCH-09', entryYear: '2017', sectionCode: 'BUS-2A', courseId: 'CRS-05', trainerId: 'TR-05', roomId: 'RM-102', centerId: 'CEN-01', scheduleTime1: 'Tue 08:00-10:00', scheduleTime2: 'Thu 08:00-10:00', startDate: '2024-10-08', endDate: '2025-01-25' },
  // Intentional clash with SCH-01 (same room/time) and same trainer (TR-11) to demonstrate conflict detection
  { id: 'SCH-10', entryYear: '2017', sectionCode: 'ICT-4A', courseId: 'CRS-02', trainerId: 'TR-11', roomId: 'RM-201', centerId: 'CEN-01', scheduleTime1: 'Mon 08:00-10:00', scheduleTime2: '', startDate: '2024-10-07', endDate: '2025-01-24' },
];

// --- Reports: Attendance -----------------------------------------------------
export const attendanceRecords = [
  { id: 'ATT-01', scheduleId: 'SCH-01', trainerId: 'TR-11', date: '2025-06-02', present: 22, absent: 3, late: 1, total: 26, photoUrl: 'attendance_ict3a_0602.jpg', notes: 'Lab session – DB normalization.' },
  { id: 'ATT-02', scheduleId: 'SCH-02', trainerId: 'TR-12', date: '2025-06-03', present: 24, absent: 2, late: 0, total: 26, photoUrl: 'attendance_ict3a_0603.jpg', notes: 'HTML/CSS practical.' },
  { id: 'ATT-03', scheduleId: 'SCH-04', trainerId: 'TR-01', date: '2025-06-02', present: 18, absent: 1, late: 2, total: 21, photoUrl: 'attendance_aut2a_0602.jpg', notes: 'Business communication lecture.' },
  { id: 'ATT-04', scheduleId: 'SCH-06', trainerId: 'TR-04', date: '2025-06-04', present: 19, absent: 4, late: 1, total: 24, photoUrl: '', notes: 'Ledger accounting practice.' },
  { id: 'ATT-05', scheduleId: 'SCH-07', trainerId: 'TR-09', date: '2025-06-05', present: 20, absent: 0, late: 0, total: 20, photoUrl: 'attendance_acf3a_0605.jpg', notes: 'Peachtree ledger entries.' },
  { id: 'ATT-06', scheduleId: 'SCH-03', trainerId: 'TR-13', date: '2025-06-06', present: 15, absent: 3, late: 2, total: 20, photoUrl: '', notes: 'Subnetting exercise.' },
];

// --- Reports: Course Coverage ------------------------------------------------
export const courseCoverage = [
  { id: 'CC-01', scheduleId: 'SCH-01', trainerId: 'TR-11', courseId: 'CRS-01', totalLos: 8, coveredLos: 6, coverageNotes: 'Covered up to indexing & transactions.', dateSubmitted: '2025-06-01' },
  { id: 'CC-02', scheduleId: 'SCH-02', trainerId: 'TR-12', courseId: 'CRS-02', totalLos: 10, coveredLos: 7, coverageNotes: 'Responsive layouts and forms done.', dateSubmitted: '2025-06-02' },
  { id: 'CC-03', scheduleId: 'SCH-03', trainerId: 'TR-13', courseId: 'CRS-03', totalLos: 9, coveredLos: 5, coverageNotes: 'Routing basics covered, VLAN pending.', dateSubmitted: '2025-06-03' },
  { id: 'CC-04', scheduleId: 'SCH-04', trainerId: 'TR-01', courseId: 'CRS-05', totalLos: 6, coveredLos: 4, coverageNotes: 'Principles of clear communication.', dateSubmitted: '2025-06-03' },
  { id: 'CC-05', scheduleId: 'SCH-06', trainerId: 'TR-04', courseId: 'CRS-04', totalLos: 8, coveredLos: 5, coverageNotes: 'Setup of accounts complete.', dateSubmitted: '2025-06-04' },
  { id: 'CC-06', scheduleId: 'SCH-07', trainerId: 'TR-09', courseId: 'CRS-04', totalLos: 8, coveredLos: 8, coverageNotes: 'Full module completed.', dateSubmitted: '2025-06-05' },
];

// --- Reports: Cooperative Training Follow-ups --------------------------------
export const coopFollowups = [
  { id: 'COOP-01', traineeId: 'TRNE-001', traineeName: 'Rahel Bekele', organizationName: 'INSA', visitDate: '2025-05-20', outcome: 'On track', notes: 'Assigned to DB support team.', status: 'Completed' },
  { id: 'COOP-02', traineeId: 'TRNE-004', traineeName: 'Yonas Alemu', organizationName: 'Moenco Garage', visitDate: '2025-05-22', outcome: 'Needs support', notes: 'Requires more hands-on supervision.', status: 'Follow-up' },
  { id: 'COOP-03', traineeId: 'TRNE-007', traineeName: 'Hewan Tadesse', organizationName: 'Dashen Bank', visitDate: '2025-05-25', outcome: 'Excellent', notes: 'Praised by host supervisor.', status: 'Completed' },
  { id: 'COOP-04', traineeId: 'TRNE-006', traineeName: 'Dawit Haile', organizationName: 'EEU Substation', visitDate: '2025-05-28', outcome: 'On track', notes: 'Safety procedures followed well.', status: 'Completed' },
  { id: 'COOP-05', traineeId: 'TRNE-008', traineeName: 'Bereket Solomon', organizationName: 'Sheraton Addis', visitDate: '2025-05-30', outcome: 'Needs support', notes: 'Punctuality concerns raised.', status: 'Follow-up' },
];

// --- Reports: Skill Gap Training ---------------------------------------------
export const skillGapTraining = [
  { id: 'SG-01', traineeName: 'ICT-3A Cohort', skillArea: 'Git & Version Control', learningOutcomes: 'Branching, merging, PR workflow', durationHours: 6, trainerId: 'TR-11', evidenceUrl: 'sg_git_session.jpg', date: '2025-05-18' },
  { id: 'SG-02', traineeName: 'BUS-2A Cohort', skillArea: 'Public Speaking', learningOutcomes: 'Presentation design and body language', durationHours: 4, trainerId: 'TR-01', evidenceUrl: 'sg_speech_session.jpg', date: '2025-05-19' },
  { id: 'SG-03', traineeName: 'ACC-3A Cohort', skillArea: 'Tax Filings', learningOutcomes: 'ERCA e-filing portal basics', durationHours: 8, trainerId: 'TR-04', evidenceUrl: '', date: '2025-05-21' },
  { id: 'SG-04', traineeName: 'ACC-3A Cohort', skillArea: 'Excel for Accountants', learningOutcomes: 'Pivot tables, VLOOKUP', durationHours: 5, trainerId: 'TR-09', evidenceUrl: 'sg_excel.jpg', date: '2025-05-23' },
];

// --- Assessment: Exam Approvals ----------------------------------------------
export const examApprovals = [
  { id: 'EX-01', courseId: 'CRS-01', trainerId: 'TR-11', examType: 'Theoretical', status: 'Pending', submissionDate: '2025-06-01', planDetails: 'Written exam – 40 marks, 90 min.' },
  { id: 'EX-02', courseId: 'CRS-01', trainerId: 'TR-11', examType: 'Practical', status: 'Pending', submissionDate: '2025-06-01', planDetails: 'Build & query a relational schema.' },
  { id: 'EX-03', courseId: 'CRS-05', trainerId: 'TR-01', examType: 'Practical', status: 'Approved', submissionDate: '2025-05-28', approvalDate: '2025-05-30', planDetails: 'Mock sales presentation assessment.' },
  { id: 'EX-04', courseId: 'CRS-04', trainerId: 'TR-09', examType: 'Theoretical', status: 'Approved', submissionDate: '2025-05-27', approvalDate: '2025-05-29', planDetails: 'Peachtree concepts – 50 marks.' },
  { id: 'EX-05', courseId: 'CRS-04', trainerId: 'TR-04', examType: 'Theoretical', status: 'Draft', submissionDate: '2025-06-04', planDetails: 'Double entry book keeping test.' },
];

// --- Assessment: Institutional Results ---------------------------------------
export const assessmentResults = [
  { id: 'AR-01', title: 'Database Administration – Mid', courseId: 'CRS-01', level: 'Level III', sectionCode: 'ICT-3A', avgScore: 78, passRate: 88, dateRecorded: '2025-05-15', status: 'Published' },
  { id: 'AR-02', title: 'Web Development – Mid', courseId: 'CRS-02', level: 'Level III', sectionCode: 'ICT-3A', avgScore: 82, passRate: 92, dateRecorded: '2025-05-16', status: 'Published' },
  { id: 'AR-03', title: 'Business Comm – Practical', courseId: 'CRS-05', level: 'Level II', sectionCode: 'BUS-2A', avgScore: 74, passRate: 81, dateRecorded: '2025-05-18', status: 'Published' },
  { id: 'AR-04', title: 'Peachtree Accounting – Final', courseId: 'CRS-04', level: 'Level III', sectionCode: 'ACC-3A', avgScore: 80, passRate: 90, dateRecorded: '2025-05-20', status: 'Published' },
  { id: 'AR-05', title: 'Principles of Management – Mid', courseId: 'CRS-06', level: 'Level III', sectionCode: 'BUS-3A', avgScore: 71, passRate: 79, dateRecorded: '2025-05-21', status: 'Published' },
];

// --- Assessment: COC Registrations -------------------------------------------
export const cocRegistrations = [
  { id: 'COC-01', traineeId: 'TRNE-003', traineeName: 'Lidya Mekonnen', departmentId: 'DEP-01', level: 'Level IV', phone: '+251-911-345678', amountPaid: 700, registrationDate: '2025-05-10', status: 'Registered' },
  { id: 'COC-02', traineeId: 'TRNE-010', traineeName: 'Nahom Daniel', departmentId: 'DEP-01', level: 'Level IV', phone: '+251-912-345678', amountPaid: 700, registrationDate: '2025-05-11', status: 'Registered' },
  { id: 'COC-03', traineeId: 'TRNE-005', traineeName: 'Meron Tesfaye', departmentId: 'DEP-07', level: 'Level III', phone: '+251-913-345678', amountPaid: 600, registrationDate: '2025-05-12', status: 'Pending Payment' },
  { id: 'COC-04', traineeId: 'TRNE-006', traineeName: 'Dawit Haile', departmentId: 'DEP-04', level: 'Level III', phone: '+251-914-345678', amountPaid: 600, registrationDate: '2025-05-13', status: 'Registered' },
  { id: 'COC-05', traineeId: 'TRNE-007', traineeName: 'Hewan Tadesse', departmentId: 'DEP-04', level: 'Level III', phone: '+251-915-345678', amountPaid: 600, registrationDate: '2025-05-14', status: 'Registered' },
  { id: 'COC-06', traineeId: 'TRNE-012', traineeName: 'Abel Mulugeta', departmentId: 'DEP-04', level: 'Level III', phone: '+251-916-345678', amountPaid: 0, registrationDate: '2025-05-15', status: 'Pending Payment' },
];

// --- Trainer Evaluations (360°) ----------------------------------------------
// Per-trainer aggregated component scores (out of 100) used to compute weighted total.
export const trainerEvaluations = [
  { id: 'TE-01', trainerId: 'TR-01', trainee: 88, peer: 84, self: 90, department: 86, period: 'Sem I 2017' },
  { id: 'TE-02', trainerId: 'TR-02', trainee: 91, peer: 88, self: 85, department: 90, period: 'Sem I 2017' },
  { id: 'TE-03', trainerId: 'TR-03', trainee: 79, peer: 82, self: 80, department: 78, period: 'Sem I 2017' },
  { id: 'TE-04', trainerId: 'TR-04', trainee: 85, peer: 80, self: 88, department: 84, period: 'Sem I 2017' },
  { id: 'TE-05', trainerId: 'TR-05', trainee: 93, peer: 90, self: 89, department: 92, period: 'Sem I 2017' },
  { id: 'TE-06', trainerId: 'TR-08', trainee: 76, peer: 78, self: 82, department: 80, period: 'Sem I 2017' },
];
export const EVAL_WEIGHTS = { trainee: 0.6, peer: 0.05, self: 0.05, department: 0.3 };

// --- Lifelong Learning: Webinars ---------------------------------------------
export const webinars = [
  { id: 'WB-01', title: 'Industry 4.0 & TVET', host: 'BINIAM ABAYU', startTime: '2025-06-20 14:00', durationMin: 60, registrants: 142, status: 'Scheduled', joinUrl: 'https://meet.admas.edu.et/industry40' },
  { id: 'WB-02', title: 'Modern Business Strategy', host: 'ABEBE SHITU', startTime: '2025-06-18 10:00', durationMin: 90, registrants: 98, status: 'Live', joinUrl: 'https://meet.admas.edu.et/bizstrategy' },
  { id: 'WB-03', title: 'Entrepreneurship for Graduates', host: 'ABEBAW DEMEKE', startTime: '2025-06-10 16:00', durationMin: 75, registrants: 210, status: 'Ended', joinUrl: 'https://meet.admas.edu.et/entrepreneur' },
];

// --- Manage Complaints -------------------------------------------------------
export const complaints = [
  { id: 'CMP-01', subject: 'Projector not working in LAB-1', category: 'Facilities', raisedBy: 'BREKTI TEKLEMICHAEL', priority: 'High', status: 'Open', date: '2025-06-05' },
  { id: 'CMP-02', subject: 'Schedule clash for ICT-4A', category: 'Scheduling', raisedBy: 'BINIAM ABAYU', priority: 'High', status: 'In Progress', date: '2025-06-04' },
  { id: 'CMP-03', subject: 'COC payment receipt missing', category: 'Finance', raisedBy: 'Abel Mulugeta', priority: 'Medium', status: 'Open', date: '2025-06-03' },
  { id: 'CMP-04', subject: 'Workshop tools shortage', category: 'Facilities', raisedBy: 'ABEBE SHITU', priority: 'Medium', status: 'Resolved', date: '2025-05-30' },
  { id: 'CMP-05', subject: 'Library access hours', category: 'General', raisedBy: 'Rahel Bekele', priority: 'Low', status: 'Resolved', date: '2025-05-28' },
];

export const seedData = {
  departments,
  centers,
  rooms,
  users,
  trainers,
  courses,
  trainees,
  schedules,
  attendanceRecords,
  courseCoverage,
  coopFollowups,
  skillGapTraining,
  examApprovals,
  assessmentResults,
  cocRegistrations,
  trainerEvaluations,
  webinars,
  complaints,
};

export default seedData;
