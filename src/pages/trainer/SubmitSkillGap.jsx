import React, { useMemo, useState } from 'react';
import { GitBranch, Send } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import GlassCard from '../../components/GlassCard';
import ImageUpload, { ImageThumb } from '../../components/ui/ImageUpload';
import { useData } from '../../context/DataContext';

const SubmitSkillGap = ({ user }) => {
  const { trainees, skillGapTraining, today, submitSkillGap } = useData();

  const myTrainees = useMemo(
    () => trainees.filter((t) => !user.departmentId || t.departmentId === user.departmentId),
    [trainees, user.departmentId]
  );
  const mySessions = useMemo(() => skillGapTraining.filter((s) => s.trainerId === user.trainerId), [skillGapTraining, user.trainerId]);

  const blank = { skillArea: '', studentIds: [], learningOutcomes: '', durationHours: '', evidenceUrl: '' };
  const [form, setForm] = useState(blank);
  const [ok, setOk] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const toggleStudent = (id) => set('studentIds', form.studentIds.includes(id) ? form.studentIds.filter((s) => s !== id) : [...form.studentIds, id]);

  const submit = (e) => {
    e.preventDefault();
    if (!form.skillArea || form.studentIds.length === 0) return;
    const names = myTrainees.filter((t) => form.studentIds.includes(t.id)).map((t) => t.fullName);
    submitSkillGap({
      skillArea: form.skillArea,
      trainerId: user.trainerId,
      supportedStudentIds: form.studentIds,
      traineeName: names.length > 2 ? `${names.slice(0, 2).join(', ')} +${names.length - 2}` : names.join(', '),
      studentCount: names.length,
      learningOutcomes: form.learningOutcomes,
      durationHours: Number(form.durationHours) || 0,
      evidenceUrl: form.evidenceUrl,
      date: today,
    });
    setForm(blank);
    setOk(true);
    setTimeout(() => setOk(false), 2500);
  };

  const columns = [
    { key: 'skillArea', label: 'Skill Area', render: (r) => <span style={{ fontWeight: '600', color: 'hsl(var(--text-primary))' }}>{r.skillArea}</span> },
    { key: 'students', label: 'Students Supported', render: (r) => r.traineeName },
    { key: 'count', label: '#', align: 'center', render: (r) => r.studentCount ?? '—' },
    { key: 'durationHours', label: 'Hours', align: 'center', render: (r) => <span style={{ fontWeight: '700', color: 'hsl(var(--accent-gold))' }}>{r.durationHours}h</span> },
    { key: 'date', label: 'Date' },
    { key: 'evidence', label: 'Photo', align: 'center', render: (r) => <ImageThumb src={r.evidenceUrl} /> },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <PageHeader icon={GitBranch} title="Skill Gap Support" subtitle="Report extra support sessions and upload a photo of the students you helped" />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 440px) 1fr', gap: '18px', alignItems: 'start' }}>
        <GlassCard hoverEffect={false}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '16px' }}>New Support Session</h3>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Field label="Skill Area"><input className="input-field" required value={form.skillArea} onChange={(e) => set('skillArea', e.target.value)} placeholder="e.g. Git & Version Control" /></Field>
            <div className="input-group">
              <label className="input-label">Students supported ({form.studentIds.length} selected)</label>
              <div style={{ maxHeight: '150px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '8px' }}>
                {myTrainees.map((t) => (
                  <label key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 8px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem', background: form.studentIds.includes(t.id) ? 'rgba(0,229,255,0.07)' : 'transparent' }}>
                    <input type="checkbox" checked={form.studentIds.includes(t.id)} onChange={() => toggleStudent(t.id)} style={{ accentColor: '#00e5ff' }} />
                    <span style={{ color: 'hsl(var(--text-primary))' }}>{t.fullName}</span>
                    <span style={{ marginLeft: 'auto', color: 'hsl(var(--text-muted))', fontSize: '0.74rem' }}>{t.sectionCode}</span>
                  </label>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="Duration (hrs)"><input type="number" min="0" step="0.5" className="input-field" value={form.durationHours} onChange={(e) => set('durationHours', e.target.value)} /></Field>
            </div>
            <Field label="Learning Outcomes"><textarea className="input-field" rows="2" value={form.learningOutcomes} onChange={(e) => set('learningOutcomes', e.target.value)} placeholder="What was practiced…" /></Field>
            <ImageUpload label="Session photo" hint="Photo of students supported · up to 4 MB" value={form.evidenceUrl} onChange={(url) => set('evidenceUrl', url)} />
            <button type="submit" className="btn-primary"><Send size={15} /> Submit to Admin</button>
            {ok && <span style={{ fontSize: '0.8rem', color: 'hsl(var(--accent-emerald))', textAlign: 'center' }}>✓ Session sent to the admin.</span>}
          </form>
        </GlassCard>

        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '12px' }}>My Sessions ({mySessions.length})</h3>
          <DataTable columns={columns} rows={mySessions} emptyText="No skill-gap sessions reported yet." />
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, children }) => (<div className="input-group"><label className="input-label">{label}</label>{children}</div>);

export default SubmitSkillGap;
