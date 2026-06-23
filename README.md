# ADMAS University · TVET Management System (ATMS)

![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/crossdagifx1/admas_university_management_system?utm_source=oss&utm_medium=github&utm_campaign=crossdagifx1%2Fadmas_university_management_system&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)

A modern React implementation of the ADMAS University TVET Management System (ATMS),
re-engineered from the legacy Access database into a web-based **System Administrator
console** with a premium dark glassmorphism UI.

## Implemented modules (System Administrator)

- **Dashboard** — KPI counters (quality alerts, active trainers, trainees, users),
  TVET submissions overview, workload & trainee-distribution charts, conflict and
  complaint feeds.
- **TVET Scheduling** — Manage Schedules (with live room/trainer conflict detection)
  and a printable Trainer Load Report (credit hours + invigilation estimates).
- **Users & Trainees** — Manage system users (roles/status) and the trainee directory.
- **TVET Reports** — Attendance, Course Coverage (LO progress), Cooperative Training
  follow-ups, Skill Gap training, and the Overall Monthly Activity Report.
- **TVET Assessment** — Exam Approvals queue, Institutional Assessment Results, and the
  COC Registration ledger.
- **Trainers Evaluation** — Trainer of the Month calculator and the weighted 360°
  evaluation (Trainee 60% · Peer 5% · Self 5% · Department 30%) with a radar profile.
- **Lifelong Learning** — Live webinar management.
- **Manage Complaints** — issue tracking with status workflow.
- **System Settings** — institution configuration.

Every report screen supports **CSV export** and **print-ready PDF** output.

## Architecture

- **Stack:** React 19 + Vite. Premium UI via CSS variables + inline styles, `lucide-react`
  icons, and hand-built SVG charts (line / bar / donut / radar) — no heavy UI deps.
- **Data layer:** `src/context/DataContext.jsx` holds every ATMS entity (mirroring the
  plan's data dictionary) seeded from `src/data/seed.js`, and exposes lookups,
  CRUD actions, and derived report selectors (conflicts, trainer load, 360°, KPIs,
  monthly activity).
- **Navigation:** grouped/collapsible sidebar driven by `src/config/nav.js`, with a
  view registry in `App.jsx` (no router dependency).

## Run it

```bash
npm install
npm run dev      # http://localhost:3034
npm run build    # production bundle
```

The app runs immediately on the bundled seed dataset — no backend required.

## Connecting a live Supabase backend (optional)

1. `cp .env.example .env` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
   (the **public anon** key, guarded by Row Level Security).
2. `npm install @supabase/supabase-js`

> **Security:** never put a Postgres connection string or the `service_role` key in the
> frontend — browsers expose everything they download. Only the anon key belongs here.
