import React, { useState } from 'react';
import { LogOut, Sparkles, ChevronDown } from 'lucide-react';
import { NAV } from '../config/nav';
import AdmasEmblem from './AdmasEmblem';

const Sidebar = ({ activeView, setActiveView, onLogout, user, nav = NAV, portalLabel = 'TVET Management' }) => {
  // Auto-open the group that contains the active view.
  const initialOpen = {};
  nav.forEach((n) => {
    if (n.type === 'group' && n.children.some((c) => c.view === activeView)) initialOpen[n.id] = true;
  });
  const [open, setOpen] = useState(initialOpen);

  const toggle = (id) => setOpen((o) => ({ ...o, [id]: !o[id] }));

  const itemBase = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    padding: '11px 16px',
    border: '1px solid transparent',
    borderRadius: '11px',
    fontSize: '0.88rem',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
    background: 'transparent',
  };

  const renderLeaf = (view, label, Icon) => {
    const isActive = activeView === view;
    return (
      <button
        key={view}
        onClick={() => setActiveView(view)}
        style={{
          ...itemBase,
          background: isActive ? 'rgba(0,229,255,0.08)' : 'transparent',
          borderColor: isActive ? 'rgba(0,229,255,0.25)' : 'transparent',
          color: isActive ? 'hsl(var(--accent-cyan))' : 'hsl(var(--text-secondary))',
          fontWeight: isActive ? '600' : '500',
        }}
        className={!isActive ? 'sb-hover' : ''}
      >
        {Icon && <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />}
        {label}
        {isActive && (
          <span style={{ marginLeft: 'auto', width: '5px', height: '5px', borderRadius: '50%', background: 'hsl(var(--accent-cyan))', boxShadow: '0 0 8px hsl(var(--accent-cyan))' }} />
        )}
      </button>
    );
  };

  return (
    <aside
      className="glass-panel"
      style={{
        width: '264px',
        height: 'calc(100vh - 32px)',
        position: 'sticky',
        top: '16px',
        left: '16px',
        display: 'flex',
        flexDirection: 'column',
        padding: '28px 16px 20px 16px',
        border: '1px solid rgba(255,255,255,0.05)',
        zIndex: 10,
        boxShadow: '0 8px 32px 0 rgba(0,0,0,0.3)',
        flexShrink: 0,
      }}
    >
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px', paddingLeft: '6px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(0,229,255,0.3)', flexShrink: 0 }}>
          <AdmasEmblem size={40} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '800', lineHeight: 1.1 }}>ADMAS · ATMS</h2>
          <span style={{ fontSize: '0.66rem', letterSpacing: '0.14em', color: 'hsl(var(--accent-cyan))', textTransform: 'uppercase', fontWeight: '700' }}>
            {portalLabel}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingRight: '4px', marginRight: '-4px' }}>
        {nav.map((node) => {
          if (node.type === 'item') return renderLeaf(node.view, node.label, node.icon);

          const Icon = node.icon;
          const isOpen = !!open[node.id];
          const groupActive = node.children.some((c) => c.view === activeView);
          return (
            <div key={node.id}>
              <button
                onClick={() => toggle(node.id)}
                style={{
                  ...itemBase,
                  color: groupActive ? 'hsl(var(--text-primary))' : 'hsl(var(--text-secondary))',
                  fontWeight: groupActive ? '600' : '500',
                }}
                className="sb-hover"
              >
                <Icon size={18} strokeWidth={2} color={groupActive ? 'hsl(var(--accent-cyan))' : undefined} />
                {node.label}
                <ChevronDown size={15} style={{ marginLeft: 'auto', transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none', opacity: 0.6 }} />
              </button>
              {isOpen && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', margin: '2px 0 4px 0', paddingLeft: '14px', borderLeft: '1px solid rgba(255,255,255,0.06)', marginLeft: '22px' }}>
                  {node.children.map((c) => {
                    const isActive = activeView === c.view;
                    return (
                      <button
                        key={c.view}
                        onClick={() => setActiveView(c.view)}
                        style={{
                          ...itemBase,
                          padding: '8px 14px',
                          fontSize: '0.82rem',
                          background: isActive ? 'rgba(0,229,255,0.07)' : 'transparent',
                          color: isActive ? 'hsl(var(--accent-cyan))' : 'hsl(var(--text-muted))',
                          fontWeight: isActive ? '600' : '500',
                          borderColor: isActive ? 'rgba(0,229,255,0.2)' : 'transparent',
                        }}
                        className={!isActive ? 'sb-hover' : ''}
                      >
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User / logout */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '4px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: 'hsl(var(--accent-teal))' }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <span style={{ fontSize: '0.86rem', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name || 'Administrator'}</span>
            <span style={{ fontSize: '0.72rem', color: 'hsl(var(--text-muted))', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={10} color="hsl(var(--accent-gold))" /> {user?.role || 'Super Admin'}
            </span>
          </div>
        </div>
        <button
          onClick={onLogout}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', padding: '11px', background: 'rgba(244,63,94,0.05)', border: '1px solid rgba(244,63,94,0.15)', borderRadius: '10px', color: '#f43f5e', fontSize: '0.86rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(244,63,94,0.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(244,63,94,0.05)'; }}
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      <style>{`.sb-hover:hover { background: rgba(255,255,255,0.03) !important; color: hsl(var(--text-primary)) !important; }`}</style>
    </aside>
  );
};

export default Sidebar;
