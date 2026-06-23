# Going Live with Supabase — ATMS

The app now runs against a live Supabase Postgres backend. It auto-detects live
mode from `.env.local`; with no env file it falls back to the offline seed dataset.

## What was wired

| Concern | Decision |
| :--- | :--- |
| **Data source** | Live Supabase. All datasets hydrate from Postgres on load — **no mock data shown when connected**. |
| **Seed scope** | 42 real trainers + departments, courses, centers, rooms, and user accounts. Transactional tables (trainees, schedules, attendance, COC, evaluations…) are created **empty** for real data entry. |
| **Auth** | Login by username; **the username is also the password**. Accounts read from the live `users` table. Admin: `admin_cross` / `admin_cross`. |
| **Security (RLS)** | Row-Level Security **on**; the anon key is **read-only** (SELECT). In-app writes are rejected until you add Supabase Auth + write policies. |

## One-time setup

First generate the SQL (derives the seed from `src/data/seed.js` so the seeded
usernames match login). This writes **both** `db/supabase.sql` (for manual paste)
and `supabase/migrations/20260618120000_atms_init.sql` (for the CLI):

```bash
npm run db:supabase
```

Then provision the database with **either** option:

### Option A — SQL Editor (no CLI)
Open `https://supabase.com/dashboard/project/aqokbotocmyabbftdyvq` → **SQL Editor**
→ paste the contents of `db/supabase.sql` → **Run**. Idempotent (drops & recreates
the ATMS tables, then reseeds).

### Option B — Supabase CLI (migrations)
```bash
supabase login                 # opens browser for an access token
supabase init                  # writes supabase/config.toml (skip if it exists)
supabase link --project-ref aqokbotocmyabbftdyvq   # prompts for the DB password
supabase db push               # applies supabase/migrations/*.sql to the project
```
> The DB password is entered **interactively** and is never written to a tracked
> file. If you pasted it anywhere, rotate it (Dashboard → Project Settings →
> Database → Reset database password).

Then **run the app**:
   ```bash
   npm install
   npm run dev
   ```
   The login screen badge shows **"Connecting to live database…"** briefly, then you
   can sign in with `admin_cross` / `admin_cross`. Trainer logins use their generated
   username (e.g. Biniam Abayu → `b.abayu` / `b.abayu`).

## Verifying it's live

- Settings page shows the data-source label **"Supabase (live)"**.
- Manage Trainers lists all **42** real trainers from Postgres.
- Editing a trainer will show "Update failed — reverted" — that's expected: the anon
  key is read-only by design (see below).

## Credentials

`.env.local` holds the project URL and the **public publishable key**
(`sb_publishable_…`, the modern replacement for the legacy anon JWT — both are
supported by `src/services/supabase.js`). Never commit the secret key
(`sb_secret_…`) / `service_role` key or a Postgres connection string — the browser
exposes everything it downloads. The publishable key maps to the `anon` role and is
safe precisely because RLS restricts it.

## Enabling writes later (optional)

Writes are intentionally blocked. To allow in-app editing you have two paths:

1. **Add Supabase Auth** and write policies scoped to authenticated users, e.g.
   ```sql
   create policy "auth write trainers" on trainers
     for all to authenticated using (true) with check (true);
   ```
   then sign users in with `supabase.auth` instead of the username-as-password shim.

2. **Prototype-only:** loosen to permissive anon write policies (insecure — anyone with
   the anon key can write). Not recommended beyond local demos.
