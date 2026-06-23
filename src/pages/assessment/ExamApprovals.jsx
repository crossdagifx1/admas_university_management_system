import React, { useState } from 'react';
import { ClipboardCheck, CircleCheck } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import { FilterBar, SelectFilter, ExportButton, Badge } from '../../components/ui/Toolbar';
import { useData } from '../../context/DataContext';
import { exportToCSV } from '../../utils/export';

const STATUS_TONE = { Pending: 'warning', Approved: 'success', Draft: 'info', Rejected: 'danger' };

const ExamApprovals = () => {
  const { examApprovals, courseTitle, trainerName, setExamStatus } = useData();
  const [status, setStatus] = useState('All');

  const enriched = examApprovals.map((e) => ({ ...e, course: courseTitle(e.courseId), trainer: trainerName(e.trainerId) }));
  const rows = enriched.filter((r) => status === 'All' || r.status === status);
  const pending = examApprovals.filter((e) => e.status === 'Pending' || e.status === 'Draft').length;

  const columns = [
    { key: 'course', label: 'Course', render: (r) => <span style={{ fontWeight: '600', color: 'hsl(var(--text-primary))' }}>{r.course}</span> },
    { key: 'trainer', label: 'Trainer' },
    { key: 'examType', label: 'Type', align: 'center', render: (r) => <Badge tone={r.examType === 'Practical' ? 'info' : 'warning'}>{r.examType}</Badge> },
    { key: 'planDetails', label: 'Assessment Plan', render: (r) => <span style={{ fontSize: '0.8rem' }}>{r.planDetails}</span> },
    { key: 'submissionDate', label: 'Submitted' },
    { key: 'status', label: 'Status', align: 'center', render: (r) => <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge> },
    { key: 'actions', label: 'Action', align: 'center', render: (r) => (
      r.status === 'Approved' ? <span style={{ color: 'hsl(var(--text-muted))', fontSize: '0.78rem' }}>Published</span> : (
        <button onClick={() => setExamStatus(r.id, 'Approved')} className="btn-primary" style={{ width: 'auto', padding: '6px 12px', borderRadius: '8px', fontSize: '0.76rem' }}><CircleCheck size={13} /> Approve</button>
      )
    ) },
  ];

  const csvCols = [
    { label: 'Course', key: 'course' }, { label: 'Trainer', key: 'trainer' }, { label: 'Type', key: 'examType' },
    { label: 'Plan', key: 'planDetails' }, { label: 'Submitted', key: 'submissionDate' }, { label: 'Status', key: 'status' },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <PageHeader icon={ClipboardCheck} title="Exam Approvals" subtitle={`${pending} draft/pending exam(s) awaiting review`}
        actions={<ExportButton onClick={() => exportToCSV('exam_approvals', csvCols, rows)} />} />
      <FilterBar>
        <SelectFilter label="Status" value={status} onChange={setStatus} options={['All', 'Pending', 'Draft', 'Approved']} />
      </FilterBar>
      <DataTable columns={columns} rows={rows} />
    </div>
  );
};

export default ExamApprovals;
