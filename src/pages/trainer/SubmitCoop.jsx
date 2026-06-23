import React, { useMemo, useState } from 'react';
import { Building2, Send } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import GlassCard from '../../components/GlassCard';
import { Badge } from '../../components/ui/Toolbar';
import { useData } from '../../context/DataContext';

const OUTCOME_TONE = { Excellent: 'success', 'On track': 'info', 'Needs support': 'warning' };

const SubmitCoop = ({ user }) => {
  const { trainees, coopFollowups, today, submitCoop } = useData();

  // Trainees in the trainer's department (their supervised cohort).
  const myTrainees = useMemo(
    () => trainees.filter((t) => !user.departmentId || t.departmentId === user.departmentId),
    [trainees, user.departmentId]
  );
  const myCoop = useMemo(() => coopFollowups.filter((c) => c.trainerId === user.trainerId), [coopFollowups, user.trainerId]);

  const blank = { traineeId: myTrainees[0]?.id || '', organizationName: '', visitDate: today, outcome: 'On track', notes: '', status: 'Completed' };
  const [form, setForm] = useState(blank);
  const [ok, setOk] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    const trainee = myTrainees.find((t) => t.id === form.traineeId);
    if (!trainee || !form.organizationName) return;
    submitCoop({
      traineeId: trainee.id,
      traineeName: trainee.fullName,
      trainerId: user.trainerId,
      organizationName: form.organizationName,
      visitDate: form.visitDate,
      outcome: form.outcome,
      notes: form.notes,
      status: form.status,
    });
    setForm({ ...blank });
    setOk(true);
    setTimeout(() => setOk(false), 2500);
  };

  const columns = [
    { key: 'traineeName', label: 'Trainee', render: (r) => <span style={{ fontWeight: '600', color: 'hsl(var(--text-primary))' }}>{r.traineeName}</span> },
    { key: 'organizationName', label: 'Organization' },
    { key: 'visitDate', label: 'Visit' },
    { key: 'outcome', label: 'Outcome', align: 'center', render: (r) => <Badge tone={OUTCOME_TONE[r.outcome] || 'info'}>{r.outcome}</Badge> },
    { key: 'status', label: 'Status', align: 'center', render: (r) => <Badge tone={r.status === 'Completed' ? 'success' : 'warning'}>{r.status}</Badge> },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <PageHeader icon={Building2} title="Cooperative Training Follow-up" subtitle="Log a workplace visit for a trainee on coop placement" />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: '18px', alignItems: 'start' }}>
        <GlassCard hoverEffect={false}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '16px' }}>New Follow-up</h3>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Field label="Trainee">
              <select className="input-field" value={form.traineeId} onChange={(e) => set('traineeId', e.target.value)} required>
                {myTrainees.map((t) => <option key={t.id} value={t.id}>{t.fullName} — {t.sectionCode}</option>)}
              </select>
            </Field>
            <Field label="Host Organization"><input className="input-field" required value={form.organizationName} onChange={(e) => set('organizationName', e.target.value)} placeholder="e.g. Dashen Bank" /></Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="Visit Date"><input type="date" className="input-field" value={form.visitDate} onChange={(e) => set('visitDate', e.target.value)} /></Field>
              <Field label="Outcome"><select className="input-field" value={form.outcome} onChange={(e) => set('outcome', e.target.value)}>{['Excellent', 'On track', 'Needs support'].map((o) => <option key={o}>{o}</option>)}</select></Field>
            </div>
            <Field label="Status"><select className="input-field" value={form.status} onChange={(e) => set('status', e.target.value)}>{['Completed', 'Follow-up'].map((s) => <option key={s}>{s}</option>)}</select></Field>
            <Field label="Notes"><textarea className="input-field" rows="2" value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Supervisor feedback…" /></Field>
            <button type="submit" className="btn-primary"><Send size={15} /> Submit to Admin</button>
            {ok && <span style={{ fontSize: '0.8rem', color: 'hsl(var(--accent-emerald))', textAlign: 'center' }}>✓ Follow-up sent to the admin.</span>}
          </form>
        </GlassCard>

        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '12px' }}>My Follow-ups ({myCoop.length})</h3>
          <DataTable columns={columns} rows={myCoop} emptyText="No follow-ups logged yet." />
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, children }) => (<div className="input-group"><label className="input-label">{label}</label>{children}</div>);

export default SubmitCoop;
