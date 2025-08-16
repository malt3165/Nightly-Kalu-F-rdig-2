import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Users, UserPlus, UserMinus, Crown, Settings, Share2, MessageCircle, Search, Check, X } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ProfileAvatar } from '@/components/ProfileAvatar';

interface GroupMember {
  id: string;
  name: string;
  isOwner: boolean;
  joinedAt: string;
  hasProfilePicture: boolean;
  isOnline: boolean;
}

interface Friend {
  id: string;
  name: string;
  hasProfilePicture: boolean;
  isOnline: boolean;
  isInGroup: boolean;
}

interface GroupDetails {
  id: string;
  name: string;
  description: string;
  isOwner: boolean;
  ownerName: string;
  createdAt: string;
  members: GroupMember[];
  avatar: string;
}

const mockGroupData: { [key: string]: GroupDetails } = {
  '1': {
    id: '1',
    name: 'Weekend Crew',
    description: 'Vores faste weekend gruppe til at planlægge fester og events',
    isOwner: true,
    ownerName: 'Dig',
    createdAt: '2025-01-15T10:00:00Z',
    avatar: '👥',
    members: [
      { id: '1', name: 'Anna', isOwner: false, joinedAt: '2025-01-16T10:00:00Z', hasProfilePicture: true, isOnline: true },
      { id: '2', name: 'Lars', isOwner: false, joinedAt: '2025-01-16T14:30:00Z', hasProfilePicture: false, isOnline: false },
      { id: '3', name: 'Maria', isOwner: false, joinedAt: '2025-01-17T09:15:00Z', hasProfilePicture: true, isOnline: true },
      { id: '4', name: 'Peter', isOwner: false, joinedAt: '2025-01-18T16:45:00Z', hasProfilePicture: false, isOnline: true },
      { id: '5', name: 'Sofia', isOwner: false, joinedAt: '2025-01-19T11:20:00Z', hasProfilePicture: true, isOnline: false },
      { id: '6', name: 'Oliver', isOwner: false, joinedAt: '2025-01-20T13:10:00Z', hasProfilePicture: false, isOnline: true },
      { id: '7', name: 'Emma', isOwner: false, joinedAt: '2025-01-21T08:30:00Z', hasProfilePicture: true, isOnline: true },
    ]
  },
  '2': {
    id: '2',
    name: 'Electronic Lovers',
    description: 'For dem der elsker elektronisk musik og techno events',
    isOwner: false,
    ownerName: 'Anna',
    createdAt: '2025-01-10T15:30:00Z',
    avatar: '🎵',
    members: [
      { id: '1', name: 'Anna', isOwner: true, joinedAt: '2025-01-10T15:30:00Z', hasProfilePicture: true, isOnline: true },
      { id: '2', name: 'Dig', isOwner: false, joinedAt: '2025-01-12T10:00:00Z', hasProfilePicture: true, isOnline: true },
      { id: '3', name: 'Mikkel', isOwner: false, joinedAt: '2025-01-13T14:20:00Z', hasProfilePicture: false, isOnline: false },
      { id: '4', name: 'Caroline', isOwner: false, joinedAt: '2025-01-14T16:45:00Z', hasProfilePicture: true, isOnline: true },
      { id: '5', name: 'Magnus', isOwner: false, joinedAt: '2025-01-15T09:30:00Z', hasProfilePicture: false, isOnline: false },
    ]
  }
};

const mockFriends: Friend[] = [
  { id: '8', name: 'Frederik', hasProfilePicture: false, isOnline: true, isInGroup: false },
  { id: '9', name: 'Maja', hasProfilePicture: true, isOnline: false, isInGroup: false },
  { id: '10', name: 'Kasper', hasProfilePicture: false, isOnline: true, isInGroup: false },
  { id: '11', name: 'Line', hasProfilePicture: true, isOnline: true, isInGroup: false },
  { id: '12', name: 'Tobias', hasProfilePicture: false, isOnline: false, isInGroup: false },
  { id: '13', name: 'Camilla', hasProfilePicture: true, isOnline: true, isInGroup: false },
];

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  
  const group = mockGroupData[id as string];

  if (!group) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <Text style={styles.errorText}>Gruppe ikke fundet</Text>
        </SafeAreaView>
      </View>
    );
  }

  const totalMembers = group.members.length + (group.isOwner ? 1 : 0);
  const onlineMembers = group.members.filter(m => m.isOnline).length + (group.isOwner ? 1 : 0);

  const filteredFriends = mockFriends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !friend.isInGroup
  );

  const handleRemoveMember = (memberId: string, memberName: string) => {
    if (!group.isOwner) {
      Alert.alert('Fejl', 'Kun ejeren kan fjerne medlemmer');
      return;
    }

    Alert.alert(
      'Fjern medlem',
      `Er du sikker på at du vil fjerne ${memberName} fra gruppen?`,
      [
        { text: 'Annuller', style: 'cancel' },
        {
          text: 'Fjern',
          style: 'destructive',
          onPress: () => Alert.alert('Medlem fjernet', `${memberName} er fjernet fra gruppen`)
        }
      ]
    );
  };

  const handleLeaveGroup = () => {
    Alert.alert(
      'Forlad gruppe',
      `Er du sikker på at du vil forlade "${group.name}"?`,
      [
        { text: 'Annuller', style: 'cancel' },
        {
          text: 'Forlad',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Gruppe forladt', 'Du har forladt gruppen');
            router.back();
          }
        }
      ]
    );
  };

  const handleEditGroup = () => {
    router.push(`/groups/edit/${id}`);
  };

  const handleShareGroup = () => {
    Alert.alert('Del gruppe', 'Gruppe link kopieret til udklipsholder!');
  };

  const toggleFriendSelection = (friendId: string) => {
    setSelectedFriends(prev => 
      prev.includes(friendId) 
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleSendInvites = () => {
    if (selectedFriends.length === 0) {
      Alert.alert('Ingen valgt', 'Vælg mindst én ven at invitere');
      return;
    }

    const selectedNames = mockFriends
      .filter(f => selectedFriends.includes(f.id))
      .map(f => f.name)
      .join(', ');

    Alert.alert(
      'Invitationer sendt!',
      `Invitationer er sendt til: ${selectedNames}`,
      [
        {
          text: 'OK',
          onPress: () => {
            setSelectedFriends([]);
            setShowInviteModal(false);
          }
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('da-DK', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  };

  const formatJoinedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('da-DK', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const renderMember = (member: GroupMember, showActions = false) => (
    <View key={member.id} style={styles.memberCard}>
      <View style={styles.memberInfo}>
        <ProfileAvatar 
          size={40} 
          showOnlineIndicator={member.isOnline}
        />
        <View style={styles.memberDetails}>
          <View style={styles.memberNameRow}>
            <Text style={styles.memberName}>{member.name}</Text>
            {member.isOwner && (
              <View style={styles.ownerBadge}>
                <Crown size={12} color="#FFD700" />
                <Text style={styles.ownerBadgeText}>Ejer</Text>
              </View>
            )}
          </View>
          <Text style={styles.memberJoined}>
            Tilmeldt {formatJoinedDate(member.joinedAt)}
          </Text>
        </View>
      </View>
      
      {showActions && group.isOwner && !member.isOwner && (
        <View style={styles.memberActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {/* Message functionality */}}
          >
            <MessageCircle size={16} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.removeButton]}
            onPress={() => handleRemoveMember(member.id, member.name)}
          >
            <UserMinus size={16} color="#ff3b30" />
          </TouchableOpacity>
        </View>
      )}
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
          <Text style={styles.headerTitle}>Gruppe Detaljer</Text>
          <TouchableOpacity 
            style={styles.shareButton}
            onPress={handleShareGroup}
          >
            <Share2 size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Group Header */}
          <View style={styles.groupHeader}>
            <View style={styles.groupTitleRow}>
              <View style={styles.groupTitleContainer}>
                <Text style={styles.groupAvatar}>{group.avatar}</Text>
                <View style={styles.groupTitleInfo}>
                  <Text style={styles.groupName}>{group.name}</Text>
                  <Text style={styles.groupOwner}>Ejet af {group.ownerName}</Text>
                </View>
              </View>
              {group.isOwner && (
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={handleEditGroup}
                >
                  <Settings size={20} color="#007AFF" />
                </TouchableOpacity>
              )}
            </View>
            
            <Text style={styles.groupDescription}>{group.description}</Text>
            
            <View style={styles.groupMeta}>
              <Text style={styles.groupCreated}>
                Oprettet {formatDate(group.createdAt)}
              </Text>
            </View>
          </View>

          {/* Group Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{totalMembers}</Text>
              <Text style={styles.statLabel}>Medlemmer</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{onlineMembers}</Text>
              <Text style={styles.statLabel}>Online nu</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {Math.round((onlineMembers / totalMembers) * 100)}%
              </Text>
              <Text style={styles.statLabel}>Aktivitet</Text>
            </View>
          </View>

          {/* Members List */}
          <View style={styles.section}>
            <View style={styles.membersHeader}>
              <Text style={styles.sectionTitle}>
                Medlemmer ({totalMembers})
              </Text>
              <TouchableOpacity 
                style={styles.inviteButton}
                onPress={() => setShowInviteModal(true)}
              >
                <UserPlus size={16} color="#007AFF" />
                <Text style={styles.inviteButtonText}>Inviter</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.membersList}>
              {/* Owner */}
              {group.isOwner ? (
                <View style={styles.memberCard}>
                  <View style={styles.memberInfo}>
                    <ProfileAvatar 
                      size={40} 
                      showOnlineIndicator={true}
                    />
                    <View style={styles.memberDetails}>
                      <View style={styles.memberNameRow}>
                        <Text style={styles.memberName}>Dig (Ejer)</Text>
                        <View style={styles.ownerBadge}>
                          <Crown size={12} color="#FFD700" />
                          <Text style={styles.ownerBadgeText}>Ejer</Text>
                        </View>
                      </View>
                      <Text style={styles.memberJoined}>Oprettede gruppen</Text>
                    </View>
                  </View>
                </View>
              ) : (
                // Show actual owner if user is not owner
                group.members
                  .filter(m => m.isOwner)
                  .map(member => renderMember(member, false))
              )}

              {/* Other members */}
              {group.members
                .filter(m => !m.isOwner)
                .map(member => renderMember(member, group.isOwner))}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            {!group.isOwner && (
              <TouchableOpacity 
                style={styles.leaveButton}
                onPress={handleLeaveGroup}
              >
                <Text style={styles.leaveButtonText}>Forlad Gruppe</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={styles.chatButton}
              onPress={() => router.push({
                pathname: '/chat/group',
                params: { groupId: group.id, groupName: group.name }
              })}
            >
              <MessageCircle size={18} color="#fff" />
              <Text style={styles.messageAllButtonText}>Send besked til alle</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Invite Modal */}
        <Modal
          visible={showInviteModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowInviteModal(false)}
        >
          <View style={styles.modalContainer}>
            <SafeAreaView style={styles.modalSafeArea}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setShowInviteModal(false)}>
                  <Text style={styles.modalCancelText}>Annuller</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Inviter venner</Text>
                <TouchableOpacity 
                  onPress={handleSendInvites}
                  disabled={selectedFriends.length === 0}
                >
                  <Text style={[
                    styles.modalSaveText,
                    selectedFriends.length === 0 && styles.modalSaveTextDisabled
                  ]}>
                    Send ({selectedFriends.length})
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.modalContent}>
                {/* Search */}
                <View style={styles.searchContainer}>
                  <Search size={20} color="#666" />
                  <TextInput
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Søg efter venner..."
                    placeholderTextColor="#666"
                  />
                </View>

                {/* Friends List */}
                <ScrollView style={styles.friendsList} showsVerticalScrollIndicator={false}>
                  {filteredFriends.length === 0 ? (
                    <View style={styles.emptyFriendsState}>
                      <Users size={48} color="#666" />
                      <Text style={styles.emptyFriendsTitle}>
                        {searchQuery ? 'Ingen venner fundet' : 'Alle venner er allerede i gruppen'}
                      </Text>
                      <Text style={styles.emptyFriendsText}>
                        {searchQuery 
                          ? 'Prøv at søge efter noget andet'
                          : 'Du har inviteret alle dine venner til denne gruppe'
                        }
                      </Text>
                    </View>
                  ) : (
                    filteredFriends.map((friend) => (
                      <TouchableOpacity
                        key={friend.id}
                        style={[
                          styles.friendCard,
                          selectedFriends.includes(friend.id) && styles.friendCardSelected
                        ]}
                        onPress={() => toggleFriendSelection(friend.id)}
                      >
                        <View style={styles.friendInfo}>
                          <ProfileAvatar 
                            size={40} 
                            showOnlineIndicator={friend.isOnline}
                          />
                          <View style={styles.friendDetails}>
                            <Text style={styles.friendName}>{friend.name}</Text>
                            <Text style={[
                              styles.friendStatus,
                              friend.isOnline && styles.friendOnlineStatus
                            ]}>
                              {friend.isOnline ? 'Online' : 'Offline'}
                            </Text>
                          </View>
                        </View>
                        
                        <View style={[
                          styles.selectionIndicator,
                          selectedFriends.includes(friend.id) && styles.selectionIndicatorSelected
                        ]}>
                          {selectedFriends.includes(friend.id) && (
                            <Check size={16} color="#fff" />
                          )}
                        </View>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            </SafeAreaView>
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
  shareButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  groupHeader: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#1a1a1a',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
  },
  groupTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  groupTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  groupAvatar: {
    fontSize: 48,
    marginRight: 16,
  },
  groupTitleInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginBottom: 4,
  },
  groupOwner: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
  editButton: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 8,
  },
  groupDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ccc',
    lineHeight: 24,
    marginBottom: 16,
  },
  groupMeta: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
  },
  groupCreated: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#999',
    textAlign: 'center',
  },
  activityStatsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  activityStatsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginBottom: 16,
  },
  activityStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  activityStatCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  activityStatNumber: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#4ade80',
    marginBottom: 4,
    textAlign: 'center',
  },
  activityStatLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#999',
    textAlign: 'center',
  },
  lastTripContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastTripLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#999',
  },
  lastTripDate: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginBottom: 16,
  },
  membersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  inviteButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#007AFF',
  },
  membersList: {
    gap: 12,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  memberDetails: {
    marginLeft: 12,
    flex: 1,
  },
  memberNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  memberName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginRight: 8,
  },
  ownerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 4,
  },
  ownerBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFD700',
  },
  memberJoined: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
  memberActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#2a2a2a',
    borderRadius: 6,
    padding: 8,
  },
  chatButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  removeButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  actionSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  leaveButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff3b30',
  },
  leaveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ff3b30',
  },
  messageAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  messageAllButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  modalSafeArea: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalCancelText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  modalSaveText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#007AFF',
  },
  modalSaveTextDisabled: {
    color: '#666',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    marginLeft: 12,
  },
  friendsList: {
    flex: 1,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  friendCardSelected: {
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#007AFF',
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
  friendStatus: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
  friendOnlineStatus: {
    color: '#4ade80',
  },
  selectionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionIndicatorSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  emptyFriendsState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyFriendsTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyFriendsText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    textAlign: 'center',
    marginTop: 100,
  },
});