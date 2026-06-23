// Trainees data-access module. Same pattern as trainersApi.js — owns the
// snake_case <-> camelCase mapping and degrades gracefully when Supabase is
// not configured.
import { getSupabaseClient } from './supabase';

const TABLE = 'trainees';

export const toApp = (r) => ({
  id: r.id,
  studentId: r.student_id,
  firstName: r.first_name,
  lastName: r.last_name,
  fullName: r.full_name,
  sex: r.sex,
  academicLevel: r.academic_level,
  sectionCode: r.section_code,
  departmentId: r.department_id,
  entryYear: r.entry_year,
  city: r.city,
  phone: r.phone,
  emergencyContactName: r.emergency_contact_name,
  emergencyContactPhone1: r.emergency_contact_phone1,
  status: r.status,
  photoUrl: r.photo_url,
});

export const toRow = (a) => {
  const row = {};
  if ('id' in a) row.id = a.id;
  if ('studentId' in a) row.student_id = a.studentId;
  if ('firstName' in a) row.first_name = a.firstName;
  if ('lastName' in a) row.last_name = a.lastName;
  if ('fullName' in a) row.full_name = a.fullName;
  if ('sex' in a) row.sex = a.sex;
  if ('academicLevel' in a) row.academic_level = a.academicLevel;
  if ('sectionCode' in a) row.section_code = a.sectionCode;
  if ('departmentId' in a) row.department_id = a.departmentId;
  if ('entryYear' in a) row.entry_year = a.entryYear;
  if ('city' in a) row.city = a.city;
  if ('phone' in a) row.phone = a.phone;
  if ('emergencyContactName' in a) row.emergency_contact_name = a.emergencyContactName;
  if ('emergencyContactPhone1' in a) row.emergency_contact_phone1 = a.emergencyContactPhone1;
  if ('status' in a) row.status = a.status;
  if ('photoUrl' in a) row.photo_url = a.photoUrl ?? null;
  return row;
};

export async function list() {
  const sb = await getSupabaseClient();
  if (!sb) return null;
  const { data, error } = await sb.from(TABLE).select('*').order('id');
  if (error) { console.warn('[ATMS] trainees.list failed', error); return null; }
  return data.map(toApp);
}

export async function insert(trainee) {
  const sb = await getSupabaseClient();
  if (!sb) return { data: null, error: new Error('not configured') };
  const { data, error } = await sb.from(TABLE).insert(toRow(trainee)).select().single();
  return { data: data ? toApp(data) : null, error };
}

export async function update(id, patch) {
  const sb = await getSupabaseClient();
  if (!sb) return { data: null, error: new Error('not configured') };
  const { data, error } = await sb.from(TABLE).update(toRow(patch)).eq('id', id).select().single();
  return { data: data ? toApp(data) : null, error };
}

export async function remove(id) {
  const sb = await getSupabaseClient();
  if (!sb) return { error: new Error('not configured') };
  const { error } = await sb.from(TABLE).delete().eq('id', id);
  return { error };
}

export async function removeMany(ids) {
  const sb = await getSupabaseClient();
  if (!sb) return { error: new Error('not configured') };
  const { error } = await sb.from(TABLE).delete().in('id', ids);
  return { error };
}

export async function subscribe(cb) {
  try {
    const sb = await getSupabaseClient();
    if (!sb) return null;
    const ch = sb
      .channel('rt-trainees')
      .on('postgres_changes', { event: '*', schema: 'public', table: TABLE }, (p) => {
        const row = p.eventType === 'DELETE' ? { id: p.old?.id } : toApp(p.new);
        cb(p.eventType, row);
      })
      .subscribe();
    return () => sb.removeChannel(ch);
  } catch (err) {
    console.warn('[ATMS] trainees.subscribe unavailable', err);
    return null;
  }
}
