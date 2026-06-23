import React, { useMemo, useState } from 'react';
import { FilePlus2, Send } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import GlassCard from '../../components/GlassCard';
import { Badge } from '../../components/ui/Toolbar';
import { useData } from '../../context/DataContext';

const STATUS_TONE = { Pending: 'warning', Approved: 'success', Draft: 'info', Rejected: 'danger' };

const SubmitExam = ({ user }) => {
  const { schedules, courses, examApprovals, courseTitle, today, submitExamPlan } = useData();

  // Courses the trainer actually teaches (from their schedule).
  const myCourses = useMemo(() => {
    const ids = [...new Set(schedules.filter((s) => s.trainerId === user.trainerId).map((s) => s.courseId))];
    return courses.filter((c) => ids.includes(c.id));
  }, [schedules, courses, user.trainerId]);

  const myExams = useMemo(() => examApprovals.filter((e) => e.trainerId === user.trainerId), [examApprovals, user.trainerId]);

  const blank = { courseId: myCourses[0]?.id || '', examType: 'Theoretical', planDetails: '' };
  const [form, setForm] = useState(blank);
  const [ok, setOk] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.courseId || !form.planDetails) return;
    submitExamPlan({
      courseId: form.courseId,
      trainerId: user.trainerId,
      examType: form.examType,
      planDetails: form.planDetails,
      submissionDate: today,
    });
    setForm({ ...blank, courseId: form.courseId });
    setOk(true);
    setTimeout(() => setOk(false), 2500);
  };

  const columns = [
    { key: 'course', label: 'Course', render: (r) => <span style={{ fontWeight: '600', color: 'hsl(var(--text-primary))' }}>{courseTitle(r.courseId)}</span> },
    { key: 'examType', label: 'Type', align: 'center', render: (r) => <Badge tone={r.examType === 'Practical' ? 'info' : 'warning'}>{r.examType}</Badge> },
    { key: 'planDetails', label: 'Plan', render: (r) => <span style={{ fontSize: '0.8rem' }}>{r.planDetails}</span> },
    { key: 'submissionDate', label: 'Submitted' },
    { key: 'status', label: 'Admin Decision', align: 'center', render: (r) => <Badge tone={STATUS_TONE[r.status] || 'info'}>{r.status}</Badge> },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <PageHeader icon={FilePlus2} title="Exam Posting" subtitle="Submit assessment plans — the admin reviews and approves them for the main exams" />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: '18px', alignItems: 'start' }}>
        <GlassCard hoverEffect={false}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '16px' }}>New Exam Plan</h3>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Field label="Course">
              <select className="input-field" value={form.courseId} onChange={(e) => set('courseId', e.target.value)} required>
                {myCourses.length === 0 && <option value="">No courses assigned</option>}
                {myCourses.map((c) => <option key={c.id} value={c.id}>{c.unitTitle}</option>)}
              </select>
            </Field>
            <Field label="Exam Type">
              <select className="input-field" value={form.examType} onChange={(e) => set('examType', e.target.value)}>
                {['Theoretical', 'Practical'].map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Assessment Plan"><textarea className="input-field" rows="4" required value={form.planDetails} onChange={(e) => set('planDetails', e.target.value)} placeholder="Marks, duration, format, coverage…" /></Field>
            <button type="submit" className="btn-primary" disabled={myCourses.length === 0}><Send size={15} /> Submit for Approval</button>
            {ok && <span style={{ fontSize: '0.8rem', color: 'hsl(var(--accent-emerald))', textAlign: 'center' }}>✓ Exam plan sent to the admin for approval.</span>}
          </form>
        </GlassCard>

        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '12px' }}>My Exam Plans ({myExams.length})</h3>
          <DataTable columns={columns} rows={myExams} emptyText="No exam plans submitted yet." />
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, children }) => (<div className="input-group"><label className="input-label">{label}</label>{children}</div>);

export default SubmitExam;
