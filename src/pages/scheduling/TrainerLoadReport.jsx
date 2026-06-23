import React from 'react';
import { ClipboardList } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import GlassCard from '../../components/GlassCard';
import { ExportButton, PrintButton, Badge } from '../../components/ui/Toolbar';
import { DistributionChart } from '../../components/CustomChart';
import { useData } from '../../context/DataContext';
import { exportToCSV, printTrainerCourseLoad } from '../../utils/export';

const TrainerLoadReport = () => {
  const { trainerLoad, meta, schedules, courseTitle, courseById, roomName, centerName } = useData();

  const totalCredit = trainerLoad.reduce((s, t) => s + t.creditHours, 0);
  const totalInvig = trainerLoad.reduce((s, t) => s + t.invigilationDays, 0);

  const columns = [
    { key: 'name', label: 'Trainer', render: (r) => <span style={{ fontWeight: '600', color: 'hsl(var(--text-primary))' }}>{r.name}</span> },
    { key: 'department', label: 'Department' },
    { key: 'employmentType', label: 'Type', align: 'center', render: (r) => <Badge tone={r.employmentType === 'FT' ? 'info' : 'warning'}>{r.employmentType}</Badge> },
    { key: 'courses', label: 'Courses', align: 'center' },
    { key: 'creditHours', label: 'Credit Hours', align: 'center', render: (r) => <span style={{ fontWeight: '700', color: 'hsl(var(--accent-gold))', fontFamily: 'Outfit' }}>{r.creditHours}</span> },
    { key: 'invigilationDays', label: 'Invigilation Days', align: 'center' },
  ];

  const csvCols = [
    { label: 'Trainer', key: 'name' },
    { label: 'Department', key: 'department' },
    { label: 'Employment', key: 'employmentType' },
    { label: 'Courses', key: 'courses' },
    { label: 'Credit Hours', key: 'creditHours' },
    { label: 'Invigilation Days', key: 'invigilationDays' },
  ];

  const handlePrint = () => {
    const activeTrainers = trainerLoad.filter((t) => t.courses > 0);

    const trainersData = activeTrainers.map((t) => {
      const mySchedules = schedules.filter((s) => s.trainerId === t.trainerId);
      const rows = mySchedules.map((s) => ({
        sectionCode: s.sectionCode,
        unitTitle: courseTitle(s.courseId),
        creditHours: courseById(s.courseId)?.creditHours || 0,
        schedule1: s.scheduleTime1,
        schedule2: s.scheduleTime2,
        room: roomName(s.roomId),
        center: centerName(s.centerId),
      }));

      return {
        name: t.name,
        totalLoad: t.creditHours,
        rows: rows,
      };
    });

    const year = meta?.academicYear || '2017 E.C';
    const sem = meta?.semester || 'Semester I';
    const isSem1 = sem.toLowerCase().includes('i') || sem.toLowerCase().includes('1st');
    const classEnd = isSem1 ? 'megabit 20' : 'TAHESAS 30, 2017 E.C.';

    printTrainerCourseLoad(year, sem, trainersData, classEnd);
  };

  const chartData = trainerLoad
    .filter((t) => t.creditHours > 0)
    .map((t) => {
      const parts = t.name.split(' ');
      const first = parts[0] ? parts[0].charAt(0) + parts[0].slice(1).toLowerCase() : '';
      const lastInitial = parts[1] ? ' ' + parts[1].charAt(0).toUpperCase() + '.' : '';
      return {
        label: `${first}${lastInitial}`,
        value: t.creditHours,
      };
    });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <PageHeader
        icon={ClipboardList}
        title="Trainer Load Report"
        subtitle={`${meta.academicYear} · ${meta.semester} — ${totalCredit} total credit hours`}
        actions={<><ExportButton onClick={() => exportToCSV('trainer_load_report', csvCols, trainerLoad)} /><PrintButton onClick={handlePrint} /></>}
      />

      <GlassCard hoverEffect={false}>
        <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '16px' }}>Credit Hour Distribution</h3>
        {chartData.length > 0 ? (
          <DistributionChart data={chartData} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', color: 'hsl(var(--text-muted))', gap: '8px' }}>
            <ClipboardList size={32} style={{ opacity: 0.4 }} />
            <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>No active workloads</span>
            <span style={{ fontSize: '0.78rem' }}>Assign courses to trainers in "Manage Schedules" to calculate load.</span>
          </div>
        )}
      </GlassCard>

      <DataTable columns={columns} rows={trainerLoad} keyField="trainerId" />

      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
        <Summary label="Total Credit Hours" value={totalCredit} />
        <Summary label="Estimated Invigilation Days" value={totalInvig} />
        <Summary label="Trainers Assigned" value={trainerLoad.filter((t) => t.courses > 0).length} />
      </div>
    </div>
  );
};

const Summary = ({ label, value }) => (
  <div style={{ flex: '1 1 180px', padding: '14px 18px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
    <span style={{ fontSize: '0.78rem', color: 'hsl(var(--text-secondary))', display: 'block' }}>{label}</span>
    <span style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'Outfit' }}>{value}</span>
  </div>
);

export default TrainerLoadReport;
