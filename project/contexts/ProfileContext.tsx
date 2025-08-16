import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ProfileContextType {
  profileImage: string | null;
  setProfileImage: (image: string | null) => void;
  userProfile: {
    name: string;
    nickname: string;
    email: string;
    bio: string;
    age: string;
    location: string;
  };
  updateProfile: (updates: Partial<ProfileContextType['userProfile']>) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  // This is now just a fallback for when Supabase data isn't available
  const [userProfile, setUserProfile] = useState({
    name: 'Bruger',
    nickname: 'bruger',
    email: 'bruger@example.com',
    bio: 'Velkommen til NIGHTLY! 🎉',
    age: '25',
    location: 'København',
  });

  const updateProfile = (updates: Partial<typeof userProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  return (
    <ProfileContext.Provider value={{
      profileImage,
      setProfileImage,
      userProfile,
      updateProfile,
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}