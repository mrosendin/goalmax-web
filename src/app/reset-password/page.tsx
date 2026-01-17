'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-telofy-accent/20 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-telofy-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-4">Password Reset</h2>
        <p className="text-telofy-text-secondary mb-8">
          Your password has been successfully reset.
        </p>
        <p className="text-telofy-text-secondary mb-4">
          Open the Telofy app to sign in with your new password.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-xl bg-telofy-surface border border-telofy-border font-medium hover:border-telofy-accent/50 transition-all"
        >
          Go to Homepage
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <h2 className="text-2xl font-bold mb-2">Set New Password</h2>
      <p className="text-telofy-text-secondary mb-8">
        Enter your new password below.
      </p>

      {error && (
        <div className="bg-red-500/20 border border-red-500 rounded-xl p-4 mb-6">
          <p className="text-red-400 text-center text-sm">{error}</p>
        </div>
      )}

      <div className="mb-4">
        <label className="text-telofy-text-secondary text-sm mb-2 block">New Password</label>
        <input
          type="password"
          className="w-full text-white p-4 rounded-xl bg-telofy-surface border border-telofy-border focus:border-telofy-accent/50 outline-none transition-colors"
          placeholder="Min 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          disabled={!token}
        />
      </div>

      <div className="mb-6">
        <label className="text-telofy-text-secondary text-sm mb-2 block">Confirm Password</label>
        <input
          type="password"
          className="w-full text-white p-4 rounded-xl bg-telofy-surface border border-telofy-border focus:border-telofy-accent/50 outline-none transition-colors"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          disabled={!token}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || !token}
        className={`w-full rounded-xl py-4 font-semibold text-lg transition-colors ${
          isLoading || !token
            ? 'bg-telofy-accent/50 text-telofy-bg/50 cursor-not-allowed'
            : 'bg-telofy-accent text-telofy-bg hover:bg-telofy-accent/90'
        }`}
      >
        {isLoading ? 'Resetting...' : 'Reset Password'}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-telofy-bg flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2">
            <Image src="/icon.png" alt="Telofy" width={40} height={40} className="rounded-lg" />
          </Link>
          <p className="text-telofy-accent text-4xl mt-4" style={{ fontStyle: 'italic', fontWeight: 300 }}>
            telofy
          </p>
        </div>

        <Suspense fallback={
          <div className="text-center text-telofy-text-secondary">Loading...</div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
