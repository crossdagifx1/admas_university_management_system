import React from 'react';
import GlassCard from '../GlassCard';

// Generic table. columns: { key, label, align, width, render(row), value(row) }
// Optional row selection (all default off, so existing callers are unaffected):
//   selectable, selectedIds, onToggleSelect(id), onToggleAll(rows)
const DataTable = ({
  columns,
  rows,
  keyField = 'id',
  emptyText = 'No records found.',
  selectable = false,
  selectedIds = [],
  onToggleSelect,
  onToggleAll,
}) => {
  const allSelected = selectable && rows.length > 0 && rows.every((r) => selectedIds.includes(r[keyField]));
  const colCount = columns.length + (selectable ? 1 : 0);
  return (
    <GlassCard hoverEffect={false} style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              {selectable && (
                <th style={{ padding: '14px 18px', width: '44px', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => { if (el) el.indeterminate = !allSelected && selectedIds.length > 0 && rows.some((r) => selectedIds.includes(r[keyField])); }}
                    onChange={() => onToggleAll && onToggleAll(rows)}
                    style={{ cursor: 'pointer', accentColor: 'hsl(var(--accent-cyan))' }}
                  />
                </th>
              )}
              {columns.map((c) => (
                <th
                  key={c.key}
                  style={{
                    padding: '14px 18px',
                    color: 'hsl(var(--text-secondary))',
                    fontWeight: '600',
                    whiteSpace: 'nowrap',
                    textAlign: c.align || 'left',
                    width: c.width,
                  }}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.map((row) => {
                const checked = selectable && selectedIds.includes(row[keyField]);
                return (
                  <tr key={row[keyField]} className="dt-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s', background: checked ? 'rgba(34,211,238,0.06)' : undefined }}>
                    {selectable && (
                      <td style={{ padding: '14px 18px', textAlign: 'center', verticalAlign: 'middle' }}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => onToggleSelect && onToggleSelect(row[keyField])}
                          style={{ cursor: 'pointer', accentColor: 'hsl(var(--accent-cyan))' }}
                        />
                      </td>
                    )}
                    {columns.map((c) => (
                      <td key={c.key} style={{ padding: '14px 18px', textAlign: c.align || 'left', color: 'hsl(var(--text-secondary))', verticalAlign: 'middle' }}>
                        {c.render ? c.render(row) : c.value ? c.value(row) : row[c.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={colCount} style={{ padding: '44px', textAlign: 'center', color: 'hsl(var(--text-muted))' }}>
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <style>{`.dt-row:hover { background: rgba(255,255,255,0.015); }`}</style>
    </GlassCard>
  );
};

export default DataTable;
