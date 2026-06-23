// Users data-access module. Owns the snake_case <-> camelCase mapping and
// degrades gracefully when Supabase is not configured.
import { getSupabaseClient } from './supabase';

const TABLE = 'users';

export const toApp = (r) => ({
  id: r.id,
  username: r.username,
  fullName: r.full_name,
  email: r.email,
  role: r.role,
  departmentId: r.department_id,
  mobileNumber: r.mobile_number,
  status: r.status,
  createdAt: r.created_at,
  password: r.password,
});

export const toRow = (a) => {
  const row = {};
  if ('id' in a) row.id = a.id;
  if ('username' in a) row.username = a.username;
  if ('fullName' in a) row.full_name = a.fullName;
  if ('email' in a) row.email = a.email ?? null;
  if ('role' in a) row.role = a.role;
  if ('departmentId' in a) row.department_id = a.departmentId ?? null;
  if ('mobileNumber' in a) row.mobile_number = a.mobileNumber ?? null;
  if ('status' in a) row.status = a.status;
  if ('createdAt' in a) row.created_at = a.createdAt;
  if ('password' in a) row.password = a.password ?? null;
  return row;
};

export async function list() {
  const sb = await getSupabaseClient();
  if (!sb) return null;
  const { data, error } = await sb.from(TABLE).select('*').order('id');
  if (error) { console.warn('[ATMS] users.list failed', error); return null; }
  return data.map(toApp);
}

export async function insert(user) {
  const sb = await getSupabaseClient();
  if (!sb) return { data: null, error: new Error('not configured') };
  const { data, error } = await sb.from(TABLE).insert(toRow(user)).select().single();
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
      .channel('rt-users')
      .on('postgres_changes', { event: '*', schema: 'public', table: TABLE }, (p) => {
        const row = p.eventType === 'DELETE' ? { id: p.old?.id } : toApp(p.new);
        cb(p.eventType, row);
      })
      .subscribe();
    return () => sb.removeChannel(ch);
  } catch (err) {
    console.warn('[ATMS] users.subscribe unavailable', err);
    return null;
  }
}
