import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import StatCard from '../../components/ui/StatCard';
import { FilterBar, SelectFilter, SearchInput, ExportButton, Badge } from '../../components/ui/Toolbar';
import { useData } from '../../context/DataContext';
import { exportToCSV } from '../../utils/export';

const PRIORITY_TONE = { High: 'danger', Medium: 'warning', Low: 'info' };
const STATUS_TONE = { Open: 'danger', 'In Progress': 'warning', Resolved: 'success' };
const NEXT_STATUS = { Open: 'In Progress', 'In Progress': 'Resolved', Resolved: 'Open' };

const Complaints = () => {
  const { complaints, setComplaintStatus } = useData();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');

  const rows = complaints.filter((c) => {
    const q = search.toLowerCase();
    const matchesSearch = !q || c.subject.toLowerCase().includes(q) || c.raisedBy.toLowerCase().includes(q);
    return (status === 'All' || c.status === status) && matchesSearch;
  });

  const open = complaints.filter((c) => c.status === 'Open').length;
  const inProgress = complaints.filter((c) => c.status === 'In Progress').length;
  const resolved = complaints.filter((c) => c.status === 'Resolved').length;

  const columns = [
    { key: 'subject', label: 'Subject', render: (r) => <span style={{ fontWeight: '600', color: 'hsl(var(--text-primary))' }}>{r.subject}</span> },
    { key: 'category', label: 'Category' },
    { key: 'raisedBy', label: 'Raised By' },
    { key: 'priority', label: 'Priority', align: 'center', render: (r) => <Badge tone={PRIORITY_TONE[r.priority]}>{r.priority}</Badge> },
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Status', align: 'center', render: (r) => (
      <button onClick={() => setComplaintStatus(r.id, NEXT_STATUS[r.status])} style={{ background: 'none', border: 'none', cursor: 'pointer' }} title="Click to advance status">
        <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge>
      </button>
    ) },
  ];

  const csvCols = [
    { label: 'Subject', key: 'subject' }, { label: 'Category', key: 'category' }, { label: 'Raised By', key: 'raisedBy' },
    { label: 'Priority', key: 'priority' }, { label: 'Date', key: 'date' }, { label: 'Status', key: 'status' },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <PageHeader icon={MessageSquare} title="Manage Complaints" subtitle={`${complaints.length} issues tracked · click a status to advance it`}
        actions={<ExportButton onClick={() => exportToCSV('complaints', csvCols, rows)} />} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px' }}>
        <StatCard label="Open" value={open} accent="hsl(var(--accent-rose))" glow="rgba(244,63,94,0.15)" />
        <StatCard label="In Progress" value={inProgress} accent="hsl(var(--accent-gold))" glow="rgba(234,179,8,0.15)" />
        <StatCard label="Resolved" value={resolved} accent="hsl(var(--accent-emerald))" glow="rgba(16,185,129,0.15)" />
      </div>

      <FilterBar>
        <SelectFilter label="Status" value={status} onChange={setStatus} options={['All', 'Open', 'In Progress', 'Resolved']} />
        <SearchInput value={search} onChange={setSearch} placeholder="Search subject or person…" />
      </FilterBar>
      <DataTable columns={columns} rows={rows} />
    </div>
  );
};

export default Complaints;
