'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="fixed top-0 right-0 bottom-0 w-64 bg-telofy-bg border-l border-telofy-border p-6">
        <button onClick={onClose} className="absolute top-4 right-4 p-2">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <nav className="flex flex-col gap-6 mt-12">
          <Link href="#features" onClick={onClose} className="text-lg text-telofy-text-secondary hover:text-white transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" onClick={onClose} className="text-lg text-telofy-text-secondary hover:text-white transition-colors">
            How It Works
          </Link>
          <Link
            href="/waitlist"
            onClick={onClose}
            className="px-6 py-3 rounded-lg bg-telofy-accent text-telofy-bg font-medium text-center hover:bg-telofy-accent/90 transition-colors"
          >
            Join Waitlist
          </Link>
        </nav>
      </div>
    </div>
  );
}

function StatusBadge({ status, label }: { status: 'on_track' | 'pending'; label: string }) {
  const colors = {
    on_track: 'bg-telofy-accent/10 text-telofy-accent border-telofy-accent/30',
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-mono border ${colors[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'on_track' ? 'bg-telofy-accent' : 'bg-amber-400'}`} />
      {label}
    </span>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group p-6 rounded-2xl bg-telofy-surface/50 border border-telofy-border hover:border-telofy-accent/30 transition-all duration-300">
      <div className="w-12 h-12 rounded-xl bg-telofy-accent/10 flex items-center justify-center mb-4 group-hover:bg-telofy-accent/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-telofy-text-secondary text-sm leading-relaxed">{description}</p>
    </div>
  );
}

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-telofy-bg">
      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-telofy-bg/80 backdrop-blur-xl border-b border-telofy-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <Image src="/icon.png" alt="Telofy" width={28} height={28} className="rounded-md" />
            <span>Telofy</span>
          </Link>
          
          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm text-telofy-text-secondary hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm text-telofy-text-secondary hover:text-white transition-colors">
              How It Works
            </Link>
            <Link
              href="/waitlist"
              className="px-4 py-2 rounded-lg bg-telofy-accent text-telofy-bg text-sm font-medium hover:bg-telofy-accent/90 transition-colors"
            >
              Join Waitlist
            </Link>
          </div>
          
          {/* Mobile hamburger */}
          <button 
            className="md:hidden p-2 -mr-2"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-24 overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 grid-pattern opacity-50" />
        
        {/* Gradient orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-telofy-accent/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            {/* Left column - Text */}
            <div>
              {/* Status indicator */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-telofy-surface border border-telofy-border mb-8 opacity-0 animate-fade-in-up">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-telofy-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-telofy-accent"></span>
                </span>
                <span className="text-sm text-telofy-text-secondary">System operational</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-4 sm:mb-6 opacity-0 animate-fade-in-up animation-delay-100">
                Turn intention
                <br />
                into <span className="gradient-text">execution</span>
              </h1>

              <p className="text-lg sm:text-xl text-telofy-text-secondary leading-relaxed mb-8 sm:mb-10 opacity-0 animate-fade-in-up animation-delay-200">
                Define your objective. Telofy breaks it down into pillars, tracks your metrics, 
                and keeps you accountable with intelligent scheduling.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 opacity-0 animate-fade-in-up animation-delay-300">
                <Link
                  href="/waitlist"
                  className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-telofy-accent text-telofy-bg font-semibold text-base sm:text-lg hover:bg-telofy-accent/90 transition-all glow text-center"
                >
                  Get Early Access
                </Link>
                <Link
                  href="#how-it-works"
                  className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-telofy-surface border border-telofy-border font-semibold text-base sm:text-lg hover:border-telofy-accent/50 transition-all text-center"
                >
                  See How It Works
                </Link>
              </div>
            </div>

            {/* Right column - Mock UI Cards with notifications */}
            <div className="relative mt-4 md:mt-0">
              {/* Floating notification - top right (hidden on mobile) */}
              <div className="hidden sm:block absolute -top-4 -right-4 z-20">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-telofy-surface border border-telofy-border shadow-xl">
                  <div className="w-8 h-8 rounded-full bg-telofy-accent/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-telofy-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-telofy-text-secondary">Just completed</p>
                    <p className="text-sm font-medium">Morning workout</p>
                  </div>
                </div>
              </div>

              {/* Background card - Fitness objective (hidden on mobile) */}
              <div className="hidden sm:block absolute top-6 left-6 right-0 rounded-2xl bg-telofy-surface/60 border border-telofy-border p-6 opacity-60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-telofy-text-secondary tracking-wide">FITNESS</p>
                    <p className="font-semibold">Lose 15 lbs by Summer</p>
                  </div>
                </div>
              </div>

              {/* Main card - Career objective */}
              <div className="relative z-10 rounded-2xl bg-telofy-surface border border-telofy-border p-4 sm:p-6 glow">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-telofy-text-secondary tracking-wide">CAREER</p>
                      <p className="font-semibold">Get Promoted to Senior</p>
                    </div>
                  </div>
                  <StatusBadge status="on_track" label="ON TRACK" />
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-telofy-bg">
                    <p className="text-2xl font-bold">4/5</p>
                    <p className="text-xs text-telofy-text-secondary">Tasks</p>
                  </div>
                  <div className="p-3 rounded-xl bg-telofy-bg">
                    <p className="text-2xl font-bold">3/3</p>
                    <p className="text-xs text-telofy-text-secondary">Rituals</p>
                  </div>
                  <div className="p-3 rounded-xl bg-telofy-bg">
                    <p className="text-2xl font-bold text-telofy-accent">12</p>
                    <p className="text-xs text-telofy-text-secondary">Day Streak</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-telofy-text-secondary">Overall Progress</span>
                    <span className="text-telofy-accent font-mono">67%</span>
                  </div>
                  <div className="h-2 bg-telofy-bg rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-telofy-accent rounded-full" />
                  </div>
                </div>
              </div>

              {/* Floating notification - bottom left (hidden on mobile) */}
              <div className="hidden sm:block absolute -bottom-4 -left-4 z-20">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-telofy-surface border border-amber-500/30 shadow-xl">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-amber-400">In 30 minutes</p>
                    <p className="text-sm font-medium">Review PR feedback</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 border-t border-telofy-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <p className="text-telofy-accent font-mono text-sm tracking-wide mb-3 sm:mb-4">FEATURES</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Engineered for execution</h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <FeatureCard
              icon={
                <svg className="w-6 h-6 text-telofy-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              }
              title="AI-Powered Planning"
              description="Describe your goal in natural language. Telofy breaks it into pillars, metrics, and daily rituals automatically."
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6 text-telofy-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              title="Metric Tracking"
              description="Log progress on key metrics. See trends over time. Know exactly how far you've come and how far you have to go."
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6 text-telofy-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              }
              title="Intelligent Reminders"
              description="Push notifications that respect your schedule. Escalation when you're off track. No spam, just accountability."
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6 text-telofy-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
              }
              title="Streak Tracking"
              description="Build momentum with ritual streaks. Break a streak, Telofy helps you recover without judgment."
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6 text-telofy-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              }
              title="Multiple Objectives"
              description="Career, fitness, learning, style — track them all. Telofy balances your time across what matters most."
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6 text-telofy-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
              title="Deviation Detection"
              description="Missed a task? Broke a streak? Telofy detects deviations and suggests course corrections in real-time."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 sm:py-24 border-t border-telofy-border bg-telofy-surface/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <p className="text-telofy-accent font-mono text-sm tracking-wide mb-3 sm:mb-4">HOW IT WORKS</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Three steps to execution</h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 sm:gap-8">
            {[
              {
                step: '01',
                title: 'Define your objective',
                description: 'Tell Telofy what you want to achieve in plain language. "Get promoted to senior engineer in 12 months."',
              },
              {
                step: '02',
                title: 'AI creates your plan',
                description: 'Telofy breaks your goal into pillars, identifies key metrics, and suggests daily rituals to build momentum.',
              },
              {
                step: '03',
                title: 'Execute with accountability',
                description: 'Complete tasks, log metrics, maintain streaks. Telofy keeps you on track with intelligent notifications.',
              },
            ].map((item, i) => (
              <div key={i} className="relative text-center sm:text-left">
                <p className="text-5xl sm:text-6xl font-bold text-telofy-accent/50 mb-3 sm:mb-4">{item.step}</p>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-telofy-text-secondary text-sm sm:text-base leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Preview Section */}
      <section id="app-preview" className="py-16 sm:py-24 border-t border-telofy-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <p className="text-telofy-accent font-mono text-sm tracking-wide mb-3 sm:mb-4">APP PREVIEW</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Available on iOS & Web</h2>
            <p className="text-telofy-text-secondary max-w-xl mx-auto">
              Take Telofy everywhere. Your objectives sync across all your devices.
            </p>
          </div>

          <div className="flex items-center justify-center">
            <Image 
              src="/app-mockup.png" 
              alt="Telofy App on iPhone" 
              width={400} 
              height={800}
              className="max-w-full h-auto"
              priority
            />
          </div>

          {/* Platform badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-telofy-surface border border-telofy-border">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <span className="text-sm font-medium">iOS</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-telofy-surface border border-telofy-border">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span className="text-sm font-medium">Web</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 border-t border-telofy-border bg-telofy-surface/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">Ready to execute?</h2>
          <p className="text-lg sm:text-xl text-telofy-text-secondary mb-8 sm:mb-10 max-w-xl mx-auto">
            Join the waitlist for early access. Be among the first to transform how you achieve your goals.
          </p>
          <Link
            href="/waitlist"
            className="inline-flex px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-telofy-accent text-telofy-bg font-semibold text-base sm:text-lg hover:bg-telofy-accent/90 transition-all glow"
          >
            Get Early Access
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 border-t border-telofy-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Image src="/icon.png" alt="Telofy" width={24} height={24} className="rounded-md" />
              <span className="text-xl font-bold">Telofy</span>
            </div>
            <p className="text-telofy-text-secondary text-sm">
              © {new Date().getFullYear()} Telofy. Turn intention into execution.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
