import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { User } from 'lucide-react-native';
import { useProfile as useSupabaseProfile } from '@/hooks/useProfile';
import { useProfile as useLocalProfile } from '@/contexts/ProfileContext';

interface ProfileAvatarProps {
  size?: number;
  onPress?: () => void;
  showOnlineIndicator?: boolean;
  style?: any;
}

export function ProfileAvatar({ 
  size = 48, 
  onPress, 
  showOnlineIndicator = false,
  style 
}: ProfileAvatarProps) {
  const { profile } = useSupabaseProfile();
  const { profileImage, userProfile } = useLocalProfile();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const avatarStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  // Use Supabase profile if available, otherwise fallback to local profile
  const displayImage = profile?.profile_image_url || profileImage;
  const displayName = profile?.full_name || userProfile.name;

  const content = (
    <View style={[styles.container, style]}>
      <View style={[styles.avatar, avatarStyle]}>
        {displayImage ? (
          <Image source={{ uri: displayImage }} style={[styles.image, avatarStyle]} />
        ) : displayName ? (
          <View style={[styles.initialsAvatar, avatarStyle]}>
            <Text style={[styles.initialsText, { fontSize: size * 0.4 }]}>
              {getInitials(displayName)}
            </Text>
          </View>
        ) : (
          <View style={[styles.defaultAvatar, avatarStyle]}>
            <User size={size * 0.4} color="#666" />
          </View>
        )}
      </View>
      
      {showOnlineIndicator && (
        <View style={[
          styles.onlineIndicator,
          {
            width: size * 0.25,
            height: size * 0.25,
            borderRadius: size * 0.125,
            right: size * 0.05,
            top: size * 0.05,
            borderWidth: size * 0.05,
          }
        ]} />
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  avatar: {
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  defaultAvatar: {
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsAvatar: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  onlineIndicator: {
    position: 'absolute',
    backgroundColor: '#4ade80',
    borderColor: '#000',
  },
});