-- TechChurn News Feed MVP Database Schema
-- Run this script in your Supabase SQL Editor

-- 1. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Articles Table
CREATE TABLE IF NOT EXISTS public.articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT NOT NULL,
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL,
  category TEXT NOT NULL,
  published_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Article Likes Table
CREATE TABLE IF NOT EXISTS public.article_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id TEXT NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_article_like UNIQUE (user_id, article_id)
);

-- 4. Create Saved Articles Table
CREATE TABLE IF NOT EXISTS public.saved_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id TEXT NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_saved_article UNIQUE (user_id, article_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_articles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Profiles
CREATE POLICY "Public profiles are viewable by everyone." 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." 
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile." 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for Articles
CREATE POLICY "Articles are viewable by everyone." 
  ON public.articles FOR SELECT USING (true);

-- RLS Policies for Article Likes
CREATE POLICY "Likes are viewable by everyone." 
  ON public.article_likes FOR SELECT USING (true);

CREATE POLICY "Authenticated users can add likes." 
  ON public.article_likes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own likes." 
  ON public.article_likes FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Saved Articles
CREATE POLICY "Users can view their own saved articles." 
  ON public.saved_articles FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can save articles for themselves." 
  ON public.saved_articles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their saved articles." 
  ON public.saved_articles FOR DELETE USING (auth.uid() = user_id);

-- Profile creation trigger on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert Seed Articles
INSERT INTO public.articles (id, title, slug, summary, content, image_url, source_name, source_url, category, published_at)
VALUES 
  (
    'art-1',
    'OpenAI Unveils Next-Gen Multimodal Reasoning Models for Real-Time Code Synthesis',
    'openai-next-gen-multimodal-reasoning-models',
    'The new model architecture introduces real-time reasoning capability with zero latency code synthesis and interactive debugging tools.',
    'OpenAI has announced its latest breakthrough in AI model architectures, focusing on ultra-fast reasoning and native multimodal comprehension.\n\nKey Highlights:\n• Sub-100ms Reasoning: Complex reasoning chains execute in real-time.\n• Context Extension: Supports up to 2 million tokens of active working memory.\n• Multi-Agent Coordination: Native protocols for multi-agent delegation.',
    'https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=1000&auto=format&fit=crop',
    'TechCrunch',
    'https://techcrunch.com',
    '🤖 AI',
    '2026-07-25 09:30:00+00'
  ),
  (
    'art-2',
    'Quantum Chipset Breaks 1,000 Logical Qubit Barrier in Room Temperature Trial',
    'quantum-chipset-breaks-1000-logical-qubit-barrier',
    'Engineers achieve fault-tolerant quantum calculation at near room temperature using novel optical crystal lattices.',
    'A consortium of quantum physics research labs has announced a monumental milestone: maintaining over 1,000 fault-tolerant logical qubits at room temperature.\n\nBreakthrough Details:\n• Optical Lattice Matrix: Uses micro-machined sapphire substrates to trap ions.\n• Error Correction Rate: Achieves a surface code error threshold under 0.001%.',
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000&auto=format&fit=crop',
    'Wired',
    'https://wired.com',
    '⚡ Gadgets',
    '2026-07-25 08:15:00+00'
  ),
  (
    'art-3',
    'Next-Gen Foldable Smartphones Integrate Solid-State Batteries for 3-Day Battery Life',
    'foldable-smartphones-solid-state-batteries',
    'The latest mobile devices pack 7,500mAh capacity in a sleek 6mm chassis without overheating or battery degradation risks.',
    'Mobile hardware makers have unveiled the first consumer smartphones equipped with commercial solid-state electrolyte batteries.\n\nWhat Makes This Revolutionizing:\n• 7,500 mAh in a 6.1mm Body\n• Ultra-Fast 200W Charging in 9 minutes\n• Zero Swelling Risk with solid electrolyte',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1000&auto=format&fit=crop',
    'The Verge',
    'https://theverge.com',
    '📱 Smartphones',
    '2026-07-24 18:45:00+00'
  ),
  (
    'art-4',
    'Zero-Day Flaw in WebAssembly Runtime Patched Across Major Browsers',
    'zero-day-flaw-in-webassembly-runtime-patched',
    'Security researchers discovered a memory isolation vulnerability affecting edge runtimes, prompting emergency updates.',
    'Security teams across major browser vendors and cloud providers have released coordinated emergency patches for a critical WebAssembly memory isolation flaw.',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop',
    'Ars Technica',
    'https://arstechnica.com',
    '🔐 Cybersecurity',
    '2026-07-24 14:20:00+00'
  ),
  (
    'art-5',
    'SpaceX Starship Successfully Deploys Orbital Solar Relay System',
    'spacex-starship-orbital-solar-relay-system',
    'Starship flight test 12 successfully orbitally deployed wireless energy receiver satellites designed for 24/7 clean energy beaming.',
    'In a historic aerospace achievement, Starship completed mission payload deployment for the orbital solar reflector array in low Earth orbit.',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop',
    'SpaceNews',
    'https://spacenews.com',
    '🌌 Space',
    '2026-07-24 11:00:00+00'
  ),
  (
    'art-6',
    'Clean Tech Startup Raises $250M for Direct-Air Carbon-to-Fuel Conversion',
    'clean-tech-startup-raises-250m-carbon-fuel',
    'Novel electrochemical catalysts convert captured atmospheric CO2 directly into carbon-neutral aviation fuel at commercial scale.',
    'Climate tech startup SynFuel Global has closed a $250 million Series C financing round led by major clean tech funds.',
    'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=1000&auto=format&fit=crop',
    'TechCrunch',
    'https://techcrunch.com',
    '🚀 Startups',
    '2026-07-23 16:10:00+00'
  ),
  (
    'art-7',
    'Unreal Engine 6 Preview Showcases Photorealistic Physics and Neural Lighting',
    'unreal-engine-6-preview-photorealistic-physics',
    'Epic Games reveals next-generation engine architecture featuring real-time neural path tracing and dynamic fluid dynamics.',
    'Epic Games hosted its annual developer summit, debuting Unreal Engine 6 with revolutionary graphics rendering pipelines.',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop',
    'Polygon',
    'https://polygon.com',
    '🎮 Gaming',
    '2026-07-23 13:40:00+00'
  ),
  (
    'art-8',
    'TypeScript 6.0 Ships Native WebAssembly Compilation and Instant Type Checker',
    'typescript-6-ships-native-wasm-compilation',
    'The latest major release rewritten in Rust delivers 50x faster type checking and direct compilation targets for serverless edge environments.',
    'Microsoft team has officially announced TypeScript 6.0, marking the biggest performance rewrite in the language history.',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop',
    'InfoQ',
    'https://infoq.com',
    '💻 Software',
    '2026-07-23 09:00:00+00'
  )
ON CONFLICT (id) DO NOTHING;
