import React, { useState } from 'react';
import { Building2 } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import { FilterBar, SelectFilter, SearchInput, ExportButton, PrintButton, Badge } from '../../components/ui/Toolbar';
import { useData } from '../../context/DataContext';
import { exportToCSV, printReport } from '../../utils/export';

const OUTCOME_TONE = { Excellent: 'success', 'On track': 'info', 'Needs support': 'warning' };

const CoopTrainingReport = () => {
  const { coopFollowups } = useData();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');

  const rows = coopFollowups.filter((r) => {
    const q = search.toLowerCase();
    const matchesSearch = !q || r.traineeName.toLowerCase().includes(q) || r.organizationName.toLowerCase().includes(q);
    return (status === 'All' || r.status === status) && matchesSearch;
  });

  const columns = [
    { key: 'traineeName', label: 'Trainee', render: (r) => <span style={{ fontWeight: '600', color: 'hsl(var(--text-primary))' }}>{r.traineeName}</span> },
    { key: 'organizationName', label: 'Organization' },
    { key: 'visitDate', label: 'Visit Date' },
    { key: 'outcome', label: 'Outcome', align: 'center', render: (r) => <Badge tone={OUTCOME_TONE[r.outcome] || 'info'}>{r.outcome}</Badge> },
    { key: 'notes', label: 'Notes', render: (r) => <span style={{ fontSize: '0.8rem' }}>{r.notes}</span> },
    { key: 'status', label: 'Status', align: 'center', render: (r) => <Badge tone={r.status === 'Completed' ? 'success' : 'warning'}>{r.status}</Badge> },
  ];

  const csvCols = [
    { label: 'Trainee', key: 'traineeName' }, { label: 'Organization', key: 'organizationName' }, { label: 'Visit Date', key: 'visitDate' },
    { label: 'Outcome', key: 'outcome' }, { label: 'Notes', key: 'notes' }, { label: 'Status', key: 'status' },
  ];

  const handlePrint = () => {
    const body = `<table><thead><tr>${csvCols.map((c) => `<th>${c.label}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${csvCols.map((c) => `<td>${r[c.key] ?? ''}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    printReport('Cooperative Training Follow-up Report', body);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <PageHeader icon={Building2} title="Cooperative Training Follow-ups" subtitle={`${coopFollowups.length} workplace visits logged`}
        actions={<><ExportButton onClick={() => exportToCSV('coop_training', csvCols, rows)} /><PrintButton onClick={handlePrint} /></>} />
      <FilterBar>
        <SelectFilter label="Status" value={status} onChange={setStatus} options={['All', 'Completed', 'Follow-up']} />
        <SearchInput value={search} onChange={setSearch} placeholder="Search trainee or organization…" />
      </FilterBar>
      <DataTable columns={columns} rows={rows} />
    </div>
  );
};

export default CoopTrainingReport;
