'use client';

import { useState } from 'react';
import { BrandLogo } from '@/components/ui/Brand';
import { createClient } from '@/lib/supabase/client';

type Mode = 'signin' | 'signup';

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const supabase = createClient();

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { error: err } = await supabase.auth.signUp({ email, password });
        if (err) throw err;
        setSuccessMsg('Account created! Check your email to confirm your address, then sign in.');
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        // Middleware will redirect to / on next navigation
        window.location.href = '/';
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setOauthLoading(true);
    try {
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (err) throw err;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed. Make sure Google is enabled in your Supabase Authentication settings.');
      setOauthLoading(false);
    }
  };

  const toggleMode = () => {
    setMode((m) => (m === 'signin' ? 'signup' : 'signin'));
    setError('');
    setSuccessMsg('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
    }}>
      {/* Card */}
      <div className="card" style={{
        width: '100%',
        maxWidth: 420,
        padding: 'clamp(28px, 5vw, 40px)',
        boxShadow: 'var(--sh-pop)',
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
          <BrandLogo />
          <div style={{ marginTop: 14, textAlign: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.08em', color: 'var(--muted)', marginBottom: 4 }}>
              CREDIT REPORT AI ANALYZER
            </div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-.02em' }}>
              {mode === 'signin' ? 'Sign in to your account' : 'Create your account'}
            </h1>
            <p style={{ margin: '8px 0 0', fontSize: 13.5, color: 'var(--ink-3)' }}>
              {mode === 'signin'
                ? 'Enter your email and password to continue.'
                : 'Sign up to start analyzing your credit report.'}
            </p>
          </div>
        </div>

        {/* Google OAuth button */}
        <button
          type="button"
          className="btn btn-ghost"
          onClick={handleGoogle}
          disabled={oauthLoading || loading}
          style={{ width: '100%', height: 46, fontSize: 14, marginBottom: 20, gap: 10 }}
        >
          {oauthLoading ? (
            <><span className="spin" style={{ borderColor: 'rgba(0,0,0,.15)', borderTopColor: 'var(--ink)' }} /> Connecting…</>
          ) : (
            <>
              {/* Google logo */}
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </>
          )}
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        {/* Email/password form */}
        <form onSubmit={handleEmail} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="field-label" htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              className="input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="field-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="input"
              placeholder={mode === 'signup' ? 'At least 8 characters' : '••••••••'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={mode === 'signup' ? 8 : 1}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            />
          </div>

          {error && (
            <div style={{
              background: 'var(--red-bg)', border: '1px solid #f5c0c0',
              borderRadius: 9, padding: '10px 13px',
              color: 'var(--red)', fontSize: 13.5, fontWeight: 500,
            }}>
              {error}
            </div>
          )}

          {successMsg && (
            <div style={{
              background: 'var(--green-bg)', border: '1px solid #a7f3c0',
              borderRadius: 9, padding: '10px 13px',
              color: 'var(--green)', fontSize: 13.5, fontWeight: 500,
            }}>
              {successMsg}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || oauthLoading}
            style={{ height: 48, fontSize: 15, borderRadius: 11, marginTop: 2 }}
          >
            {loading
              ? <><span className="spin" /> {mode === 'signin' ? 'Signing in…' : 'Creating account…'}</>
              : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Toggle mode */}
        <p style={{ textAlign: 'center', margin: '20px 0 0', fontSize: 13.5, color: 'var(--ink-3)' }}>
          {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            type="button"
            onClick={toggleMode}
            style={{
              background: 'none', border: 'none', padding: 0,
              color: 'var(--blue)', fontWeight: 700, fontSize: 13.5, cursor: 'pointer',
            }}
          >
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>

      {/* Footer note */}
      <p style={{ marginTop: 20, fontSize: 12, color: 'var(--muted)', textAlign: 'center', maxWidth: 360 }}>
        Your data is processed securely and never stored. Analysis is discarded after your session.
      </p>
    </div>
  );
}
