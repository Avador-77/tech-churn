'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, Shield, Cpu, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full bg-neutral-950 border-t border-neutral-800/80 text-neutral-400 text-xs py-12 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shadow-md">
                <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center">
                  <Zap className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="font-bold text-lg text-white">
                Tech<span className="text-cyan-400">Churn</span>
              </span>
            </Link>
            <p className="text-neutral-400 text-xs leading-relaxed max-w-md">
              A high-performance modern technology news feed featuring real-time story search, Supabase backend integration, PWA capabilities, and an AI story companion.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Vercel & Supabase Ready
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                AI Companion Active
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-neutral-200 uppercase tracking-wider text-[11px]">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-cyan-400 transition-colors">
                  Technology Feed
                </Link>
              </li>
              <li>
                <Link href="/saved" className="hover:text-cyan-400 transition-colors">
                  Saved Bookmarks
                </Link>
              </li>
              <li>
                <a href="#categories" className="hover:text-cyan-400 transition-colors">
                  Categories
                </a>
              </li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div className="space-y-3">
            <h4 className="font-bold text-neutral-200 uppercase tracking-wider text-[11px]">
              Built With
            </h4>
            <ul className="space-y-2 text-neutral-400">
              <li className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Next.js 16 App Router
              </li>
              <li className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-indigo-400" /> Supabase Auth & DB
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Tailwind CSS v4 & PWA
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} TechPulse News. Designed for 10-Minute Live Showcase.</p>
          <div className="flex items-center gap-4 text-neutral-500">
            <span>TypeScript Verified</span>
            <span>•</span>
            <span>Progressive Web App</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
