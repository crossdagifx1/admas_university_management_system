// Audit-log data-access module. Records who changed what on trainers/trainees.
// Fire-and-forget on writes; reads are lazy (only when a History modal opens).
import { getSupabaseClient } from './supabase';

const TABLE = 'audit_log';

const toApp = (r) => ({
  id: r.id,
  entity: r.entity,
  entityId: r.entity_id,
  action: r.action,
  actor: r.actor,
  changes: r.changes,
  createdAt: r.created_at,
});

// entry: { entity, entityId, action, actor, changes }
export async function insert(entry) {
  const sb = await getSupabaseClient();
  if (!sb) return { error: new Error('not configured') };
  const { error } = await sb.from(TABLE).insert({
    entity: entry.entity,
    entity_id: entry.entityId,
    action: entry.action,
    actor: entry.actor ?? null,
    changes: entry.changes ?? null,
  });
  if (error) console.warn('[ATMS] audit insert failed', error);
  return { error };
}

export async function listFor(entity, entityId) {
  const sb = await getSupabaseClient();
  if (!sb) return null;
  const { data, error } = await sb
    .from(TABLE)
    .select('*')
    .eq('entity', entity)
    .eq('entity_id', entityId)
    .order('created_at', { ascending: false });
  if (error) { console.warn('[ATMS] audit listFor failed', error); return null; }
  return data.map(toApp);
}

export async function listAll() {
  const sb = await getSupabaseClient();
  if (!sb) return null;
  const { data, error } = await sb
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { console.warn('[ATMS] audit listAll failed', error); return null; }
  return data.map(toApp);
}

