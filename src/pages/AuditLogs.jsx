import React, { useMemo, useState, useEffect } from 'react';
import { History, Eye, Search, Filter, RefreshCw } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import { FilterBar, SelectFilter, SearchInput, ExportButton, Badge } from '../components/ui/Toolbar';
import { useData } from '../context/DataContext';
import { exportToCSV } from '../utils/export';

const ACTION_TONES = {
  create: 'success',
  update: 'info',
  delete: 'danger',
  status: 'warning',
  'reset-password': 'warning',
};

const AuditLogs = () => {
  const { listAllAudits } = useData();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [entityFilter, setEntityFilter] = useState('All');
  const [actionFilter, setActionFilter] = useState('All');
  const [selectedLog, setSelectedLog] = useState(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await listAllAudits();
      setLogs(data || []);
    } catch (err) {
      console.error('[ATMS] Failed to fetch audit logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        (log.actor || '').toLowerCase().includes(q) ||
        (log.entityId || '').toLowerCase().includes(q) ||
        (log.action || '').toLowerCase().includes(q);
      
      const matchesEntity = entityFilter === 'All' || log.entity === entityFilter;
      const matchesAction = actionFilter === 'All' || log.action === actionFilter;

      return matchesSearch && matchesEntity && matchesAction;
    });
  }, [logs, search, entityFilter, actionFilter]);

  const uniqueEntities = useMemo(() => {
    const set = new Set(logs.map((l) => l.entity).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [logs]);

  const uniqueActions = useMemo(() => {
    const set = new Set(logs.map((l) => l.action).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [logs]);

  const formatChanges = (changes) => {
    if (!changes) return '—';
    if (typeof changes !== 'object') return String(changes);
    
    // Check if it's formatted as field: { from, to }
    const entries = Object.entries(changes);
    if (entries.length === 0) return 'No changes recorded';

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8rem' }}>
        {entries.map(([key, val]) => {
          if (val && typeof val === 'object' && ('from' in val || 'to' in val)) {
            return (
              <div key={key} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <strong style={{ color: 'hsl(var(--accent-cyan))' }}>{key}: </strong>
                <span style={{ color: 'hsl(var(--text-muted))', textDecoration: 'line-through', marginRight: '6px' }}>
                  {val.from === undefined || val.from === null ? 'None' : String(val.from)}
                </span>
                <span style={{ color: 'hsl(var(--accent-emerald))' }}>
                  → {val.to === undefined || val.to === null ? 'None' : String(val.to)}
                </span>
              </div>
            );
          }
          return (
            <div key={key} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <strong style={{ color: 'hsl(var(--accent-cyan))' }}>{key}: </strong>
              <span>{JSON.stringify(val)}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const columns = [
    {
      key: 'createdAt',
      label: 'Timestamp',
      width: '180px',
      render: (r) => (
        <span style={{ fontFamily: 'Outfit', fontWeight: '500', color: 'hsl(var(--text-secondary))' }}>
          {r.createdAt ? new Date(r.createdAt).toLocaleString() : '—'}
        </span>
      ),
    },
    {
      key: 'actor',
      label: 'Actor',
      width: '120px',
      render: (r) => (
        <span style={{ fontWeight: '600', color: 'hsl(var(--accent-cyan))' }}>{r.actor}</span>
      ),
    },
    {
      key: 'entity',
      label: 'Module / Table',
      width: '130px',
      render: (r) => (
        <Badge tone="info">
          {r.entity ? r.entity.toUpperCase() : 'SYSTEM'}
        </Badge>
      ),
    },
    {
      key: 'entityId',
      label: 'Record ID',
      width: '150px',
      render: (r) => (
        <span style={{ fontFamily: 'monospace', color: 'hsl(var(--text-muted))' }}>{r.entityId || '—'}</span>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      width: '120px',
      render: (r) => (
        <Badge tone={ACTION_TONES[r.action] || 'warning'}>{r.action}</Badge>
      ),
    },
    {
      key: 'changes',
      label: 'Modified Fields',
      render: (r) => formatChanges(r.changes),
    },
    {
      key: 'details',
      label: '',
      width: '50px',
      align: 'center',
      render: (r) => (
        <button
          onClick={() => setSelectedLog(r)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(var(--accent-cyan))' }}
          title="View raw log details"
        >
          <Eye size={15} />
        </button>
      ),
    },
  ];

  const csvCols = [
    { label: 'Timestamp', value: (r) => (r.createdAt ? new Date(r.createdAt).toISOString() : '') },
    { label: 'Actor', key: 'actor' },
    { label: 'Module', key: 'entity' },
    { label: 'Record ID', key: 'entityId' },
    { label: 'Action', key: 'action' },
    { label: 'Changes', value: (r) => JSON.stringify(r.changes) },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <PageHeader
        icon={History}
        title="Audit Logs"
        subtitle="Global trace of administrative and operational user edits"
        actions={
          <button className="btn-secondary" style={{ width: 'auto', padding: '10px 16px', borderRadius: '10px' }} onClick={fetchLogs} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'spin' : ''} /> Refresh
          </button>
        }
      />

      <FilterBar>
        <SelectFilter
          label="Entity"
          value={entityFilter}
          onChange={setEntityFilter}
          options={uniqueEntities.map((e) => ({ value: e, label: e === 'All' ? 'All Modules' : e.toUpperCase() }))}
        />
        <SelectFilter
          label="Action"
          value={actionFilter}
          onChange={setActionFilter}
          options={uniqueActions.map((a) => ({ value: a, label: a === 'All' ? 'All Actions' : a.toUpperCase() }))}
        />
        <SearchInput value={search} onChange={setSearch} placeholder="Search actor, ID or action…" />
        <div style={{ marginLeft: 'auto' }}>
          <ExportButton onClick={() => exportToCSV('atms_audit_logs', csvCols, filteredLogs)} />
        </div>
      </FilterBar>

      <DataTable
        columns={columns}
        rows={filteredLogs}
        emptyText={loading ? 'Loading audit records…' : 'No audit records match the filters.'}
      />

      {/* Raw log detail modal */}
      <Modal open={!!selectedLog} onClose={() => setSelectedLog(null)} title="Audit Event Details" icon={History}>
        {selectedLog && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', display: 'block', marginBottom: '2px' }}>Timestamp</label>
                <div style={{ fontWeight: '600' }}>{selectedLog.createdAt ? new Date(selectedLog.createdAt).toLocaleString() : '—'}</div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', display: 'block', marginBottom: '2px' }}>Actor (User)</label>
                <div style={{ fontWeight: '600', color: 'hsl(var(--accent-cyan))' }}>{selectedLog.actor}</div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', display: 'block', marginBottom: '2px' }}>Module / Entity</label>
                <div style={{ fontWeight: '600' }}>{selectedLog.entity?.toUpperCase()}</div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', display: 'block', marginBottom: '2px' }}>Record Reference ID</label>
                <div style={{ fontWeight: '600', fontFamily: 'monospace' }}>{selectedLog.entityId || '—'}</div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', display: 'block', marginBottom: '2px' }}>Action Triggered</label>
                <div>
                  <Badge tone={ACTION_TONES[selectedLog.action] || 'warning'}>{selectedLog.action}</Badge>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
              <label style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', display: 'block', marginBottom: '6px' }}>Raw Payload Changes</label>
              <pre
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '0.8rem',
                  color: 'hsl(var(--text-primary))',
                  overflowX: 'auto',
                  margin: 0,
                  maxHeight: '220px',
                }}
              >
                {JSON.stringify(selectedLog.changes, null, 2)}
              </pre>
            </div>

            <div style={{ display: 'flex', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '14px', marginTop: '4px' }}>
              <button type="button" className="btn-secondary" style={{ flex: 1, padding: '11px' }} onClick={() => setSelectedLog(null)}>
                Close Details
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AuditLogs;
