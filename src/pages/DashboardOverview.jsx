import React from 'react';
import { TriangleAlert, Users, GraduationCap, UserCog, ArrowRight, ClipboardList } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import StatCard from '../components/ui/StatCard';
import { Badge } from '../components/ui/Toolbar';
import { DonutChart, DistributionChart } from '../components/CustomChart';
import { useData } from '../context/DataContext';

const DashboardOverview = ({ setActiveView }) => {
  const { kpis, submissions, meta, departments, trainees, conflicts, complaints, trainerLoad } = useData();

  const kpiCards = [
    { label: 'Quality Alerts', value: kpis.qualityAlerts, icon: TriangleAlert, accent: 'hsl(var(--accent-rose))', glow: 'rgba(244,63,94,0.15)', hint: 'conflicts + open complaints' },
    { label: 'Active Trainers', value: kpis.activeTrainers, icon: UserCog, accent: 'hsl(var(--accent-cyan))', glow: 'rgba(0,229,255,0.15)' },
    { label: 'Total Trainees', value: kpis.totalTrainees, icon: GraduationCap, accent: 'hsl(var(--accent-teal))', glow: 'rgba(20,184,166,0.15)' },
    { label: 'Total Users', value: kpis.totalUsers, icon: Users, accent: 'hsl(var(--accent-gold))', glow: 'rgba(234,179,8,0.15)' },
  ];

  // trainees per department for donut
  const traineeByDept = departments
    .map((d) => ({ label: d.code, value: trainees.filter((t) => t.departmentId === d.id).length }))
    .filter((x) => x.value > 0);

  const loadChart = trainerLoad.slice(0, 6).map((t) => ({ label: t.name.split(' ')[0], value: t.creditHours }));

  const tileColors = ['hsl(var(--accent-cyan))', 'hsl(var(--accent-teal))', 'hsl(var(--accent-emerald))', 'hsl(var(--accent-gold))'];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* context banner */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <Badge tone="info">{meta.academicYear} · {meta.semester}</Badge>
        <span style={{ fontSize: '0.78rem', color: 'hsl(var(--text-muted))' }}>Data source: {meta.dataSourceLabel}</span>
      </div>

      {/* KPI grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '18px' }}>
        {kpiCards.map((k) => <StatCard key={k.label} {...k} />)}
      </div>

      {/* TVET submissions overview */}
      <GlassCard hoverEffect={false}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <ClipboardList size={18} color="hsl(var(--accent-cyan))" />
          <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>TVET Submissions Overview</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
          {submissions.map((s, i) => (
            <div key={s.key} style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'Outfit', color: tileColors[i % tileColors.length] }}>{s.count}</span>
              <p style={{ fontSize: '0.78rem', color: 'hsl(var(--text-secondary))', marginTop: '2px' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '18px' }}>
        <GlassCard hoverEffect={false}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Trainer Workload</h3>
              <p style={{ fontSize: '0.74rem', color: 'hsl(var(--text-muted))' }}>Total credit hours per trainer</p>
            </div>
            <button onClick={() => setActiveView('scheduling/trainer-load')} style={linkBtn}>Full report <ArrowRight size={12} /></button>
          </div>
          <DistributionChart data={loadChart} />
        </GlassCard>

        <GlassCard hoverEffect={false}>
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Trainee Distribution</h3>
            <p style={{ fontSize: '0.74rem', color: 'hsl(var(--text-muted))' }}>Enrollment by department</p>
          </div>
          <DonutChart data={traineeByDept} />
        </GlassCard>
      </div>

      {/* alerts + complaints */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '18px' }}>
        <GlassCard hoverEffect={false}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Scheduling Conflicts</h3>
            <button onClick={() => setActiveView('scheduling/manage')} style={linkBtn}>Resolve <ArrowRight size={12} /></button>
          </div>
          {conflicts.length === 0 ? (
            <p style={{ fontSize: '0.82rem', color: 'hsl(var(--text-muted))' }}>No conflicts detected.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {conflicts.map((c, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '10px 12px', borderRadius: '10px', background: 'rgba(244,63,94,0.05)', border: '1px solid rgba(244,63,94,0.12)' }}>
                  <TriangleAlert size={15} color="hsl(var(--accent-rose))" style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-primary))', fontWeight: '500' }}>{c.detail}</span>
                    <span style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))', display: 'block' }}>{c.a} ↔ {c.b}</span>
                  </div>
                  <Badge tone="danger">{c.type}</Badge>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        <GlassCard hoverEffect={false}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Recent Complaints</h3>
            <button onClick={() => setActiveView('complaints')} style={linkBtn}>Manage <ArrowRight size={12} /></button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {complaints.slice(0, 4).map((c) => (
              <div key={c.id} style={{ display: 'flex', gap: '10px', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.82rem', color: 'hsl(var(--text-primary))', fontWeight: '500' }}>{c.subject}</span>
                  <span style={{ fontSize: '0.72rem', color: 'hsl(var(--text-muted))', display: 'block' }}>{c.category} · {c.raisedBy}</span>
                </div>
                <Badge tone={c.status === 'Resolved' ? 'success' : c.status === 'Open' ? 'danger' : 'warning'}>{c.status}</Badge>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

const linkBtn = {
  background: 'none',
  border: 'none',
  color: 'hsl(var(--accent-cyan))',
  fontSize: '0.76rem',
  fontWeight: '600',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
};

export default DashboardOverview;
