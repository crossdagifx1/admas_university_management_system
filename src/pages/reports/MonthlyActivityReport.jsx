import React, { useState } from 'react';
import { FileText, UserCog, ClipboardList, CalendarDays, Printer } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import GlassCard from '../../components/GlassCard';
import StatCard from '../../components/ui/StatCard';
import { SelectFilter } from '../../components/ui/Toolbar';
import { DonutChart, DistributionChart } from '../../components/CustomChart';
import { useData } from '../../context/DataContext';
import { printReport } from '../../utils/export';

const MonthlyActivityReport = () => {
  const { monthlyActivity, submissions, meta } = useData();
  const [month, setMonth] = useState('June 2025');

  const cocDonut = monthlyActivity.cocByDept.map((d) => ({ label: d.department, value: d.count }));
  const subsChart = submissions.map((s) => ({ label: s.label.split(' ')[0], value: s.count }));

  const handlePrint = () => {
    const body = `
      <h2>Summary — ${month}</h2>
      <table><tbody>
        <tr><th>Active Trainers</th><td>${monthlyActivity.activeTrainers}</td></tr>
        <tr><th>Total Submissions</th><td>${monthlyActivity.totalSubmissions}</td></tr>
        <tr><th>Classes Scheduled</th><td>${monthlyActivity.classesScheduled}</td></tr>
      </tbody></table>
      <h2 style="margin-top:16px;">COC Registrations by Department</h2>
      <table><thead><tr><th>Department</th><th>Count</th></tr></thead><tbody>
        ${monthlyActivity.cocByDept.map((d) => `<tr><td>${d.department}</td><td>${d.count}</td></tr>`).join('')}
      </tbody></table>
      <h2 style="margin-top:16px;">Submission Summary</h2>
      <table><thead><tr><th>Category</th><th>Count</th></tr></thead><tbody>
        ${submissions.map((s) => `<tr><td>${s.label}</td><td>${s.count}</td></tr>`).join('')}
      </tbody></table>`;
    printReport(`Overall Monthly Activity Report — ${month}`, body);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <PageHeader icon={FileText} title="Overall Monthly Activity Report" subtitle={`${meta.academicYear} · ${meta.semester}`}
        actions={<>
          <SelectFilter value={month} onChange={setMonth} options={['April 2025', 'May 2025', 'June 2025']} />
          <button className="btn-primary" style={{ width: 'auto', padding: '10px 16px', borderRadius: '10px' }} onClick={handlePrint}><Printer size={16} /> Print Report</button>
        </>} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '18px' }}>
        <StatCard icon={UserCog} label="Active Trainers" value={monthlyActivity.activeTrainers} accent="hsl(var(--accent-cyan))" glow="rgba(0,229,255,0.15)" />
        <StatCard icon={ClipboardList} label="Total Submissions" value={monthlyActivity.totalSubmissions} accent="hsl(var(--accent-teal))" glow="rgba(20,184,166,0.15)" />
        <StatCard icon={CalendarDays} label="Classes Scheduled" value={monthlyActivity.classesScheduled} accent="hsl(var(--accent-gold))" glow="rgba(234,179,8,0.15)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '18px' }}>
        <GlassCard hoverEffect={false}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '16px' }}>Submissions Breakdown</h3>
          <DistributionChart data={subsChart} />
        </GlassCard>
        <GlassCard hoverEffect={false}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '16px' }}>COC Registration by Department</h3>
          <DonutChart data={cocDonut} />
        </GlassCard>
      </div>
    </div>
  );
};

export default MonthlyActivityReport;
