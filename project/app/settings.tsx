import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  Bell, 
  Shield, 
  Moon, 
  Globe, 
  MapPin, 
  Users, 
  Eye, 
  Trash2,
  LogOut,
  ChevronRight,
  Volume2,
  Vibrate,
  Lock,
  Camera,
  MessageCircle,
  Calendar,
  UserCheck,
  Database,
  Download,
  Share2
} from 'lucide-react-native';
import { router } from 'expo-router';
import { ProfileAvatar } from '@/components/ProfileAvatar';
import { useProfile } from '@/contexts/ProfileContext';

interface SettingItem {
  id: string;
  title: string;
  description?: string;
  type: 'toggle' | 'navigation' | 'action';
  value?: boolean;
  icon: any;
  onPress?: () => void;
  destructive?: boolean;
}

export default function SettingsScreen() {
  const { userProfile } = useProfile();
  const [settings, setSettings] = useState({
    notifications: true,
    locationSharing: true,
    darkMode: true,
    soundEffects: true,
    vibration: true,
    showOnlineStatus: true,
    allowFriendRequests: true,
    showInLeaderboard: true,
    profileVisibility: true,
    allowPhotoTagging: true,
    shareEventActivity: true,
    allowDirectMessages: true,
    showCheckIns: true,
    dataCollection: false,
    analyticsSharing: false,
    profileSearchable: true,
    showLastSeen: true,
    allowGroupInvites: true,
    shareWithThirdParty: false,
  });

  const toggleSetting = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Slet konto',
      'Er du sikker på at du vil slette din konto? Denne handling kan ikke fortrydes.',
      [
        { text: 'Annuller', style: 'cancel' },
        {
          text: 'Slet konto',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Konto slettet', 'Din konto er blevet slettet.');
            router.replace('/auth');
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Log ud',
      'Er du sikker på at du vil logge ud?',
      [
        { text: 'Annuller', style: 'cancel' },
        {
          text: 'Log ud',
          onPress: () => {
            router.replace('/auth');
          },
        },
      ]
    );
  };

  const handleDownloadData = () => {
    Alert.alert(
      'Download dine data',
      'Vi sender dig en email med alle dine data inden for 24 timer.',
      [
        { text: 'OK' }
      ]
    );
  };

  const notificationSettings: SettingItem[] = [
    {
      id: 'notifications',
      title: 'Notifikationer',
      description: 'Modtag push notifikationer',
      type: 'toggle',
      value: settings.notifications,
      icon: Bell,
      onPress: () => toggleSetting('notifications'),
    },
    {
      id: 'soundEffects',
      title: 'Lydeffekter',
      description: 'Afspil lyde i appen',
      type: 'toggle',
      value: settings.soundEffects,
      icon: Volume2,
      onPress: () => toggleSetting('soundEffects'),
    },
    {
      id: 'vibration',
      title: 'Vibration',
      description: 'Vibrer ved notifikationer',
      type: 'toggle',
      value: settings.vibration,
      icon: Vibrate,
      onPress: () => toggleSetting('vibration'),
    },
  ];

  const privacySettings: SettingItem[] = [
    {
      id: 'locationSharing',
      title: 'Del lokation',
      description: 'Tillad venner at se din lokation',
      type: 'toggle',
      value: settings.locationSharing,
      icon: MapPin,
      onPress: () => toggleSetting('locationSharing'),
    },
    {
      id: 'showOnlineStatus',
      title: 'Online status',
      description: 'Vis når du er online',
      type: 'toggle',
      value: settings.showOnlineStatus,
      icon: UserCheck,
      onPress: () => toggleSetting('showOnlineStatus'),
    },
    {
      id: 'showLastSeen',
      title: 'Sidst set',
      description: 'Vis hvornår du sidst var aktiv',
      type: 'toggle',
      value: settings.showLastSeen,
      icon: Eye,
      onPress: () => toggleSetting('showLastSeen'),
    },
    {
      id: 'showCheckIns',
      title: 'Vis check-ins',
      description: 'Del dine check-ins med venner',
      type: 'toggle',
      value: settings.showCheckIns,
      icon: MapPin,
      onPress: () => toggleSetting('showCheckIns'),
    },
  ];

  const communicationSettings: SettingItem[] = [
    {
      id: 'allowFriendRequests',
      title: 'Venneanmodninger',
      description: 'Tillad andre at sende venneanmodninger',
      type: 'toggle',
      value: settings.allowFriendRequests,
      icon: Users,
      onPress: () => toggleSetting('allowFriendRequests'),
    },
    {
      id: 'allowDirectMessages',
      title: 'Direkte beskeder',
      description: 'Tillad beskeder fra andre brugere',
      type: 'toggle',
      value: settings.allowDirectMessages,
      icon: MessageCircle,
      onPress: () => toggleSetting('allowDirectMessages'),
    },
    {
      id: 'allowGroupInvites',
      title: 'Gruppe invitationer',
      description: 'Tillad invitationer til grupper',
      type: 'toggle',
      value: settings.allowGroupInvites,
      icon: Users,
      onPress: () => toggleSetting('allowGroupInvites'),
    },
    {
      id: 'allowPhotoTagging',
      title: 'Foto tagging',
      description: 'Tillad andre at tagge dig i billeder',
      type: 'toggle',
      value: settings.allowPhotoTagging,
      icon: Camera,
      onPress: () => toggleSetting('allowPhotoTagging'),
    },
  ];


  const dataSettings: SettingItem[] = [
    {
      id: 'dataCollection',
      title: 'Data indsamling',
      description: 'Tillad indsamling af brugsdata til forbedringer',
      type: 'toggle',
      value: settings.dataCollection,
      icon: Database,
      onPress: () => toggleSetting('dataCollection'),
    },
    {
      id: 'analyticsSharing',
      title: 'Analytics deling',
      description: 'Del anonyme analytics data',
      type: 'toggle',
      value: settings.analyticsSharing,
      icon: Share2,
      onPress: () => toggleSetting('analyticsSharing'),
    },
    {
      id: 'shareWithThirdParty',
      title: 'Tredjepartsdata',
      description: 'Del data med partnere (anbefales ikke)',
      type: 'toggle',
      value: settings.shareWithThirdParty,
      icon: Share2,
      onPress: () => toggleSetting('shareWithThirdParty'),
    },
    {
      id: 'downloadData',
      title: 'Download mine data',
      description: 'Få en kopi af alle dine data',
      type: 'action',
      icon: Download,
      onPress: handleDownloadData,
    },
  ];

  const appSettings: SettingItem[] = [
    {
      id: 'darkMode',
      title: 'Mørk tilstand',
      description: 'Brug mørkt tema',
      type: 'toggle',
      value: settings.darkMode,
      icon: Moon,
      onPress: () => toggleSetting('darkMode'),
    },
    {
      id: 'language',
      title: 'Sprog',
      description: 'Dansk',
      type: 'navigation',
      icon: Globe,
      onPress: () => Alert.alert('Sprog', 'Sprogindstillinger kommer snart'),
    },
  ];

  const accountSettings: SettingItem[] = [
    {
      id: 'logout',
      title: 'Log ud',
      description: 'Log ud af din konto',
      type: 'action',
      icon: LogOut,
      onPress: handleLogout,
    },
    {
      id: 'deleteAccount',
      title: 'Slet konto',
      description: 'Slet din konto permanent',
      type: 'action',
      icon: Trash2,
      onPress: handleDeleteAccount,
      destructive: true,
    },
  ];

  const renderSettingItem = (item: SettingItem) => {
    const IconComponent = item.icon;
    
    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.settingItem,
          item.destructive && styles.destructiveItem
        ]}
        onPress={item.onPress}
      >
        <View style={styles.settingLeft}>
          <View style={[
            styles.settingIcon,
            item.destructive && styles.destructiveIcon
          ]}>
            <IconComponent 
              size={20} 
              color={item.destructive ? "#ff3b30" : "#007AFF"} 
            />
          </View>
          <View style={styles.settingContent}>
            <Text style={[
              styles.settingTitle,
              item.destructive && styles.destructiveTitle
            ]}>
              {item.title}
            </Text>
            {item.description && (
              <Text style={styles.settingDescription}>
                {item.description}
              </Text>
            )}
          </View>
        </View>
        
        <View style={styles.settingRight}>
          {item.type === 'toggle' && (
            <Switch
              value={item.value}
              onValueChange={item.onPress}
              trackColor={{ false: '#333', true: '#007AFF' }}
              thumbColor={item.value ? '#fff' : '#f4f3f4'}
            />
          )}
          {item.type === 'navigation' && (
            <ChevronRight size={20} color="#666" />
          )}
          {item.type === 'action' && !item.destructive && (
            <ChevronRight size={20} color="#666" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderSection = (title: string, items: SettingItem[], description?: string) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {description && (
        <Text style={styles.sectionDescription}>{description}</Text>
      )}
      <View style={styles.sectionContent}>
        {items.map(renderSettingItem)}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Indstillinger</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* User Info */}
          <View style={styles.userSection}>
            <ProfileAvatar size={60} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{userProfile.name}</Text>
              <Text style={styles.userEmail}>{userProfile.email}</Text>
            </View>
          </View>

          {/* Settings Sections */}
          {renderSection('Notifikationer', notificationSettings)}
          
          {renderSection(
            'Profil & Synlighed', 
            privacySettings,
            'Kontroller hvem der kan se din profil og aktivitet'
          )}
          
          {renderSection(
            'Data & Privatliv', 
            dataSettings,
            'Administrer dine data og privatlivsindstillinger'
          )}
          
          {renderSection('App', appSettings)}
          {renderSection('Konto', accountSettings)}

          {/* Privacy Notice */}
          <View style={styles.privacyNotice}>
            <View style={styles.privacyIcon}>
              <Lock size={20} color="#007AFF" />
            </View>
            <Text style={styles.privacyTitle}>Dit privatliv er vigtigt</Text>
            <Text style={styles.privacyText}>
              NIGHTLY respekterer dit privatliv. Vi indsamler kun de data, der er nødvendige for at give dig den bedste oplevelse. Du har altid kontrol over dine data.
            </Text>
            <TouchableOpacity style={styles.privacyLink}>
              <Text style={styles.privacyLinkText}>Læs vores privatlivspolitik</Text>
            </TouchableOpacity>
          </View>

          {/* App Info */}
          <View style={styles.appInfoSection}>
            <Text style={styles.appInfoTitle}>NIGHTLY</Text>
            <Text style={styles.appInfoVersion}>Version 1.0.0</Text>
            <Text style={styles.appInfoCopyright}>© 2025 NIGHTLY. Alle rettigheder forbeholdes.</Text>
          </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
    marginBottom: 16,
    lineHeight: 20,
  },
  sectionContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  destructiveItem: {
    borderBottomColor: 'rgba(255, 59, 48, 0.1)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
  },
  destructiveIcon: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 2,
  },
  destructiveTitle: {
    color: '#ff3b30',
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
  settingRight: {
    marginLeft: 12,
  },
  privacyNotice: {
    marginHorizontal: 20,
    marginVertical: 24,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  privacyIcon: {
    alignSelf: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  privacyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  privacyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  privacyLink: {
    alignSelf: 'center',
  },
  privacyLinkText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  appInfoSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  appInfoTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    letterSpacing: 1,
    marginBottom: 8,
  },
  appInfoVersion: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
    marginBottom: 4,
  },
  appInfoCopyright: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
  },
});