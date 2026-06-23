import React, { useMemo, useState } from 'react';
import { GraduationCap, UserPlus, Trash2, Pencil, History } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import ImageUpload, { ImageThumb } from '../../components/ui/ImageUpload';
import AuditHistoryModal from '../../components/ui/AuditHistoryModal';
import { FilterBar, SelectFilter, SearchInput, ExportButton, Badge } from '../../components/ui/Toolbar';
import { useData } from '../../context/DataContext';
import { exportToCSV } from '../../utils/export';
import { validateTrainee, hasErrors } from '../../utils/validators';

const EMPTY = {
  studentId: '', firstName: '', lastName: '', sex: 'Male', academicLevel: 'Level III', sectionCode: '',
  departmentId: '', city: 'Addis Ababa', phone: '', entryYear: '2017', status: 'Active',
  emergencyContactName: '', emergencyContactPhone1: '', photoUrl: '',
};

const ManageTrainees = () => {
  const { trainees, departments, deptName, addTrainee, updateTrainee, deleteTrainee, deleteTraineesBulk } = useData();
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('All');
  const [dept, setDept] = useState('All');
  const [modal, setModal] = useState({ open: false, mode: 'add', id: null });
  const [form, setForm] = useState({ ...EMPTY, departmentId: departments[0].id });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState([]);
  const [history, setHistory] = useState(null);

  const levels = ['All', 'Level I', 'Level II', 'Level III', 'Level IV'];

  const rows = useMemo(() => trainees.filter((t) => {
    const q = search.toLowerCase();
    const matchesSearch = !q || t.fullName.toLowerCase().includes(q) || t.studentId.toLowerCase().includes(q) || (t.sectionCode || '').toLowerCase().includes(q);
    return (level === 'All' || t.academicLevel === level) && (dept === 'All' || t.departmentId === dept) && matchesSearch;
  }), [trainees, search, level, dept]);

  const femaleCount = trainees.filter((t) => t.sex === 'Female').length;

  const openAdd = () => { setForm({ ...EMPTY, departmentId: departments[0].id }); setErrors({}); setModal({ open: true, mode: 'add', id: null }); };
  const openEdit = (r) => { setForm({ ...EMPTY, ...r }); setErrors({}); setModal({ open: true, mode: 'edit', id: r.id }); };
  const closeModal = () => setModal({ open: false, mode: 'add', id: null });

  const toggleSelect = (id) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const toggleAll = (visible) => {
    const ids = visible.map((r) => r.id);
    const allOn = ids.every((id) => selected.includes(id));
    setSelected(allOn ? selected.filter((id) => !ids.includes(id)) : Array.from(new Set([...selected, ...ids])));
  };
  const bulkDelete = async () => {
    if (!selected.length) return;
    if (!window.confirm(`Remove ${selected.length} selected trainee(s)?`)) return;
    await deleteTraineesBulk(selected);
    setSelected([]);
  };

  const columns = [
    { key: 'photo', label: '', width: '48px', align: 'center', render: (r) => <ImageThumb src={r.photoUrl} /> },
    { key: 'studentId', label: 'ID Number', render: (r) => <span style={{ fontWeight: '700', color: 'hsl(var(--accent-cyan))', fontFamily: 'Outfit' }}>{r.studentId}</span> },
    { key: 'fullName', label: 'Full Name', render: (r) => <span style={{ fontWeight: '600', color: 'hsl(var(--text-primary))' }}>{r.fullName}</span> },
    { key: 'sex', label: 'Sex', align: 'center', render: (r) => <Badge tone={r.sex === 'Female' ? 'warning' : 'info'}>{r.sex}</Badge> },
    { key: 'academicLevel', label: 'Level' },
    { key: 'sectionCode', label: 'Section' },
    { key: 'dept', label: 'Department', render: (r) => deptName(r.departmentId) },
    { key: 'phone', label: 'Phone' },
    { key: 'actions', label: '', align: 'center', render: (r) => (
      <div style={{ display: 'inline-flex', gap: '10px', alignItems: 'center' }}>
        <button onClick={() => openEdit(r)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(var(--accent-cyan))' }} title="Edit trainee"><Pencil size={15} /></button>
        <button onClick={() => setHistory(r)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(var(--text-muted))' }} title="View history"><History size={15} /></button>
        <button onClick={() => { if (window.confirm(`Remove ${r.fullName}?`)) deleteTrainee(r.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f43f5e' }} title="Delete trainee"><Trash2 size={15} /></button>
      </div>
    ) },
  ];

  const csvCols = [
    { label: 'ID Number', key: 'studentId' },
    { label: 'Full Name', key: 'fullName' },
    { label: 'Sex', key: 'sex' },
    { label: 'Level', key: 'academicLevel' },
    { label: 'Section', key: 'sectionCode' },
    { label: 'Department', value: (r) => deptName(r.departmentId) },
    { label: 'Phone', key: 'phone' },
  ];

  const submit = async (e) => {
    e.preventDefault();
    const errs = validateTrainee(form, trainees, modal.mode === 'edit' ? modal.id : null);
    if (hasErrors(errs)) { setErrors(errs); return; }
    setSaving(true);
    const payload = { ...form, fullName: `${form.firstName} ${form.lastName}`.trim() };
    if (modal.mode === 'edit') {
      await updateTrainee(modal.id, payload);
    } else {
      await addTrainee(payload);
    }
    setSaving(false);
    closeModal();
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <PageHeader icon={GraduationCap} title="Manage Trainees" subtitle={`${trainees.length} trainees · ${femaleCount} female`}
        actions={<button className="btn-primary" style={{ width: 'auto', padding: '10px 16px', borderRadius: '10px' }} onClick={openAdd}><UserPlus size={16} /> Register Trainee</button>} />

      <FilterBar>
        <SelectFilter label="Level" value={level} onChange={setLevel} options={levels} />
        <SelectFilter label="Department" value={dept} onChange={setDept} options={['All', ...departments.map((d) => ({ value: d.id, label: d.name }))]} />
        <SearchInput value={search} onChange={setSearch} placeholder="Search ID, name, section…" />
        <div style={{ marginLeft: 'auto' }}><ExportButton onClick={() => exportToCSV('atms_trainees', csvCols, rows)} /></div>
      </FilterBar>

      {selected.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)' }}>
          <span style={{ fontWeight: '600', color: 'hsl(var(--text-primary))' }}>{selected.length} selected</span>
          <button onClick={bulkDelete} className="btn-secondary" style={{ width: 'auto', padding: '8px 14px', color: '#f43f5e' }}><Trash2 size={14} /> Delete selected</button>
          <button onClick={() => setSelected([])} className="btn-secondary" style={{ width: 'auto', padding: '8px 14px' }}>Clear</button>
        </div>
      )}

      <DataTable columns={columns} rows={rows} emptyText="No trainees match the filters."
        selectable selectedIds={selected} onToggleSelect={toggleSelect} onToggleAll={toggleAll} />

      <Modal open={modal.open} onClose={closeModal} title={modal.mode === 'edit' ? 'Edit Trainee' : 'Register Trainee'} icon={GraduationCap}>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <Field label="Student ID" error={errors.studentId}><input className="input-field" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} placeholder="TRN-2017-016" /></Field>
            <Field label="Section"><input className="input-field" value={form.sectionCode} onChange={(e) => setForm({ ...form, sectionCode: e.target.value })} placeholder="ICT-3A" /></Field>
            <Field label="First Name" error={errors.firstName}><input className="input-field" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></Field>
            <Field label="Last Name"><input className="input-field" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></Field>
            <Field label="Sex"><select className="input-field" value={form.sex} onChange={(e) => setForm({ ...form, sex: e.target.value })}>{['Male', 'Female'].map((s) => <option key={s}>{s}</option>)}</select></Field>
            <Field label="Level"><select className="input-field" value={form.academicLevel} onChange={(e) => setForm({ ...form, academicLevel: e.target.value })}>{levels.filter((l) => l !== 'All').map((l) => <option key={l}>{l}</option>)}</select></Field>
            <Field label="Department"><select className="input-field" value={form.departmentId} onChange={(e) => setForm({ ...form, departmentId: e.target.value })}>{departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select></Field>
            <Field label="Phone"><input className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+251-9..." /></Field>
            <Field label="Status"><select className="input-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{['Active', 'Inactive'].map((s) => <option key={s}>{s}</option>)}</select></Field>
            <Field label="Entry Year"><input className="input-field" value={form.entryYear} onChange={(e) => setForm({ ...form, entryYear: e.target.value })} placeholder="2017" /></Field>
          </div>
          <ImageUpload value={form.photoUrl} onChange={(url) => setForm({ ...form, photoUrl: url })} label="Photo" hint="PNG/JPG, under 4 MB" />
          <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '14px' }}>
            <button type="button" className="btn-secondary" style={{ flex: 1, padding: '11px' }} onClick={closeModal}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ flex: 1, padding: '11px' }} disabled={saving}>{saving ? 'Saving…' : modal.mode === 'edit' ? 'Save Changes' : 'Save Record'}</button>
          </div>
        </form>
      </Modal>

      <AuditHistoryModal open={!!history} onClose={() => setHistory(null)} entity="trainee" record={history} />
    </div>
  );
};

const Field = ({ label, error, children }) => (
  <div className="input-group">
    <label className="input-label">{label}</label>
    {children}
    {error && <span style={{ fontSize: '0.75rem', color: 'hsl(var(--accent-rose))' }}>{error}</span>}
  </div>
);

export default ManageTrainees;
