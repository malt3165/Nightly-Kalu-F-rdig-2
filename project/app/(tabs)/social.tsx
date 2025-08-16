import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, RefreshControl } from 'react-native';
import { TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, UserPlus, Calendar, MapPin, Bell, MessageCircle, Search } from 'lucide-react-native';
import { router } from 'expo-router';
import { ProfileAvatar } from '@/components/ProfileAvatar';
import { useNotifications } from '@/contexts/NotificationContext';
import { useLiveData } from '@/contexts/LiveDataContext';

const { width } = Dimensions.get('window');

const mockFriends = [
  { id: '1', name: 'Anna', status: 'online', hasProfilePicture: true, isOnline: true },
  { id: '2', name: 'Lars', status: 'at Vega', hasProfilePicture: false, isOnline: true },
  { id: '3', name: 'Maria', status: 'offline', hasProfilePicture: true, isOnline: false },
  { id: '4', name: 'Peter', status: 'online', hasProfilePicture: false, isOnline: true },
];

const mockGroups = [
  { id: '1', name: 'Weekend Crew', members: 8, hasIcon: true },
  { id: '2', name: 'Electronic Lovers', members: 23, hasIcon: false },
  { id: '3', name: 'Party Animals', members: 15, hasIcon: false },
];

const mockPreparties = [
  {
    id: '1',
    host: 'Anna',
    location: 'Nørrebro',
    time: '20:00',
    attendees: 6,
    distance: '0.5 km',
    isHot: true,
  },
  {
    id: '2',
    host: 'Weekend Crew',
    location: 'Vesterbro',
    time: '19:30',
    attendees: 12,
    distance: '1.2 km',
    isHot: false,
  },
];

export default function SocialScreen() {
  const [activeTab, setActiveTab] = useState('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const { unreadCount } = useNotifications();
  const { recentCheckIns, refreshData, isRefreshing } = useLiveData();

  const handleFriendPress = (friend: any) => {
    router.push({
      pathname: '/friend-location',
      params: { 
        friendId: friend.id, 
        friendName: friend.name 
      }
    });
  };

  const handleNotificationPress = () => {
    router.push('/notifications');
  };

  const filteredFriends = mockFriends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroups = mockGroups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderFriends = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Venner ({filteredFriends.length})</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/friends')}
        >
          <UserPlus size={16} color="#007AFF" />
        </TouchableOpacity>
      </View>
      
      {/* Search */}
      <View style={styles.searchContainer}>
        <Search size={16} color="#666" />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Søg efter venner..."
          placeholderTextColor="#666"
        />
      </View>
      
      <View style={styles.cardsList}>
        {filteredFriends.map((friend) => (
          <TouchableOpacity 
            key={friend.id} 
            style={styles.friendCard}
            onPress={() => handleFriendPress(friend)}
          >
            <ProfileAvatar 
              size={40} 
              showOnlineIndicator={friend.isOnline}
            />
            <View style={styles.friendInfo}>
              <Text style={styles.friendName}>{friend.name}</Text>
              <Text style={[
                styles.friendStatus,
                friend.isOnline && styles.onlineStatus
              ]}>
                {friend.status}
              </Text>
            </View>
            <View style={styles.friendActions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => router.push({
                  pathname: '/chat/friend',
                  params: { friendId: friend.id, friendName: friend.name }
                })}
              >
                <MessageCircle size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderGroups = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Grupper ({filteredGroups.length})</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/groups')}
        >
          <Users size={16} color="#007AFF" />
        </TouchableOpacity>
      </View>
      
      {/* Search */}
      <View style={styles.searchContainer}>
        <Search size={16} color="#666" />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Søg efter grupper..."
          placeholderTextColor="#666"
        />
      </View>
      
      <View style={styles.cardsList}>
        {filteredGroups.map((group) => (
          <TouchableOpacity 
            key={group.id} 
            style={styles.groupCard}
            onPress={() => router.push(`/groups/${group.id}`)}
          >
            <View style={styles.groupHeader}>
              <View style={styles.groupAvatar}>
                <Users size={20} color="#fff" />
              </View>
            </View>
            <View style={styles.groupInfo}>
              <Text style={styles.groupName}>{group.name}</Text>
              <Text style={styles.groupMembers}>{group.members} medlemmer</Text>
            </View>
            <View style={styles.groupActions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={(e) => {
                  e.stopPropagation();
                  router.push({
                    pathname: '/chat/group',
                    params: { groupId: group.id, groupName: group.name }
                  });
                }}
              >
                <MessageCircle size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderPreparties = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Preparties ({mockPreparties.length})</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/preparty')}
        >
          <Calendar size={16} color="#007AFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.cardsList}>
        {mockPreparties.map((party) => (
          <TouchableOpacity key={party.id} style={styles.prepartyCard}>
            <View>
              <View style={styles.prepartyHeader}>
                <View style={styles.prepartyHostContainer}>
                  <Text style={styles.prepartyHost}>{party.host}</Text>
                  {party.isHot && (
                    <View style={styles.hotBadge}>
                      <Text style={styles.hotBadgeText}>🔥 HOT</Text>
                    </View>
                  )}
                </View>
              </View>
              <View style={styles.prepartyDetails}>
                <View style={styles.prepartyDetail}>
                  <MapPin size={14} color="#999" />
                  <Text style={styles.prepartyDetailText}>{party.location} • {party.distance}</Text>
                </View>
                <View style={styles.prepartyDetail}>
                  <Users size={14} color="#999" />
                  <Text style={styles.prepartyDetailText}>{party.attendees} deltagere</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.joinButton}
                onPress={() => router.push(`/preparty/${party.id}`)}
              >
                <Text style={styles.joinButtonText}>Deltag</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Social</Text>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={handleNotificationPress}
          >
            <Bell size={20} color="#fff" />
            {unreadCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <View style={styles.centeredTabs}>
            {[
              { key: 'friends', label: 'Venner', icon: Users },
              { key: 'groups', label: 'Grupper', icon: UserPlus },
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.tab, activeTab === tab.key && styles.activeTab]}
                  onPress={() => setActiveTab(tab.key)}
                >
                  <IconComponent size={16} color={activeTab === tab.key ? '#fff' : '#999'} />
                  <Text style={[
                    styles.tabText,
                    activeTab === tab.key && styles.activeTabText
                  ]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refreshData}
              tintColor="#007AFF"
              colors={['#007AFF']}
            />
          }
        >
          {/* Recent Check-ins */}
          {recentCheckIns.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Seneste check-ins</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.checkInsScroll}>
                {recentCheckIns.slice(0, 10).map((checkIn) => (
                  <View key={checkIn.id} style={styles.checkInCard}>
                    <ProfileAvatar size={32} />
                    <Text style={styles.checkInName}>{checkIn.userName}</Text>
                    <Text style={styles.checkInClub}>{checkIn.clubName}</Text>
                    <Text style={styles.checkInTime}>
                      {Math.floor((Date.now() - checkIn.timestamp) / 60000)}m siden
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {activeTab === 'friends' && renderFriends()}
          {activeTab === 'groups' && renderGroups()}
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
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  tabsContainer: {
    paddingVertical: 16,
  },
  centeredTabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 12,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    gap: 8,
    minWidth: 120,
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#999',
  },
  activeTabText: {
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    marginLeft: 8,
  },
  cardsList: {
    gap: 12,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
  },
  friendInfo: {
    flex: 1,
    marginLeft: 12,
  },
  friendName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 4,
  },
  friendStatus: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
  onlineStatus: {
    color: '#4ade80',
  },
  friendActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  chatButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 14,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  groupCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  groupAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 4,
  },
  groupMembers: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
  groupActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  groupChatButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  checkInsScroll: {
    paddingLeft: 20,
  },
  checkInCard: {
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    width: 80,
  },
  checkInName: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginTop: 6,
    textAlign: 'center',
  },
  checkInClub: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#007AFF',
    marginTop: 2,
    textAlign: 'center',
  },
  checkInTime: {
    fontSize: 9,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 2,
    textAlign: 'center',
  },
});