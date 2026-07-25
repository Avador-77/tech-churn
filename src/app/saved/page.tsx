'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bookmark, Sparkles, ArrowRight, Zap, Trash2 } from 'lucide-react';
import { useSaved } from '@/context/SavedContext';
import { useAuth } from '@/context/AuthContext';
import { ArticleCard } from '@/components/ArticleCard';
import { Article } from '@/lib/types';
import { AiCompanionModal } from '@/components/AiCompanionModal';
import { NewsGridSkeleton } from '@/components/Skeleton';

export default function SavedArticlesPage() {
  const { savedArticles, loading } = useSaved();
  const { user, openAuthModal } = useAuth();
  const [selectedAiArticle, setSelectedAiArticle] = useState<Article | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const handleOpenAiModal = (article: Article) => {
    setSelectedAiArticle(article);
    setIsAiModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-fade-in py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20 mb-2">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Personal Tech Library</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Saved Articles</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Access your bookmarked tech stories anytime, synced with your account.
          </p>
        </div>

        {savedArticles.length > 0 && (
          <div className="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-300">
            {savedArticles.length} {savedArticles.length === 1 ? 'article saved' : 'articles saved'}
          </div>
        )}
      </div>

      {!user ? (
        <div className="text-center py-20 px-6 bg-neutral-900/40 rounded-3xl border border-neutral-800 space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Bookmark className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white">Sign in to view saved stories</h2>
          <p className="text-xs text-neutral-400">
            Save interesting technology articles to read later or analyze with AI. Your saved articles sync across all devices.
          </p>
          <button
            onClick={() => openAuthModal('Sign in to view your saved articles')}
            className="px-6 py-3 rounded-2xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg inline-flex items-center gap-2"
          >
            <span>Sign In / Demo Login</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : loading ? (
        <NewsGridSkeleton count={3} />
      ) : savedArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onOpenAi={handleOpenAiModal}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 px-6 bg-neutral-900/40 rounded-3xl border border-neutral-800 space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-neutral-800/80 border border-neutral-700 flex items-center justify-center text-neutral-500">
            <Bookmark className="w-8 h-8 text-neutral-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Your library is empty</h2>
          <p className="text-xs text-neutral-400 leading-relaxed">
            You haven&apos;t saved any tech articles yet. Click the bookmark icon on any story card in the main feed to save it here.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-cyan-400 font-bold text-xs border border-neutral-700 transition-colors"
          >
            <Zap className="w-4 h-4" />
            <span>Explore News Feed</span>
          </Link>
        </div>
      )}

      {/* AI Companion Modal */}
      <AiCompanionModal
        article={selectedAiArticle}
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </div>
  );
}
