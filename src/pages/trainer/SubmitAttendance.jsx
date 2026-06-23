import React, { useMemo, useState } from 'react';
import { CalendarCheck, Send } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import GlassCard from '../../components/GlassCard';
import { Badge } from '../../components/ui/Toolbar';
import ImageUpload, { ImageThumb } from '../../components/ui/ImageUpload';
import { useData } from '../../context/DataContext';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const SubmitAttendance = ({ user }) => {
  const { schedules, attendanceRecords, courseTitle, scheduleById, today, submitAttendance } = useData();

  const mySchedules = useMemo(() => schedules.filter((s) => s.trainerId === user.trainerId), [schedules, user.trainerId]);
  const myRecords = useMemo(() => attendanceRecords.filter((a) => a.trainerId === user.trainerId), [attendanceRecords, user.trainerId]);

  const blank = { scheduleId: mySchedules[0]?.id || '', month: 'June', present: '', absent: '', late: '', total: '', notes: '', photoUrl: '' };
  const [form, setForm] = useState(blank);
  const [ok, setOk] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.scheduleId) return;
    const sch = scheduleById(form.scheduleId);
    submitAttendance({
      scheduleId: form.scheduleId,
      trainerId: user.trainerId,
      date: today,
      month: form.month,
      present: form.present === '' ? null : Number(form.present),
      absent: form.absent === '' ? null : Number(form.absent),
      late: form.late === '' ? null : Number(form.late),
      total: form.total === '' ? null : Number(form.total),
      photoUrl: form.photoUrl,
      notes: form.notes,
      sectionLabel: sch?.sectionCode,
    });
    setForm(blank);
    setOk(true);
    setTimeout(() => setOk(false), 2500);
  };

  const columns = [
    { key: 'date', label: 'Submitted', render: (r) => <span style={{ color: 'hsl(var(--text-primary))', fontWeight: '600' }}>{r.date}</span> },
    { key: 'month', label: 'Month', render: (r) => r.month || '—' },
    { key: 'section', label: 'Section', render: (r) => scheduleById(r.scheduleId)?.sectionCode || '—' },
    { key: 'present', label: 'Present', align: 'center', render: (r) => <span style={{ color: 'hsl(var(--accent-emerald))', fontWeight: '700' }}>{r.present ?? '—'}</span> },
    { key: 'total', label: 'Total', align: 'center', render: (r) => r.total ?? '—' },
    { key: 'rate', label: 'Rate', align: 'center', render: (r) => {
        if (r.total == null || r.present == null) return <Badge tone="info">—</Badge>;
        const p = Math.round((r.present / r.total) * 100);
        return <Badge tone={p >= 85 ? 'success' : p >= 70 ? 'warning' : 'danger'}>{p}%</Badge>;
      }
    },
    { key: 'photo', label: 'Photo', align: 'center', render: (r) => <ImageThumb src={r.photoUrl} /> },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <PageHeader icon={CalendarCheck} title="Submit Monthly Attendance" subtitle="Record attendance and upload the signed sheet photo for the admin" />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: '18px', alignItems: 'start' }}>
        <GlassCard hoverEffect={false}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '16px' }}>New Attendance Submission</h3>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Field label="Class / Section">
              <select className="input-field" value={form.scheduleId} onChange={(e) => set('scheduleId', e.target.value)} required>
                {mySchedules.length === 0 && <option value="">No classes assigned</option>}
                {mySchedules.map((s) => <option key={s.id} value={s.id}>{s.sectionCode} — {courseTitle(s.courseId)}</option>)}
              </select>
            </Field>
            <Field label="Month">
              <select className="input-field" value={form.month} onChange={(e) => set('month', e.target.value)}>
                {MONTHS.map((m) => <option key={m}>{m}</option>)}
              </select>
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="Present (Optional)"><input type="number" min="0" placeholder="Optional" className="input-field" value={form.present} onChange={(e) => set('present', e.target.value)} /></Field>
              <Field label="Total Enrolled (Optional)"><input type="number" min="0" placeholder="Optional" className="input-field" value={form.total} onChange={(e) => set('total', e.target.value)} /></Field>
              <Field label="Absent (Optional)"><input type="number" min="0" placeholder="Optional" className="input-field" value={form.absent} onChange={(e) => set('absent', e.target.value)} /></Field>
              <Field label="Late (Optional)"><input type="number" min="0" placeholder="Optional" className="input-field" value={form.late} onChange={(e) => set('late', e.target.value)} /></Field>
            </div>
            <ImageUpload label="Attendance sheet photo" hint="JPG/PNG up to 4 MB" value={form.photoUrl} onChange={(url) => set('photoUrl', url)} />
            <Field label="Notes"><textarea className="input-field" rows="2" value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Optional remarks…" /></Field>
            <button type="submit" className="btn-primary" disabled={mySchedules.length === 0}><Send size={15} /> Submit to Admin</button>
            {ok && <span style={{ fontSize: '0.8rem', color: 'hsl(var(--accent-emerald))', textAlign: 'center' }}>✓ Attendance sent to the admin dashboard.</span>}
          </form>
        </GlassCard>

        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '12px' }}>My Submissions ({myRecords.length})</h3>
          <DataTable columns={columns} rows={myRecords} emptyText="No attendance submitted yet." />
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, children }) => (<div className="input-group"><label className="input-label">{label}</label>{children}</div>);

export default SubmitAttendance;
