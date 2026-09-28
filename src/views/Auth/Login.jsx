'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import { isAuthenticated, setAuthToken, setRefreshToken, setUser } from '../../utils/auth';
import { API_BASE_URL } from '../../config/api';
import logo from '../../assets/Logo.png';
import heroImage from '../../assets/ify/hero.jpg';

const inputClass =
  'w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#22B2A8] focus:border-transparent transition';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Already signed in: go straight to the dashboard.
  useEffect(() => {
    if (isAuthenticated()) router.replace('/dashboard');
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await response.json();

      if (data.success) {
        setAuthToken(data.data.accessToken);
        setRefreshToken(data.data.refreshToken);
        setUser(data.data.user);
        router.push('/dashboard');
        return;
      }
      setError(data.message || 'We could not sign you in. Please try again.');
    } catch {
      setError('We could not reach the server. Check your connection and try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Brand panel: desktop only. */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden p-12 text-white">
        <Image src={heroImage} alt="" fill priority placeholder="blur" sizes="50vw" className="object-cover" />
        <div className="absolute inset-0 bg-linear-to-br from-[#0f6f66]/95 via-[#1a9d8f]/85 to-[#0f6f66]/90" aria-hidden="true" />

        <div className="relative">
          <span className="inline-flex rounded-xl bg-white px-4 py-3 shadow-lg">
            <Image src={logo} alt="Veritas Pathways" className="w-[150px] h-[42px] object-contain" />
          </span>
        </div>

        <div className="relative max-w-md">
          <p className="text-sm font-semibold uppercase tracking-widest text-white/70">Admin dashboard</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight">
            Manage courses, universities and enquiries in one place.
          </h1>
          <p className="mt-4 text-white/80 leading-relaxed">
            Keep the University Progression directory, media library and contact messages up to date for
            students worldwide.
          </p>
        </div>

        <p className="relative text-sm text-white/60">© {new Date().getFullYear()} Veritas Pathways Ltd</p>
      </aside>

      {/* Form */}
      <main className="flex flex-col px-6 py-8 sm:px-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 self-start text-sm font-medium text-gray-500 hover:text-[#1a9d8f] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to website
        </Link>

        <div className="flex-1 flex items-center justify-center py-10">
          <div className="w-full max-w-sm">
            {/* The brand panel carries the logo on desktop. */}
            <Image src={logo} alt="Veritas Pathways" priority className="lg:hidden w-[150px] h-[42px] object-contain mb-10" />

            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-gray-500">Sign in to the Veritas Pathways admin dashboard.</p>

            {error && (
              <div role="alert" className="mt-6 flex gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@veritaspathways.co.uk"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={`${inputClass} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-0 flex items-center px-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-lg bg-[#1a9d8f] text-white font-semibold shadow-sm hover:bg-[#158e88] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#22B2A8] transition-colors disabled:opacity-70"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>

            <p className="mt-8 text-sm text-gray-500">
              Forgotten your password? Ask another admin to reset it from the Admins page.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
