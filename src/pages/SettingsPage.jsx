import React, { useState } from 'react';
import { 
  Database, 
  ShieldAlert, 
  ToggleLeft, 
  ToggleRight, 
  Save, 
  Sparkles, 
  Layers, 
  Terminal,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import GlassCard from '../components/GlassCard';

const SettingsPage = () => {
  const [semester, setSemester] = useState('2026_Fall');
  const [selfRegistration, setSelfRegistration] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [systemLogs, setSystemLogs] = useState(true);
  
  // Backups states
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupMessage, setBackupMessage] = useState('');

  // Accent customizable state
  const [accent, setAccent] = useState('cyan'); // 'cyan', 'teal', 'gold', 'emerald'

  const handleBackup = () => {
    setIsBackingUp(true);
    setBackupMessage('');
    setTimeout(() => {
      setIsBackingUp(false);
      setBackupMessage('Backup schema SQL_DUMP_20260616.tar.gz created successfully.');
    }, 1800);
  };

  const handleSaveConfigs = () => {
    alert("University System settings saved successfully to configuration server!");
  };

  // Change CSS variable accents locally
  const changeAccent = (color) => {
    setAccent(color);
    let hslVal = '187 100% 50%'; // default cyan
    if (color === 'teal') hslVal = '174 86% 45%';
    if (color === 'gold') hslVal = '48 89% 50%';
    if (color === 'emerald') hslVal = '150 84% 53%';
    
    document.documentElement.style.setProperty('--accent-cyan', hslVal);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
        
        {/* Core Administrative settings */}
        <GlassCard hoverEffect={false}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '12px' }}>
            <Layers size={18} color="hsl(var(--accent-cyan))" />
            <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Academic & Term Control</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Semester Select */}
            <div className="input-group">
              <label className="input-label">Current Academic Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="input-field"
              >
                <option value="2026_Spring">2026 Spring Semester</option>
                <option value="2026_Fall">2026 Fall Semester (Active)</option>
                <option value="2027_Spring">2027 Spring Semester (Planning)</option>
              </select>
            </div>

            {/* Self-Registration Toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px' }}>
              <div>
                <span style={{ fontSize: '0.88rem', fontWeight: '600', display: 'block', color: 'hsl(var(--text-primary))' }}>
                  Student Self-Registration
                </span>
                <span style={{ fontSize: '0.78rem', color: 'hsl(var(--text-muted))' }}>
                  Allows students to register for courses via portal.
                </span>
              </div>
              <button
                onClick={() => setSelfRegistration(!selfRegistration)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: selfRegistration ? 'hsl(var(--accent-cyan))' : 'hsl(var(--text-muted))' }}
              >
                {selfRegistration ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
              </button>
            </div>

            {/* Maintenance Mode Toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px' }}>
              <div>
                <span style={{ fontSize: '0.88rem', fontWeight: '600', display: 'block', color: 'hsl(var(--text-primary))' }}>
                  Institutional Maintenance Lockout
                </span>
                <span style={{ fontSize: '0.78rem', color: 'hsl(var(--text-muted))' }}>
                  Places student portals under offline maintenance.
                </span>
              </div>
              <button
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: maintenanceMode ? '#f43f5e' : 'hsl(var(--text-muted))' }}
              >
                {maintenanceMode ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
              </button>
            </div>

            <button 
              onClick={handleSaveConfigs}
              className="btn-primary"
              style={{ marginTop: '8px' }}
            >
              <Save size={16} />
              Save Configurations
            </button>
          </div>
        </GlassCard>

        {/* Database & Security Operations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* DB backup */}
          <GlassCard hoverEffect={false}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '12px' }}>
              <Database size={18} color="hsl(var(--accent-teal))" />
              <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>System Data Backups</h3>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))', lineHeight: 1.45, marginBottom: '20px' }}>
              Execute backup dumps of student directories, faculty indices, and database transaction histories. Storage backups will be pushed to the secure institutional S3 storage.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={handleBackup}
                disabled={isBackingUp}
                className="btn-secondary"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                {isBackingUp ? (
                  <>
                    <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} />
                    Generating Storage Dump...
                  </>
                ) : (
                  <>
                    <Database size={14} />
                    Run System Backup Now
                  </>
                )}
              </button>

              {backupMessage && (
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px',
                    borderRadius: '8px',
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.15)',
                    color: 'hsl(var(--accent-emerald))',
                    fontSize: '0.8rem',
                    lineHeight: 1.3
                  }}
                >
                  <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
                  <span>{backupMessage}</span>
                </div>
              )}
            </div>
          </GlassCard>

          {/* Accent customization widget */}
          <GlassCard hoverEffect={false}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '12px' }}>
              <Sparkles size={18} color="hsl(var(--accent-gold))" />
              <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Portal Theme Accent</h3>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))', marginBottom: '16px' }}>
              Customize administrative highlight accents. Change applies instantly across global portal interfaces.
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => changeAccent('cyan')}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '10px',
                  border: '1.5px solid',
                  borderColor: accent === 'cyan' ? '#00e5ff' : 'rgba(255,255,255,0.05)',
                  background: 'rgba(0, 229, 255, 0.05)',
                  color: '#00e5ff',
                  fontWeight: '600',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)'
                }}
              >
                Cyan
              </button>
              <button
                onClick={() => changeAccent('teal')}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '10px',
                  border: '1.5px solid',
                  borderColor: accent === 'teal' ? '#14b8a6' : 'rgba(255,255,255,0.05)',
                  background: 'rgba(20, 184, 166, 0.05)',
                  color: '#14b8a6',
                  fontWeight: '600',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)'
                }}
              >
                Teal
              </button>
              <button
                onClick={() => changeAccent('gold')}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '10px',
                  border: '1.5px solid',
                  borderColor: accent === 'gold' ? '#eab308' : 'rgba(255,255,255,0.05)',
                  background: 'rgba(234, 179, 8, 0.05)',
                  color: '#eab308',
                  fontWeight: '600',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)'
                }}
              >
                Gold
              </button>
              <button
                onClick={() => changeAccent('emerald')}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '10px',
                  border: '1.5px solid',
                  borderColor: accent === 'emerald' ? '#10b981' : 'rgba(255,255,255,0.05)',
                  background: 'rgba(16, 185, 129, 0.05)',
                  color: '#10b981',
                  fontWeight: '600',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)'
                }}
              >
                Emerald
              </button>
            </div>
          </GlassCard>

        </div>

      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SettingsPage;
