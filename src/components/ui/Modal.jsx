import React from 'react';
import { X } from 'lucide-react';
import GlassCard from '../GlassCard';

const Modal = ({ open, onClose, title, icon: Icon, children, maxWidth = '520px' }) => {
  if (!open) return null;
  return (
    <div
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)',
        padding: '20px',
      }}
    >
      <div className="animate-fade-in" style={{ width: '100%', maxWidth }}>
        <GlassCard hoverEffect={false} style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {Icon && <Icon size={18} color="hsl(var(--accent-cyan))" />}
              {title}
            </h3>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(var(--text-muted))' }}>
              <X size={20} />
            </button>
          </div>
          {children}
        </GlassCard>
      </div>
    </div>
  );
};

export default Modal;
