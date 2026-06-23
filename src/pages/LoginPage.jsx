import React, { useState } from 'react';
import { User, Lock, ArrowRight, ShieldCheck, HelpCircle, Eye, EyeOff, GraduationCap, BarChart3, Users2, UserCog, Key } from 'lucide-react';
import AdmasEmblem from '../components/AdmasEmblem';
import { useData } from '../context/DataContext';
import Modal from '../components/ui/Modal';

const ADMAS_LOGO = '/admas-logo.png';

const HIGHLIGHTS = [
  { icon: GraduationCap, title: 'Unified Academic Records', desc: 'Students, courses & results in one console.' },
  { icon: BarChart3, title: 'Real-time Analytics', desc: 'Live enrollment and performance insights.' },
  { icon: Users2, title: 'Role-based Access', desc: 'Admin & trainer portals, separate access.' },
];

const LoginPage = ({ onLogin }) => {
  const { users, trainerByUserId, meta, updateUserPassword } = useData();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Forgot password flow states
  const [forgotModal, setForgotModal] = useState(false);
  const [resetUsername, setResetUsername] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetError, setResetError] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const uname = username.trim().toLowerCase();
    if (!uname) { setError('Username cannot be empty.'); return; }
    if (!password) { setError('Password cannot be empty.'); return; }
    if (meta?.isLive && !meta?.dataReady) { setError('Still connecting to the live database — try again in a moment.'); return; }

    const account = users.find((u) => u.username.toLowerCase() === uname);
    if (!account) { setError('No account found for that username.'); return; }
    if (account.status === 'Inactive') { setError('This account is inactive. Contact the administrator.'); return; }
    
    // Check credentials (falls back to username, trainer ID, or staffNo as password)
    const expectedPassword = account.password || account.username;
    const isTrainer = account.role === 'Trainer';
    const trainer = isTrainer ? trainerByUserId(account.id) : null;

    let isValid = false;
    const enteredPwd = password.trim();

    if (enteredPwd === expectedPassword || enteredPwd.toLowerCase() === expectedPassword.toLowerCase()) {
      isValid = true;
    }
    
    if (!isValid && trainer) {
      if (trainer.id && (enteredPwd === trainer.id || enteredPwd.toLowerCase() === trainer.id.toLowerCase())) {
        isValid = true;
      }
      if (trainer.staffNo && (enteredPwd === trainer.staffNo || enteredPwd.toLowerCase() === trainer.staffNo.toLowerCase())) {
        isValid = true;
      }
    }

    if (!isValid) {
      setError('Incorrect password. Please contact administrator or use Forgot Password.'); return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const isTrainer = account.role === 'Trainer';
      const trainer = isTrainer ? trainerByUserId(account.id) : null;
      onLogin({
        userId: account.id,
        username: account.username,
        name: account.fullName,
        role: account.role === 'Admin' ? 'System Administrator' : account.role,
        portal: isTrainer ? 'trainer' : 'admin',
        trainerId: trainer?.id || null,
        departmentId: account.departmentId,
      });
    }, 900);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');

    const uname = resetUsername.trim().toLowerCase();
    const email = resetEmail.trim().toLowerCase();

    if (!uname || !email || !resetNewPassword) {
      setResetError('All fields are required.');
      return;
    }

    const account = users.find((u) => u.username.toLowerCase() === uname);
    if (!account) {
      setResetError('No account found for that username.');
      return;
    }

    if (!account.email || account.email.toLowerCase() !== email) {
      setResetError('Email address does not match this account.');
      return;
    }

    setIsResetting(true);
    const { error: resetErr } = await updateUserPassword(account.id, null, resetNewPassword);
    setIsResetting(false);

    if (resetErr) {
      setResetError(resetErr.message || 'Failed to update password.');
    } else {
      setResetSuccess('Password reset successfully. You can now log in with your new password.');
      setResetUsername('');
      setResetEmail('');
      setResetNewPassword('');
    }
  };



  return (
    <div className="login-shell">
      {/* Immersive animated background */}
      <div className="login-aurora">
        <div className="aurora-blob aurora-1" />
        <div className="aurora-blob aurora-2" />
        <div className="aurora-blob aurora-3" />
        <div className="login-grid" />
        <div className="login-watermark">
          <AdmasEmblem size={620} />
        </div>
        <div className="login-particles">
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} className={`particle p-${i}`} />
          ))}
        </div>
      </div>

      <div className="login-split animate-fade-in">
        {/* ============ Left: Immersive Brand Panel ============ */}
        <aside className="login-brand">
          <div className="brand-top">
            <div className="brand-logo-wrap">
              <span className="brand-logo-halo" />
              <span className="brand-logo-disc">
                <AdmasEmblem size={64} className="brand-logo-svg" />
                <img
                  src={ADMAS_LOGO}
                  alt="Admas University"
                  className="brand-logo-img"
                  onError={(e) => { e.currentTarget.remove(); }}
                />
              </span>
            </div>
            <div>
              <p className="brand-eyebrow">Established 1998</p>
              <h1 className="brand-title">ADMAS UNIVERSITY</h1>
            </div>
          </div>

          <div className="brand-mid">
            <h2 className="brand-headline">
              TVET Management <span className="text-gradient-teal">System</span>
            </h2>
            <p className="brand-sub">
              The central administrative console for managing academics, students and
              institutional operations — secure, fast and built for scale.
            </p>

            <ul className="brand-highlights">
              {HIGHLIGHTS.map(({ icon: Icon, title, desc }) => (
                <li key={title} className="brand-highlight">
                  <span className="brand-highlight-icon">
                    <Icon size={18} />
                  </span>
                  <span>
                    <strong>{title}</strong>
                    <small>{desc}</small>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="brand-foot">
            <span className="brand-status">
              <span className="brand-status-dot" /> Systems operational
            </span>
            <span>ATMS · v2.0</span>
          </div>
        </aside>

        {/* ============ Right: Login Form ============ */}
        <main className="login-form-panel">
          <div className="login-form-inner">
            <div className="form-badge">
              <ShieldCheck size={13} color="hsl(var(--accent-teal))" /> Administrator Console
            </div>

            <h2 className="form-title">Welcome back</h2>
            <p className="form-desc">
              Enter your credentials to access the central console. Your password is your username.
            </p>
            {meta?.isLive && !meta?.dataReady && (
              <div className="badge badge-info login-error" style={{ marginBottom: 14 }}>
                Connecting to live database…
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              {/* Username */}
              <div className="input-group">
                <label className="input-label" htmlFor="username">Admin Username / ID Code</label>
                <div className="input-wrap">
                  <User size={16} className="input-icon" />
                  <input
                    id="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="enter username"
                    className="input-field has-icon"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="input-group">
                <div className="input-label-row">
                  <label className="input-label" htmlFor="password">Security Password</label>
                  <button type="button" onClick={() => { setForgotModal(true); setResetError(''); setResetSuccess(''); }} className="forgot-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Forgot?</button>
                </div>
                <div className="input-wrap">
                  <Lock size={16} className="input-icon" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field has-icon has-trailing"
                  />
                  <button
                    type="button"
                    className="input-trailing-btn"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="badge badge-danger login-error">{error}</div>
              )}

              {/* Submit Button */}
              <button type="submit" className="btn-primary login-submit" disabled={isLoading || (meta?.isLive && !meta?.dataReady)}>
                {isLoading ? (
                  <span className="btn-inline">
                    <svg width="18" height="18" viewBox="0 0 38 38" stroke="currentColor" className="spin">
                      <g fill="none" fillRule="evenodd">
                        <g transform="translate(1 1)" strokeWidth="3">
                          <circle strokeOpacity=".3" cx="18" cy="18" r="18" />
                          <path d="M36 18c0-9.94-8.06-18-18-18" />
                        </g>
                      </g>
                    </svg>
                    Authorizing...
                  </span>
                ) : (
                  <span className="btn-inline">
                    Secure Login
                    <ArrowRight size={16} />
                  </span>
                )}
              </button>
            </form>



            <div className="login-form-footer">
              <span className="footer-item">
                <ShieldCheck size={12} color="hsl(var(--accent-teal))" /> TLS Encrypted
              </span>
              <span>•</span>
              <span className="footer-item footer-link">
                <HelpCircle size={12} /> Contact IT Helpdesk
              </span>
            </div>
          </div>
        </main>
      </div>

      <Modal open={forgotModal} onClose={() => setForgotModal(false)} title="Reset Password" icon={Key}>
        <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', margin: 0 }}>
            Verify your account details to set a new security password.
          </p>
          
          <div className="input-group">
            <label className="input-label" htmlFor="reset-uname">Username / ID Code</label>
            <input
              id="reset-uname"
              type="text"
              required
              className="input-field"
              placeholder="e.g. b.abayu"
              value={resetUsername}
              onChange={(e) => setResetUsername(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="reset-email">Registered Email</label>
            <input
              id="reset-email"
              type="email"
              required
              className="input-field"
              placeholder="e.g. biniam.abayu@admas.edu.et"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="reset-pass">New Password</label>
            <input
              id="reset-pass"
              type="password"
              required
              className="input-field"
              placeholder="••••••••"
              value={resetNewPassword}
              onChange={(e) => setResetNewPassword(e.target.value)}
            />
          </div>

          {resetError && <div className="badge badge-danger login-error" style={{ fontSize: '0.8rem', padding: '8px' }}>{resetError}</div>}
          {resetSuccess && <div className="badge badge-success" style={{ fontSize: '0.8rem', padding: '8px', color: '#10b981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>{resetSuccess}</div>}

          <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
            <button type="button" className="btn-secondary" style={{ flex: 1, padding: '11px' }} onClick={() => setForgotModal(false)}>Close</button>
            <button type="submit" className="btn-primary" style={{ flex: 1, padding: '11px' }} disabled={isResetting}>{isResetting ? 'Updating…' : 'Reset Password'}</button>
          </div>
        </form>
      </Modal>

      <style>{`
        .login-shell {
          width: 100%;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          position: relative;
          background:
            radial-gradient(ellipse 120% 90% at 15% 0%, rgba(0,229,255,0.10) 0%, transparent 45%),
            radial-gradient(ellipse 110% 90% at 100% 100%, rgba(20,184,166,0.12) 0%, transparent 50%),
            radial-gradient(ellipse 80% 80% at 50% 120%, rgba(37,99,235,0.10) 0%, transparent 55%),
            linear-gradient(160deg, #0b1320 0%, hsl(var(--bg-obsidian)) 55%, #060a12 100%);
          overflow: hidden;
        }
        /* vignette + film grain for depth */
        .login-shell::after {
          content: '';
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 100% 100% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%);
        }

        /* ---- Immersive animated background ---- */
        .login-aurora {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .aurora-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(130px);
          opacity: 0.5;
          mix-blend-mode: screen;
        }
        .aurora-1 {
          width: 46vw; height: 46vw;
          top: -12%; left: -6%;
          background: radial-gradient(circle, hsl(var(--accent-cyan)) 0%, transparent 70%);
          animation: drift1 18s ease-in-out infinite;
        }
        .aurora-2 {
          width: 40vw; height: 40vw;
          bottom: -14%; right: -8%;
          background: radial-gradient(circle, hsl(var(--accent-teal)) 0%, transparent 70%);
          animation: drift2 22s ease-in-out infinite;
        }
        .aurora-3 {
          width: 32vw; height: 32vw;
          top: 35%; left: 45%;
          background: radial-gradient(circle, #2563eb 0%, transparent 70%);
          opacity: 0.32;
          animation: drift3 26s ease-in-out infinite;
        }
        .login-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 54px 54px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 40%, #000 30%, transparent 75%);
          -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 40%, #000 30%, transparent 75%);
        }
        @keyframes drift1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(6%,8%)} }
        @keyframes drift2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-7%,-6%)} }
        @keyframes drift3 { 0%,100%{transform:translate(-50%,0)} 50%{transform:translate(-40%,-10%)} }

        /* Giant faint emblem watermark */
        .login-watermark {
          position: absolute;
          top: 50%; right: -120px;
          transform: translateY(-50%);
          opacity: 0.05;
          filter: grayscale(1) brightness(2);
          animation: spinSlow 90s linear infinite;
          pointer-events: none;
        }
        @keyframes spinSlow { from { transform: translateY(-50%) rotate(0deg);} to { transform: translateY(-50%) rotate(360deg);} }

        /* Floating particles */
        .login-particles { position: absolute; inset: 0; }
        .particle {
          position: absolute;
          width: 4px; height: 4px; border-radius: 50%;
          background: hsl(var(--accent-cyan));
          box-shadow: 0 0 8px hsl(var(--accent-cyan));
          opacity: 0.35;
          animation: floatUp linear infinite;
        }
        @keyframes floatUp {
          0% { transform: translateY(20px); opacity: 0; }
          10% { opacity: 0.45; }
          90% { opacity: 0.45; }
          100% { transform: translateY(-110vh); opacity: 0; }
        }
        .p-0 { left: 6%;  animation-duration: 19s; animation-delay: 0s;  bottom: -10px; }
        .p-1 { left: 14%; animation-duration: 24s; animation-delay: 3s;  bottom: -10px; width:3px;height:3px; }
        .p-2 { left: 22%; animation-duration: 17s; animation-delay: 6s;  bottom: -10px; background: hsl(var(--accent-teal)); box-shadow:0 0 8px hsl(var(--accent-teal)); }
        .p-3 { left: 31%; animation-duration: 28s; animation-delay: 1s;  bottom: -10px; }
        .p-4 { left: 39%; animation-duration: 21s; animation-delay: 9s;  bottom: -10px; width:5px;height:5px; }
        .p-5 { left: 47%; animation-duration: 26s; animation-delay: 4s;  bottom: -10px; background: hsl(var(--accent-teal)); box-shadow:0 0 8px hsl(var(--accent-teal)); }
        .p-6 { left: 55%; animation-duration: 18s; animation-delay: 7s;  bottom: -10px; }
        .p-7 { left: 63%; animation-duration: 23s; animation-delay: 2s;  bottom: -10px; width:3px;height:3px; }
        .p-8 { left: 70%; animation-duration: 30s; animation-delay: 11s; bottom: -10px; }
        .p-9 { left: 77%; animation-duration: 20s; animation-delay: 5s;  bottom: -10px; background: hsl(var(--accent-teal)); box-shadow:0 0 8px hsl(var(--accent-teal)); }
        .p-10{ left: 84%; animation-duration: 25s; animation-delay: 8s;  bottom: -10px; width:5px;height:5px; }
        .p-11{ left: 90%; animation-duration: 22s; animation-delay: 0s;  bottom: -10px; }
        .p-12{ left: 95%; animation-duration: 27s; animation-delay: 6s;  bottom: -10px; width:3px;height:3px; }
        .p-13{ left: 2%;  animation-duration: 24s; animation-delay: 10s; bottom: -10px; }

        @media (prefers-reduced-motion: reduce) {
          .aurora-blob, .login-watermark, .particle, .brand-logo-halo, .brand-status-dot { animation: none !important; }
        }

        /* ---- Split layout ---- */
        .login-split {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 1040px;
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          background: rgba(13, 14, 19, 0.55);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 28px;
          box-shadow: 0 24px 80px rgba(0,0,0,0.6), 0 0 60px rgba(0,229,255,0.04);
          overflow: hidden;
        }

        /* ---- Brand panel ---- */
        .login-brand {
          position: relative;
          padding: 44px 40px;
          display: flex;
          flex-direction: column;
          gap: 28px;
          background:
            linear-gradient(155deg, rgba(0,229,255,0.07) 0%, rgba(20,184,166,0.04) 40%, transparent 80%),
            linear-gradient(135deg, rgba(27,28,36,0.7) 0%, rgba(9,10,15,0.85) 100%);
          border-right: 1px solid rgba(255,255,255,0.06);
        }
        .brand-top { display: flex; align-items: center; gap: 16px; }
        .brand-logo-wrap { position: relative; flex-shrink: 0; }
        .brand-logo-halo {
          position: absolute; inset: -8px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,229,255,0.45) 0%, transparent 70%);
          filter: blur(14px);
          animation: pulseGlow 3.5s ease-in-out infinite;
        }
        .brand-logo-disc {
          position: relative;
          display: inline-flex;
          width: 64px; height: 64px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.12), 0 8px 24px rgba(0,0,0,0.45);
        }
        .brand-logo-svg { border-radius: 50%; }
        .brand-logo-img {
          position: absolute; inset: 0;
          width: 64px; height: 64px;
          border-radius: 50%;
          object-fit: cover;
          background: #fff;
        }
        .brand-eyebrow {
          font-size: 0.7rem; font-weight: 600; letter-spacing: 0.14em;
          text-transform: uppercase; color: hsl(var(--accent-cyan)); margin-bottom: 4px;
        }
        .brand-title {
          font-size: 1.45rem; font-weight: 800; line-height: 1; letter-spacing: -0.01em;
        }
        .brand-mid { flex: 1; }
        .brand-headline {
          font-size: 2rem; font-weight: 800; line-height: 1.12; margin-bottom: 14px;
        }
        .brand-sub {
          color: hsl(var(--text-secondary)); font-size: 0.92rem; line-height: 1.6;
          max-width: 38ch; margin-bottom: 28px;
        }
        .brand-highlights { list-style: none; display: flex; flex-direction: column; gap: 16px; }
        .brand-highlight { display: flex; align-items: flex-start; gap: 14px; }
        .brand-highlight-icon {
          flex-shrink: 0;
          width: 38px; height: 38px; border-radius: 11px;
          display: inline-flex; align-items: center; justify-content: center;
          color: hsl(var(--accent-cyan));
          background: rgba(0,229,255,0.08);
          border: 1px solid rgba(0,229,255,0.16);
        }
        .brand-highlight strong { display: block; font-size: 0.9rem; font-weight: 600; color: hsl(var(--text-primary)); }
        .brand-highlight small { display: block; font-size: 0.8rem; color: hsl(var(--text-muted)); margin-top: 2px; }
        .brand-foot {
          display: flex; align-items: center; justify-content: space-between;
          font-size: 0.78rem; color: hsl(var(--text-muted));
          padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.06);
        }
        .brand-status { display: inline-flex; align-items: center; gap: 7px; color: hsl(var(--accent-emerald)); }
        .brand-status-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: hsl(var(--accent-emerald));
          box-shadow: 0 0 8px hsl(var(--accent-emerald));
          animation: pulseGlow 2s ease-in-out infinite;
        }

        /* ---- Form panel ---- */
        .login-form-panel {
          padding: 44px 40px;
          display: flex; align-items: center;
        }
        .login-form-inner { width: 100%; }
        .form-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 12px; border-radius: 30px;
          font-size: 0.74rem; font-weight: 600; letter-spacing: 0.02em;
          color: hsl(var(--text-secondary));
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          margin-bottom: 22px;
        }
        .form-title { font-size: 1.7rem; font-weight: 800; margin-bottom: 8px; }
        .form-desc { color: hsl(var(--text-muted)); font-size: 0.85rem; line-height: 1.55; margin-bottom: 26px; }
        .login-form { display: flex; flex-direction: column; gap: 18px; }
        .input-label-row { display: flex; align-items: center; justify-content: space-between; }
        .forgot-link {
          font-size: 0.78rem; color: hsl(var(--accent-cyan));
          text-decoration: none; font-weight: 500;
        }
        .forgot-link:hover { text-decoration: underline; }
        .input-wrap { position: relative; display: flex; align-items: center; }
        .input-icon {
          position: absolute; left: 16px; color: hsl(var(--text-muted));
          pointer-events: none;
        }
        .input-field.has-icon { padding-left: 44px; }
        .input-field.has-trailing { padding-right: 44px; }
        .input-trailing-btn {
          position: absolute; right: 8px;
          display: inline-flex; align-items: center; justify-content: center;
          width: 30px; height: 30px; border-radius: 8px;
          background: transparent; border: none; cursor: pointer;
          color: hsl(var(--text-muted)); transition: var(--transition-fast);
        }
        .input-trailing-btn:hover { color: hsl(var(--text-primary)); background: rgba(255,255,255,0.06); }
        .login-error { padding: 9px 12px; border-radius: 8px; font-size: 0.8rem; }
        .login-submit { position: relative; overflow: hidden; margin-top: 4px; }
        .btn-inline { display: flex; align-items: center; gap: 8px; }
        .spin { animation: spin 1s linear infinite; }
        .login-demo {
          margin-top: 18px;
          padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .login-demo-label {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: hsl(var(--text-muted));
          margin-bottom: 10px;
        }
        .login-demo-row { display: flex; gap: 10px; }
        .login-demo-btn {
          flex: 1;
          display: inline-flex; align-items: center; justify-content: center; gap: 7px;
          padding: 9px 12px; border-radius: 10px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          color: hsl(var(--text-secondary));
          font-size: 0.8rem; font-weight: 600; cursor: pointer;
          transition: var(--transition-fast);
        }
        .login-demo-btn:hover {
          border-color: hsl(var(--accent-cyan));
          color: hsl(var(--accent-cyan));
          background: rgba(0,229,255,0.06);
        }
        .login-form-footer {
          display: flex; align-items: center; justify-content: center; gap: 14px;
          margin-top: 26px; font-size: 0.78rem; color: hsl(var(--text-muted));
        }
        .footer-item { display: flex; align-items: center; gap: 5px; }
        .footer-link { cursor: pointer; }
        .footer-link:hover { color: hsl(var(--text-secondary)); }

        @keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }

        /* ---- Responsive ---- */
        @media (max-width: 860px) {
          .login-split { grid-template-columns: 1fr; max-width: 460px; }
          .login-brand { display: none; }
          .login-form-panel { padding: 36px 28px; }
        }
        @media (max-width: 480px) {
          .login-shell { padding: 14px; }
          .login-form-panel { padding: 30px 22px; }
          .form-title { font-size: 1.45rem; }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
