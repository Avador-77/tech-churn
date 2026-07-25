import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ToastProvider } from '@/context/ToastContext';
import { AuthProvider } from '@/context/AuthContext';
import { SavedProvider } from '@/context/SavedContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AuthModal } from '@/components/AuthModal';
import { PwaInstaller } from '@/components/PwaInstaller';

export const metadata: Metadata = {
  title: 'TechChurn — Next-Gen Tech News Feed & AI Companion',
  description: 'Stay ahead of technology trends with rich news cards, interactive bookmarks, Supabase authentication, and an integrated AI story assistant.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/icon-192.png',
  },
  openGraph: {
    title: 'TechChurn — Next-Gen Tech News Feed',
    description: 'Real-time technology news, AI story analysis, and bookmarking.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#06b6d4',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark bg-neutral-950 text-neutral-100 antialiased">
      <body className="min-h-screen flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
        <ToastProvider>
          <AuthProvider>
            <SavedProvider>
              <Header />
              <PwaInstaller />
              <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
                {children}
              </main>
              <Footer />
              <AuthModal />
            </SavedProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
