'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function WaitlistPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage("You're on the list. We'll be in touch.");
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-telofy-bg flex items-center justify-center p-6">
      {/* Background effects */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-telofy-accent/5 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-telofy-text-secondary hover:text-white transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>

        <h1 className="text-4xl font-bold mb-4">Join the waitlist</h1>
        <p className="text-telofy-text-secondary mb-8">
          Be among the first to access Telofy. We&apos;ll notify you when early access opens.
        </p>

        {status === 'success' ? (
          <div className="p-6 rounded-2xl bg-telofy-accent/10 border border-telofy-accent/30">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-6 h-6 text-telofy-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-semibold text-telofy-accent">Confirmed</span>
            </div>
            <p className="text-telofy-text-secondary">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-4 rounded-xl bg-telofy-surface border border-telofy-border text-white placeholder:text-telofy-text-secondary focus:outline-none focus:border-telofy-accent/50 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full px-4 py-4 rounded-xl bg-telofy-accent text-telofy-bg font-semibold hover:bg-telofy-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Joining...' : 'Join Waitlist'}
            </button>

            {status === 'error' && (
              <p className="text-red-400 text-sm text-center">{message}</p>
            )}
          </form>
        )}

        <p className="text-telofy-text-secondary text-sm text-center mt-8">
          No spam. Just one email when we&apos;re ready.
        </p>
      </div>
    </div>
  );
}
