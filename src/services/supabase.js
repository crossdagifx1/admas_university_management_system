// Supabase client. The app goes "live" the moment both env vars are present in
// .env.local; otherwise it falls back to the bundled seed dataset (offline mode).
//
//   VITE_SUPABASE_URL=https://<project-ref>.supabase.co
//   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...   (preferred)
//   VITE_SUPABASE_ANON_KEY=<legacy-anon-jwt>           (still supported)
//
// SECURITY: only the public publishable/anon key (guarded by Row-Level Security)
// belongs in the client. Never put the secret (sb_secret_...) / service_role key
// or a Postgres connection string in frontend code — browsers expose everything
// they download.
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
// Accept the new publishable key or the legacy anon JWT, whichever is present.
const anonKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

// @supabase/supabase-js is a real dependency now, so we import it statically and
// create the singleton lazily. Async signature is kept for call-site stability.
let _client = null;
export async function getSupabaseClient() {
  if (!isSupabaseConfigured) return null;
  if (!_client) {
    _client = createClient(url, anonKey, {
      auth: { persistSession: false },
    });
  }
  return _client;
}

export const dataSourceLabel = isSupabaseConfigured ? 'Supabase (live)' : 'Seed dataset (offline)';
