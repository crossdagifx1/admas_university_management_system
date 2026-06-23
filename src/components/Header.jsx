import React, { useState } from 'react';
import { Bell, Calendar, Check, CircleAlert } from 'lucide-react';
import { useData } from '../context/DataContext';

const SEED_NOTES = [
  { id: 'seed-1', text: "Room LAB-1 schedule conflict detected", time: "1 hour ago", type: "warning", read: false },
  { id: 'seed-2', text: "Monthly activity report generated", time: "4 hours ago", type: "success", read: false },
];

const Header = ({ title, subtitle, user }) => {
  const { notifications: liveNotes, markNotificationsRead } = useData();
  const [showNotifications, setShowNotifications] = useState(false);
  const [seedRead, setSeedRead] = useState(false);

  // Live trainer-submission notifications stack on top of the seed items.
  const seed = SEED_NOTES.map((n) => ({ ...n, read: n.read || seedRead }));
  const notifications = [...liveNotes, ...seed];
  const hasUnread = notifications.some(n => !n.read);

  const markAllRead = () => {
    markNotificationsRead();
    setSeedRead(true);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <Check size={14} color="hsl(var(--accent-emerald))" />;
      case 'warning':
        return <CircleAlert size={14} color="hsl(var(--accent-gold))" />;
      default:
        return <Check size={14} color="hsl(var(--accent-cyan))" />;
    }
  };

  return (
    <header 
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 0',
        marginBottom: '24px',
        position: 'relative'
      }}
    >
      {/* Greetings */}
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0, letterSpacing: '-0.02em' }}>
          {title}
        </h1>
        <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.88rem', marginTop: '4px' }}>
          {subtitle || <>Welcome back, <span style={{ color: 'hsl(var(--accent-cyan))', fontWeight: '500' }}>{user?.name || 'Admin'}</span>.</>}
        </p>
      </div>

      {/* Quick Utilities */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Calendar / Date Widget */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            color: 'hsl(var(--text-secondary))',
            fontSize: '0.85rem',
            height: '44px'
          }}
        >
          <Calendar size={15} color="hsl(var(--accent-teal))" />
          <span>June 16, 2026</span>
        </div>

        {/* Notifications Popover Trigger */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: showNotifications ? 'rgba(0, 229, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
              border: '1px solid',
              borderColor: showNotifications ? 'hsl(var(--accent-cyan))' : 'rgba(255, 255, 255, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: showNotifications ? 'hsl(var(--accent-cyan))' : 'hsl(var(--text-primary))',
              position: 'relative',
              transition: 'all 0.25s'
            }}
          >
            <Bell size={18} />
            {hasUnread && (
              <span 
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#f43f5e',
                  boxShadow: '0 0 10px #f43f5e'
                }}
              />
            )}
          </button>

          {/* Notifications Dropdown menu */}
          {showNotifications && (
            <div 
              className="glass-panel"
              style={{
                position: 'absolute',
                top: '56px',
                right: 0,
                width: '320px',
                padding: '16px',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                zIndex: 100,
                boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
                animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '14px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  paddingBottom: '8px'
                }}
              >
                <h4 style={{ fontSize: '0.9rem', fontWeight: '700' }}>Notifications</h4>
                {hasUnread && (
                  <button 
                    onClick={markAllRead}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: 'hsl(var(--accent-cyan))', 
                      fontSize: '0.75rem', 
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      padding: '10px',
                      borderRadius: '8px',
                      background: notif.read ? 'transparent' : 'rgba(255,255,255,0.02)',
                      borderLeft: notif.read ? 'none' : '3px solid hsl(var(--accent-cyan))',
                      fontSize: '0.8rem',
                      alignItems: 'flex-start'
                    }}
                  >
                    <div 
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.03)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      {getNotificationIcon(notif.type)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: notif.read ? 'hsl(var(--text-secondary))' : 'hsl(var(--text-primary))', fontWeight: notif.read ? '400' : '500', lineHeight: 1.3 }}>
                        {notif.text}
                      </p>
                      <span style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))', marginTop: '4px', display: 'inline-block' }}>
                        {notif.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
