import React from 'react';
import GlassCard from '../GlassCard';

const StatCard = ({ icon: Icon, label, value, accent = 'hsl(var(--accent-cyan))', glow = 'rgba(0,229,255,0.15)', hint, onClick }) => (
  <GlassCard hoverEffect={!!onClick} onClick={onClick}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
      <span style={{ fontSize: '0.82rem', color: 'hsl(var(--text-secondary))', fontWeight: '500' }}>{label}</span>
      {Icon && (
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            backgroundColor: glow,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: accent,
          }}
        >
          <Icon size={18} />
        </div>
      )}
    </div>
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
      <span style={{ fontSize: '1.9rem', fontWeight: '800', fontFamily: 'Outfit', lineHeight: 1 }}>{value}</span>
      {hint && <span style={{ fontSize: '0.74rem', color: 'hsl(var(--text-muted))', marginBottom: '2px' }}>{hint}</span>}
    </div>
  </GlassCard>
);

export default StatCard;
