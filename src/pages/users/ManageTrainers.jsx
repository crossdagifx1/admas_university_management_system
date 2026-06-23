import React, { useMemo, useState } from 'react';
import { UserCog, UserPlus, Trash2, Star, Pencil, History } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import ImageUpload, { ImageThumb } from '../../components/ui/ImageUpload';
import AuditHistoryModal from '../../components/ui/AuditHistoryModal';
import { FilterBar, SelectFilter, SearchInput, ExportButton, Badge } from '../../components/ui/Toolbar';
import { useData } from '../../context/DataContext';
import { exportToCSV } from '../../utils/export';
import { validateTrainer, hasErrors } from '../../utils/validators';

const STATUS_TONE = { Active: 'success', Coordinator: 'info', Released: 'danger' };
const EMPTY = { name: '', staffNo: '', departmentId: '', employmentType: 'FT', presentStatus: 'Active', rating: 4.5, photoUrl: '' };

const ManageTrainers = () => {
  const { trainers, users, departments, deptName, addTrainer, updateTrainer, deleteTrainer, deleteTrainersBulk } = useData();
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('All');
  const [type, setType] = useState('All');
  const [modal, setModal] = useState({ open: false, mode: 'add', id: null });
  const [form, setForm] = useState({
    ...EMPTY,
    departmentId: departments[0]?.id || '',
    username: '',
    password: '',
    email: '',
    mobileNumber: '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState([]);
  const [history, setHistory] = useState(null);

  const rows = useMemo(() => trainers.filter((t) => {
    const q = search.toLowerCase();
    const matchesSearch = !q || t.name.toLowerCase().includes(q) || (t.staffNo || '').toLowerCase().includes(q);
    return (dept === 'All' || t.departmentId === dept) && (type === 'All' || t.employmentType === type) && matchesSearch;
  }), [trainers, search, dept, type]);

  const activeCount = trainers.filter((t) => t.presentStatus !== 'Released').length;
  const avgRating = trainers.length ? (trainers.reduce((s, t) => s + (t.rating || 0), 0) / trainers.length).toFixed(1) : '0.0';

  const openAdd = () => {
    setForm({
      ...EMPTY,
      departmentId: departments[0]?.id || '',
      username: '',
      password: '',
      email: '',
      mobileNumber: '',
    });
    setErrors({});
    setModal({ open: true, mode: 'add', id: null });
  };
  const openEdit = (r) => {
    const linkedUser = users.find((u) => u.id === r.userId) || {};
    setForm({
      ...EMPTY,
      ...r,
      username: linkedUser.username || '',
      password: linkedUser.password || linkedUser.username || '',
      email: linkedUser.email || '',
      mobileNumber: linkedUser.mobileNumber || '',
    });
    setErrors({});
    setModal({ open: true, mode: 'edit', id: r.id });
  };
  const closeModal = () => setModal({ open: false, mode: 'add', id: null });

  const toggleSelect = (id) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const toggleAll = (visible) => {
    const ids = visible.map((r) => r.id);
    const allOn = ids.every((id) => selected.includes(id));
    setSelected(allOn ? selected.filter((id) => !ids.includes(id)) : Array.from(new Set([...selected, ...ids])));
  };
  const bulkDelete = async () => {
    if (!selected.length) return;
    if (!window.confirm(`Remove ${selected.length} selected trainer(s)?`)) return;
    await deleteTrainersBulk(selected);
    setSelected([]);
  };

  const columns = [
    { key: 'photo', label: '', width: '48px', align: 'center', render: (r) => <ImageThumb src={r.photoUrl} /> },
    { key: 'staffNo', label: 'Staff No', render: (r) => <span style={{ fontWeight: '700', color: 'hsl(var(--accent-cyan))', fontFamily: 'Outfit' }}>{r.staffNo || '—'}</span> },
    { key: 'name', label: 'Trainer', render: (r) => <span style={{ fontWeight: '600', color: 'hsl(var(--text-primary))' }}>{r.name}</span> },
    { key: 'dept', label: 'Department', render: (r) => deptName(r.departmentId) },
    { key: 'employmentType', label: 'Type', align: 'center', render: (r) => <Badge tone={r.employmentType === 'FT' ? 'info' : 'warning'}>{r.employmentType}</Badge> },
    { key: 'rating', label: 'Rating', align: 'center', render: (r) => (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: '700', fontFamily: 'Outfit', color: 'hsl(var(--accent-gold))' }}>
        <Star size={13} fill="hsl(var(--accent-gold))" color="hsl(var(--accent-gold))" /> {(r.rating ?? 0).toFixed(1)}
      </span>
    ) },
    { key: 'presentStatus', label: 'Status', align: 'center', render: (r) => (
      <button onClick={() => updateTrainer(r.id, { presentStatus: r.presentStatus === 'Released' ? 'Active' : 'Released' })} style={{ background: 'none', border: 'none', cursor: 'pointer' }} title="Toggle active/released">
        <Badge tone={STATUS_TONE[r.presentStatus] || 'warning'}>{r.presentStatus}</Badge>
      </button>
    ) },
    { key: 'actions', label: '', align: 'center', render: (r) => (
      <div style={{ display: 'inline-flex', gap: '10px', alignItems: 'center' }}>
        <button onClick={() => openEdit(r)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(var(--accent-cyan))' }} title="Edit trainer"><Pencil size={15} /></button>
        <button onClick={() => setHistory(r)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(var(--text-muted))' }} title="View history"><History size={15} /></button>
        <button onClick={() => { if (window.confirm(`Remove trainer ${r.name}?`)) deleteTrainer(r.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f43f5e' }} title="Delete trainer"><Trash2 size={15} /></button>
      </div>
    ) },
  ];

  const csvCols = [
    { label: 'Staff No', key: 'staffNo' },
    { label: 'Trainer', key: 'name' },
    { label: 'Department', value: (r) => deptName(r.departmentId) },
    { label: 'Employment', key: 'employmentType' },
    { label: 'Rating', key: 'rating' },
    { label: 'Status', key: 'presentStatus' },
  ];

  const submit = async (e) => {
    e.preventDefault();
    const errs = validateTrainer(form, trainers, modal.mode === 'edit' ? modal.id : null);
    
    // Validate credentials
    if (!form.username?.trim()) {
      errs.username = 'Username is required.';
    } else {
      const uLower = form.username.trim().toLowerCase();
      const linkedTrainer = modal.mode === 'edit' ? trainers.find((t) => t.id === modal.id) : null;
      const isTaken = users.some((u) => u.username.toLowerCase() === uLower && u.id !== linkedTrainer?.userId);
      if (isTaken) {
        errs.username = 'Username is already taken.';
      }
    }

    if (hasErrors(errs)) { setErrors(errs); return; }
    setSaving(true);
    const payload = {
      ...form,
      rating: Number(form.rating) || 0,
      username: form.username.trim(),
      password: form.password?.trim() || form.username.trim(),
      email: form.email?.trim() || null,
      mobileNumber: form.mobileNumber?.trim() || null,
    };
    if (modal.mode === 'edit') {
      await updateTrainer(modal.id, payload);
    } else {
      await addTrainer(payload);
    }
    setSaving(false);
    closeModal();
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <PageHeader icon={UserCog} title="Manage Trainers" subtitle={`${trainers.length} trainers · ${activeCount} active · ${avgRating}★ avg`}
        actions={<button className="btn-primary" style={{ width: 'auto', padding: '10px 16px', borderRadius: '10px' }} onClick={openAdd}><UserPlus size={16} /> Add Trainer</button>} />

      <FilterBar>
        <SelectFilter label="Department" value={dept} onChange={setDept} options={['All', ...departments.map((d) => ({ value: d.id, label: d.name }))]} />
        <SelectFilter label="Type" value={type} onChange={setType} options={['All', 'FT', 'PT']} />
        <SearchInput value={search} onChange={setSearch} placeholder="Search name, staff no…" />
        <div style={{ marginLeft: 'auto' }}><ExportButton onClick={() => exportToCSV('atms_trainers', csvCols, rows)} /></div>
      </FilterBar>

      {selected.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)' }}>
          <span style={{ fontWeight: '600', color: 'hsl(var(--text-primary))' }}>{selected.length} selected</span>
          <button onClick={bulkDelete} className="btn-secondary" style={{ width: 'auto', padding: '8px 14px', color: '#f43f5e' }}><Trash2 size={14} /> Delete selected</button>
          <button onClick={() => setSelected([])} className="btn-secondary" style={{ width: 'auto', padding: '8px 14px' }}>Clear</button>
        </div>
      )}

      <DataTable columns={columns} rows={rows} emptyText="No trainers match the filters."
        selectable selectedIds={selected} onToggleSelect={toggleSelect} onToggleAll={toggleAll} />

      <Modal open={modal.open} onClose={closeModal} title={modal.mode === 'edit' ? 'Edit Trainer' : 'Add Trainer'} icon={UserCog}>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'hsl(var(--accent-cyan))', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>Trainer Profile</div>
          
          <Field label="Full Name" error={errors.name}><input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Dr. Sara Mengistu" /></Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <Field label="Staff No" error={errors.staffNo}><input className="input-field" value={form.staffNo} onChange={(e) => setForm({ ...form, staffNo: e.target.value })} placeholder="STF-1009" /></Field>
            <Field label="Department"><select className="input-field" value={form.departmentId} onChange={(e) => setForm({ ...form, departmentId: e.target.value })}>{departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select></Field>
            <Field label="Employment"><select className="input-field" value={form.employmentType} onChange={(e) => setForm({ ...form, employmentType: e.target.value })}>{['FT', 'PT'].map((s) => <option key={s}>{s}</option>)}</select></Field>
            <Field label="Status"><select className="input-field" value={form.presentStatus} onChange={(e) => setForm({ ...form, presentStatus: e.target.value })}>{['Active', 'Coordinator', 'Released'].map((s) => <option key={s}>{s}</option>)}</select></Field>
            <Field label="Rating (0–5)" error={errors.rating}><input type="number" min="0" max="5" step="0.1" className="input-field" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} /></Field>
          </div>

          <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'hsl(var(--accent-cyan))', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px', marginTop: '10px' }}>User Credentials</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <Field label="Portal Username" error={errors.username}><input className="input-field" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="e.g. s.mengistu" /></Field>
            <Field label="Portal Password" error={errors.password}><input className="input-field" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password code" /></Field>
            <Field label="Email Address" error={errors.email}><input type="email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="s.mengistu@admas.edu.et" /></Field>
            <Field label="Mobile Number"><input className="input-field" value={form.mobileNumber} onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })} placeholder="+251-9..." /></Field>
          </div>

          <ImageUpload value={form.photoUrl} onChange={(url) => setForm({ ...form, photoUrl: url })} label="Photo" hint="PNG/JPG, under 4 MB" />
          <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '14px' }}>
            <button type="button" className="btn-secondary" style={{ flex: 1, padding: '11px' }} onClick={closeModal}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ flex: 1, padding: '11px' }} disabled={saving}>{saving ? 'Saving…' : modal.mode === 'edit' ? 'Save Changes' : 'Save Trainer'}</button>
          </div>
        </form>
      </Modal>

      <AuditHistoryModal open={!!history} onClose={() => setHistory(null)} entity="trainer" record={history} />
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

export default ManageTrainers;
