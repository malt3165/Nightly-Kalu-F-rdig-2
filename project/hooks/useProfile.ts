import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
      setError(null);
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching profile for user:', user?.email);

      // Try to fetch from Supabase first
      if (process.env.EXPO_PUBLIC_SUPABASE_URL && process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user!.id)
          .single();

        if (error) {
          console.error('Error fetching profile from Supabase:', error);
          
          // If profile doesn't exist, try to fetch by email
          if (error.code === 'PGRST116') {
            console.log('Profile not found by ID, trying by email...');
            const { data: emailData, error: emailError } = await supabase
              .from('profiles')
              .select('*')
              .eq('email', user!.email!)
              .single();

            if (emailError) {
              console.error('Error fetching profile by email:', emailError);
              setError('Profil ikke fundet. Prøv at logge ud og ind igen.');
            } else {
              console.log('Profile found by email:', emailData);
              setProfile(emailData);
            }
          } else {
            setError('Kunne ikke hente profil data.');
          }
        } else {
          console.log('Profile fetched successfully:', data);
          setProfile(data);
        }
      } else {
        // Fallback for development mode
        console.log('Using mock profile data for development');
        const mockProfile: Profile = {
          id: user!.id,
          email: user!.email!,
          full_name: 'Test Bruger',
          nickname: 'Test',
          bio: 'Dette er en test profil',
          age: 25,
          location: 'København',
          profile_image_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setProfile(mockProfile);
      }
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
      setError('Der opstod en uventet fejl.');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      setError(null);

      // Check if Supabase is properly configured
      if (!process.env.EXPO_PUBLIC_SUPABASE_URL || !process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
        console.log('Supabase not configured, using mock update');
        // Update local state for development
        setProfile(prev => prev ? { ...prev, ...updates } : null);
        return { error: null };
      }

      console.log('Updating profile with:', updates);

      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user!.id);

      if (error) {
        console.error('Error updating profile:', error);
        return { error };
      }

      // Update local state
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      console.log('Profile updated successfully');
      return { error: null };
    } catch (error) {
      console.error('Unexpected error updating profile:', error);
      return { error: { message: 'Der opstod en uventet fejl' } };
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    refetch: fetchProfile,
  };
}