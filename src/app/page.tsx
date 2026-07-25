'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { CategoryType, Article } from '@/lib/types';
import { SEED_ARTICLES } from '@/lib/articles-data';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { CategoryBar } from '@/components/CategoryBar';
import { ArticleCard } from '@/components/ArticleCard';
import { AiCompanionModal } from '@/components/AiCompanionModal';
import { NewsGridSkeleton } from '@/components/Skeleton';
import { Search, Sparkles, RefreshCw, Flame, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function HomeFeed() {
  const { user, openAuthModal } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular'>('newest');
  const [articles, setArticles] = useState<Article[]>(SEED_ARTICLES);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [livePage, setLivePage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedAiArticle, setSelectedAiArticle] = useState<Article | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const observerTargetRef = useRef<HTMLDivElement>(null);
  const supabase = useMemo(() => createClient(), []);

  // 1. Fetch initial articles
  useEffect(() => {
    async function fetchArticles() {
      let baseArticles: Article[] = [...SEED_ARTICLES];

      if (supabase) {
        try {
          const { data } = await supabase
            .from('articles')
            .select('*')
            .order('published_at', { ascending: false });

          if (data && data.length > 0) {
            baseArticles = data as Article[];
          }
        } catch (err) {
          console.error('Error fetching Supabase articles, using seed data:', err);
        }
      }

      setArticles(baseArticles);
      setLoading(false);
    }

    fetchArticles();
  }, [supabase]);

  // 2. Function to fetch next batch of live articles via Option B API
  const fetchMoreArticles = useCallback(async () => {
    if (loadingMore || !hasMore || !user) return;
    setLoadingMore(true);

    const nextPage = livePage + 1;
    try {
      const res = await fetch(`/api/news/live?page=${nextPage}&per_page=8`);
      if (res.ok) {
        const data = await res.json();
        if (data.articles && data.articles.length > 0) {
          setArticles((prev) => {
            const existingIds = new Set(prev.map((a) => a.id));
            const newItems = data.articles.filter((a: Article) => !existingIds.has(a.id));
            return [...prev, ...newItems];
          });
          setLivePage(nextPage);
        } else {
          setHasMore(false);
        }
      }
    } catch (err) {
      console.error('Error lazy loading live news:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [livePage, loadingMore, hasMore, user]);

  // 3. Intersection Observer for Lazy Loading at bottom of page
  useEffect(() => {
    if (!user || !hasMore || loading) return;

    const targetNode = observerTargetRef.current;
    if (!targetNode) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchMoreArticles();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(targetNode);

    return () => {
      observer.unobserve(targetNode);
    };
  }, [user, hasMore, loading, fetchMoreArticles]);

  const filteredArticles = useMemo(() => {
    let result = [...articles];

    if (selectedCategory !== 'All') {
      result = result.filter(
        (a) => a.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.source_name.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'popular') {
      result.sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0));
    } else {
      result.sort(
        (a, b) =>
          new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
      );
    }

    return result;
  }, [articles, selectedCategory, searchQuery, sortBy]);

  const handleOpenAiModal = (article: Article) => {
    if (!user) {
      openAuthModal('Sign up to use TechChurn AI assistant');
      return;
    }
    setSelectedAiArticle(article);
    setIsAiModalOpen(true);
  };

  // Unauthenticated view shows preview cards + blur overlay
  const visibleArticles = user ? filteredArticles : filteredArticles.slice(0, 2);
  const blurredArticles = user ? [] : filteredArticles.slice(2);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Header Banner */}
      <section className="relative rounded-3xl bg-gradient-to-r from-neutral-900 via-indigo-950/60 to-neutral-900 border border-neutral-800 p-6 sm:p-10 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI-Enhanced Tech Feed</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Stay Ahead of the <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Technology Curve
            </span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
            Curated breakthroughs in AI, Quantum Computing, Mobile Hardware, Cybersecurity, and Clean Energy.
          </p>

          {/* Search & Sort Controls */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-2xl">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stories, topics, or sources..."
                className="w-full bg-neutral-950/80 border border-neutral-700/80 focus:border-cyan-500 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none transition-colors shadow-inner"
              />
            </div>

            {/* Sort Toggle */}
            <div className="flex items-center gap-1 bg-neutral-950/80 p-1.5 rounded-2xl border border-neutral-700/80 shrink-0">
              <button
                onClick={() => setSortBy('newest')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  sortBy === 'newest'
                    ? 'bg-neutral-800 text-cyan-300 shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <RefreshCw className="w-3 h-3" />
                Latest
              </button>
              <button
                onClick={() => setSortBy('popular')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  sortBy === 'popular'
                    ? 'bg-neutral-800 text-cyan-300 shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Flame className="w-3 h-3 text-amber-400" />
                Popular
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation Bar */}
      <section>
        <CategoryBar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </section>

      {/* Main News Feed Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>{selectedCategory === 'All' ? 'Latest Stories' : selectedCategory}</span>
            <span className="text-xs font-medium text-neutral-400 bg-neutral-900 px-2.5 py-1 rounded-full border border-neutral-800">
              {filteredArticles.length} stories
            </span>
          </h2>
        </div>

        {loading ? (
          <NewsGridSkeleton count={6} />
        ) : filteredArticles.length > 0 ? (
          <div className="space-y-8">
            {/* Unlocked / Visible Articles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onOpenAi={handleOpenAiModal}
                />
              ))}
            </div>

            {/* Blurred Locked Feed for Unauthenticated Users */}
            {!user && blurredArticles.length > 0 && (
              <div className="relative rounded-3xl overflow-hidden pt-4">
                {/* Blurred News Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 filter blur-md opacity-40 select-none pointer-events-none">
                  {blurredArticles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      onOpenAi={handleOpenAiModal}
                    />
                  ))}
                </div>

                {/* Locked Frost Glass Overlay Card */}
                <div className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-neutral-950/75 backdrop-blur-xl border border-neutral-800/80 rounded-3xl">
                  <div className="max-w-md w-full text-center space-y-4 p-8 bg-neutral-900/90 border border-cyan-500/40 rounded-3xl shadow-2xl animate-scale-up">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20">
                      <div className="w-full h-full bg-neutral-950 rounded-[14px] flex items-center justify-center">
                        <Lock className="w-6 h-6 text-cyan-400" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-extrabold text-white">
                        Unlock Full Tech Feed
                      </h3>
                      <p className="text-xs text-neutral-300 leading-relaxed">
                        Sign up for free to remove the blur, read full detailed articles, bookmark stories, and ask AI questions about any tech news!
                      </p>
                    </div>

                    <div className="pt-2 flex flex-col gap-2">
                      <button
                        onClick={() => openAuthModal('Create an account to unlock full tech feed')}
                        className="w-full py-3 px-5 rounded-2xl text-xs font-extrabold bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
                      >
                        <span>Sign Up to Unlock Feed</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="pt-2 flex items-center justify-center gap-4 text-[10px] text-neutral-400">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-cyan-400" /> Free Forever
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-cyan-400" /> TechChurn AI Assistant
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Lazy Loading Sentinel & Loading Indicator for Authenticated Users */}
            {user && (
              <div className="pt-4 text-center">
                <div ref={observerTargetRef} className="h-10 flex items-center justify-center">
                  {loadingMore && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-semibold text-cyan-400 shadow-md">
                      <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                      <span>Loading fresh tech stories...</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-neutral-900/40 rounded-3xl border border-neutral-800 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-neutral-800/80 flex items-center justify-center text-neutral-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-neutral-200">No articles found</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              We couldn&apos;t find any stories matching your filter or search. Try clearing your search query or choosing another category.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-cyan-400 border border-neutral-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* AI Story Companion Modal */}
      <AiCompanionModal
        article={selectedAiArticle}
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </div>
  );
}
