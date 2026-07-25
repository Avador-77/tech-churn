'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { Article } from '@/lib/types';
import { SEED_ARTICLES, getCachedArticles } from '@/lib/articles-data';

interface SavedContextType {
  likedArticleIds: string[];
  savedArticleIds: string[];
  savedArticles: Article[];
  toggleLike: (article: Article) => Promise<boolean>;
  toggleSave: (article: Article) => Promise<boolean>;
  isLiked: (articleId: string) => boolean;
  isSaved: (articleId: string) => boolean;
  loading: boolean;
}

const SavedContext = createContext<SavedContextType | undefined>(undefined);

const LOCAL_STORAGE_LIKES_KEY = 'techchurn_likes';
const LOCAL_STORAGE_SAVED_KEY = 'techchurn_saved';

export function SavedProvider({ children }: { children: React.ReactNode }) {
  const { user, openAuthModal } = useAuth();
  const { showToast } = useToast();
  const [likedArticleIds, setLikedArticleIds] = useState<string[]>([]);
  const [savedArticleIds, setSavedArticleIds] = useState<string[]>([]);
  const [savedArticles, setSavedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let isMounted = true;

    async function loadUserData() {
      if (!user) {
        if (isMounted) {
          setLikedArticleIds([]);
          setSavedArticleIds([]);
          setSavedArticles([]);
        }
        return;
      }

      if (isMounted) setLoading(true);

      if (supabase && user) {
        try {
          // Fetch Likes
          const { data: likesData } = await supabase
            .from('article_likes')
            .select('article_id')
            .eq('user_id', user.id);

          if (likesData && isMounted) {
            setLikedArticleIds(likesData.map((l: { article_id: string }) => l.article_id));
          }

          // Fetch Saved Articles
          const { data: savedData } = await supabase
            .from('saved_articles')
            .select('article_id, articles(*)')
            .eq('user_id', user.id);

          if (savedData && isMounted) {
            const ids = savedData.map((s: { article_id: string }) => s.article_id);
            setSavedArticleIds(ids);
            
            const typedSavedData = savedData as unknown as Array<{ article_id: string; articles?: Article | Article[] }>;
            const cachedAll = getCachedArticles();
            const articlesList: Article[] = typedSavedData
              .map((s) => {
                if (s.articles) {
                  return Array.isArray(s.articles) ? s.articles[0] : s.articles;
                }
                return cachedAll.find(a => a.id === s.article_id) || SEED_ARTICLES.find(a => a.id === s.article_id);
              })
              .filter((a): a is Article => Boolean(a));
            setSavedArticles(articlesList);
          }
        } catch (err) {
          console.error('Error fetching Supabase user preferences:', err);
          fallbackToLocalStorage();
        }
      } else {
        fallbackToLocalStorage();
      }

      if (isMounted) setLoading(false);
    }

    function fallbackToLocalStorage() {
      if (!user || !isMounted) return;
      try {
        // Restore Likes
        const localLikes = localStorage.getItem(`${LOCAL_STORAGE_LIKES_KEY}_${user.id}`);
        if (localLikes) setLikedArticleIds(JSON.parse(localLikes));

        // Restore Saved Article Objects
        const storedArticles = localStorage.getItem(`${LOCAL_STORAGE_SAVED_KEY}_articles_${user.id}`);
        const storedIds = localStorage.getItem(`${LOCAL_STORAGE_SAVED_KEY}_${user.id}`);

        if (storedArticles && storedIds) {
          const parsedArticles: Article[] = JSON.parse(storedArticles);
          const parsedIds: string[] = JSON.parse(storedIds);
          setSavedArticleIds(parsedIds);
          setSavedArticles(parsedArticles);
        } else if (storedIds) {
          const parsedIds: string[] = JSON.parse(storedIds);
          setSavedArticleIds(parsedIds);
          const cachedAll = getCachedArticles();
          const articlesList = parsedIds
            .map((id) => cachedAll.find((a) => a.id === id) || SEED_ARTICLES.find((a) => a.id === id))
            .filter((a): a is Article => Boolean(a));
          setSavedArticles(articlesList);
        }
      } catch (e) {
        console.error('Error reading localStorage saved data:', e);
      }
    }

    loadUserData();

    return () => {
      isMounted = false;
    };
  }, [user, supabase]);

  const isLiked = useCallback((articleId: string) => likedArticleIds.includes(articleId), [likedArticleIds]);
  const isSaved = useCallback((articleId: string) => savedArticleIds.includes(articleId), [savedArticleIds]);

  const toggleLike = async (article: Article): Promise<boolean> => {
    if (!user) {
      openAuthModal('Please sign in to like articles');
      return false;
    }

    const currentlyLiked = isLiked(article.id);
    const newLikedState = !currentlyLiked;

    setLikedArticleIds((prev) =>
      newLikedState ? [...prev, article.id] : prev.filter((id) => id !== article.id)
    );

    showToast(
      newLikedState ? 'Added to your liked stories! ❤️' : 'Removed from your liked stories',
      'success'
    );

    if (supabase) {
      try {
        if (newLikedState) {
          await supabase
            .from('article_likes')
            .insert({ user_id: user.id, article_id: article.id });
        } else {
          await supabase
            .from('article_likes')
            .delete()
            .eq('user_id', user.id)
            .eq('article_id', article.id);
        }
      } catch (err) {
        console.error('Failed to sync like with Supabase:', err);
      }
    }

    try {
      const updated = newLikedState
        ? [...likedArticleIds, article.id]
        : likedArticleIds.filter((id) => id !== article.id);
      localStorage.setItem(`${LOCAL_STORAGE_LIKES_KEY}_${user.id}`, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed saving to localStorage:', e);
    }

    return true;
  };

  const toggleSave = async (article: Article): Promise<boolean> => {
    if (!user) {
      openAuthModal('Please sign in to save articles to your library');
      return false;
    }

    const currentlySaved = isSaved(article.id);
    const newSavedState = !currentlySaved;

    const newSavedIds = newSavedState
      ? [...savedArticleIds, article.id]
      : savedArticleIds.filter((id) => id !== article.id);

    const newSavedArticles = newSavedState
      ? [...savedArticles.filter((a) => a.id !== article.id), article]
      : savedArticles.filter((a) => a.id !== article.id);

    setSavedArticleIds(newSavedIds);
    setSavedArticles(newSavedArticles);

    showToast(
      newSavedState ? 'Saved to your bookmarks! 🔖' : 'Removed from bookmarks',
      'success'
    );

    if (supabase) {
      try {
        if (newSavedState) {
          await supabase
            .from('saved_articles')
            .insert({ user_id: user.id, article_id: article.id });
        } else {
          await supabase
            .from('saved_articles')
            .delete()
            .eq('user_id', user.id)
            .eq('article_id', article.id);
        }
      } catch (err) {
        console.error('Failed to sync save with Supabase:', err);
      }
    }

    try {
      localStorage.setItem(`${LOCAL_STORAGE_SAVED_KEY}_${user.id}`, JSON.stringify(newSavedIds));
      localStorage.setItem(`${LOCAL_STORAGE_SAVED_KEY}_articles_${user.id}`, JSON.stringify(newSavedArticles));
    } catch (e) {
      console.error('Failed saving to localStorage:', e);
    }

    return true;
  };

  return (
    <SavedContext.Provider
      value={{
        likedArticleIds,
        savedArticleIds,
        savedArticles,
        toggleLike,
        toggleSave,
        isLiked,
        isSaved,
        loading,
      }}
    >
      {children}
    </SavedContext.Provider>
  );
}

export function useSaved() {
  const context = useContext(SavedContext);
  if (!context) {
    throw new Error('useSaved must be used within a SavedProvider');
  }
  return context;
}
