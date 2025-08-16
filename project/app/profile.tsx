import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Camera, CreditCard as Edit3, Save, MapPin, Calendar, Users, Trophy, Star, Settings, User, Image as ImageIcon, Trash2 } from 'lucide-react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ProfileAvatar } from '@/components/ProfileAvatar';
import { useProfile as useSupabaseProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { user } = useAuth();
  const { profile, loading, error, updateProfile } = useSupabaseProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [localProfile, setLocalProfile] = useState({
    full_name: '',
    nickname: '',
    bio: '',
    age: '',
    location: '',
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Update local profile when Supabase profile loads
  React.useEffect(() => {
    if (profile) {
      console.log('Setting local profile from Supabase data:', profile);
      setLocalProfile({
        full_name: profile.full_name || '',
        nickname: profile.nickname || '',
        bio: profile.bio || '',
        age: profile.age?.toString() || '',
        location: profile.location || '',
      });
      setProfileImage(profile.profile_image_url);
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      const updates = {
        full_name: localProfile.full_name.trim(),
        nickname: localProfile.nickname.trim(),
        bio: localProfile.bio.trim(),
        age: localProfile.age ? parseInt(localProfile.age) : null,
        location: localProfile.location.trim(),
        profile_image_url: profileImage,
      };

      console.log('Saving profile updates:', updates);

      const { error } = await updateProfile(updates);
      
      if (error) {
        console.error('Error updating profile:', error);
        Alert.alert('Fejl', 'Kunne ikke opdatere profil. Prøv igen.');
        return;
      }

      Alert.alert('Succes', 'Profil opdateret!');
      setIsEditing(false);
    } catch (error) {
      console.error('Unexpected error saving profile:', error);
      Alert.alert('Fejl', 'Der opstod en uventet fejl. Prøv igen.');
    }
  };

  const requestPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    return {
      camera: cameraPermission.granted,
      media: mediaPermission.granted
    };
  };

  const pickImageFromGallery = async () => {
    try {
      const permissions = await requestPermissions();
      
      if (!permissions.media) {
        Alert.alert(
          'Tilladelse påkrævet', 
          'Du skal give tilladelse til at få adgang til dit galleri for at vælge et billede.',
          [
            { text: 'OK' },
            { text: 'Åbn indstillinger', onPress: () => ImagePicker.requestMediaLibraryPermissionsAsync() }
          ]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        selectionLimit: 1,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
        Alert.alert('Succes', 'Profilbillede opdateret! Husk at gemme ændringerne.');
      }
    } catch (error) {
      console.error('Error picking image from gallery:', error);
      Alert.alert('Fejl', 'Der opstod en fejl ved valg af billede fra galleriet.');
    }
  };

  const takePhotoWithCamera = async () => {
    try {
      const permissions = await requestPermissions();
      
      if (!permissions.camera) {
        Alert.alert(
          'Tilladelse påkrævet', 
          'Du skal give tilladelse til at bruge kameraet for at tage et billede.',
          [
            { text: 'OK' },
            { text: 'Åbn indstillinger', onPress: () => ImagePicker.requestCameraPermissionsAsync() }
          ]
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
        Alert.alert('Succes', 'Profilbillede opdateret! Husk at gemme ændringerne.');
      }
    } catch (error) {
      console.error('Error taking photo with camera:', error);
      Alert.alert('Fejl', 'Der opstod en fejl ved brug af kameraet.');
    }
  };

  const removeProfileImage = () => {
    Alert.alert(
      'Fjern profilbillede',
      'Er du sikker på at du vil fjerne dit profilbillede?',
      [
        { text: 'Annuller', style: 'cancel' },
        {
          text: 'Fjern',
          style: 'destructive',
          onPress: () => {
            setProfileImage(null);
            Alert.alert('Succes', 'Profilbillede fjernet! Husk at gemme ændringerne.');
          }
        }
      ]
    );
  };

  const showImageOptions = () => {
    const options = [
      { text: 'Annuller', style: 'cancel' },
      { text: 'Tag foto', onPress: takePhotoWithCamera },
      { text: 'Vælg fra galleri', onPress: pickImageFromGallery },
    ];

    if (profileImage) {
      options.push({ 
        text: 'Fjern billede', 
        onPress: removeProfileImage, 
        style: 'destructive' 
      });
    }

    Alert.alert(
      'Profilbillede',
      'Hvordan vil du opdatere dit profilbillede?',
      options
    );
  };

  const achievements = [
    { icon: '🔥', title: 'Party Starter', description: 'Deltaget i 50+ events' },
    { icon: '👑', title: 'Social Butterfly', description: '100+ venner' },
    { icon: '🎯', title: 'Explorer', description: 'Besøgt 25+ steder' },
  ];

  const stats = [
    { label: 'Events', value: '47', icon: Calendar },
    { label: 'Venner', value: '23', icon: Users },
    { label: 'Check-ins', value: '156', icon: MapPin },
    { label: 'Rating', value: '4.8', icon: Star },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Indlæser profil...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.retryButtonText}>Gå tilbage</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Ingen profil data fundet</Text>
        <Text style={styles.errorSubtext}>
          Prøv at logge ud og ind igen, eller kontakt support hvis problemet fortsætter.
        </Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.retryButtonText}>Gå tilbage</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Min Profil</Text>
          
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => {
              if (isEditing) {
                handleSave();
              } else {
                setIsEditing(true);
              }
            }}
          >
            <Text style={styles.editButtonText}>
              {isEditing ? 'Gem' : 'Rediger'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Picture Section */}
          <View style={styles.profileSection}>
            <View style={styles.profilePictureContainer}>
              <ProfileAvatar 
                size={120} 
                onPress={isEditing ? showImageOptions : undefined}
                showOnlineIndicator={true}
              />
            </View>
            
            <Text style={styles.profileName}>{profile.full_name}</Text>
            <Text style={styles.profileNickname}>@{profile.nickname}</Text>
            <Text style={styles.profileEmail}>{profile.email}</Text>
            
            {profile.location && (
              <View style={styles.locationContainer}>
                <MapPin size={16} color="#999" />
                <Text style={styles.locationText}>{profile.location}</Text>
              </View>
            )}

            {/* Image Actions */}
            {isEditing && (
              <View style={styles.imageActions}>
                <TouchableOpacity 
                  style={styles.imageActionButton}
                  onPress={pickImageFromGallery}
                >
                  <ImageIcon size={16} color="#007AFF" />
                  <Text style={styles.imageActionText}>Galleri</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.imageActionButton}
                  onPress={takePhotoWithCamera}
                >
                  <Camera size={16} color="#007AFF" />
                  <Text style={styles.imageActionText}>Kamera</Text>
                </TouchableOpacity>
                
                {profileImage && (
                  <TouchableOpacity 
                    style={[styles.imageActionButton, styles.removeActionButton]}
                    onPress={removeProfileImage}
                  >
                    <Trash2 size={16} color="#ff3b30" />
                    <Text style={[styles.imageActionText, styles.removeActionText]}>Fjern</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          {/* Stats Grid */}
          <View style={styles.statsContainer}>
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <View key={index} style={styles.statCard}>
                  <View style={styles.statIconContainer}>
                    <IconComponent size={20} color="#007AFF" />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              );
            })}
          </View>

          {/* Bio Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Om mig</Text>
            <View style={styles.bioContainer}>
              {isEditing ? (
                <TextInput
                  style={styles.bioInput}
                  value={localProfile.bio}
                  onChangeText={(text) => setLocalProfile({...localProfile, bio: text})}
                  placeholder="Fortæl lidt om dig selv..."
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={3}
                />
              ) : (
                <Text style={styles.bioText}>
                  {profile.bio || 'Ingen beskrivelse endnu...'}
                </Text>
              )}
            </View>
          </View>

          {/* Achievements */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Præstationer</Text>
            <View style={styles.achievementsContainer}>
              {achievements.map((achievement, index) => (
                <View key={index} style={styles.achievementCard}>
                  <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                  <View style={styles.achievementInfo}>
                    <Text style={styles.achievementTitle}>{achievement.title}</Text>
                    <Text style={styles.achievementDescription}>{achievement.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Profile Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profil detaljer</Text>
            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Fulde navn</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.detailInput}
                    value={localProfile.full_name}
                    onChangeText={(text) => setLocalProfile({...localProfile, full_name: text})}
                    placeholder="Indtast dit fulde navn"
                    placeholderTextColor="#999"
                  />
                ) : (
                  <Text style={styles.detailValue}>{profile.full_name}</Text>
                )}
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Kælenavn</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.detailInput}
                    value={localProfile.nickname}
                    onChangeText={(text) => setLocalProfile({...localProfile, nickname: text})}
                    placeholder="Indtast dit kælenavn"
                    placeholderTextColor="#999"
                  />
                ) : (
                  <Text style={styles.detailValue}>@{profile.nickname}</Text>
                )}
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Email</Text>
                <Text style={[styles.detailValue, styles.emailValue]}>{profile.email}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Alder</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.detailInput}
                    value={localProfile.age}
                    onChangeText={(text) => setLocalProfile({...localProfile, age: text})}
                    placeholder="Indtast din alder"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                  />
                ) : (
                  <Text style={styles.detailValue}>
                    {profile.age ? `${profile.age} år` : 'Ikke angivet'}
                  </Text>
                )}
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Lokation</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.detailInput}
                    value={localProfile.location}
                    onChangeText={(text) => setLocalProfile({...localProfile, location: text})}
                    placeholder="Indtast din by"
                    placeholderTextColor="#999"
                  />
                ) : (
                  <Text style={styles.detailValue}>
                    {profile.location || 'Ikke angivet'}
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hurtige handlinger</Text>
            <TouchableOpacity 
              style={styles.singleActionButton}
              onPress={() => router.push('/settings')}
            >
              <Settings size={20} color="#007AFF" />
              <Text style={styles.quickActionText}>Indstillinger</Text>
            </TouchableOpacity>
          </View>

          {isEditing && (
            <View style={styles.editActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => {
                  setIsEditing(false);
                  // Reset to original profile data
                  if (profile) {
                    setLocalProfile({
                      full_name: profile.full_name || '',
                      nickname: profile.nickname || '',
                      bio: profile.bio || '',
                      age: profile.age?.toString() || '',
                      location: profile.location || '',
                    });
                    setProfileImage(profile.profile_image_url);
                  }
                }}
              >
                <Text style={styles.cancelButtonText}>Annuller</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Gem ændringer</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
    marginBottom: 12,
  },
  errorSubtext: {
    color: '#999',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#000',
  },
  headerButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  profilePictureContainer: {
    marginBottom: 20,
  },
  profileName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginBottom: 4,
  },
  profileNickname: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#999',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#007AFF',
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
    marginLeft: 4,
  },
  imageActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  imageActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  removeActionButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  imageActionText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#007AFF',
  },
  removeActionText: {
    color: '#ff3b30',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 32,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statIconContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#999',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginBottom: 16,
  },
  bioContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
  },
  bioInput: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  bioText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ccc',
    lineHeight: 24,
  },
  achievementsContainer: {
    gap: 12,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
  detailsContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    overflow: 'hidden',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  detailLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#999',
  },
  detailValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  detailInput: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    textAlign: 'right',
    minWidth: 120,
  },
  emailValue: {
    color: '#007AFF',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  singleActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
  },
  quickActionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#007AFF',
    marginLeft: 8,
  },
  editActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#999',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#007AFF',
  },
});