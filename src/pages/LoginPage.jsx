import React, { useState } from 'react';
import { BookOpen, User, Lock, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const LoginPage = ({ onLogin }) => {
  const [role, setRole] = useState('admin'); // 'admin', 'registrar', 'instructor', 'student'
  const [username, setUsername] = useState('admin_cross');
  const [password, setPassword] = useState('••••••••');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle auto-population of fields based on role switch
  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setError('');
    switch (selectedRole) {
      case 'admin':
        setUsername('admin_cross');
        setPassword('••••••••');
        break;
      case 'registrar':
        setUsername('registrar_dagi');
        setPassword('••••••••');
        break;
      case 'instructor':
        setUsername('prof_dagmawi');
        setPassword('••••••••');
        break;
      case 'student':
        setUsername('student_admas');
        setPassword('••••••••');
        break;
      default:
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay for premium experience
    setTimeout(() => {
      setIsLoading(false);
      
      let displayName = 'Administrator';
      let mappedRole = 'Super Admin';

      if (role === 'admin') {
        displayName = 'Dagmawi Amare';
        mappedRole = 'Super Admin';
      } else if (role === 'registrar') {
        displayName = 'Abebe Bikila';
        mappedRole = 'Registrar Head';
      } else if (role === 'instructor') {
        displayName = 'Dr. Yosef Kebede';
        mappedRole = 'Senior Professor';
      } else {
        displayName = 'Helen Girma';
        mappedRole = 'CS Student';
      }

      onLogin({
        username,
        name: displayName,
        role: mappedRole
      });
    }, 1200);
  };

  return (
    <div 
      style={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        background: 'hsl(var(--bg-obsidian))',
        overflow: 'hidden'
      }}
    >
      {/* Background Glows */}
      <div className="glow-bg">
        <div className="glow-circle glow-1"></div>
        <div className="glow-circle glow-2"></div>
      </div>

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '480px' }} className="animate-fade-in">
        {/* Logo / Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div 
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, hsl(var(--accent-teal)) 0%, hsl(var(--accent-cyan)) 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              boxShadow: '0 0 25px rgba(0, 229, 255, 0.25)',
            }}
          >
            <BookOpen size={28} color="#090a0f" strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', lineHeight: 1.1, marginBottom: '6px' }}>
            ADMAS UNIVERSITY
          </h1>
          <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.9rem', fontWeight: '500' }}>
            Management Portal & System Administration
          </p>
        </div>

        {/* Login Box */}
        <GlassCard hoverEffect={false}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '10px' }}>
            Access Account
          </h2>
          <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.82rem', marginBottom: '24px' }}>
            Please select your role and enter your secure access credentials.
          </p>

          {/* Role Pills Selectors */}
          <div style={{ marginBottom: '24px' }}>
            <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))', fontWeight: '600', display: 'block', marginBottom: '10px' }}>
              Select Portal Role
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              <button 
                type="button" 
                onClick={() => handleRoleChange('admin')}
                className={`role-pill ${role === 'admin' ? 'active' : ''}`}
                style={{ justifyContent: 'center' }}
              >
                Super Admin
              </button>
              <button 
                type="button" 
                onClick={() => handleRoleChange('registrar')}
                className={`role-pill ${role === 'registrar' ? 'active' : ''}`}
                style={{ justifyContent: 'center' }}
              >
                Registrar
              </button>
              <button 
                type="button" 
                onClick={() => handleRoleChange('instructor')}
                className={`role-pill ${role === 'instructor' ? 'active' : ''}`}
                style={{ justifyContent: 'center' }}
              >
                Instructor
              </button>
              <button 
                type="button" 
                onClick={() => handleRoleChange('student')}
                className={`role-pill ${role === 'student' ? 'active' : ''}`}
                style={{ justifyContent: 'center' }}
              >
                Student
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Username */}
            <div className="input-group">
              <label className="input-label" htmlFor="username">Username / ID Code</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="enter username"
                  className="input-field"
                  style={{ paddingLeft: '44px' }}
                />
                <User size={16} color="hsl(var(--text-muted))" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            {/* Password */}
            <div className="input-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="input-label" htmlFor="password">Security Password</label>
                <a href="#reset" style={{ fontSize: '0.78rem', color: 'hsl(var(--accent-cyan))', textDecoration: 'none', fontWeight: '500' }}>Forgot?</a>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field"
                  style={{ paddingLeft: '44px' }}
                />
                <Lock size={16} color="hsl(var(--text-muted))" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="badge badge-danger" style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem' }}>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isLoading}
              style={{ position: 'relative', overflow: 'hidden' }}
            >
              {isLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <svg width="18" height="18" viewBox="0 0 38 38" stroke="currentColor" style={{ animation: 'spin 1s linear infinite' }}>
                    <g fill="none" fillRule="evenodd">
                      <g transform="translate(1 1)" strokeWidth="3">
                        <circle strokeOpacity=".3" cx="18" cy="18" r="18"/>
                        <path d="M36 18c0-9.94-8.06-18-18-18" />
                      </g>
                    </g>
                  </svg>
                  Authorizing...
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Secure Portal Login
                  <ArrowRight size={16} />
                </span>
              )}
            </button>
          </form>
        </GlassCard>

        {/* Footer Info */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '24px', fontSize: '0.78rem', color: 'hsl(var(--text-muted))' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={12} color="hsl(var(--accent-teal))" /> TLS Encrypted
          </span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
            <HelpCircle size={12} /> Contact IT Helpdesk
          </span>
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

export default LoginPage;
