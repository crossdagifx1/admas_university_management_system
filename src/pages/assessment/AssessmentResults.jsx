import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import { FilterBar, SelectFilter, SearchInput, ExportButton, PrintButton, Badge, ProgressBar } from '../../components/ui/Toolbar';
import { useData } from '../../context/DataContext';
import { exportToCSV, printReport } from '../../utils/export';

const AssessmentResults = () => {
  const { assessmentResults } = useData();
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('All');

  const rows = assessmentResults.filter((r) => {
    const q = search.toLowerCase();
    const matchesSearch = !q || r.title.toLowerCase().includes(q) || r.sectionCode.toLowerCase().includes(q);
    return (level === 'All' || r.level === level) && matchesSearch;
  });

  const columns = [
    { key: 'title', label: 'Assessment Title', render: (r) => <span style={{ fontWeight: '600', color: 'hsl(var(--text-primary))' }}>{r.title}</span> },
    { key: 'level', label: 'Level' },
    { key: 'sectionCode', label: 'Section' },
    { key: 'avgScore', label: 'Avg Score', align: 'center', render: (r) => <span style={{ fontWeight: '700', color: 'hsl(var(--accent-gold))', fontFamily: 'Outfit' }}>{r.avgScore}</span> },
    { key: 'pass', label: 'Pass Rate', width: '170px', render: (r) => <ProgressBar value={r.passRate} max={100} accent={r.passRate >= 85 ? 'hsl(var(--accent-emerald))' : 'hsl(var(--accent-gold))'} /> },
    { key: 'dateRecorded', label: 'Date' },
    { key: 'status', label: 'Status', align: 'center', render: (r) => <Badge tone="success">{r.status}</Badge> },
  ];

  const csvCols = [
    { label: 'Title', key: 'title' }, { label: 'Level', key: 'level' }, { label: 'Section', key: 'sectionCode' },
    { label: 'Avg Score', key: 'avgScore' }, { label: 'Pass Rate %', key: 'passRate' }, { label: 'Date', key: 'dateRecorded' },
  ];

  const handlePrint = () => {
    const body = `<table><thead><tr>${csvCols.map((c) => `<th>${c.label}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${csvCols.map((c) => `<td>${r[c.key] ?? ''}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    printReport('Institutional Assessment Results', body);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <PageHeader icon={FileText} title="Institutional Assessment Results" subtitle={`${assessmentResults.length} published results`}
        actions={<><ExportButton onClick={() => exportToCSV('assessment_results', csvCols, rows)} /><PrintButton onClick={handlePrint} /></>} />
      <FilterBar>
        <SelectFilter label="Level" value={level} onChange={setLevel} options={['All', 'Level I', 'Level II', 'Level III', 'Level IV']} />
        <SearchInput value={search} onChange={setSearch} placeholder="Search title or section…" />
      </FilterBar>
      <DataTable columns={columns} rows={rows} />
    </div>
  );
};

export default AssessmentResults;
