'use client';

import React, { useState } from 'react';
import { X, Lock, Mail, User, Zap, ArrowRight, UserCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, signup, demoLogin, authModalPrompt } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setSubmitting(true);
    if (mode === 'login') {
      await login(email, password);
    } else {
      await signup(email, password, fullName);
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-b from-neutral-950 to-neutral-900 border-b border-neutral-800 text-center relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-3">
            <div className="w-full h-full bg-neutral-950 rounded-[14px] flex items-center justify-center">
              <Zap className="w-6 h-6 text-cyan-400" />
            </div>
          </div>

          <h2 className="text-xl font-bold text-neutral-100">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-xs text-cyan-400 mt-1 font-medium">{authModalPrompt}</p>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          {/* Quick Demo Mode Login Button */}
          <button
            type="button"
            onClick={demoLogin}
            className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-indigo-950/80 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-500/40 flex items-center justify-center gap-2 shadow-md transition-all group"
          >
            <UserCheck className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span>One-Click Demo Login (Alex Rivera)</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-neutral-800 w-full" />
            <span className="bg-neutral-900 px-3 text-[10px] uppercase tracking-wider text-neutral-500 font-semibold absolute">
              or use email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-400">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-cyan-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-400">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-cyan-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-400">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-cyan-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all mt-2"
            >
              {submitting ? (
                <span>Processing...</span>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="text-center pt-2 border-t border-neutral-800/80">
            {mode === 'login' ? (
              <p className="text-xs text-neutral-400">
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => setMode('signup')}
                  className="text-cyan-400 font-semibold hover:underline"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p className="text-xs text-neutral-400">
                Already have an account?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="text-cyan-400 font-semibold hover:underline"
                >
                  Log In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
