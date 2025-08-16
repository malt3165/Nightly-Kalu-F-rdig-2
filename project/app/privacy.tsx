import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Shield, Eye, EyeOff, MapPin, Users, Camera, MessageCircle, Calendar, UserCheck, Database, Download, Share2, Lock, Globe, Bell, Search, Heart, Clock, Trash2, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { router } from 'expo-router';

interface PrivacySetting {
  id: string;
  title: string;
  description: string;
  type: 'toggle' | 'action';
  value?: boolean;
  icon: any;
  onPress?: () => void;
  warning?: boolean;
  recommended?: boolean;
}

export default function PrivacyScreen() {
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: true,
    profileSearchable: true,
    locationSharing: false,
    showOnlineStatus: true,
    showLastSeen: false,
    showCheckIns: true,
    allowFriendRequests: true,
    allowDirectMessages: true,
    allowGroupInvites: true,
    allowPhotoTagging: false,
    shareEventActivity: true,
    showInLeaderboard: true,
    dataCollection: false,
    analyticsSharing: false,
    shareWithThirdParty: false,
    allowPushNotifications: true,
    allowMarketingEmails: false,
    allowPersonalizedAds: false,
    shareActivityWithFriends: true,
    allowPublicProfile: false,
    showFriendsList: false,
    allowStrangerMessages: false,
    allowDataExport: true,
    simpleSegmentation: true,
    personalizedMarketing: false,
    marketingPushNotifications: false,
  });

  const toggleSetting = (key: string) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleDeleteAllData = () => {
    Alert.alert(
      'Slet alle data',
      'Dette vil slette ALLE dine data permanent, inklusive profil, venner, beskeder og aktivitet. Denne handling kan IKKE fortrydes.',
      [
        { text: 'Annuller', style: 'cancel' },
        {
          text: 'Slet alt',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Data slettet', 'Alle dine data er blevet slettet permanent.');
            router.replace('/auth');
          },
        },
      ]
    );
  };

  const handleDownloadData = () => {
    Alert.alert(
      'Download dine data',
      'Vi sender dig en email med alle dine data i et læsbart format inden for 24 timer.',
      [
        { text: 'OK' }
      ]
    );
  };

  const handleDataPortability = () => {
    Alert.alert(
      'Dataportabilitet',
      'Du kan eksportere dine data til andre tjenester. Vi sender dig en struktureret fil med alle dine data.',
      [
        { text: 'Annuller', style: 'cancel' },
        { text: 'Eksporter data', onPress: handleDownloadData }
      ]
    );
  };

  const mobilepaySettings: PrivacySetting[] = [
    {
      id: 'mobilepayImprovement',
      title: 'For at forbedre NIGHTLY',
      description: 'Vi bruger data om dig til at gøre NIGHTLY bedre.',
      type: 'action',
      icon: Database,
      onPress: () => Alert.alert('Info', 'Data vi bruger information'),
    },
  ];

  const marketingSettings: PrivacySetting[] = [
    {
      id: 'simpleSegmentation',
      title: 'For at lave simpel segmentering i markedsføring',
      description: 'Vi bruger nogle grundlæggende profildata for at give dig relevant markedsføring, anbefalinger og tilbud. Du kan altid vælge det fra.',
      type: 'toggle',
      value: privacySettings.simpleSegmentation,
      icon: Share2,
      onPress: () => toggleSetting('simpleSegmentation'),
    },
    {
      id: 'personalizedMarketing',
      title: 'For at lave personlig markedsføring',
      description: 'Vi bruger dine personlige data til at give dig relevante tilbud og anbefalinger. Du kan altid slå dit samtykke til – og trække det tilbage ved at slå det fra.',
      type: 'toggle',
      value: privacySettings.personalizedMarketing,
      icon: Heart,
      onPress: () => toggleSetting('personalizedMarketing'),
    },
    {
      id: 'marketingPushNotifications',
      title: 'Markedsføring via push-notifikationer',
      description: 'Det gør, at vi kan sende dig markedsføring via push-notifikationer om vores produkter. Du kan altid slå dit samtykke til – og trække det tilbage ved at slå det fra.',
      type: 'toggle',
      value: privacySettings.marketingPushNotifications,
      icon: Bell,
      onPress: () => toggleSetting('marketingPushNotifications'),
    },
  ];

  const renderSettingItem = (item: PrivacySetting) => {
    const IconComponent = item.icon;
    
    return (
      <View key={item.id} style={styles.settingItem}>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          <Text style={styles.settingDescription}>{item.description}</Text>
          {item.type === 'action' && (
            <TouchableOpacity onPress={item.onPress}>
              <Text style={styles.dataLink}>Data vi bruger.</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {item.type === 'toggle' && (
          <View style={styles.settingRight}>
            <Switch
              value={item.value}
              onValueChange={item.onPress}
              trackColor={{ false: '#E5E5EA', true: '#34C759' }}
              thumbColor="#fff"
              ios_backgroundColor="#E5E5EA"
            />
          </View>
        )}
      </View>
    );
  };

  const renderSection = (title: string, items: PrivacySetting[], showTitle = true) => (
    <View style={styles.section}>
      {showTitle && <Text style={styles.sectionTitle}>{title}</Text>}
      <View style={styles.sectionContent}>
        {items.map((item, index) => (
          <View key={item.id}>
            {renderSettingItem(item)}
            {index < items.length - 1 && <View style={styles.itemDivider} />}
          </View>
        ))}
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
            <ArrowLeft size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mine data, som NIGHTLY bruger</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* NIGHTLY Section */}
          {renderSection('', mobilepaySettings, false)}
          
          {/* Marketing Sections */}
          {renderSection('', marketingSettings, false)}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#000',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 35,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 16,
  },
  sectionContent: {
    backgroundColor: '#1a1a1a',
    marginHorizontal: 0,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
  },
  settingContent: {
    flex: 1,
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 17,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    marginBottom: 4,
    lineHeight: 22,
  },
  settingDescription: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#999',
    lineHeight: 18,
    marginBottom: 4,
  },
  dataLink: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#007AFF',
  },
  settingRight: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  itemDivider: {
    height: 0.5,
    backgroundColor: '#333',
    marginLeft: 16,
  },
});