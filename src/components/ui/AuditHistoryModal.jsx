import React, { useEffect, useState } from 'react';
import { History } from 'lucide-react';
import Modal from './Modal';
import { Badge } from './Toolbar';
import { useData } from '../../context/DataContext';

const ACTION_TONE = { create: 'success', update: 'info', status: 'warning', delete: 'danger' };

// Renders the change-history for a single trainer/trainee record. Pulls from
// Supabase audit_log when live, otherwise the in-memory audit feed.
const AuditHistoryModal = ({ open, onClose, entity, record }) => {
  const { auditFor } = useData();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !record) return;
    let cancelled = false;
    setLoading(true);
    auditFor(entity, record.id).then((rows) => {
      if (!cancelled) { setEntries(rows || []); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [open, entity, record, auditFor]);

  const label = record ? (record.name || record.fullName || record.id) : '';

  return (
    <Modal open={open} onClose={onClose} title={`History · ${label}`} icon={History} maxWidth="560px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '60vh', overflowY: 'auto' }}>
        {loading && <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.85rem' }}>Loading…</p>}
        {!loading && entries.length === 0 && (
          <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.85rem' }}>No history recorded yet for this record.</p>
        )}
        {entries.map((e) => (
          <div key={e.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between' }}>
              <Badge tone={ACTION_TONE[e.action] || 'info'}>{e.action}</Badge>
              <span style={{ fontSize: '0.72rem', color: 'hsl(var(--text-muted))' }}>{e.actor} · {e.createdAt}</span>
            </div>
            {e.changes && typeof e.changes === 'object' && (
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.78rem', color: 'hsl(var(--text-secondary))' }}>
                {Object.entries(e.changes).map(([field, v]) => (
                  <li key={field}>
                    <strong>{field}</strong>{v && typeof v === 'object' && 'to' in v ? `: ${fmt(v.from)} → ${fmt(v.to)}` : `: ${fmt(v)}`}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
};

const fmt = (v) => (v === undefined || v === null || v === '' ? '—' : String(v));

export default AuditHistoryModal;
