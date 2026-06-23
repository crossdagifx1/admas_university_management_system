import React, { useMemo, useState } from 'react';
import { CalendarDays, Plus, Trash2, TriangleAlert } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import { FilterBar, SelectFilter, SearchInput, ExportButton, PrintButton, Badge } from '../../components/ui/Toolbar';
import { useData } from '../../context/DataContext';
import { exportToCSV, printClassSchedule } from '../../utils/export';

const ManageSchedules = () => {
  const { schedules, courses, trainers, rooms, centers, conflicts, courseById, courseTitle, trainerName, roomName, centerName, addSchedule, deleteSchedule, meta } = useData();

  const [search, setSearch] = useState('');
  const [center, setCenter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ sectionCode: '', courseId: courses[0].id, trainerId: trainers[0].id, roomId: rooms[0].id, centerId: centers[0].id, scheduleTime1: '', startDate: '', endDate: '' });

  const conflictIds = useMemo(() => {
    const s = new Set();
    conflicts.forEach((c) => { s.add(c.a); s.add(c.b); });
    return s;
  }, [conflicts]);

  const rows = useMemo(() => {
    return schedules.filter((s) => {
      const matchesCenter = center === 'All' || s.centerId === center;
      const q = search.toLowerCase();
      const matchesSearch = !q || s.sectionCode.toLowerCase().includes(q) || courseTitle(s.courseId).toLowerCase().includes(q) || trainerName(s.trainerId).toLowerCase().includes(q);
      return matchesCenter && matchesSearch;
    });
  }, [schedules, center, search, courseTitle, trainerName]);

  const columns = [
    { key: 'section', label: 'Section', render: (r) => <span style={{ fontWeight: '700', color: 'hsl(var(--accent-cyan))', fontFamily: 'Outfit' }}>{r.sectionCode}</span> },
    { key: 'course', label: 'Course', render: (r) => <span style={{ color: 'hsl(var(--text-primary))' }}>{courseTitle(r.courseId)}</span> },
    { key: 'cr', label: 'Cr.Hr', align: 'center', render: (r) => courseById(r.courseId)?.creditHours ?? '—' },
    { key: 'time', label: 'Schedule', render: (r) => <span>{r.scheduleTime1}{r.scheduleTime2 ? <span style={{ color: 'hsl(var(--text-muted))' }}> · {r.scheduleTime2}</span> : ''}</span> },
    { key: 'room', label: 'Room', render: (r) => roomName(r.roomId) },
    { key: 'center', label: 'Center', render: (r) => centerName(r.centerId) },
    { key: 'trainer', label: 'Trainer', render: (r) => trainerName(r.trainerId) },
    { key: 'status', label: 'Status', align: 'center', render: (r) => conflictIds.has(r.id) ? <Badge tone="danger">Conflict</Badge> : <Badge tone="success">OK</Badge> },
    {
      key: 'actions', label: '', align: 'center', render: (r) => (
        <button onClick={() => { if (window.confirm('Delete this schedule entry?')) deleteSchedule(r.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f43f5e' }}><Trash2 size={15} /></button>
      ),
    },
  ];

  const csvCols = [
    { label: 'Section', key: 'sectionCode' },
    { label: 'Course', value: (r) => courseTitle(r.courseId) },
    { label: 'Credit Hours', value: (r) => courseById(r.courseId)?.creditHours },
    { label: 'Schedule', value: (r) => [r.scheduleTime1, r.scheduleTime2].filter(Boolean).join(' / ') },
    { label: 'Room', value: (r) => roomName(r.roomId) },
    { label: 'Center', value: (r) => centerName(r.centerId) },
    { label: 'Trainer', value: (r) => trainerName(r.trainerId) },
    { label: 'Start', key: 'startDate' },
    { label: 'End', key: 'endDate' },
  ];

  const handlePrint = () => {
    // Group active rows by sectionCode
    const sectionsMap = {};
    rows.forEach((r) => {
      const sec = r.sectionCode;
      if (!sectionsMap[sec]) {
        sectionsMap[sec] = [];
      }
      sectionsMap[sec].push({
        unitTitle: courseTitle(r.courseId),
        schedule: [r.scheduleTime1, r.scheduleTime2].filter(Boolean).join(' · '),
        room: roomName(r.roomId),
        center: centerName(r.centerId),
        trainerName: trainerName(r.trainerId),
      });
    });

    const sectionsData = Object.keys(sectionsMap).sort().map((sec) => ({
      sectionCode: sec,
      rows: sectionsMap[sec],
    }));

    const year = meta?.academicYear || '2017 E.C';
    const sem = meta?.semester || 'Semester I';

    printClassSchedule(year, sem, sectionsData);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.sectionCode || !form.scheduleTime1) return;
    addSchedule({ ...form, entryYear: '2017', scheduleTime2: '' });
    setShowModal(false);
    setForm({ sectionCode: '', courseId: courses[0].id, trainerId: trainers[0].id, roomId: rooms[0].id, centerId: centers[0].id, scheduleTime1: '', startDate: '', endDate: '' });
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <PageHeader
        icon={CalendarDays}
        title="Manage Schedules"
        subtitle={`${schedules.length} entries · ${conflicts.length} conflict(s) detected`}
        actions={<button className="btn-primary" style={{ width: 'auto', padding: '10px 16px', borderRadius: '10px' }} onClick={() => setShowModal(true)}><Plus size={16} /> New Schedule</button>}
      />

      {conflicts.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '12px', background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.18)' }}>
          <TriangleAlert size={18} color="hsl(var(--accent-rose))" />
          <span style={{ fontSize: '0.85rem', color: 'hsl(var(--accent-rose))', fontWeight: '600' }}>Action Required: {conflicts.length} Conflict(s) Detected</span>
          <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))' }}>{conflicts[0].detail}</span>
        </div>
      )}

      <FilterBar>
        <SelectFilter label="Center" value={center} onChange={setCenter} options={['All', ...centers.map((c) => ({ value: c.id, label: c.name }))]} />
        <SearchInput value={search} onChange={setSearch} placeholder="Search section, course, trainer…" />
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <ExportButton onClick={() => exportToCSV('atms_schedules', csvCols, rows)} />
          <PrintButton onClick={handlePrint} />
        </div>
      </FilterBar>

      <DataTable columns={columns} rows={rows} emptyText="No schedules match the current filters." />

      <Modal open={showModal} onClose={() => setShowModal(false)} title="New Class Schedule" icon={CalendarDays} maxWidth="560px">
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <Field label="Section Code"><input className="input-field" required value={form.sectionCode} onChange={(e) => setForm({ ...form, sectionCode: e.target.value })} placeholder="e.g. ICT-3B" /></Field>
            <Field label="Course"><select className="input-field" value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })}>{courses.map((c) => <option key={c.id} value={c.id}>{c.unitTitle}</option>)}</select></Field>
            <Field label="Trainer"><select className="input-field" value={form.trainerId} onChange={(e) => setForm({ ...form, trainerId: e.target.value })}>{trainers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select></Field>
            <Field label="Room"><select className="input-field" value={form.roomId} onChange={(e) => setForm({ ...form, roomId: e.target.value })}>{rooms.map((r) => <option key={r.id} value={r.id}>{r.roomNumber}</option>)}</select></Field>
            <Field label="Center"><select className="input-field" value={form.centerId} onChange={(e) => setForm({ ...form, centerId: e.target.value })}>{centers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
            <Field label="Schedule Time"><input className="input-field" required value={form.scheduleTime1} onChange={(e) => setForm({ ...form, scheduleTime1: e.target.value })} placeholder="e.g. Mon 08:00-10:00" /></Field>
            <Field label="Start Date"><input type="date" className="input-field" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></Field>
            <Field label="End Date"><input type="date" className="input-field" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></Field>
          </div>
          <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '14px' }}>
            <button type="button" className="btn-secondary" style={{ flex: 1, padding: '11px' }} onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ flex: 1, padding: '11px' }}>Save to Database</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

const Field = ({ label, children }) => (
  <div className="input-group"><label className="input-label">{label}</label>{children}</div>
);

export default ManageSchedules;
