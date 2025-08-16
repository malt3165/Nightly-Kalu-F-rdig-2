import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, MessageCircle } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ProfileAvatar } from '@/components/ProfileAvatar';

const mockCheckedInFriends = [
  {
    id: '1',
    name: 'Anna K.',
    checkedInAt: Date.now() - 1800000, // 30 min ago
    hasProfilePicture: true,
  },
  {
    id: '2',
    name: 'Lars M.',
    checkedInAt: Date.now() - 900000, // 15 min ago
    hasProfilePicture: false,
  },
  {
    id: '3',
    name: 'Maria S.',
    checkedInAt: Date.now() - 300000, // 5 min ago
    hasProfilePicture: true,
  },
  {
    id: '4',
    name: 'Peter J.',
    checkedInAt: Date.now() - 600000, // 10 min ago
    hasProfilePicture: false,
  },
  {
    id: '5',
    name: 'Sofia L.',
    checkedInAt: Date.now() - 1200000, // 20 min ago
    hasProfilePicture: true,
  },
];

export default function ClubFriendsScreen() {
  const { clubId, clubName } = useLocalSearchParams();

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Lige nu';
    if (minutes < 60) return `${minutes} min siden`;
    
    const hours = Math.floor(minutes / 60);
    return `${hours} timer siden`;
  };

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
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Venner her</Text>
            <Text style={styles.headerSubtitle}>{clubName}</Text>
          </View>
          <View style={styles.headerRight} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Friends Count */}
          <View style={styles.countSection}>
            <Text style={styles.countNumber}>{mockCheckedInFriends.length}</Text>
            <Text style={styles.countLabel}>
              {mockCheckedInFriends.length === 1 ? 'ven er' : 'venner er'} checked ind
            </Text>
          </View>

          {/* Friends List */}
          <View style={styles.friendsSection}>
            <Text style={styles.sectionTitle}>Checked ind venner</Text>
            <View style={styles.friendsList}>
              {mockCheckedInFriends.map((friend) => (
                <View key={friend.id} style={styles.friendCard}>
                  <View style={styles.friendInfo}>
                    <ProfileAvatar size={48} showOnlineIndicator={true} />
                    <View style={styles.friendDetails}>
                      <Text style={styles.friendName}>{friend.name}</Text>
                      <Text style={styles.friendTime}>
                        Checked ind {formatTimeAgo(friend.checkedInAt)}
                      </Text>
                    </View>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.messageButton}
                    onPress={() => router.push({
                      pathname: '/chat/friend',
                      params: { 
                        friendId: friend.id, 
                        friendName: friend.name 
                      }
                    })}
                  >
                    <MessageCircle size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          {/* Info Section */}
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Om check-ins</Text>
            <Text style={styles.infoText}>
              Dine venner bliver kun vist her hvis de har valgt at dele deres check-ins med venner. 
              Du kan ændre dine egne indstillinger under Profil → Indstillinger → Privatliv.
            </Text>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
    marginTop: 2,
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  countSection: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#1a1a1a',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
  },
  countNumber: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  countLabel: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#fff',
  },
  friendsSection: {
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginBottom: 16,
  },
  friendsList: {
    gap: 12,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  friendDetails: {
    marginLeft: 12,
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 4,
  },
  friendTime: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
  messageButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
  },
  infoSection: {
    marginHorizontal: 20,
    marginTop: 32,
    marginBottom: 40,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
    lineHeight: 20,
  },
});