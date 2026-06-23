import React, { useMemo, useState } from 'react';
import { TrendingUp, Send } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import GlassCard from '../../components/GlassCard';
import { ProgressBar } from '../../components/ui/Toolbar';
import { useData } from '../../context/DataContext';

const SubmitCoverage = ({ user }) => {
  const { schedules, courseCoverage, courseTitle, courseById, scheduleById, today, submitCoverage } = useData();

  const mySchedules = useMemo(() => schedules.filter((s) => s.trainerId === user.trainerId), [schedules, user.trainerId]);
  const myCoverage = useMemo(() => courseCoverage.filter((c) => c.trainerId === user.trainerId), [courseCoverage, user.trainerId]);

  const first = mySchedules[0];
  const blank = { scheduleId: first?.id || '', coveredLos: '', coverageNotes: '' };
  const [form, setForm] = useState(blank);
  const [ok, setOk] = useState(false);

  const selectedSch = scheduleById(form.scheduleId);
  const totalLos = selectedSch ? (courseById(selectedSch.courseId)?.totalLos || 0) : 0;

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.scheduleId || form.coveredLos === '') return;
    submitCoverage({
      scheduleId: form.scheduleId,
      trainerId: user.trainerId,
      courseId: selectedSch.courseId,
      totalLos,
      coveredLos: Math.min(Number(form.coveredLos), totalLos),
      coverageNotes: form.coverageNotes,
      dateSubmitted: today,
      courseLabel: courseTitle(selectedSch.courseId),
    });
    setForm({ ...blank, scheduleId: form.scheduleId });
    setOk(true);
    setTimeout(() => setOk(false), 2500);
  };

  const columns = [
    { key: 'course', label: 'Course', render: (r) => <span style={{ fontWeight: '600', color: 'hsl(var(--text-primary))' }}>{courseTitle(r.courseId)}</span> },
    { key: 'section', label: 'Section', render: (r) => scheduleById(r.scheduleId)?.sectionCode || '—' },
    { key: 'los', label: 'LOs', align: 'center', render: (r) => `${r.coveredLos} / ${r.totalLos}` },
    { key: 'progress', label: 'Coverage', width: '180px', render: (r) => <ProgressBar value={r.coveredLos} max={r.totalLos} accent={Math.round((r.coveredLos / r.totalLos) * 100) >= 80 ? 'hsl(var(--accent-emerald))' : 'hsl(var(--accent-gold))'} /> },
    { key: 'dateSubmitted', label: 'Submitted' },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <PageHeader icon={TrendingUp} title="Report Course Coverage" subtitle="Tell the admin how many learning outcomes you have covered" />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: '18px', alignItems: 'start' }}>
        <GlassCard hoverEffect={false}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '16px' }}>New Coverage Report</h3>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Field label="Class / Course">
              <select className="input-field" value={form.scheduleId} onChange={(e) => set('scheduleId', e.target.value)} required>
                {mySchedules.length === 0 && <option value="">No classes assigned</option>}
                {mySchedules.map((s) => <option key={s.id} value={s.id}>{s.sectionCode} — {courseTitle(s.courseId)}</option>)}
              </select>
            </Field>
            <Field label={`Learning outcomes covered (of ${totalLos})`}>
              <input type="number" min="0" max={totalLos} className="input-field" required value={form.coveredLos} onChange={(e) => set('coveredLos', e.target.value)} />
            </Field>
            <Field label="Notes"><textarea className="input-field" rows="3" value={form.coverageNotes} onChange={(e) => set('coverageNotes', e.target.value)} placeholder="What was covered, what remains…" /></Field>
            <button type="submit" className="btn-primary" disabled={mySchedules.length === 0}><Send size={15} /> Submit to Admin</button>
            {ok && <span style={{ fontSize: '0.8rem', color: 'hsl(var(--accent-emerald))', textAlign: 'center' }}>✓ Coverage report sent to the admin.</span>}
          </form>
        </GlassCard>

        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '12px' }}>My Reports ({myCoverage.length})</h3>
          <DataTable columns={columns} rows={myCoverage} emptyText="No coverage reported yet." />
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, children }) => (<div className="input-group"><label className="input-label">{label}</label>{children}</div>);

export default SubmitCoverage;
