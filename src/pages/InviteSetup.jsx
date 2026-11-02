import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../lib/api';

export default function InviteSetup() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const token = sessionStorage.getItem('portfolio_invite_token');

  async function submit(event) {
    event.preventDefault();
    setError('');
    if (password.length < 12) return setError('Use at least 12 characters.');
    if (password !== confirm) return setError('Passwords do not match.');
    setBusy(true);
    try {
      await apiFetch('/auth/accept-invite', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ password }),
      });
      sessionStorage.removeItem('portfolio_invite_token');
      navigate('/admin', { replace: true, state: { notice: 'Password set. Sign in with your email and new password.' } });
    } catch (cause) {
      setError(cause.message || 'Could not set the password.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="max-w-xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold text-theme-text mb-4">Set your admin password</h1>
      {!token ? (
        <p className="text-theme-muted">This invitation link is missing or has expired. Open the link from your Supabase invitation email, or ask for a new invitation. <Link className="text-theme-accent underline" to="/admin">Return to admin</Link></p>
      ) : (
        <form onSubmit={submit} className="space-y-5">
          <p className="text-theme-muted">Choose a password for your portfolio admin account. Your password is sent securely to Supabase and is never stored in the portfolio content database.</p>
          <label className="block text-sm">New password
            <input className="mt-2 w-full rounded border border-theme-border bg-theme-bg p-3" type="password" autoComplete="new-password" minLength={12} required value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <label className="block text-sm">Confirm password
            <input className="mt-2 w-full rounded border border-theme-border bg-theme-bg p-3" type="password" autoComplete="new-password" minLength={12} required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </label>
          {error && <p role="alert" className="text-red-500 text-sm">{error}</p>}
          <button disabled={busy} className="rounded-full bg-theme-accent px-6 py-3 text-white disabled:opacity-60">{busy ? 'Saving…' : 'Set password'}</button>
        </form>
      )}
    </section>
  );
}
