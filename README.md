# ⚡ TechPulse — Next-Gen Tech News Feed MVP

A modern, fast, responsive technology news feed web application built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, **Supabase**, and an **AI Story Companion**. Designed for live 10-minute demonstrations and production deployment on Vercel.

---

## ✨ Features

- 📰 **Visual Tech News Feed**: Visually rich cards featuring category badges, relative publication dates, read time estimates, and responsive hover effects.
- 🏷️ **Category Filtering**: Instant filtering across **🤖 AI**, **📱 Smartphones**, **💻 Software**, **🔐 Cybersecurity**, **🚀 Startups**, **🎮 Gaming**, **🌌 Space**, and **⚡ Gadgets**.
- 🔍 **Real-Time Search & Sorting**: Search by title, text, or source and sort by latest or popular stories.
- 📖 **Dedicated Article Detail Pages**: Full reading view with executive summary cards, original source links, and like/save/share toolbars.
- 🔐 **Supabase Authentication**: Full support for email sign-up/login, session persistence, and a **One-Click Demo Mode Login** for instant reviewer evaluation.
- ❤️ **Like & Bookmark System**: Save articles to your personal `/saved` library and toggle likes with optimistic UI state updates.
- 🤖 **AI News Companion**: Interactive AI chat modal connected to each article. Supports quick prompts (*"Explain this simply"*, *"Why is this important?"*, *"What is the impact?"*) and custom user queries. Powered by Google Gemini 1.5 with built-in fallback engine.
- 📱 **Progressive Web App (PWA)**: Installable web app manifest, offline service worker caching, and install prompt banner.

---

## 🚀 Local Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key_here

# Optional: Google Gemini API Key for live AI LLM completions
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Supabase Setup & Database Schema

1. Go to your [Supabase Dashboard](https://database.new) and create a new project.
2. Navigate to the **SQL Editor** tab.
3. Open the schema file included in this project: [`supabase/schema.sql`](file:///C:/Users/rajat/OneDrive/Desktop/techChurn/supabase/schema.sql).
4. Paste the SQL script into the editor and click **Run**.

### Schema Summary:
- **`profiles`**: Stores user full names linked to `auth.users(id)`.
- **`articles`**: Stores tech news articles (id, title, slug, summary, content, image_url, source_name, category, published_at).
- **`article_likes`**: Tracks article likes (`user_id` + `article_id` unique constraint).
- **`saved_articles`**: Tracks user bookmarks (`user_id` + `article_id` unique constraint).
- **Row Level Security (RLS)**: Configured so articles are publicly readable, while likes and saved articles are scoped strictly to the authenticated user.

---

## 📦 Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit — TechPulse MVP"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```
*Note: `.env.local` is listed in `.gitignore` to keep credentials secure.*

---

## 🌐 Deploying to Vercel

1. Push your code to GitHub.
2. Go to [Vercel Dashboard](https://vercel.com/new) and import your repository.
3. In the **Environment Variables** section, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `GEMINI_API_KEY` (Optional)
4. Click **Deploy**.
5. In your Supabase Dashboard under **Authentication -> URL Configuration**, add your Vercel deployment domain (e.g. `https://your-app.vercel.app`) to the **Redirect URLs**.

---

## 📲 PWA Installation

### Mobile (iOS / Android)
- **Safari (iOS)**: Tap the Share button -> Tap **"Add to Home Screen"**.
- **Chrome (Android)**: Tap the menu (3 dots) -> Tap **"Install App"** or click the floating banner.

### Desktop (Chrome / Edge / Brave)
- Click the **Install** icon in the address bar or click **"Install App"** in the top navigation header.

---

## 🛠️ Verification & Quality Assurance

- **Type Check**: `npx tsc --noEmit`
- **Lint Check**: `npm run lint`
- **Production Build**: `npm run build`
