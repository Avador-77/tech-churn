export type CategoryType = 
  | 'All'
  | '🤖 AI'
  | '📱 Smartphones'
  | '💻 Software'
  | '🔐 Cybersecurity'
  | '🚀 Startups'
  | '🎮 Gaming'
  | '🌌 Space'
  | '⚡ Gadgets';

export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  image_url: string;
  source_name: string;
  source_url: string;
  category: CategoryType | string;
  published_at: string;
  created_at?: string;
  read_time_minutes?: number;
  likes_count?: number;
}

export interface ArticleLike {
  id: string;
  user_id: string;
  article_id: string;
  created_at: string;
}

export interface SavedArticle {
  id: string;
  user_id: string;
  article_id: string;
  created_at: string;
  article?: Article;
}

export interface Profile {
  id: string;
  full_name: string | null;
  created_at: string;
}

export interface UserSession {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
  };
}
