'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { UserSession } from '@/lib/types';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: (promptText?: string) => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, fullName: string) => Promise<boolean>;
  demoLogin: () => void;
  logout: () => Promise<void>;
  authModalPrompt: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'techchurn_demo_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalPrompt, setAuthModalPrompt] = useState('Log in to continue');
  const { showToast } = useToast();

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    async function initAuth() {
      if (supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              user_metadata: {
                full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
              },
            });
          } else {
            setIsAuthModalOpen(true);
            setAuthModalPrompt('Create an account to unlock TechChurn news feed & AI features');
          }
        } catch (error) {
          console.error('Supabase auth session error:', error);
        }

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              user_metadata: {
                full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
              },
            });
          } else {
            setUser(null);
          }
        });

        setLoading(false);
        return () => {
          authListener?.subscription.unsubscribe();
        };
      } else {
        try {
          const savedDemoUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
          if (savedDemoUser) {
            setUser(JSON.parse(savedDemoUser));
          } else {
            // First time visit without saved session -> open Sign Up modal automatically
            setIsAuthModalOpen(true);
            setAuthModalPrompt('Create an account to unlock TechChurn news feed & AI features');
          }
        } catch (e) {
          console.error('Failed to load demo user', e);
          setIsAuthModalOpen(true);
        }
        setLoading(false);
      }
    }

    initAuth();
  }, [supabase]);

  const openAuthModal = useCallback((promptText = 'Log in to continue') => {
    setAuthModalPrompt(promptText);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        showToast(error.message, 'error');
        return false;
      }
      showToast('Successfully logged in!', 'success');
      closeAuthModal();
      return true;
    } else {
      const demoUser: UserSession = {
        id: 'demo-user-123',
        email,
        user_metadata: { full_name: email.split('@')[0] || 'Demo User' },
      };
      setUser(demoUser);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(demoUser));
      showToast('Logged in (Demo Mode)', 'success');
      closeAuthModal();
      return true;
    }
  };

  const signup = async (email: string, password: string, fullName: string): Promise<boolean> => {
    if (supabase) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });
      if (error) {
        showToast(error.message, 'error');
        return false;
      }
      showToast('Account created! Check your email to verify.', 'success');
      closeAuthModal();
      return true;
    } else {
      const demoUser: UserSession = {
        id: 'demo-user-123',
        email,
        user_metadata: { full_name: fullName },
      };
      setUser(demoUser);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(demoUser));
      showToast('Account created! (Demo Mode)', 'success');
      closeAuthModal();
      return true;
    }
  };

  const demoLogin = () => {
    const demoUser: UserSession = {
      id: 'demo-user-123',
      email: 'tech.innovator@example.com',
      user_metadata: { full_name: 'Alex Rivera' },
    };
    setUser(demoUser);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(demoUser));
    showToast('Welcome, Alex Rivera! Signed in as Demo User', 'success');
    closeAuthModal();
  };

  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    showToast('Logged out successfully', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        login,
        signup,
        demoLogin,
        logout,
        authModalPrompt,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
