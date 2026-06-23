import React, { useMemo, useState } from 'react';
import { ClipboardCheck } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import { FilterBar, SearchInput, ExportButton, PrintButton, Badge } from '../../components/ui/Toolbar';
import { ImageThumb } from '../../components/ui/ImageUpload';
import { useData } from '../../context/DataContext';
import { exportToCSV, printReport } from '../../utils/export';

const AttendanceReport = () => {
  const { attendanceRecords, scheduleById, trainerName, courseTitle } = useData();
  const [search, setSearch] = useState('');

  const enriched = useMemo(() => attendanceRecords.map((a) => {
    const sch = scheduleById(a.scheduleId);
    const rate = (a.total && a.present != null) ? Math.round((a.present / a.total) * 100) : null;
    return { ...a, section: sch?.sectionCode || '—', course: sch ? courseTitle(sch.courseId) : '—', trainer: trainerName(a.trainerId), rate };
  }), [attendanceRecords, scheduleById, trainerName, courseTitle]);

  const rows = enriched.filter((r) => {
    const q = search.toLowerCase();
    return !q || r.section.toLowerCase().includes(q) || r.trainer.toLowerCase().includes(q) || r.course.toLowerCase().includes(q);
  });

  const columns = [
    { key: 'date', label: 'Date', render: (r) => <span style={{ color: 'hsl(var(--text-primary))', fontWeight: '600' }}>{r.date}</span> },
    { key: 'section', label: 'Section' },
    { key: 'course', label: 'Course' },
    { key: 'trainer', label: 'Trainer' },
    { key: 'present', label: 'Present', align: 'center', render: (r) => <span style={{ color: 'hsl(var(--accent-emerald))', fontWeight: '700' }}>{r.present ?? '—'}</span> },
    { key: 'absent', label: 'Absent', align: 'center', render: (r) => <span style={{ color: 'hsl(var(--accent-rose))', fontWeight: '700' }}>{r.absent ?? '—'}</span> },
    { key: 'late', label: 'Late', align: 'center', render: (r) => r.late ?? '—' },
    { key: 'rate', label: 'Rate', align: 'center', render: (r) => r.rate != null ? <Badge tone={r.rate >= 85 ? 'success' : r.rate >= 70 ? 'warning' : 'danger'}>{r.rate}%</Badge> : <Badge tone="info">—</Badge> },
    { key: 'photo', label: 'Photo', align: 'center', render: (r) => <ImageThumb src={r.photoUrl} /> },
  ];

  const csvCols = [
    { label: 'Date', key: 'date' }, { label: 'Section', key: 'section' }, { label: 'Course', key: 'course' },
    { label: 'Trainer', key: 'trainer' }, { label: 'Present', key: 'present' }, { label: 'Absent', key: 'absent' },
    { label: 'Late', key: 'late' }, { label: 'Total', key: 'total' }, { label: 'Rate %', key: 'rate' },
  ];

  const handlePrint = () => {
    const body = `<table><thead><tr>${csvCols.map((c) => `<th>${c.label}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${csvCols.map((c) => `<td>${r[c.key] ?? ''}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    printReport('Attendance Submissions Report', body);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <PageHeader icon={ClipboardCheck} title="Attendance Submissions" subtitle={`${attendanceRecords.length} submitted records`}
        actions={<><ExportButton onClick={() => exportToCSV('attendance_report', csvCols, rows)} /><PrintButton onClick={handlePrint} /></>} />
      <FilterBar>
        <SearchInput value={search} onChange={setSearch} placeholder="Search section, trainer, course…" />
      </FilterBar>
      <DataTable columns={columns} rows={rows} />
    </div>
  );
};

export default AttendanceReport;
