'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Bookmark, Share2, Sparkles, Clock, Zap } from 'lucide-react';
import { Article } from '@/lib/types';
import { useSaved } from '@/context/SavedContext';
import { useToast } from '@/context/ToastContext';

interface ArticleCardProps {
  article: Article;
  onOpenAi: (article: Article) => void;
}

function cleanText(text: string) {
  return text
    .replace(/#{1,6}\s?/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1');
}

export function ArticleCard({ article, onOpenAi }: ArticleCardProps) {
  const { isLiked, isSaved, toggleLike, toggleSave } = useSaved();
  const { showToast } = useToast();
  const [imageError, setImageError] = useState(false);

  const liked = isLiked(article.id);
  const saved = isSaved(article.id);

  const formattedDate = new Date(article.published_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareUrl = `${window.location.origin}/article/${article.slug || article.id}`;
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
    <article className="group flex flex-col bg-neutral-900/60 rounded-2xl border border-neutral-800/80 overflow-hidden shadow-lg hover:shadow-cyan-500/10 hover:border-neutral-700/80 transition-all duration-300 transform hover:-translate-y-1">
      {/* Image Container */}
      <Link href={`/article/${article.slug || article.id}`} className="relative h-48 sm:h-52 w-full overflow-hidden block">
        {!imageError ? (
          <img
            src={article.image_url}
            alt={article.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-neutral-950 via-indigo-950/80 to-neutral-900 flex flex-col items-center justify-center p-6 text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <Zap className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="text-xs font-bold text-neutral-300 tracking-wide">{article.category}</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />

        {/* Category Pill */}
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md bg-neutral-950/80 text-cyan-300 border border-cyan-500/30 shadow-md">
          {article.category}
        </span>
      </Link>

      {/* Content Container */}
      <div className="flex flex-col flex-1 p-5 space-y-3">
        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-neutral-400 font-medium">
          <span className="text-indigo-400 font-semibold">{article.source_name}</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-neutral-500" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/article/${article.slug || article.id}`} className="block group-hover:text-cyan-400 transition-colors">
          <h2 className="text-lg font-bold text-neutral-100 leading-snug line-clamp-2">
            {cleanText(article.title)}
          </h2>
        </Link>

        {/* Summary */}
        <p className="text-sm text-neutral-400 line-clamp-2 leading-relaxed">
          {cleanText(article.summary)}
        </p>

        {/* Action Controls */}
        <div className="pt-4 mt-auto flex items-center justify-between border-t border-neutral-800/80">
          <div className="flex items-center gap-1.5">
            {/* Like Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleLike(article);
              }}
              className={`p-2 rounded-xl transition-all duration-200 flex items-center gap-1 text-xs font-semibold ${
                liked
                  ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                  : 'text-neutral-400 hover:text-rose-400 hover:bg-neutral-800'
              }`}
              title={liked ? 'Unlike' : 'Like'}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-rose-400' : ''}`} />
              {(article.likes_count || 0) + (liked ? 1 : 0)}
            </button>

            {/* Save Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleSave(article);
              }}
              className={`p-2 rounded-xl transition-all duration-200 ${
                saved
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'text-neutral-400 hover:text-amber-400 hover:bg-neutral-800'
              }`}
              title={saved ? 'Unsave' : 'Save'}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-amber-400' : ''}`} />
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="p-2 rounded-xl text-neutral-400 hover:text-cyan-400 hover:bg-neutral-800 transition-colors"
              title="Share Article"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Ask AI Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onOpenAi(article);
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-500/20 flex items-center gap-1.5 transition-all duration-200 transform hover:scale-105"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            Ask AI
          </button>
        </div>
      </div>
    </article>
  );
}
