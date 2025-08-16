import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, DEMO_CREDENTIALS } from '@/lib/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  connectionStatus: 'connected' | 'disconnected' | 'mock' | 'checking';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'mock' | 'checking'>('mock');

  useEffect(() => {
    let mounted = true;

    // Always use mock mode for now
    setConnectionStatus('mock');

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('Getting initial session...');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        }
        
        console.log('Initial session:', session?.user?.email || 'No session');
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email || 'No session');
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      setLoading(true);
      console.log('Signing up user:', email);

      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password,
        options: {
          data: {
            full_name: `${userData.firstName} ${userData.lastName}`,
            nickname: userData.firstName,
            age: parseInt(userData.age),
            location: `${userData.city}, ${userData.postalCode}`,
          }
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        return { error };
      }

      console.log('Sign up successful:', data.user?.email);
      return { error: null };
    } catch (error) {
      console.error('Sign up catch error:', error);
      return { error: { message: 'Der opstod en fejl ved oprettelse af konto. Prøv igen.' } };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Signing in user:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
        return { error };
      }

      console.log('Sign in successful:', data.user?.email);
      return { error: null };
    } catch (error) {
      console.error('Sign in catch error:', error);
      return { error: { message: 'Der opstod en fejl ved login. Prøv igen.' } };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      console.log('Signing out user...');
      await supabase.auth.signOut();
      console.log('Sign out successful');
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      session,
      user,
      loading,
      signUp,
      signIn,
      signOut,
      connectionStatus,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}