// Generic read-only Supabase access for the many tables that don't need their
// own bespoke module. Every column in db/supabase.sql is the exact snake_case
// of its camelCase app key, so one converter round-trips them all
// (schedule_time1 -> scheduleTime1, emergency_contact_phone1 -> emergencyContactPhone1, etc.).
import { getSupabaseClient } from './supabase';

const snakeToCamel = (s) => s.replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase());

export const rowToApp = (row) =>
  Object.fromEntries(Object.entries(row).map(([k, v]) => [snakeToCamel(k), v]));

const TABLE_COLUMNS = {
  schedules: [
    'id', 'entry_year', 'section_code', 'course_id', 'trainer_id', 'room_id', 'center_id',
    'schedule_time1', 'schedule_time2', 'start_date', 'end_date'
  ],
  attendance: [
    'id', 'schedule_id', 'trainer_id', 'date', 'month', 'present', 'absent', 'late', 'total',
    'photo_url', 'notes'
  ],
  course_coverage: [
    'id', 'schedule_id', 'trainer_id', 'course_id', 'total_los', 'covered_los', 'coverage_notes',
    'date_submitted'
  ],
  skill_gap_training: [
    'id', 'trainee_name', 'skill_area', 'learning_outcomes', 'duration_hours', 'trainer_id',
    'evidence_url', 'date'
  ],
  coop_followups: [
    'id', 'trainee_id', 'trainee_name', 'organization_name', 'visit_date', 'outcome', 'notes',
    'status'
  ],
  exam_approvals: [
    'id', 'course_id', 'trainer_id', 'exam_type', 'status', 'submission_date', 'approval_date',
    'plan_details'
  ],
  complaints: [
    'id', 'subject', 'category', 'raised_by', 'priority', 'status', 'date'
  ]
};

const camelToSnake = (s) => s.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);

export const appToRow = (table, app) => {
  if (!app) return null;
  const cols = TABLE_COLUMNS[table];
  const entries = Object.entries(app)
    .map(([k, v]) => [camelToSnake(k), v])
    .filter(([k]) => !cols || cols.includes(k));
  return Object.fromEntries(entries);
};

// Returns an array of camelCase rows, or null when Supabase is unavailable / the
// query errors (caller decides the fallback — empty in live mode, seed offline).
export async function selectAll(table, orderBy = 'id') {
  const sb = await getSupabaseClient();
  if (!sb) return null;
  let query = sb.from(table).select('*');
  if (orderBy) query = query.order(orderBy);
  const { data, error } = await query;
  if (error) {
    console.warn(`[ATMS] selectAll(${table}) failed`, error.message);
    return null;
  }
  return data.map(rowToApp);
}

export async function insertRow(table, record) {
  const sb = await getSupabaseClient();
  if (!sb) return { data: null, error: new Error('not configured') };
  const { data, error } = await sb.from(table).insert(appToRow(table, record)).select().single();
  return { data: data ? rowToApp(data) : null, error };
}

export async function updateRow(table, id, patch) {
  const sb = await getSupabaseClient();
  if (!sb) return { data: null, error: new Error('not configured') };
  const { data, error } = await sb.from(table).update(appToRow(table, patch)).eq('id', id).select().single();
  return { data: data ? rowToApp(data) : null, error };
}

export async function deleteRow(table, id) {
  const sb = await getSupabaseClient();
  if (!sb) return { error: new Error('not configured') };
  const { error } = await sb.from(table).delete().eq('id', id);
  return { error };
}

export async function subscribeTable(table, callback) {
  try {
    const sb = await getSupabaseClient();
    if (!sb) return null;
    const channelName = `rt-${table}`;
    const ch = sb
      .channel(channelName)
      .on('postgres_changes', { event: '*', schema: 'public', table }, (p) => {
        const row = p.eventType === 'DELETE' ? { id: p.old?.id } : rowToApp(p.new);
        callback(p.eventType, row);
      })
      .subscribe();
    return () => sb.removeChannel(ch);
  } catch (err) {
    console.warn(`[ATMS] subscribe(${table}) unavailable`, err);
    return null;
  }
}
