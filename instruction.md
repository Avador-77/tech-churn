# Tech News Feed MVP — Build Instructions

Build a polished, modern, fully functional technology news feed web application using:

* Next.js with App Router
* TypeScript
* Tailwind CSS
* Supabase
* PWA support
* Vercel-compatible architecture

The goal is to create a **working MVP that can be demonstrated within 10 minutes**. Prioritize functionality that is actually working over creating placeholder features.

---

## 1. CORE USER EXPERIENCE

The application should allow a user to:

1. Open the application and browse a modern technology news feed.
2. See technology news displayed as visually rich cards.
3. Open a detailed view of a news article.
4. Like/unlike an article.
5. Save/unsave an article.
6. View saved articles.
7. Share an article using the Web Share API or copy the article link.
8. Register and log in using Supabase Authentication.
9. Ask an AI question about a specific article.

All implemented features must be functional.

Do not create buttons that only look functional without actually performing their intended action.

---

# 2. UI/UX — HIGH PRIORITY

The visual quality of the application is extremely important.

Create a modern, premium technology-focused design.

The application should feel like a polished real product, not a basic tutorial project.

Use:

* Modern typography
* Excellent spacing
* Responsive layouts
* Beautiful article cards
* Rounded corners
* Subtle shadows
* Smooth transitions
* Hover effects
* Micro-interactions
* Toast notifications
* Skeleton loading states
* Beautiful empty states
* Error states

Use Lucide Icons or another high-quality icon library.

Use emojis appropriately for technology categories and friendly UI elements.

Use SVGs and visual illustrations where appropriate.

Maintain a professional balance between:

* Icons
* Emojis
* SVGs
* Typography
* Images

Do not make the interface visually plain.

---

# 3. RESPONSIVE DESIGN

The application must work beautifully on:

* Mobile phones
* Tablets
* Laptops
* Desktop screens

The mobile experience is very important.

Make the feed feel natural to scroll on mobile.

Use touch-friendly buttons and responsive article cards.

Do not simply shrink the desktop design.

---

# 4. HOME FEED

Create a homepage with a modern technology news feed.

Each article card should display:

* Article image
* Category
* Title
* Short summary
* Source
* Published date
* Like button
* Save button
* Share button
* "Ask AI" button

Use realistic technology news seed data so the application works immediately after setup.

The seed data should contain multiple articles across categories such as:

* 🤖 AI
* 📱 Smartphones
* 💻 Software
* 🔐 Cybersecurity
* 🚀 Startups
* 🎮 Gaming
* 🌌 Space
* ⚡ Gadgets

Use high-quality image URLs or reliable image sources.

If an image fails, display a beautiful fallback visual instead of a broken image.

Add category filtering.

The user should be able to:

* View all news
* Select a category
* See the feed update accordingly

---

# 5. ARTICLE DETAIL PAGE

Create a dedicated article detail page.

Example:

```text
/article/[id]
```

The page should contain:

* Large article image
* Category
* Title
* Summary/content
* Source
* Publication date
* Like button
* Save button
* Share button
* AI News Companion

Make the article reading experience visually polished.

---

# 6. AUTHENTICATION

Use Supabase Authentication.

Implement:

* Sign up
* Login
* Logout
* Session persistence

Use the following environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

I will provide the actual values in `.env.local`.

Do not hardcode credentials.

Unauthenticated users may browse public news.

Require authentication for:

* Like
* Save
* AI questions

If an unauthenticated user attempts a protected action, show a beautiful login/signup prompt.

---

# 7. LIKE FUNCTIONALITY

Authenticated users must be able to:

* Like an article
* Unlike an article

Store likes in Supabase.

Ensure:

* One like per user per article
* No duplicate likes
* Like state persists after refresh

Use optimistic UI where appropriate.

---

# 8. SAVE FUNCTIONALITY

Authenticated users must be able to:

* Save an article
* Unsave an article

Create:

```text
/saved
```

The Saved page should display the user's saved articles.

Include a beautiful empty state when no articles have been saved.

All saved data must persist in Supabase.

---

# 9. SHARE FUNCTIONALITY

Implement:

1. Web Share API where supported.
2. Copy-link fallback where Web Share API is unavailable.

Show a toast notification after successfully copying a link.

The shared URL must open the correct article detail page.

---

# 10. AI NEWS COMPANION

Implement a working AI feature for individual articles.

The user should be able to click:

> Ask AI About This Story

The UI should open a beautiful chat interface or dialog connected to that specific article.

Include suggested questions such as:

* 💡 Explain this simply
* 🤔 Why is this important?
* 🌍 What is the impact?
* 🧠 What should I remember?

The user can also type a custom question.

The AI should receive the selected article's:

* Title
* Summary
* Content
* Category

The AI should answer based primarily on that article.

The AI should:

* Explain technical topics clearly.
* Support beginner-friendly explanations.
* Avoid inventing information.
* Clearly state when the article does not provide enough information.

The AI API key must never be exposed in client-side code.

Implement the AI request through a secure server-side route or server action.

If an AI API key has not yet been configured, create the integration architecture cleanly and document the required environment variable in `.env.example` and `README.md`.

Do not fake an AI response and claim it is a real AI integration.

---

# 11. SUPABASE DATABASE

Create the minimum required database schema.

Use these tables:

### profiles

* id
* full_name
* created_at

### articles

* id
* title
* slug
* summary
* content
* image_url
* source_name
* source_url
* category
* published_at
* created_at

### article_likes

* id
* user_id
* article_id
* created_at

Ensure:

```text
user_id + article_id
```

is unique.

### saved_articles

* id
* user_id
* article_id
* created_at

Ensure duplicate saves are prevented.

Use appropriate Row Level Security policies.

Users must only be able to modify their own likes and saved articles.

Published articles should be publicly readable.

---

# 12. PWA

Make the application a Progressive Web App.

Implement:

* Web App Manifest
* Application name
* Short name
* Description
* Icons
* Theme color
* Standalone display mode
* Service worker or appropriate PWA configuration

The application should be installable on compatible mobile devices.

Create a polished app icon if needed using an appropriate SVG or generated visual.

---

# 13. PROJECT QUALITY

Use:

* TypeScript
* Reusable components
* Clean project structure
* Proper loading states
* Proper error states
* Responsive design
* Accessible buttons and labels

Avoid unnecessary complexity.

Do not implement advanced features such as:

* Complex recommendation algorithms
* Public comments
* Messaging
* Notifications
* Advanced admin dashboards

Those will be added later.

Focus on making the current features genuinely functional.

---

# 14. README.md

Create a complete `README.md` containing:

## Local Setup

```bash
npm install
npm run dev
```

## Environment Variables

Explain how to create `.env.local` and add:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Document any AI environment variable separately if required.

## Supabase Setup

Explain:

* How to create the required tables
* How to run the SQL schema/migrations
* How to configure authentication
* How to configure RLS policies

## Push to GitHub

Include:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

Make sure `.env.local` is ignored by Git.

## Deploy to Vercel

Explain:

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Add all environment variables in Vercel.
4. Deploy.
5. Configure Supabase authentication redirect URLs for the Vercel domain.

## PWA Installation

Explain how to install the application on supported mobile devices.

---

# IMPORTANT IMPLEMENTATION INSTRUCTION

First inspect the existing project.

Then implement the MVP in a focused manner.

Prioritize the following order:

1. Modern visual design and responsive layout
2. Supabase connection and authentication
3. News feed with real database/seed data
4. Article detail page
5. Like functionality
6. Save functionality
7. Saved articles page
8. Share functionality
9. Working AI article assistant
10. PWA support
11. README and deployment instructions

Do not create fake buttons or non-functional features.

Every implemented feature must work.

After implementation:

* Run type checking.
* Run linting.
* Run the production build.
* Fix all errors.
* Verify authentication.
* Verify Supabase operations.
* Verify article interactions.
* Verify the application is responsive.
* Verify PWA configuration.

The final result should be visually impressive enough for a live 10-minute demonstration while keeping the implementation focused, stable, and genuinely functional.
