import React, { useMemo, useState } from 'react';
import { FileText } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import { FilterBar, SearchInput, ExportButton, PrintButton, ProgressBar } from '../../components/ui/Toolbar';
import { useData } from '../../context/DataContext';
import { exportToCSV, printReport } from '../../utils/export';

const CourseCoverageReport = () => {
  const { courseCoverage, courseTitle, trainerName, scheduleById } = useData();
  const [search, setSearch] = useState('');

  const enriched = useMemo(() => courseCoverage.map((c) => ({
    ...c,
    course: courseTitle(c.courseId),
    trainer: trainerName(c.trainerId),
    section: scheduleById(c.scheduleId)?.sectionCode || '—',
    pct: Math.round((c.coveredLos / c.totalLos) * 100),
  })), [courseCoverage, courseTitle, trainerName, scheduleById]);

  const rows = enriched.filter((r) => {
    const q = search.toLowerCase();
    return !q || r.course.toLowerCase().includes(q) || r.trainer.toLowerCase().includes(q) || r.section.toLowerCase().includes(q);
  });

  const columns = [
    { key: 'course', label: 'Course', render: (r) => <span style={{ fontWeight: '600', color: 'hsl(var(--text-primary))' }}>{r.course}</span> },
    { key: 'section', label: 'Section' },
    { key: 'trainer', label: 'Trainer' },
    { key: 'los', label: 'LOs', align: 'center', render: (r) => `${r.coveredLos} / ${r.totalLos}` },
    { key: 'progress', label: 'Coverage', width: '180px', render: (r) => <ProgressBar value={r.coveredLos} max={r.totalLos} accent={r.pct >= 80 ? 'hsl(var(--accent-emerald))' : 'hsl(var(--accent-gold))'} /> },
    { key: 'coverageNotes', label: 'Notes', render: (r) => <span style={{ fontSize: '0.8rem' }}>{r.coverageNotes}</span> },
    { key: 'dateSubmitted', label: 'Submitted' },
  ];

  const csvCols = [
    { label: 'Course', key: 'course' }, { label: 'Section', key: 'section' }, { label: 'Trainer', key: 'trainer' },
    { label: 'Covered LOs', key: 'coveredLos' }, { label: 'Total LOs', key: 'totalLos' }, { label: 'Coverage %', key: 'pct' },
    { label: 'Notes', key: 'coverageNotes' }, { label: 'Submitted', key: 'dateSubmitted' },
  ];

  const handlePrint = () => {
    const body = `<table><thead><tr>${csvCols.map((c) => `<th>${c.label}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${csvCols.map((c) => `<td>${r[c.key] ?? ''}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    printReport('Course Coverage Report', body);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <PageHeader icon={FileText} title="Course Coverage Submissions" subtitle={`${courseCoverage.length} coverage reports`}
        actions={<><ExportButton onClick={() => exportToCSV('course_coverage', csvCols, rows)} /><PrintButton onClick={handlePrint} /></>} />
      <FilterBar><SearchInput value={search} onChange={setSearch} placeholder="Search course, trainer, section…" /></FilterBar>
      <DataTable columns={columns} rows={rows} />
    </div>
  );
};

export default CourseCoverageReport;
