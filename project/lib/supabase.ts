import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

// Demo credentials that work in all modes
export const DEMO_CREDENTIALS = {
  email: 'test@example.com',
  password: 'test123'
};

// Always use mock mode for now
const FORCE_MOCK_MODE = true;

// Mock storage for demo users
const mockUsers = new Map([
  [DEMO_CREDENTIALS.email, {
    id: 'demo-user-1',
    email: DEMO_CREDENTIALS.email,
    password: DEMO_CREDENTIALS.password,
    user_metadata: {
      full_name: 'Demo Bruger',
      nickname: 'Demo',
    }
  }]
]);

// Mock profiles storage
const mockProfiles = new Map([
  ['demo-user-1', {
    id: 'demo-user-1',
    email: DEMO_CREDENTIALS.email,
    full_name: 'Demo Bruger',
    nickname: 'Demo',
    bio: 'Dette er en demo profil',
    age: 25,
    location: 'København',
    profile_image_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }]
]);

// Create a mock Supabase client that always works
const createMockClient = () => {
  let currentSession: any = null;
  let authListeners: Array<(event: string, session: any) => void> = [];

  return {
    auth: {
      getSession: async () => {
        console.log('Mock: Getting session');
        return { 
          data: { session: currentSession }, 
          error: null 
        };
      },
      
      signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
        console.log('Mock: Sign in attempt:', email);
        
        const user = mockUsers.get(email.toLowerCase());
        if (!user || user.password !== password) {
          return {
            data: { user: null, session: null },
            error: { message: 'Forkert email eller adgangskode. Prøv igen.' }
          };
        }

        const session = {
          user: {
            id: user.id,
            email: user.email,
            user_metadata: user.user_metadata
          },
          access_token: 'mock-token',
          refresh_token: 'mock-refresh-token'
        };

        currentSession = session;
        
        // Notify listeners
        authListeners.forEach(listener => {
          listener('SIGNED_IN', session);
        });

        return {
          data: { user: session.user, session },
          error: null
        };
      },

      signUp: async ({ email, password, options }: any) => {
        console.log('Mock: Sign up attempt:', email);
        
        if (mockUsers.has(email.toLowerCase())) {
          return {
            data: { user: null, session: null },
            error: { message: 'Denne email adresse er allerede i brug. Prøv at logge ind i stedet.' }
          };
        }

        const userId = `user-${Date.now()}`;
        const user = {
          id: userId,
          email: email.toLowerCase(),
          password,
          user_metadata: options?.data || {}
        };

        mockUsers.set(email.toLowerCase(), user);

        // Create profile
        const profile = {
          id: userId,
          email: email.toLowerCase(),
          full_name: options?.data?.full_name || 'Ny Bruger',
          nickname: options?.data?.nickname || 'Bruger',
          bio: 'Velkommen til NIGHTLY! 🎉',
          age: options?.data?.age || null,
          location: options?.data?.location || null,
          profile_image_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        mockProfiles.set(userId, profile);

        const session = {
          user: {
            id: userId,
            email: user.email,
            user_metadata: user.user_metadata
          },
          access_token: 'mock-token',
          refresh_token: 'mock-refresh-token'
        };

        currentSession = session;

        // Notify listeners
        authListeners.forEach(listener => {
          listener('SIGNED_UP', session);
        });

        return {
          data: { user: session.user, session },
          error: null
        };
      },

      signOut: async () => {
        console.log('Mock: Sign out');
        const oldSession = currentSession;
        currentSession = null;
        
        // Notify listeners
        authListeners.forEach(listener => {
          listener('SIGNED_OUT', null);
        });

        return { error: null };
      },

      onAuthStateChange: (callback: (event: string, session: any) => void) => {
        authListeners.push(callback);
        return {
          data: {
            subscription: {
              unsubscribe: () => {
                authListeners = authListeners.filter(l => l !== callback);
              }
            }
          }
        };
      }
    },

    from: (table: string) => ({
      select: (columns: string = '*') => ({
        eq: (column: string, value: any) => ({
          single: async () => {
            console.log(`Mock: SELECT ${columns} FROM ${table} WHERE ${column} = ${value}`);
            
            if (table === 'profiles') {
              const profile = Array.from(mockProfiles.values()).find(p => 
                (column === 'id' && p.id === value) || 
                (column === 'email' && p.email === value)
              );
              
              if (profile) {
                return { data: profile, error: null };
              } else {
                return { 
                  data: null, 
                  error: { code: 'PGRST116', message: 'No rows found' } 
                };
              }
            }
            
            return { data: null, error: { message: 'Table not found' } };
          }
        }),
        limit: (count: number) => ({
          then: async (resolve: any) => {
            console.log(`Mock: SELECT ${columns} FROM ${table} LIMIT ${count}`);
            resolve({ data: [], error: null });
          }
        })
      }),
      
      insert: (data: any) => ({
        then: async (resolve: any) => {
          console.log(`Mock: INSERT INTO ${table}`, data);
          
          if (table === 'profiles') {
            mockProfiles.set(data.id, data);
          }
          
          resolve({ data, error: null });
        }
      }),
      
      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          then: async (resolve: any) => {
            console.log(`Mock: UPDATE ${table} SET ... WHERE ${column} = ${value}`, data);
            
            if (table === 'profiles') {
              const existing = mockProfiles.get(value);
              if (existing) {
                const updated = { ...existing, ...data, updated_at: new Date().toISOString() };
                mockProfiles.set(value, updated);
              }
            }
            
            resolve({ data, error: null });
          }
        })
      })
    })
  };
};

// Always use mock client for now
export const supabase = createMockClient() as any;

export const testConnection = async () => {
  try {
    console.log('Testing mock connection...');
    return {
      success: true,
      message: 'Mock client er aktiv og klar til brug'
    };
  } catch (error) {
    return {
      success: false,
      message: `Mock connection fejl: ${error instanceof Error ? error.message : 'Ukendt fejl'}`
    };
  }
};

export const isUsingRealSupabase = () => {
  return false; // Always return false since we're forcing mock mode
};