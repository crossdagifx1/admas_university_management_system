import React, { useState } from 'react';
import { GitBranch } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import { FilterBar, SearchInput, ExportButton, PrintButton } from '../../components/ui/Toolbar';
import { ImageThumb } from '../../components/ui/ImageUpload';
import { useData } from '../../context/DataContext';
import { exportToCSV, printReport } from '../../utils/export';

const SkillGapReport = () => {
  const { skillGapTraining, trainerName } = useData();
  const [search, setSearch] = useState('');

  const enriched = skillGapTraining.map((s) => ({ ...s, trainer: trainerName(s.trainerId) }));
  const rows = enriched.filter((r) => {
    const q = search.toLowerCase();
    return !q || r.skillArea.toLowerCase().includes(q) || r.traineeName.toLowerCase().includes(q) || r.trainer.toLowerCase().includes(q);
  });

  const columns = [
    { key: 'skillArea', label: 'Skill Area', render: (r) => <span style={{ fontWeight: '600', color: 'hsl(var(--text-primary))' }}>{r.skillArea}</span> },
    { key: 'traineeName', label: 'Cohort / Trainee' },
    { key: 'learningOutcomes', label: 'Learning Outcomes', render: (r) => <span style={{ fontSize: '0.8rem' }}>{r.learningOutcomes}</span> },
    { key: 'durationHours', label: 'Hours', align: 'center', render: (r) => <span style={{ fontWeight: '700', color: 'hsl(var(--accent-gold))' }}>{r.durationHours}h</span> },
    { key: 'trainer', label: 'Trainer' },
    { key: 'date', label: 'Date' },
    { key: 'evidence', label: 'Evidence', align: 'center', render: (r) => <ImageThumb src={r.evidenceUrl} /> },
  ];

  const csvCols = [
    { label: 'Skill Area', key: 'skillArea' }, { label: 'Cohort', key: 'traineeName' }, { label: 'Learning Outcomes', key: 'learningOutcomes' },
    { label: 'Hours', key: 'durationHours' }, { label: 'Trainer', key: 'trainer' }, { label: 'Date', key: 'date' },
  ];

  const handlePrint = () => {
    const body = `<table><thead><tr>${csvCols.map((c) => `<th>${c.label}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${csvCols.map((c) => `<td>${r[c.key] ?? ''}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    printReport('Skill Gap Training Report', body);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <PageHeader icon={GitBranch} title="Skill Gap Training Reports" subtitle={`${skillGapTraining.length} sessions delivered`}
        actions={<><ExportButton onClick={() => exportToCSV('skill_gap', csvCols, rows)} /><PrintButton onClick={handlePrint} /></>} />
      <FilterBar><SearchInput value={search} onChange={setSearch} placeholder="Search skill, cohort, trainer…" /></FilterBar>
      <DataTable columns={columns} rows={rows} />
    </div>
  );
};

export default SkillGapReport;
