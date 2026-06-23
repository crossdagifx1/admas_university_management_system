// Validators + parsers for the ATMS identifier formats documented in the
// Granular Details Report (§1 ID Types, §2 Class Sections, §3 Room Details).
// Pure functions, no dependencies — usable from Node, the browser, or tests.

// --- §1 User / Trainee / Trainer ID (also the username) ----------------------
// Examples: 11553/17, 2031/16, 11554/18  ->  <serial>/<2-digit entry year>
export const USER_ID_RE = /^(\d{1,6})\/(\d{2})$/;

export function isUserId(v) {
  return typeof v === 'string' && USER_ID_RE.test(v.trim());
}

export function parseUserId(v) {
  const m = USER_ID_RE.exec(String(v).trim());
  if (!m) return null;
  return { serial: Number(m[1]), entryYear: Number(m[2]), raw: `${m[1]}/${m[2]}` };
}

// --- §1 Schedule / Section ID (composite) ------------------------------------
// Example: 2018 EXT-M1-01  ->  <year> <REG|EXT>-<sectionCode>-<sequence>
export const SCHEDULE_ID_RE = /^(\d{4})\s+(REG|EXT)-([A-Z]\d{1,2})-(\d{1,3})$/;

export function isScheduleId(v) {
  return typeof v === 'string' && SCHEDULE_ID_RE.test(v.trim());
}

export function parseScheduleId(v) {
  const m = SCHEDULE_ID_RE.exec(String(v).trim());
  if (!m) return null;
  return {
    year: Number(m[1]),
    track: m[2],
    sectionCode: m[3],
    sequence: Number(m[4]),
    programYearId: `${m[1]} ${m[2]}`,
  };
}

// --- §2 Class section code ---------------------------------------------------
// Examples: 18-19-M1, 17-18-A1, 10-11-M44  ->  <yy>-<yy>-<Letter><Number>
export const SECTION_RE = /^(\d{2})-(\d{2})-([A-Z])(\d{1,2})$/;

export function isSectionCode(v) {
  return typeof v === 'string' && SECTION_RE.test(v.trim());
}

export function parseSectionCode(v) {
  const m = SECTION_RE.exec(String(v).trim());
  if (!m) return null;
  return {
    yearStart: Number(m[1]),
    yearEnd: Number(m[2]),
    code: `${m[3]}${m[4]}`,
    letter: m[3],
    number: Number(m[4]),
  };
}

// --- §3 Room label -----------------------------------------------------------
// Classroom: 101, 202, 301  |  Computer lab: "Lab 201"
export const ROOM_CLASS_RE = /^\d{3}$/;
export const ROOM_LAB_RE = /^Lab\s+(\d{3})$/i;

export function classifyRoom(v) {
  const s = String(v).trim();
  if (ROOM_LAB_RE.test(s)) return { label: s, type: 'COMPUTER_LAB' };
  if (ROOM_CLASS_RE.test(s)) return { label: s, type: 'CLASSROOM' };
  return { label: s, type: null }; // unknown / workshop / named room
}

export default {
  USER_ID_RE, SCHEDULE_ID_RE, SECTION_RE, ROOM_CLASS_RE, ROOM_LAB_RE,
  isUserId, parseUserId,
  isScheduleId, parseScheduleId,
  isSectionCode, parseSectionCode,
  classifyRoom,
};
