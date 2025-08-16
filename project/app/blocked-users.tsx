import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search, UserX, MessageCircle, Shield, Clock as Unlock } from 'lucide-react-native';
import { router } from 'expo-router';
import { ProfileAvatar } from '@/components/ProfileAvatar';

interface BlockedUser {
  id: string;
  name: string;
  email: string;
  blockedAt: string;
  reason?: string;
  hasProfilePicture: boolean;
}

const mockBlockedUsers: BlockedUser[] = [
  {
    id: '1',
    name: 'Spam Bruger',
    email: 'spam@example.com',
    blockedAt: '2025-01-20T14:30:00Z',
    reason: 'Upassende beskeder',
    hasProfilePicture: false,
  },
  {
    id: '2',
    name: 'Ukendt Person',
    email: 'unknown@example.com',
    blockedAt: '2025-01-18T09:15:00Z',
    reason: 'Uønsket kontakt',
    hasProfilePicture: true,
  },
];

export default function BlockedUsersScreen() {
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>(mockBlockedUsers);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = blockedUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUnblockUser = (userId: string, userName: string) => {
    Alert.alert(
      'Fjern blokering',
      `Er du sikker på at du vil fjerne blokeringen af ${userName}? De vil igen kunne kontakte dig.`,
      [
        { text: 'Annuller', style: 'cancel' },
        {
          text: 'Fjern blokering',
          onPress: () => {
            setBlockedUsers(prev => prev.filter(user => user.id !== userId));
            Alert.alert('Blokering fjernet', `${userName} er ikke længere blokeret`);
          },
        },
      ]
    );
  };

  const formatBlockedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('da-DK', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  };

  const renderBlockedUser = (user: BlockedUser) => (
    <View key={user.id} style={styles.userCard}>
      <View style={styles.userInfo}>
        <ProfileAvatar size={48} />
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Text style={styles.blockedDate}>
            Blokeret {formatBlockedDate(user.blockedAt)}
          </Text>
          {user.reason && (
            <Text style={styles.blockReason}>Årsag: {user.reason}</Text>
          )}
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.unblockButton}
        onPress={() => handleUnblockUser(user.id, user.name)}
      >
        <Unlock size={16} color="#4ade80" />
        <Text style={styles.unblockButtonText}>Fjern blokering</Text>
      </TouchableOpacity>
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
          <Text style={styles.headerTitle}>Blokerede brugere</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Search */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Søg efter blokerede brugere..."
              placeholderTextColor="#666"
            />
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Info Section */}
          <View style={styles.infoSection}>
            <View style={styles.infoIcon}>
              <Shield size={24} color="#007AFF" />
            </View>
            <Text style={styles.infoTitle}>Blokerede brugere</Text>
            <Text style={styles.infoText}>
              Brugere du har blokeret kan ikke sende dig beskeder, venneanmodninger eller se din profil. 
              Du kan fjerne blokeringen når som helst.
            </Text>
          </View>

          {/* Blocked Users List */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {filteredUsers.length === 0 && searchQuery 
                ? 'Ingen resultater'
                : `${filteredUsers.length} blokerede brugere`
              }
            </Text>

            {filteredUsers.length === 0 ? (
              <View style={styles.emptyState}>
                <View style={styles.emptyStateIcon}>
                  {searchQuery ? (
                    <Search size={48} color="#666" />
                  ) : (
                    <UserX size={48} color="#666" />
                  )}
                </View>
                <Text style={styles.emptyStateTitle}>
                  {searchQuery ? 'Ingen brugere fundet' : 'Ingen blokerede brugere'}
                </Text>
                <Text style={styles.emptyStateText}>
                  {searchQuery 
                    ? 'Prøv at søge efter noget andet'
                    : 'Du har ikke blokeret nogen brugere endnu'
                  }
                </Text>
              </View>
            ) : (
              <View style={styles.usersList}>
                {filteredUsers.map(renderBlockedUser)}
              </View>
            )}
          </View>

          {/* Help Section */}
          <View style={styles.helpSection}>
            <Text style={styles.helpTitle}>Sådan blokerer du brugere</Text>
            <View style={styles.helpList}>
              <Text style={styles.helpText}>• Gå til brugerens profil</Text>
              <Text style={styles.helpText}>• Tryk på menu knappen (⋯)</Text>
              <Text style={styles.helpText}>• Vælg "Bloker bruger"</Text>
              <Text style={styles.helpText}>• Bekræft din beslutning</Text>
            </View>
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
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
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
    width: 32,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    marginLeft: 12,
  },
  scrollView: {
    flex: 1,
  },
  infoSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  infoIcon: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateIcon: {
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
    textAlign: 'center',
  },
  usersList: {
    gap: 12,
  },
  userCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userDetails: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
    marginBottom: 4,
  },
  blockedDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 4,
  },
  blockReason: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#ff6b6b',
    fontStyle: 'italic',
  },
  unblockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    borderColor: '#4ade80',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
  },
  unblockButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#4ade80',
  },
  helpSection: {
    marginHorizontal: 20,
    marginBottom: 40,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
  },
  helpTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginBottom: 12,
  },
  helpList: {
    gap: 8,
  },
  helpText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ccc',
    lineHeight: 20,
  },
});