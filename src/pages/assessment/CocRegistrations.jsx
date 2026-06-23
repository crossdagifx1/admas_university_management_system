import React, { useMemo, useState } from 'react';
import { Banknote } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import StatCard from '../../components/ui/StatCard';
import { FilterBar, SelectFilter, SearchInput, ExportButton, Badge } from '../../components/ui/Toolbar';
import { useData } from '../../context/DataContext';
import { exportToCSV } from '../../utils/export';

const CocRegistrations = () => {
  const { cocRegistrations, departments, deptName } = useData();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');

  const enriched = useMemo(() => cocRegistrations.map((c) => ({ ...c, department: deptName(c.departmentId) })), [cocRegistrations, deptName]);
  const rows = enriched.filter((r) => {
    const q = search.toLowerCase();
    const matchesSearch = !q || r.traineeName.toLowerCase().includes(q) || r.department.toLowerCase().includes(q);
    return (status === 'All' || r.status === status) && matchesSearch;
  });

  const totalPaid = cocRegistrations.reduce((s, c) => s + c.amountPaid, 0);
  const registered = cocRegistrations.filter((c) => c.status === 'Registered').length;

  const columns = [
    { key: 'traineeName', label: 'Trainee', render: (r) => <span style={{ fontWeight: '600', color: 'hsl(var(--text-primary))' }}>{r.traineeName}</span> },
    { key: 'department', label: 'Department' },
    { key: 'level', label: 'Level', align: 'center' },
    { key: 'phone', label: 'Contact' },
    { key: 'amountPaid', label: 'Amount Paid', align: 'center', render: (r) => <span style={{ fontWeight: '700', color: r.amountPaid > 0 ? 'hsl(var(--accent-emerald))' : 'hsl(var(--text-muted))' }}>{r.amountPaid} ETB</span> },
    { key: 'registrationDate', label: 'Reg. Date' },
    { key: 'status', label: 'Status', align: 'center', render: (r) => <Badge tone={r.status === 'Registered' ? 'success' : 'warning'}>{r.status}</Badge> },
  ];

  const csvCols = [
    { label: 'Trainee', key: 'traineeName' }, { label: 'Department', key: 'department' }, { label: 'Level', key: 'level' },
    { label: 'Contact', key: 'phone' }, { label: 'Amount Paid', key: 'amountPaid' }, { label: 'Reg. Date', key: 'registrationDate' }, { label: 'Status', key: 'status' },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <PageHeader icon={Banknote} title="COC Registration Submissions" subtitle={`Center of Competence ledger — ${cocRegistrations.length} entries`}
        actions={<ExportButton onClick={() => exportToCSV('coc_registrations', csvCols, rows)} />} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '18px' }}>
        <StatCard icon={Banknote} label="Total Collected" value={`${totalPaid} ETB`} accent="hsl(var(--accent-emerald))" glow="rgba(16,185,129,0.15)" />
        <StatCard label="Registered" value={registered} accent="hsl(var(--accent-cyan))" glow="rgba(0,229,255,0.15)" />
        <StatCard label="Pending Payment" value={cocRegistrations.length - registered} accent="hsl(var(--accent-gold))" glow="rgba(234,179,8,0.15)" />
      </div>

      <FilterBar>
        <SelectFilter label="Status" value={status} onChange={setStatus} options={['All', 'Registered', 'Pending Payment']} />
        <SearchInput value={search} onChange={setSearch} placeholder="Search trainee or department…" />
      </FilterBar>
      <DataTable columns={columns} rows={rows} />
    </div>
  );
};

export default CocRegistrations;
