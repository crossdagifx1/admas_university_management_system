import React from 'react';

// Section intro shown at the top of each module page.
const PageHeader = ({ icon: Icon, title, subtitle, accent = 'hsl(var(--accent-cyan))', actions }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
    <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
      {Icon && (
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: accent,
            flexShrink: 0,
          }}
        >
          <Icon size={20} />
        </div>
      )}
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>{title}</h2>
        {subtitle && (
          <p style={{ fontSize: '0.82rem', color: 'hsl(var(--text-muted))', marginTop: '2px' }}>{subtitle}</p>
        )}
      </div>
    </div>
    {actions && <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>{actions}</div>}
  </div>
);

export default PageHeader;
