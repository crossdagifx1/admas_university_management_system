import React from 'react';
import { Filter, Download, Printer, Search } from 'lucide-react';
import GlassCard from '../GlassCard';

export const SelectFilter = ({ label, value, onChange, options }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    {label && <span style={{ fontSize: '0.76rem', color: 'hsl(var(--text-muted))', whiteSpace: 'nowrap' }}>{label}</span>}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="input-field"
      style={{ padding: '7px 10px', height: '36px', fontSize: '0.8rem', borderRadius: '8px', width: 'auto', minWidth: '130px' }}
    >
      {options.map((o) => (
        <option key={typeof o === 'string' ? o : o.value} value={typeof o === 'string' ? o : o.value}>
          {typeof o === 'string' ? o : o.label}
        </option>
      ))}
    </select>
  </div>
);

export const SearchInput = ({ value, onChange, placeholder = 'Search…' }) => (
  <div style={{ position: 'relative', minWidth: '200px', flex: '1 1 200px', maxWidth: '320px' }}>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="input-field"
      style={{ paddingLeft: '38px', height: '36px', fontSize: '0.82rem', borderRadius: '8px' }}
    />
    <Search size={15} color="hsl(var(--text-muted))" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
  </div>
);

const ghostBtn = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '8px',
  padding: '8px 12px',
  color: 'hsl(var(--text-secondary))',
  fontSize: '0.8rem',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'var(--transition-fast)',
};

export const ExportButton = ({ onClick }) => (
  <button style={ghostBtn} onClick={onClick}
    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)')}
    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}>
    <Download size={14} color="hsl(var(--accent-teal))" /> Export CSV
  </button>
);

export const PrintButton = ({ onClick }) => (
  <button style={ghostBtn} onClick={onClick}
    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)')}
    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}>
    <Printer size={14} color="hsl(var(--accent-cyan))" /> Print
  </button>
);

export const FilterBar = ({ children }) => (
  <GlassCard hoverEffect={false} style={{ padding: '14px 16px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
      <span style={{ fontSize: '0.82rem', color: 'hsl(var(--text-secondary))', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}>
        <Filter size={14} color="hsl(var(--accent-cyan))" /> Filters
      </span>
      {children}
    </div>
  </GlassCard>
);

const TONES = {
  success: 'badge-success',
  info: 'badge-info',
  warning: 'badge-warning',
  danger: 'badge-danger',
};
export const Badge = ({ tone = 'info', children }) => (
  <span className={`badge ${TONES[tone] || 'badge-info'}`}>{children}</span>
);

export const ProgressBar = ({ value, max, accent = 'hsl(var(--accent-cyan))' }) => {
  const pct = Math.min(100, Math.round((value / (max || 1)) * 100));
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '120px' }}>
      <div style={{ flex: 1, height: '6px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', borderRadius: '4px', background: accent, boxShadow: `0 0 8px ${accent}` }} />
      </div>
      <span style={{ fontSize: '0.74rem', color: 'hsl(var(--text-muted))', fontWeight: '600', width: '34px' }}>{pct}%</span>
    </div>
  );
};
