'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart, Bookmark, Share2, Sparkles, ExternalLink, Calendar, Zap } from 'lucide-react';
import { Article } from '@/lib/types';
import { getArticleById } from '@/lib/articles-data';
import { createClient } from '@/lib/supabase/client';
import { useSaved } from '@/context/SavedContext';
import { useToast } from '@/context/ToastContext';
import { AiCompanionModal } from '@/components/AiCompanionModal';

// Clean any leftover markdown symbols
function cleanText(text: string) {
  return text
    .replace(/#{1,6}\s?/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1');
}

export default function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const { isLiked, isSaved, toggleLike, toggleSave } = useSaved();
  const { showToast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    async function loadArticle() {
      const localMatch = getArticleById(id);
      if (localMatch) {
        setArticle(localMatch);
        setLoading(false);
        return;
      }

      if (supabase) {
        try {
          const { data } = await supabase
            .from('articles')
            .select('*')
            .or(`id.eq.${id},slug.eq.${id}`)
            .single();

          if (data) {
            setArticle(data as Article);
          }
        } catch (err) {
          console.error('Error fetching article from Supabase:', err);
        }
      }

      setLoading(false);
    }

    loadArticle();
  }, [id, supabase]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse py-8">
        <div className="h-8 w-32 bg-neutral-800 rounded-xl" />
        <div className="h-80 w-full bg-neutral-800 rounded-3xl" />
        <div className="h-10 w-3/4 bg-neutral-800 rounded-xl" />
        <div className="h-32 w-full bg-neutral-800/60 rounded-2xl" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 space-y-4">
        <h2 className="text-2xl font-bold text-white">Article Not Found</h2>
        <p className="text-sm text-neutral-400">
          The requested technology story could not be located.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-white font-bold text-xs shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Feed
        </Link>
      </div>
    );
  }

  const liked = isLiked(article.id);
  const saved = isSaved(article.id);

  const formattedDate = new Date(article.published_at).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareData = {
      title: article.title,
      text: article.summary,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showToast('Article shared successfully!', 'success');
      } catch (err: unknown) {
        if (err && typeof err === 'object' && 'name' in err && err.name !== 'AbortError') {
          copyLinkFallback(shareUrl);
        }
      }
    } else {
      copyLinkFallback(shareUrl);
    }
  };

  const copyLinkFallback = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast('Article link copied to clipboard! 📋', 'success');
  };

  return (
    <article className="max-w-4xl mx-auto space-y-8 animate-fade-in py-4">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Feed
      </Link>

      {/* Hero Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            {article.category}
          </span>
          <span className="text-xs text-indigo-400 font-semibold">{article.source_name}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
          {cleanText(article.title)}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-b border-neutral-800 pb-4 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-neutral-500" />
            <span>Published {formattedDate}</span>
          </div>

          <a
            href={article.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-cyan-400 hover:underline font-semibold"
          >
            <span>Original Source ({article.source_name})</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* Featured Cover Image with Fallback */}
      <div className="relative w-full h-[320px] sm:h-[450px] rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl">
        {!imageError ? (
          <img
            src={article.image_url}
            alt={article.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-neutral-950 via-indigo-950 to-neutral-900 flex flex-col items-center justify-center p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <Zap className="w-8 h-8 text-cyan-400" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              {article.category}
            </span>
            <p className="text-sm font-semibold text-neutral-300 max-w-md">
              {cleanText(article.title)}
            </p>
          </div>
        )}
      </div>

      {/* Action Toolbar */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleLike(article)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              liked
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-rose-400' : ''}`} />
            <span>{liked ? 'Liked' : 'Like'}</span>
            <span className="text-[10px] bg-neutral-950/60 px-2 py-0.5 rounded-full">
              {(article.likes_count || 0) + (liked ? 1 : 0)}
            </span>
          </button>

          <button
            onClick={() => toggleSave(article)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              saved
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-amber-400' : ''}`} />
            <span>{saved ? 'Saved' : 'Save'}</span>
          </button>

          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl bg-neutral-800 text-neutral-300 hover:text-cyan-300 hover:bg-neutral-700 transition-all"
            title="Share Story"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={() => setIsAiModalOpen(true)}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:opacity-90 text-white shadow-lg shadow-purple-500/20 flex items-center gap-2 transition-all"
        >
          <Sparkles className="w-4 h-4 text-cyan-200" />
          <span>Ask AI About This Story</span>
        </button>
      </div>

      {/* Article Executive Summary Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-neutral-900 to-indigo-950/40 border border-cyan-500/30">
        <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-cyan-400" /> Key Highlights & Summary
        </h3>
        <p className="text-base text-neutral-200 leading-relaxed font-medium">
          {cleanText(article.summary)}
        </p>
      </div>

      {/* Article Content Body */}
      <div className="prose prose-invert max-w-none text-neutral-300 space-y-4 text-base leading-relaxed">
        {article.content.split('\n\n').map((paragraph, index) => {
          const cleaned = cleanText(paragraph);
          if (!cleaned.trim()) return null;

          if (cleaned.endsWith(':') || cleaned.length < 50 && !cleaned.includes('.')) {
            return (
              <h3 key={index} className="text-lg font-bold text-cyan-300 pt-3">
                {cleaned}
              </h3>
            );
          }

          return (
            <p key={index} className="text-neutral-300 leading-relaxed">
              {cleaned}
            </p>
          );
        })}
      </div>

      {/* Bottom AI Prompt Banner */}
      <div className="p-8 rounded-3xl bg-neutral-900 border border-purple-500/30 text-center space-y-4 shadow-2xl">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-0.5 flex items-center justify-center shadow-lg">
          <div className="w-full h-full bg-neutral-950 rounded-[14px] flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-cyan-300" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-white">Have questions about this story?</h3>
        <p className="text-xs text-neutral-400 max-w-md mx-auto">
          Ask TechChurn AI to explain technical terms, summarize key points, or explore real-world impacts.
        </p>
        <button
          onClick={() => setIsAiModalOpen(true)}
          className="px-6 py-3 rounded-2xl text-xs font-extrabold bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-xl hover:scale-105 transition-transform"
        >
          Open TechChurn AI Assistant
        </button>
      </div>

      {/* AI Companion Modal */}
      <AiCompanionModal
        article={article}
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </article>
  );
}
