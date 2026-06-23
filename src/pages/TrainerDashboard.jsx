import React, { useMemo, useState } from 'react';
import { UserCog, BookOpen, CalendarCheck, TrendingUp, ClipboardCheck, Star, Award } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import GlassCard from '../components/GlassCard';
import StatCard from '../components/ui/StatCard';
import DataTable from '../components/ui/DataTable';
import { SelectFilter, Badge, ProgressBar } from '../components/ui/Toolbar';
import { DistributionChart } from '../components/CustomChart';
import { useData } from '../context/DataContext';

const EXAM_TONE = { Approved: 'success', Pending: 'warning', Draft: 'info', Rejected: 'danger' };

const TrainerDashboard = () => {
  const { trainerStats, trainers, schedules, attendanceRecords, courseCoverage, examApprovals, courseTitle, courseById, roomName } = useData();

  const [trainerId, setTrainerId] = useState(trainers[0]?.id);
  const profile = trainerStats.find((t) => t.id === trainerId) || trainerStats[0];

  const mySchedules = useMemo(() => schedules.filter((s) => s.trainerId === trainerId), [schedules, trainerId]);
  const myAttendance = useMemo(() => attendanceRecords.filter((a) => a.trainerId === trainerId), [attendanceRecords, trainerId]);
  const myCoverage = useMemo(() => courseCoverage.filter((c) => c.trainerId === trainerId), [courseCoverage, trainerId]);
  const myExams = useMemo(() => examApprovals.filter((e) => e.trainerId === trainerId), [examApprovals, trainerId]);

  if (!profile) return <p style={{ color: 'hsl(var(--text-muted))' }}>No trainers available.</p>;

  const kpiCards = [
    { label: 'Assigned Courses', value: profile.courses, icon: BookOpen, accent: 'hsl(var(--accent-cyan))', glow: 'rgba(0,229,255,0.15)', hint: `${profile.creditHours} cr-hrs` },
    { label: 'Attendance Rate', value: `${profile.attendanceRate}%`, icon: CalendarCheck, accent: 'hsl(var(--accent-emerald))', glow: 'rgba(16,185,129,0.15)', hint: `${profile.attendanceSessions} logs` },
    { label: 'Course Coverage', value: `${profile.coverageRate}%`, icon: TrendingUp, accent: 'hsl(var(--accent-teal))', glow: 'rgba(20,184,166,0.15)', hint: `${profile.coveredLos}/${profile.totalLos} LOs` },
    { label: 'Pending Exams', value: profile.examsPending, icon: ClipboardCheck, accent: 'hsl(var(--accent-gold))', glow: 'rgba(234,179,8,0.15)', hint: `of ${profile.examsTotal}` },
  ];

  const coverageChart = myCoverage.map((c) => ({ label: (courseById(c.courseId)?.unitCode || c.courseId).split('-').slice(-1)[0], value: Math.round((c.coveredLos / c.totalLos) * 100) }));

  const scheduleCols = [
    { key: 'sectionCode', label: 'Section', render: (r) => <span style={{ fontWeight: '600', color: 'hsl(var(--accent-cyan))', fontFamily: 'Outfit' }}>{r.sectionCode}</span> },
    { key: 'course', label: 'Course', render: (r) => courseTitle(r.courseId) },
    { key: 'room', label: 'Room', render: (r) => roomName(r.roomId) },
    { key: 'time1', label: 'Session 1', render: (r) => r.scheduleTime1 || '—' },
    { key: 'time2', label: 'Session 2', render: (r) => r.scheduleTime2 || '—' },
  ];

  const examCols = [
    { key: 'course', label: 'Course', render: (r) => <span style={{ fontWeight: '600', color: 'hsl(var(--text-primary))' }}>{courseTitle(r.courseId)}</span> },
    { key: 'examType', label: 'Type', align: 'center', render: (r) => <Badge tone={r.examType === 'Practical' ? 'info' : 'warning'}>{r.examType}</Badge> },
    { key: 'submissionDate', label: 'Submitted' },
    { key: 'status', label: 'Status', align: 'center', render: (r) => <Badge tone={EXAM_TONE[r.status] || 'info'}>{r.status}</Badge> },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <PageHeader icon={UserCog} title="Trainer Dashboard" subtitle="Personal teaching workload & performance"
        actions={<SelectFilter label="Trainer" value={trainerId} onChange={setTrainerId} options={trainers.map((t) => ({ value: t.id, label: t.name }))} />} />

      {/* Identity banner */}
      <GlassCard hoverEffect={false}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, hsl(var(--accent-teal)) 0%, hsl(var(--accent-cyan)) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.4rem', fontFamily: 'Outfit', color: '#090a0f', flexShrink: 0 }}>
            {profile.name.charAt(0)}
          </div>
          <div style={{ flex: 1, minWidth: '180px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>{profile.name}</h3>
            <p style={{ fontSize: '0.82rem', color: 'hsl(var(--text-muted))' }}>{profile.staffNo || '—'} · {profile.department}</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Badge tone={profile.employmentType === 'FT' ? 'info' : 'warning'}>{profile.employmentType === 'FT' ? 'Full-time' : 'Part-time'}</Badge>
            <Badge tone={profile.presentStatus === 'Released' ? 'danger' : 'success'}>{profile.presentStatus}</Badge>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: '700', fontFamily: 'Outfit', color: 'hsl(var(--accent-gold))' }}>
              <Star size={15} fill="hsl(var(--accent-gold))" color="hsl(var(--accent-gold))" /> {(profile.rating ?? 0).toFixed(1)}
            </span>
            {profile.evalScore != null && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: '700', fontFamily: 'Outfit', color: 'hsl(var(--accent-cyan))' }}>
                <Award size={15} /> {profile.evalScore} <span style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))', fontWeight: '500' }}>360°</span>
              </span>
            )}
          </div>
        </div>
      </GlassCard>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '18px' }}>
        {kpiCards.map((k) => <StatCard key={k.label} {...k} />)}
      </div>

      {/* Coverage chart + recent attendance */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '18px' }}>
        <GlassCard hoverEffect={false}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>Course Coverage</h3>
          <p style={{ fontSize: '0.74rem', color: 'hsl(var(--text-muted))', marginBottom: '16px' }}>Learning outcomes completed per unit (%)</p>
          {coverageChart.length ? <DistributionChart data={coverageChart} /> : <Empty text="No coverage submitted yet." />}
        </GlassCard>

        <GlassCard hoverEffect={false}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '14px' }}>Recent Attendance</h3>
          {myAttendance.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {myAttendance.slice(0, 5).map((a) => (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ minWidth: '78px' }}>
                    <span style={{ fontSize: '0.78rem', color: 'hsl(var(--text-primary))', fontWeight: '600' }}>{a.date}</span>
                  </div>
                  {a.present != null && a.total != null ? (
                    <>
                      <ProgressBar value={a.present} max={a.total} accent="hsl(var(--accent-emerald))" />
                      <span style={{ fontSize: '0.74rem', color: 'hsl(var(--text-muted))', whiteSpace: 'nowrap' }}>{a.present}/{a.total}</span>
                    </>
                  ) : (
                    <span style={{ fontSize: '0.74rem', color: 'hsl(var(--text-muted))', fontStyle: 'italic', flex: 1, textAlign: 'right' }}>No numbers logged</span>
                  )}
                </div>
              ))}
            </div>
          ) : <Empty text="No attendance logs yet." />}
        </GlassCard>
      </div>

      {/* My schedule */}
      <div>
        <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '12px' }}>My Teaching Schedule</h3>
        <DataTable columns={scheduleCols} rows={mySchedules} emptyText="No classes assigned." />
      </div>

      {/* My exam plans */}
      <div>
        <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '12px' }}>My Assessment Plans</h3>
        <DataTable columns={examCols} rows={myExams} emptyText="No assessment plans submitted." />
      </div>
    </div>
  );
};

const Empty = ({ text }) => (
  <p style={{ fontSize: '0.82rem', color: 'hsl(var(--text-muted))', padding: '20px 0' }}>{text}</p>
);

export default TrainerDashboard;
