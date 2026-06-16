import React from 'react';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Users, 
  Settings, 
  LogOut,
  Sparkles,
  BookOpen
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, onLogout, user }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: GraduationCap },
    { id: 'faculty', label: 'Faculty & Staff', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside 
      className="glass-panel"
      style={{
        width: '280px',
        height: 'calc(100vh - 32px)',
        position: 'sticky',
        top: '16px',
        left: '16px',
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 20px 24px 20px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        zIndex: 10,
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* Brand Header */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '40px',
          paddingLeft: '8px'
        }}
      >
        <div 
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, hsl(var(--accent-teal)) 0%, hsl(var(--accent-cyan)) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(0, 229, 255, 0.3)',
          }}
        >
          <BookOpen size={20} color="#090a0f" strokeWidth={2.5} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', lineHeight: 1.1 }}>
            ADMAS
          </h2>
          <span 
            style={{ 
              fontSize: '0.7rem', 
              letterSpacing: '0.15em', 
              color: 'hsl(var(--accent-cyan))',
              textTransform: 'uppercase',
              fontWeight: '700'
            }}
          >
            UNIVERSITY
          </span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                width: '100%',
                padding: '14px 18px',
                background: isActive ? 'rgba(0, 229, 255, 0.08)' : 'transparent',
                border: '1px solid',
                borderColor: isActive ? 'rgba(0, 229, 255, 0.25)' : 'transparent',
                borderRadius: '12px',
                color: isActive ? 'hsl(var(--accent-cyan))' : 'hsl(var(--text-secondary))',
                fontSize: '0.92rem',
                fontWeight: isActive ? '600' : '500',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: isActive ? '0 0 15px rgba(0, 229, 255, 0.05)' : 'none',
              }}
              className={!isActive ? 'hover-btn-glow' : ''}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              {item.label}
              {isActive && (
                <div 
                  style={{
                    marginLeft: 'auto',
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    backgroundColor: 'hsl(var(--accent-cyan))',
                    boxShadow: '0 0 8px hsl(var(--accent-cyan))'
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* User Session & Logout Panel */}
      <div 
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '4px' }}>
          <div 
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              color: 'hsl(var(--accent-teal))',
              fontSize: '0.95rem'
            }}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: '600', color: 'hsl(var(--text-primary))', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name || 'Administrator'}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={10} color="hsl(var(--accent-gold))" /> {user?.role || 'Super Admin'}
            </span>
          </div>
        </div>

        <button
          onClick={onLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            width: '100%',
            padding: '12px',
            background: 'rgba(244, 63, 94, 0.05)',
            border: '1px solid rgba(244, 63, 94, 0.15)',
            borderRadius: '10px',
            color: '#f43f5e',
            fontSize: '0.88rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(244, 63, 94, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(244, 63, 94, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(244, 63, 94, 0.05)';
            e.currentTarget.style.borderColor = 'rgba(244, 63, 94, 0.15)';
          }}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>

      {/* Styling for hover button effect injected directly in styles */}
      <style>{`
        .hover-btn-glow:hover {
          background: rgba(255, 255, 255, 0.02) !important;
          color: hsl(var(--text-primary)) !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
          padding-left: 22px !important;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
