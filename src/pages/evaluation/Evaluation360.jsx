import React, { useState } from 'react';
import { Award } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import GlassCard from '../../components/GlassCard';
import DataTable from '../../components/ui/DataTable';
import { SelectFilter, ExportButton, Badge } from '../../components/ui/Toolbar';
import { RadarChart } from '../../components/CustomChart';
import { useData } from '../../context/DataContext';
import { exportToCSV } from '../../utils/export';

const Evaluation360 = () => {
  const { evaluation360 } = useData();
  const [selectedId, setSelectedId] = useState(evaluation360[0]?.trainerId);
  const selected = evaluation360.find((e) => e.trainerId === selectedId) || evaluation360[0];

  const axes = selected ? [
    { label: 'Trainee', value: selected.trainee },
    { label: 'Peer', value: selected.peer },
    { label: 'Self', value: selected.self },
    { label: 'Department', value: selected.department },
  ] : [];

  const columns = [
    { key: 'name', label: 'Trainer', render: (r) => <span style={{ fontWeight: '600', color: 'hsl(var(--text-primary))' }}>{r.name}</span> },
    { key: 'trainee', label: 'Trainee (60%)', align: 'center' },
    { key: 'peer', label: 'Peer (5%)', align: 'center' },
    { key: 'self', label: 'Self (5%)', align: 'center' },
    { key: 'department', label: 'Dept (30%)', align: 'center' },
    { key: 'weighted', label: 'Weighted Total', align: 'center', render: (r) => <Badge tone={r.weighted >= 85 ? 'success' : r.weighted >= 75 ? 'info' : 'warning'}>{r.weighted}</Badge> },
  ];

  const csvCols = [
    { label: 'Trainer', key: 'name' }, { label: 'Trainee', key: 'trainee' }, { label: 'Peer', key: 'peer' },
    { label: 'Self', key: 'self' }, { label: 'Department', key: 'department' }, { label: 'Weighted Total', key: 'weighted' },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <PageHeader icon={Award} title="360° Trainer Evaluation" subtitle="Weighted: Trainee 60% · Peer 5% · Self 5% · Department 30%"
        actions={<ExportButton onClick={() => exportToCSV('trainer_360_eval', csvCols, evaluation360)} />} />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 1.4fr', gap: '18px', alignItems: 'start' }}>
        <GlassCard hoverEffect={false}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '700' }}>Profile</h3>
            <SelectFilter value={selectedId} onChange={setSelectedId} options={evaluation360.map((e) => ({ value: e.trainerId, label: e.name }))} />
          </div>
          {selected && <RadarChart axes={axes} />}
          {selected && (
            <div style={{ textAlign: 'center', marginTop: '8px' }}>
              <span style={{ fontSize: '0.74rem', color: 'hsl(var(--text-muted))' }}>Final weighted score</span>
              <div className="text-gradient-teal" style={{ fontSize: '2.2rem', fontWeight: '800', fontFamily: 'Outfit' }}>{selected.weighted}</div>
            </div>
          )}
        </GlassCard>

        <DataTable columns={columns} rows={evaluation360} keyField="trainerId" />
      </div>
    </div>
  );
};

export default Evaluation360;
