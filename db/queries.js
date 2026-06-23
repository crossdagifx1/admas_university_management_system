// Canned SQL for the §4 module reports of the Granular Details Report.
// Each export is a SQL string; run with db.prepare(SQL).all(...params).

// §4 Manage Users table: Full Name, Username, Role & Type, Contact
export const MANAGE_USERS = `
  SELECT full_name AS "Full Name",
         username  AS "Username",
         COALESCE(user_type, role) AS "Role & Type",
         contact   AS "Contact"
  FROM app_user
  ORDER BY role, full_name`;

// §4 Manage Trainees table: Full Name, ID Number, Sex, Level, Year, Section
export const MANAGE_TRAINEES = `
  SELECT t.full_name AS "Full Name",
         t.id_number AS "ID Number",
         t.sex       AS "Sex",
         l.name      AS "Level",
         t.year      AS "Year",
         t.section_id AS "Section"
  FROM trainee t
  LEFT JOIN level l ON l.id = t.level_id
  ORDER BY t.full_name`;

// §4 Trainer Load Report: per-trainer yearly credit hours pivoted by program year,
// grand total, and estimated invigilation days (≈ total/4).
export const TRAINER_LOAD = `
  SELECT tr.name AS "Trainer Name",
         SUM(CASE WHEN py.id = '2018 EXT' THEN tl.credit_hours ELSE 0 END) AS "2018 EXT",
         SUM(CASE WHEN py.id = '2018 REG' THEN tl.credit_hours ELSE 0 END) AS "2018 REG",
         SUM(tl.credit_hours) AS "Grand Total",
         MAX(1, CAST(ROUND(SUM(tl.credit_hours) / 4.0) AS INTEGER)) AS "Est. Invigilation Days"
  FROM trainer tr
  JOIN trainer_load tl ON tl.trainer_id = tr.id
  JOIN program_year py ON py.id = tl.program_year_id
  GROUP BY tr.id
  ORDER BY "Grand Total" DESC`;

// §4 COC Registration Form ledger: Full Name, Current Level, Cell Phone, Amount Paid, City
export const COC_REGISTRATIONS = `
  SELECT c.full_name AS "Full Name",
         l.name      AS "Current Level",
         c.cell_phone AS "Cell Phone",
         c.amount_paid AS "Amount Paid",
         c.city      AS "City"
  FROM coc_registration c
  LEFT JOIN level l ON l.id = c.current_level
  ORDER BY c.registration_date DESC`;

// §4 Cooperative Training Follow-ups
export const COOP_FOLLOWUPS = `
  SELECT COALESCE(t.full_name, cf.trainee_name) AS "Trainee",
         t.id_number AS "ID",
         t.section_id AS "Section",
         cf.organization_name AS "Organization",
         cf.visit_date AS "Visit Date",
         cf.outcome    AS "Outcome",
         cf.status     AS "Status"
  FROM coop_followup cf
  LEFT JOIN trainee t ON t.id = cf.trainee_id
  ORDER BY cf.visit_date DESC`;

export default { MANAGE_USERS, MANAGE_TRAINEES, TRAINER_LOAD, COC_REGISTRATIONS, COOP_FOLLOWUPS };
