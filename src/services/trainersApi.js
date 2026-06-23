// Trainers data-access module. Maps the Supabase (snake_case) row shape to the
// app's camelCase shape and back. The rest of the app stays camelCase — all
// snake_case lives here. When Supabase is not configured, getSupabaseClient()
// returns null and every function degrades to null/{error} so the caller can
// fall back to the bundled seed dataset.
import { getSupabaseClient } from './supabase';

const TABLE = 'trainers';

// Postgres row -> app object
export const toApp = (r) => ({
  id: r.id,
  userId: r.user_id,
  name: r.name,
  staffNo: r.staff_no,
  departmentId: r.department_id,
  employmentType: r.employment_type,
  presentStatus: r.present_status,
  rating: r.rating,
  photoUrl: r.photo_url,
});

// app object/patch -> Postgres row. Only includes keys actually present so a
// partial patch (e.g. just { presentStatus }) never nulls out other columns.
export const toRow = (a) => {
  const row = {};
  if ('id' in a) row.id = a.id;
  if ('userId' in a) row.user_id = a.userId ?? null;
  if ('name' in a) row.name = a.name;
  if ('staffNo' in a) row.staff_no = a.staffNo;
  if ('departmentId' in a) row.department_id = a.departmentId;
  if ('employmentType' in a) row.employment_type = a.employmentType;
  if ('presentStatus' in a) row.present_status = a.presentStatus;
  if ('rating' in a) row.rating = a.rating;
  if ('photoUrl' in a) row.photo_url = a.photoUrl ?? null;
  return row;
};

export async function list() {
  const sb = await getSupabaseClient();
  if (!sb) return null;
  const { data, error } = await sb.from(TABLE).select('*').order('id');
  if (error) { console.warn('[ATMS] trainers.list failed', error); return null; }
  return data.map(toApp);
}

export async function insert(trainer) {
  const sb = await getSupabaseClient();
  if (!sb) return { data: null, error: new Error('not configured') };
  const { data, error } = await sb.from(TABLE).insert(toRow(trainer)).select().single();
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

// Subscribe to realtime changes. cb(eventType, payloadRow). Returns an unsubscribe
// function (or null when unavailable). Never throws.
export async function subscribe(cb) {
  try {
    const sb = await getSupabaseClient();
    if (!sb) return null;
    const ch = sb
      .channel('rt-trainers')
      .on('postgres_changes', { event: '*', schema: 'public', table: TABLE }, (p) => {
        const row = p.eventType === 'DELETE' ? { id: p.old?.id } : toApp(p.new);
        cb(p.eventType, row);
      })
      .subscribe();
    return () => sb.removeChannel(ch);
  } catch (err) {
    console.warn('[ATMS] trainers.subscribe unavailable', err);
    return null;
  }
}
