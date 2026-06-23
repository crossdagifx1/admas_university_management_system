import React, { useState } from 'react';
import { ShieldCheck, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import GlassCard from '../../components/GlassCard';
import { useData } from '../../context/DataContext';

const TrainerSettings = ({ user }) => {
  const { updateUserPassword } = useData();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword) {
      setError('Please enter your current password.');
      return;
    }

    if (!newPassword) {
      setError('Please enter a new password.');
      return;
    }

    if (newPassword.length < 4) {
      setError('New password must be at least 4 characters long.');
      return;
    }

    if (newPassword === currentPassword) {
      setError('New password cannot be the same as your current password.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password confirmation does not match.');
      return;
    }

    setSaving(true);
    try {
      const { error: updateErr } = await updateUserPassword(user.userId, currentPassword, newPassword);
      if (updateErr) {
        setError(updateErr.message || 'Failed to update password.');
      } else {
        setSuccess('Your security password has been changed successfully.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      console.error('[ATMS] settings update failed', err);
      setError('An unexpected error occurred.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '620px' }}>
      <PageHeader
        icon={ShieldCheck}
        title="Security Settings"
        subtitle="Manage your trainer portal account credentials"
      />

      <GlassCard hoverEffect={false} style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px', padding: '6px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.16)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'hsl(var(--accent-cyan))' }}>
              <Lock size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: 0 }}>Change Security Password</h3>
              <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))', margin: 0 }}>Update the password code used to access your portal</p>
            </div>
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', borderRadius: '8px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', color: 'hsl(var(--accent-rose))', fontSize: '0.85rem' }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', borderRadius: '8px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: 'hsl(var(--accent-emerald))', fontSize: '0.85rem' }}>
              <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
              <span>{success}</span>
            </div>
          )}

          {/* Current Password */}
          <div className="input-group">
            <label className="input-label" htmlFor="curr-pass">Current Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                id="curr-pass"
                type={showCurrent ? 'text' : 'password'}
                required
                className="input-field"
                style={{ paddingRight: '40px' }}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
              <button
                type="button"
                style={{ position: 'absolute', right: '8px', background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(var(--text-muted))', padding: '6px' }}
                onClick={() => setShowCurrent(!showCurrent)}
                aria-label={showCurrent ? 'Hide password' : 'Show password'}
              >
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="input-group">
            <label className="input-label" htmlFor="new-pass">New Security Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                id="new-pass"
                type={showNew ? 'text' : 'password'}
                required
                className="input-field"
                style={{ paddingRight: '40px' }}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 4 characters"
              />
              <button
                type="button"
                style={{ position: 'absolute', right: '8px', background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(var(--text-muted))', padding: '6px' }}
                onClick={() => setShowNew(!showNew)}
                aria-label={showNew ? 'Hide password' : 'Show password'}
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="input-group">
            <label className="input-label" htmlFor="confirm-pass">Confirm New Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                id="confirm-pass"
                type={showConfirm ? 'text' : 'password'}
                required
                className="input-field"
                style={{ paddingRight: '40px' }}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
              />
              <button
                type="button"
                style={{ position: 'absolute', right: '8px', background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(var(--text-muted))', padding: '6px' }}
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
            <button
              type="submit"
              className="btn-primary"
              style={{ width: 'auto', padding: '10px 24px', borderRadius: '10px' }}
              disabled={saving}
            >
              {saving ? 'Updating Password…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};

export default TrainerSettings;
