import React, { useMemo } from 'react';
import { CalendarDays } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Toolbar';
import { useData } from '../../context/DataContext';

const MySchedule = ({ user }) => {
  const { schedules, courseTitle, roomName, centerName, courseById } = useData();

  const mine = useMemo(() => schedules.filter((s) => s.trainerId === user.trainerId), [schedules, user.trainerId]);
  const totalCredit = mine.reduce((sum, s) => sum + (courseById(s.courseId)?.creditHours || 0), 0);

  const columns = [
    { key: 'sectionCode', label: 'Section', render: (r) => <span style={{ fontWeight: '700', color: 'hsl(var(--accent-cyan))', fontFamily: 'Outfit' }}>{r.sectionCode}</span> },
    { key: 'course', label: 'Course', render: (r) => <span style={{ fontWeight: '600', color: 'hsl(var(--text-primary))' }}>{courseTitle(r.courseId)}</span> },
    { key: 'credit', label: 'Credit', align: 'center', render: (r) => <Badge tone="info">{courseById(r.courseId)?.creditHours || 0} hrs</Badge> },
    { key: 'room', label: 'Room', render: (r) => roomName(r.roomId) },
    { key: 'center', label: 'Center', render: (r) => centerName(r.centerId) },
    { key: 'scheduleTime1', label: 'Session 1', render: (r) => r.scheduleTime1 || '—' },
    { key: 'scheduleTime2', label: 'Session 2', render: (r) => r.scheduleTime2 || '—' },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <PageHeader icon={CalendarDays} title="My Teaching Schedule" subtitle={`${mine.length} classes · ${totalCredit} credit hours this semester`} />
      <DataTable columns={columns} rows={mine} emptyText="You have no assigned classes yet." />
    </div>
  );
};

export default MySchedule;
