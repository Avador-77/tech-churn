'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bookmark, Zap, LogOut, Menu, X, LogIn, Download } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSaved } from '@/context/SavedContext';

interface HeaderProps {
  onInstallPwa?: () => void;
  canInstallPwa?: boolean;
}

export function Header({ onInstallPwa, canInstallPwa }: HeaderProps) {
  const pathname = usePathname();
  const { user, logout, openAuthModal } = useAuth();
  const { savedArticleIds } = useSaved();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-neutral-950/80 border-b border-neutral-800/60 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center">
                <Zap className="w-5 h-5 text-cyan-400 fill-cyan-400/20" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
                Tech<span className="text-cyan-400">Churn</span>
              </span>
              <span className="text-[10px] font-medium tracking-widest text-neutral-400 uppercase -mt-1">
                News MVP
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                pathname === '/'
                  ? 'bg-neutral-800/80 text-cyan-400 shadow-sm border border-neutral-700/50'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
              }`}
            >
              <Zap className="w-4 h-4" />
              Feed
            </Link>

            <Link
              href="/saved"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 relative ${
                pathname === '/saved'
                  ? 'bg-neutral-800/80 text-cyan-400 shadow-sm border border-neutral-700/50'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              Saved
              {savedArticleIds.length > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {savedArticleIds.length}
                </span>
              )}
            </Link>
          </nav>

          {/* User Controls / Auth & PWA */}
          <div className="hidden md:flex items-center gap-3">
            {canInstallPwa && onInstallPwa && (
              <button
                onClick={onInstallPwa}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 transition-all duration-200"
              >
                <Download className="w-3.5 h-3.5" />
                Install App
              </button>
            )}

            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-neutral-800">
                <div className="flex items-center gap-2.5 bg-neutral-900/80 px-3 py-1.5 rounded-full border border-neutral-800">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-inner">
                    {user.user_metadata?.full_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-xs font-medium text-neutral-200 max-w-[120px] truncate">
                    {user.user_metadata?.full_name || user.email}
                  </span>
                </div>
                <button
                  onClick={() => logout()}
                  title="Sign out"
                  className="p-2 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('Sign in to customize your tech feed')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-md shadow-indigo-500/20 flex items-center gap-2 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {canInstallPwa && onInstallPwa && (
              <button
                onClick={onInstallPwa}
                className="p-2 rounded-lg text-indigo-400 bg-indigo-500/10 border border-indigo-500/30"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-neutral-950/95 border-b border-neutral-800 px-4 pt-2 pb-6 space-y-3 animate-fade-in">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
              pathname === '/' ? 'bg-neutral-800 text-cyan-400' : 'text-neutral-300'
            }`}
          >
            <Zap className="w-5 h-5" />
            Feed
          </Link>

          <Link
            href="/saved"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium ${
              pathname === '/saved' ? 'bg-neutral-800 text-cyan-400' : 'text-neutral-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <Bookmark className="w-5 h-5" />
              Saved Articles
            </div>
            {savedArticleIds.length > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-cyan-500/20 text-cyan-300">
                {savedArticleIds.length}
              </span>
            )}
          </Link>

          <div className="pt-3 border-t border-neutral-800">
            {user ? (
              <div className="flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center text-white font-bold">
                    {user.user_metadata?.full_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white">
                      {user.user_metadata?.full_name || 'User'}
                    </span>
                    <span className="text-xs text-neutral-400">{user.email}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-400 bg-rose-500/10"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  openAuthModal('Sign in to save articles and ask AI');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
