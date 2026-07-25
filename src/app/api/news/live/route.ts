import { NextResponse } from 'next/server';
import { Article } from '@/lib/types';

// Helper to map tags and titles into category pills
function mapCategory(tags: string[] = [], title: string = ''): string {
  const combined = (tags.join(' ') + ' ' + title).toLowerCase();
  if (combined.includes('ai') || combined.includes('gpt') || combined.includes('llm') || combined.includes('neural') || combined.includes('openai')) return '🤖 AI';
  if (combined.includes('security') || combined.includes('hack') || combined.includes('privacy') || combined.includes('auth') || combined.includes('crypto')) return '🔐 Cybersecurity';
  if (combined.includes('mobile') || combined.includes('phone') || combined.includes('ios') || combined.includes('android')) return '📱 Smartphones';
  if (combined.includes('startup') || combined.includes('venture') || combined.includes('fund') || combined.includes('business')) return '🚀 Startups';
  if (combined.includes('game') || combined.includes('gpu') || combined.includes('graphics') || combined.includes('unreal')) return '🎮 Gaming';
  if (combined.includes('space') || combined.includes('nasa') || combined.includes('rocket') || combined.includes('orbit')) return '🌌 Space';
  if (combined.includes('hardware') || combined.includes('chip') || combined.includes('quantum') || combined.includes('battery')) return '⚡ Gadgets';
  return '💻 Software';
}

const CATEGORY_IMAGES: Record<string, string> = {
  '🤖 AI': 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop',
  '🔐 Cybersecurity': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop',
  '📱 Smartphones': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1000&auto=format&fit=crop',
  '🚀 Startups': 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=1000&auto=format&fit=crop',
  '🎮 Gaming': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop',
  '🌌 Space': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop',
  '⚡ Gadgets': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000&auto=format&fit=crop',
  '💻 Software': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop',
};

// Clean raw markdown symbols if any
function cleanText(text: string): string {
  return text
    .replace(/#{1,6}\s?/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1');
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const perPage = parseInt(searchParams.get('per_page') || '10', 10);

  try {
    const articlesList: Article[] = [];

    // 1. Fetch live tech articles from Dev.to API
    const devToRes = await fetch(
      `https://dev.to/api/articles?tag=technology&page=${page}&per_page=${perPage}`,
      { next: { revalidate: 180 } }
    );

    if (devToRes.ok) {
      const devData = await devToRes.json();
      if (Array.isArray(devData)) {
        devData.forEach((item: {
          id: number;
          title: string;
          description?: string;
          tag_list?: string[];
          cover_image?: string;
          social_image?: string;
          url: string;
          published_at?: string;
          reading_time_minutes?: number;
          positive_reactions_count?: number;
          organization?: { name?: string };
          user?: { name?: string };
        }) => {
          const category = mapCategory(item.tag_list, item.title);
          const cover = item.cover_image || item.social_image || CATEGORY_IMAGES[category];
          const cleanTitle = cleanText(item.title);
          const cleanSummary = cleanText(item.description || item.title);

          articlesList.push({
            id: `devto-${item.id}`,
            title: cleanTitle,
            slug: `devto-${item.id}`,
            summary: cleanSummary,
            content: `${cleanTitle}\n\n${cleanSummary}\n\nKey Highlights:\n• Live developer briefing from ${item.user?.name || 'Tech Contributor'}.\n• Main topics: ${item.tag_list?.join(', ') || 'Technology'}.\n\nExplore original source discussions and technical implementation details.`,
            image_url: cover,
            source_name: item.organization?.name || item.user?.name || 'Dev Tech Feed',
            source_url: item.url,
            category,
            published_at: item.published_at || new Date().toISOString(),
            read_time_minutes: item.reading_time_minutes || 4,
            likes_count: item.positive_reactions_count || 35,
          });
        });
      }
    }

    // 2. Fetch live HackerNews top stories if more items needed
    if (articlesList.length < perPage) {
      try {
        const hnTopRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
        if (hnTopRes.ok) {
          const storyIds: number[] = await hnTopRes.json();
          const pageStoryIds = storyIds.slice((page - 1) * 5, page * 5);

          const storyPromises = pageStoryIds.map((id) =>
            fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then((r) => r.json())
          );

          const hnStories = await Promise.all(storyPromises);

          hnStories.forEach((hnItem: {
            id: number;
            title?: string;
            url?: string;
            time?: number;
            score?: number;
            descendants?: number;
          }) => {
            if (hnItem && hnItem.title) {
              const category = mapCategory([], hnItem.title);
              const cleanTitle = cleanText(hnItem.title);
              articlesList.push({
                id: `hn-${hnItem.id}`,
                title: cleanTitle,
                slug: `hn-${hnItem.id}`,
                summary: `Latest technical story and trending update: ${cleanTitle}`,
                content: `${cleanTitle}\n\nKey Highlights:\n• Trending technical story with ${hnItem.score || 80} community points.\n• Active discussion thread with ${hnItem.descendants || 15} comments.\n\nRead original source coverage and full technical discussions.`,
                image_url: CATEGORY_IMAGES[category],
                source_name: 'HackerNews Live',
                source_url: hnItem.url || `https://news.ycombinator.com/item?id=${hnItem.id}`,
                category,
                published_at: hnItem.time ? new Date(hnItem.time * 1000).toISOString() : new Date().toISOString(),
                read_time_minutes: 5,
                likes_count: hnItem.score || 70,
              });
            }
          });
        }
      } catch (hnErr) {
        console.error('HN fetch error:', hnErr);
      }
    }

    return NextResponse.json({
      articles: articlesList,
      page,
      hasMore: true,
    });
  } catch (err: unknown) {
    console.error('Live news route error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch live tech news feeds' },
      { status: 500 }
    );
  }
}
