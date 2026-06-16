import React, { useState } from 'react';
import { BookOpen, User, Lock, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('admin_cross');
  const [password, setPassword] = useState('••••••••');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Verification check for admin credentials
    if (username.trim() === '') {
      setError('Username cannot be empty.');
      return;
    }

    setIsLoading(true);

    // Simulate network delay for premium experience
    setTimeout(() => {
      setIsLoading(false);
      
      onLogin({
        username,
        name: 'Dagmawi Amare',
        role: 'Super Admin'
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
            Admin Secure Access
          </h2>
          <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.82rem', marginBottom: '24px' }}>
            Enter your administrator authorization credentials to access the central console.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Username */}
            <div className="input-group">
              <label className="input-label" htmlFor="username">Admin Username / ID Code</label>
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
              <div style={{ display: 'flex', justifycontent: 'space-between', alignItems: 'center' }}>
                <label className="input-label" htmlFor="password">Security Password</label>
                <a href="#reset" style={{ fontSize: '0.78rem', color: 'hsl(var(--accent-cyan))', textDecoration: 'none', fontWeight: '500', marginLeft: 'auto' }}>Forgot?</a>
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
                  Secure Admin Login
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
