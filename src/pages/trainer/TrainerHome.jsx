import React, { useMemo } from 'react';
import { CalendarCheck, TrendingUp, ClipboardCheck, BookOpen, Star, Award, CalendarDays, Building2, GitBranch, FilePlus2, ArrowRight } from 'lucide-react';
import GlassCard from '../../components/GlassCard';
import StatCard from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Toolbar';
import { useData } from '../../context/DataContext';

const QUICK = [
  { view: 'trainer/attendance', label: 'Submit Attendance', icon: CalendarCheck },
  { view: 'trainer/coverage', label: 'Course Coverage', icon: TrendingUp },
  { view: 'trainer/coop', label: 'Coop Follow-up', icon: Building2 },
  { view: 'trainer/skillgap', label: 'Skill Gap Support', icon: GitBranch },
  { view: 'trainer/exam', label: 'Post Exam Plan', icon: FilePlus2 },
  { view: 'trainer/schedule', label: 'My Schedule', icon: CalendarDays },
];

const TrainerHome = ({ user, setActiveView }) => {
  const { trainerStats, schedules, attendanceRecords, courseCoverage, skillGapTraining, examApprovals, meta } = useData();

  const profile = trainerStats.find((t) => t.id === user.trainerId);
  const counts = useMemo(() => ({
    classes: schedules.filter((s) => s.trainerId === user.trainerId).length,
    attendance: attendanceRecords.filter((a) => a.trainerId === user.trainerId).length,
    coverage: courseCoverage.filter((c) => c.trainerId === user.trainerId).length,
    skillgap: skillGapTraining.filter((s) => s.trainerId === user.trainerId).length,
    examsPending: examApprovals.filter((e) => e.trainerId === user.trainerId && (e.status === 'Pending' || e.status === 'Draft')).length,
    examsApproved: examApprovals.filter((e) => e.trainerId === user.trainerId && e.status === 'Approved').length,
  }), [schedules, attendanceRecords, courseCoverage, skillGapTraining, examApprovals, user.trainerId]);

  const kpiCards = [
    { label: 'My Classes', value: counts.classes, icon: BookOpen, accent: 'hsl(var(--accent-cyan))', glow: 'rgba(0,229,255,0.15)', hint: profile ? `${profile.creditHours} cr-hrs` : '' },
    { label: 'Attendance Sent', value: counts.attendance, icon: CalendarCheck, accent: 'hsl(var(--accent-emerald))', glow: 'rgba(16,185,129,0.15)' },
    { label: 'Coverage Reports', value: counts.coverage, icon: TrendingUp, accent: 'hsl(var(--accent-teal))', glow: 'rgba(20,184,166,0.15)' },
    { label: 'Exams Approved', value: counts.examsApproved, icon: ClipboardCheck, accent: 'hsl(var(--accent-gold))', glow: 'rgba(234,179,8,0.15)', hint: `${counts.examsPending} pending` },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Identity */}
      <GlassCard hoverEffect={false}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
          <div style={{ width: '58px', height: '58px', borderRadius: '50%', background: 'linear-gradient(135deg, hsl(var(--accent-teal)) 0%, hsl(var(--accent-cyan)) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.3rem', fontFamily: 'Outfit', color: '#090a0f', flexShrink: 0 }}>
            {user.name.charAt(0)}
          </div>
          <div style={{ flex: 1, minWidth: '180px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Welcome, {user.name}</h3>
            <p style={{ fontSize: '0.82rem', color: 'hsl(var(--text-muted))' }}>{profile?.department || 'Trainer'} · {meta.academicYear} · {meta.semester}</p>
          </div>
          {profile && (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: '700', fontFamily: 'Outfit', color: 'hsl(var(--accent-gold))' }}>
                <Star size={15} fill="hsl(var(--accent-gold))" color="hsl(var(--accent-gold))" /> {(profile.rating ?? 0).toFixed(1)}
              </span>
              {profile.evalScore != null && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: '700', fontFamily: 'Outfit', color: 'hsl(var(--accent-cyan))' }}>
                  <Award size={15} /> {profile.evalScore} <span style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))', fontWeight: '500' }}>360°</span>
                </span>
              )}
            </div>
          )}
        </div>
      </GlassCard>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '18px' }}>
        {kpiCards.map((k) => <StatCard key={k.label} {...k} />)}
      </div>

      {/* Quick actions */}
      <GlassCard hoverEffect={false}>
        <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>Send to Admin</h3>
        <p style={{ fontSize: '0.78rem', color: 'hsl(var(--text-muted))', marginBottom: '16px' }}>Everything you submit appears instantly on the administrator dashboard.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {QUICK.map(({ view, label, icon: Icon }) => (
            <button key={view} onClick={() => setActiveView(view)}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', color: 'hsl(var(--text-primary))', cursor: 'pointer', transition: 'var(--transition-fast)', textAlign: 'left' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'hsl(var(--accent-cyan))'; e.currentTarget.style.background = 'rgba(0,229,255,0.05)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}>
              <span style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(0,229,255,0.08)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'hsl(var(--accent-cyan))', flexShrink: 0 }}>
                <Icon size={17} />
              </span>
              <span style={{ flex: 1, fontSize: '0.85rem', fontWeight: '600' }}>{label}</span>
              <ArrowRight size={15} color="hsl(var(--text-muted))" />
            </button>
          ))}
        </div>
      </GlassCard>

      {counts.examsPending > 0 && (
        <GlassCard hoverEffect={false}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Badge tone="warning">{counts.examsPending} pending</Badge>
            <span style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))' }}>exam plan(s) awaiting admin approval.</span>
          </div>
        </GlassCard>
      )}
    </div>
  );
};

export default TrainerHome;
