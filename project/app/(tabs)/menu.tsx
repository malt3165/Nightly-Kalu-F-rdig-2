import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Alert, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Star, Heart, Lock, Hand, CircleHelp as HelpCircle, Info, Users, UserPlus, Calendar, Trophy, Crown, Settings, LogOut, ChevronRight, Shield, Camera, Image as ImageIcon } from 'lucide-react-native';
import { router } from 'expo-router';
import { ProfileAvatar } from '@/components/ProfileAvatar';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile as useSupabaseProfile } from '@/hooks/useProfile';
import { useProfile as useLocalProfile } from '@/contexts/ProfileContext';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

const wishlistItems = [
  {
    id: 'add_friends',
    title: 'Tilføj ønske',
    icon: Star,
    color: '#007AFF',
  },
  {
    id: 'wishlist',
    title: 'Ønskelister',
    icon: Heart,
    color: '#007AFF',
  },
];

const premiumItems = [
  {
    id: 'premium',
    title: 'NIGHTLY Premium',
    icon: Crown,
    route: '/subscription',
    isPremium: true,
  },
];

const settingsItems = [
  {
    id: 'personal_info',
    title: 'Personlige oplysninger',
    icon: User,
    route: '/personal-info',
  },
  {
    id: 'settings',
    title: 'Indstillinger',
    icon: Settings,
    route: '/settings',
  },
  {
    id: 'help',
    title: 'Hjælp og support',
    icon: HelpCircle,
    route: '/help-support',
  },
  {
    id: 'about',
    title: 'Om',
    icon: Info,
    route: '/about',
  },
  {
    id: 'logout',
    title: 'Log ud',
    icon: LogOut,
    destructive: true,
  },
];

const menuItems = [
  {
    id: 'friends',
    title: 'Venner',
    subtitle: 'Se og administrer dine venner',
    icon: Users,
    route: '/friends',
  },
  {
    id: 'add_friends',
    title: 'Tilføj venner',
    subtitle: 'Find og tilføj nye venner',
    icon: UserPlus,
    route: '/add-friends',
  },
  {
    id: 'events',
    title: 'Begivenheder',
    subtitle: 'Se kommende begivenheder',
    icon: Calendar,
    route: '/events',
  },
  {
    id: 'achievements',
    title: 'Præstationer',
    subtitle: 'Se dine præstationer og badges',
    icon: Trophy,
    route: '/achievements',
  },
];

export default function MenuScreen() {
  const { signOut } = useAuth();
  const { profile } = useSupabaseProfile();
  const { updateProfile } = useSupabaseProfile();
  const { userProfile, setProfileImage } = useLocalProfile();
  const [aboutText, setAboutText] = React.useState('');
  const [isEditing, setIsEditing] = React.useState(false);
  const [showImageModal, setShowImageModal] = React.useState(false);

  // Update local state when profile loads
  React.useEffect(() => {
    if (profile?.bio) {
      setAboutText(profile.bio);
    }
  }, [profile]);

  const handleSaveAbout = async () => {
    try {
      if (!aboutText.trim()) {
        Alert.alert('Fejl', 'Skriv venligst noget om dig selv');
        return;
      }

      const { error } = await updateProfile({
        bio: aboutText.trim(),
      });
      
      if (error) {
        console.error('Error updating bio:', error);
        Alert.alert('Fejl', 'Kunne ikke gemme ændringer. Prøv igen.');
        return;
      }

      console.log('Bio updated successfully:', aboutText.trim());
      Alert.alert('Succes', 'Om mig er opdateret!');
      setIsEditing(false);
    } catch (error) {
      console.error('Unexpected error saving bio:', error);
      Alert.alert('Fejl', 'Der opstod en uventet fejl. Prøv igen.');
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Tilladelse påkrævet', 'Du skal give tilladelse til at få adgang til dit galleri.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        // Update profile image in context
        setProfileImage(result.assets[0].uri);
        Alert.alert('Succes', 'Profilbillede opdateret!');
        setShowImageModal(false);
      }
    } catch (error) {
      Alert.alert('Fejl', 'Der opstod en fejl ved valg af billede.');
    }
  };

  const takePhotoWithCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Tilladelse påkrævet', 'Du skal give tilladelse til at bruge kameraet.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        // Update profile image in context
        setProfileImage(result.assets[0].uri);
        Alert.alert('Succes', 'Profilbillede opdateret!');
        setShowImageModal(false);
      }
    } catch (error) {
      Alert.alert('Fejl', 'Der opstod en fejl ved brug af kameraet.');
    }
  };

  const handleMenuPress = (item: any) => {
    if (item.route) {
      router.push(item.route as any);
    } else if (item.id === 'logout') {
      handleLogout();
    } else {
      Alert.alert('Kommer snart', `${item.title} funktionalitet kommer snart`);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Log ud',
      'Er du sikker på at du vil logge ud af din konto?',
      [
        { 
          text: 'Annuller', 
          style: 'cancel' 
        },
        {
          text: 'Log ud',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/auth');
          },
        },
      ]
    );
  };


  // Use Supabase profile if available, otherwise fallback to local profile
  const displayName = profile?.full_name || userProfile.name;
  const displayPhone = '+45 60 18 62 00'; // Mock phone number

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mig</Text>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <ProfileAvatar size={60} />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{displayName}</Text>
              <Text style={styles.profilePhone}>{displayPhone}</Text>
            </View>
            <TouchableOpacity 
              style={styles.editProfileButton}
              onPress={() => setShowImageModal(true)}
            >
              <Text style={styles.editProfileText}>Skift billede</Text>
            </TouchableOpacity>
          </View>

          {/* Om mig Section - Simple text box */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Om mig</Text>
            <View style={styles.aboutMeTextContainer}>
              {isEditing ? (
                <>
                  <TextInput
                    style={styles.aboutMeInput}
                    value={aboutText}
                    onChangeText={setAboutText}
                    placeholder="Skriv lidt om dig selv..."
                    placeholderTextColor="#666"
                    multiline
                    numberOfLines={4}
                    maxLength={500}
                    autoFocus
                  />
                  <View style={styles.editActions}>
                    <TouchableOpacity 
                      style={styles.cancelButton}
                      onPress={() => {
                        setIsEditing(false);
                        setAboutText(profile?.bio || '');
                      }}
                    >
                      <Text style={styles.cancelButtonText}>Annuller</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.saveAboutButton}
                      onPress={handleSaveAbout}
                    >
                      <Text style={styles.saveAboutButtonText}>Gem</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.aboutMeText}>
                    {profile?.bio || 'Skriv lidt om dig selv...'}
                  </Text>
                  <TouchableOpacity 
                    onPress={() => setIsEditing(true)}
                  >
                    <Text style={styles.editAboutButtonText}>Rediger</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>

          {/* Settings List */}
          <View style={styles.menuSection}>
            {/* Premium Card */}
            <View style={styles.cardGroup}>
              {premiumItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.menuCard, styles.premiumCard]}
                    onPress={() => handleMenuPress(item)}
                  >
                    <View style={styles.cardContent}>
                      <View style={[styles.cardIcon, styles.premiumIcon]}>
                        <IconComponent size={20} color="#D4AF37" />
                      </View>
                      <Text style={[styles.cardTitle, styles.premiumTitle]}>
                        {item.title}
                      </Text>
                    </View>
                    <ChevronRight size={20} color="#8E8E93" />
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Settings Cards */}
            <View style={styles.cardGroup}>
              {settingsItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.menuCard,
                      item.destructive && styles.destructiveCard
                    ]}
                    onPress={() => handleMenuPress(item)}
                  >
                    <View style={styles.cardContent}>
                      <View style={[
                        styles.cardIcon,
                        item.destructive && styles.destructiveIcon
                      ]}>
                        <IconComponent 
                          size={20} 
                          color={item.destructive ? "#ff3b30" : "#007AFF"}
                        />
                      </View>
                      <Text style={[
                        styles.cardTitle,
                        item.destructive && styles.destructiveTitle
                      ]}>
                        {item.title}
                      </Text>
                    </View>
                    <ChevronRight size={20} color="#8E8E93" />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>

        {/* Image Picker Modal */}
        <Modal
          visible={showImageModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowImageModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity 
                style={styles.modalOption}
                onPress={takePhotoWithCamera}
              >
                <Camera size={24} color="#007AFF" />
                <Text style={styles.modalOptionText}>Tag billede</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalOption}
                onPress={pickImageFromGallery}
              >
                <ImageIcon size={24} color="#007AFF" />
                <Text style={styles.modalOptionText}>Vælg fra biblioteket</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalOption, styles.cancelOption]}
                onPress={() => setShowImageModal(false)}
              >
                <Text style={styles.cancelOptionText}>Annuller</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 32,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  profileName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 4,
  },
  profilePhone: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
  editProfileButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  editProfileText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 12,
  },
  aboutMeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  aboutMeTextContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  aboutMeText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ccc',
    lineHeight: 24,
    minHeight: 60,
    marginBottom: 12,
  },
  aboutMeInput: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    lineHeight: 24,
    minHeight: 100,
    marginBottom: 12,
    textAlignVertical: 'top',
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#999',
  },
  saveAboutButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  saveAboutButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  editAboutButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  editAboutButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#007AFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#000',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    justifyContent: 'center',
    gap: 12,
  },
  modalOptionText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#007AFF',
  },
  cancelOption: {
    backgroundColor: '#1a1a1a',
    marginTop: 8,
  },
  cancelOptionText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  menuSection: {
    paddingHorizontal: 20,
    gap: 20,
  },
  cardGroup: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1C1C1E',
    borderBottomWidth: 0.5,
    borderBottomColor: '#38383A',
  },
  premiumCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    marginHorizontal: 4,
    marginVertical: 4,
    borderBottomWidth: 0,
  },
  destructiveCard: {
    borderBottomColor: 'rgba(255, 59, 48, 0.2)',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  premiumIcon: {
    backgroundColor: '#2C2C2E',
  },
  destructiveIcon: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  cardTitle: {
    fontSize: 17,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  premiumTitle: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
  },
  destructiveTitle: {
    color: '#FF3B30',
  },
});