import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, MapPin, Clock, Users, Calendar, Share2, Settings, UserPlus, UserMinus, MessageCircle, Crown, Check, X } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ProfileAvatar } from '@/components/ProfileAvatar';

interface Participant {
  id: string;
  name: string;
  status: 'accepted' | 'pending' | 'declined';
  isHost: boolean;
  joinedAt: string;
  hasProfilePicture: boolean;
}

interface PrepartyDetails {
  id: string;
  title: string;
  description: string;
  location: string;
  address: string;
  date: string;
  time: string;
  maxAttendees: number;
  isHost: boolean;
  hostName: string;
  participants: Participant[];
  pendingRequests: Participant[];
}

const mockPrepartyData: { [key: string]: PrepartyDetails } = {
  '1': {
    id: '1',
    title: 'Weekend Preparty',
    description: 'Hyggelig preparty før vi tager i byen! Vi mødes hjemme hos mig for drinks og musik.',
    location: 'Nørrebro',
    address: 'Blågårdsgade 15, 2200 København N',
    date: '2025-01-25',
    time: '20:00',
    maxAttendees: 12,
    isHost: true,
    hostName: 'Dig',
    participants: [
      { id: '1', name: 'Anna', status: 'accepted', isHost: false, joinedAt: '2025-01-20T10:00:00Z', hasProfilePicture: true },
      { id: '2', name: 'Lars', status: 'accepted', isHost: false, joinedAt: '2025-01-20T11:30:00Z', hasProfilePicture: false },
      { id: '3', name: 'Maria', status: 'accepted', isHost: false, joinedAt: '2025-01-20T14:15:00Z', hasProfilePicture: true },
      { id: '4', name: 'Peter', status: 'accepted', isHost: false, joinedAt: '2025-01-21T09:00:00Z', hasProfilePicture: false },
      { id: '5', name: 'Sofia', status: 'accepted', isHost: false, joinedAt: '2025-01-21T16:45:00Z', hasProfilePicture: true },
      { id: '6', name: 'Oliver', status: 'accepted', isHost: false, joinedAt: '2025-01-22T12:30:00Z', hasProfilePicture: false },
      { id: '7', name: 'Emma', status: 'accepted', isHost: false, joinedAt: '2025-01-22T18:20:00Z', hasProfilePicture: true },
      { id: '8', name: 'Mikkel', status: 'accepted', isHost: false, joinedAt: '2025-01-23T08:15:00Z', hasProfilePicture: false },
    ],
    pendingRequests: [
      { id: '9', name: 'Caroline', status: 'pending', isHost: false, joinedAt: '2025-01-23T14:00:00Z', hasProfilePicture: true },
      { id: '10', name: 'Magnus', status: 'pending', isHost: false, joinedAt: '2025-01-23T16:30:00Z', hasProfilePicture: false },
    ]
  },
  '2': {
    id: '2',
    title: 'Før Vega',
    description: 'Preparty før koncerten på Vega. Vi mødes og tager derhen sammen!',
    location: 'Vesterbro',
    address: 'Istedgade 42, 1650 København V',
    date: '2025-01-26',
    time: '19:30',
    maxAttendees: 8,
    isHost: false,
    hostName: 'Anna',
    participants: [
      { id: '1', name: 'Anna', status: 'accepted', isHost: true, joinedAt: '2025-01-20T10:00:00Z', hasProfilePicture: true },
      { id: '2', name: 'Dig', status: 'accepted', isHost: false, joinedAt: '2025-01-21T15:00:00Z', hasProfilePicture: true },
      { id: '3', name: 'Lars', status: 'accepted', isHost: false, joinedAt: '2025-01-21T16:00:00Z', hasProfilePicture: false },
      { id: '4', name: 'Maria', status: 'accepted', isHost: false, joinedAt: '2025-01-22T10:00:00Z', hasProfilePicture: true },
      { id: '5', name: 'Peter', status: 'accepted', isHost: false, joinedAt: '2025-01-22T14:00:00Z', hasProfilePicture: false },
    ],
    pendingRequests: []
  }
};

export default function PrepartyDetailScreen() {
  const { id } = useLocalSearchParams();
  const [showManageModal, setShowManageModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  
  const preparty = mockPrepartyData[id as string];

  if (!preparty) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <Text style={styles.errorText}>Preparty ikke fundet</Text>
        </SafeAreaView>
      </View>
    );
  }

  const acceptedParticipants = preparty.participants.filter(p => p.status === 'accepted');
  const currentAttendees = acceptedParticipants.length + (preparty.isHost ? 1 : 0);

  const handleAcceptRequest = (participantId: string) => {
    Alert.alert('Anmodning accepteret', 'Deltageren er nu med i preparty\'en');
  };

  const handleDeclineRequest = (participantId: string) => {
    Alert.alert('Anmodning afvist', 'Deltageren er ikke blevet tilføjet');
  };

  const handleRemoveParticipant = (participantId: string, participantName: string) => {
    Alert.alert(
      'Fjern deltager',
      `Er du sikker på at du vil fjerne ${participantName} fra preparty'en?`,
      [
        { text: 'Annuller', style: 'cancel' },
        {
          text: 'Fjern',
          style: 'destructive',
          onPress: () => Alert.alert('Deltager fjernet', `${participantName} er fjernet fra preparty'en`)
        }
      ]
    );
  };

  const handleInviteFriends = () => {
    setShowInviteModal(true);
  };

  const handleSharePreparty = () => {
    Alert.alert('Del preparty', 'Preparty link kopieret til udklipsholder!');
  };

  const handleEditPreparty = () => {
    router.push(`/preparty/edit/${id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('da-DK', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  const formatJoinedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('da-DK', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const renderParticipant = (participant: Participant, showActions = false) => (
    <View key={participant.id} style={styles.participantCard}>
      <View style={styles.participantInfo}>
        <ProfileAvatar size={40} />
        <View style={styles.participantDetails}>
          <View style={styles.participantNameRow}>
            <Text style={styles.participantName}>{participant.name}</Text>
            {participant.isHost && (
              <View style={styles.hostBadge}>
                <Crown size={12} color="#FFD700" />
                <Text style={styles.hostBadgeText}>Host</Text>
              </View>
            )}
          </View>
          <Text style={styles.participantJoined}>
            Tilmeldt {formatJoinedDate(participant.joinedAt)}
          </Text>
        </View>
      </View>
      
      {showActions && preparty.isHost && !participant.isHost && (
        <View style={styles.participantActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {/* Message functionality */}}
          >
            <MessageCircle size={16} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.removeButton]}
            onPress={() => handleRemoveParticipant(participant.id, participant.name)}
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
          <Text style={styles.headerTitle}>Preparty Detaljer</Text>
          <TouchableOpacity 
            style={styles.shareButton}
            onPress={handleSharePreparty}
          >
            <Share2 size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Preparty Info */}
          <View style={styles.prepartyHeader}>
            <View style={styles.prepartyTitleRow}>
              <Text style={styles.prepartyTitle}>{preparty.title}</Text>
              {preparty.isHost && (
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={handleEditPreparty}
                >
                  <Settings size={20} color="#007AFF" />
                </TouchableOpacity>
              )}
            </View>
            
            <Text style={styles.prepartyDescription}>{preparty.description}</Text>
            
            <View style={styles.prepartyMeta}>
              <View style={styles.metaItem}>
                <Calendar size={16} color="#007AFF" />
                <Text style={styles.metaText}>{formatDate(preparty.date)}</Text>
              </View>
              <View style={styles.metaItem}>
                <Clock size={16} color="#007AFF" />
                <Text style={styles.metaText}>{preparty.time}</Text>
              </View>
              <View style={styles.metaItem}>
                <MapPin size={16} color="#007AFF" />
                <Text style={styles.metaText}>{preparty.location}</Text>
              </View>
            </View>

            <View style={styles.addressContainer}>
              <Text style={styles.addressLabel}>Adresse:</Text>
              <Text style={styles.addressText}>{preparty.address}</Text>
            </View>
          </View>

          {/* Attendance Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{currentAttendees}</Text>
              <Text style={styles.statLabel}>Deltagere</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{preparty.maxAttendees - currentAttendees}</Text>
              <Text style={styles.statLabel}>Ledige pladser</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{preparty.pendingRequests.length}</Text>
              <Text style={styles.statLabel}>Anmodninger</Text>
            </View>
          </View>

          {/* Attendance Progress */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>
                {currentAttendees}/{preparty.maxAttendees} deltagere
              </Text>
              <Text style={styles.progressPercentage}>
                {Math.round((currentAttendees / preparty.maxAttendees) * 100)}%
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[
                styles.progressFill,
                { width: `${(currentAttendees / preparty.maxAttendees) * 100}%` }
              ]} />
            </View>
          </View>

          {/* Pending Requests (Host only) */}
          {preparty.isHost && preparty.pendingRequests.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Anmodninger ({preparty.pendingRequests.length})
              </Text>
              <View style={styles.requestsList}>
                {preparty.pendingRequests.map((request) => (
                  <View key={request.id} style={styles.requestCard}>
                    <View style={styles.requestInfo}>
                      <ProfileAvatar size={40} />
                      <View style={styles.requestDetails}>
                        <Text style={styles.requestName}>{request.name}</Text>
                        <Text style={styles.requestDate}>
                          Anmodet {formatJoinedDate(request.joinedAt)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.requestActions}>
                      <TouchableOpacity 
                        style={styles.acceptButton}
                        onPress={() => handleAcceptRequest(request.id)}
                      >
                        <Check size={16} color="#fff" />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.declineButton}
                        onPress={() => handleDeclineRequest(request.id)}
                      >
                        <X size={16} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Participants List */}
          <View style={styles.section}>
            <View style={styles.participantsHeader}>
              <Text style={styles.sectionTitle}>
                Deltagere ({acceptedParticipants.length + (preparty.isHost ? 1 : 0)})
              </Text>
              {preparty.isHost && (
                <TouchableOpacity 
                  style={styles.inviteButton}
                  onPress={handleInviteFriends}
                >
                  <UserPlus size={16} color="#007AFF" />
                  <Text style={styles.inviteButtonText}>Inviter</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.participantsList}>
              {/* Host */}
              {preparty.isHost ? (
                <View style={styles.participantCard}>
                  <View style={styles.participantInfo}>
                    <ProfileAvatar size={40} />
                    <View style={styles.participantDetails}>
                      <View style={styles.participantNameRow}>
                        <Text style={styles.participantName}>Dig (Host)</Text>
                        <View style={styles.hostBadge}>
                          <Crown size={12} color="#FFD700" />
                          <Text style={styles.hostBadgeText}>Host</Text>
                        </View>
                      </View>
                      <Text style={styles.participantJoined}>Oprettet preparty'en</Text>
                    </View>
                  </View>
                </View>
              ) : (
                // Show actual host if user is not host
                preparty.participants
                  .filter(p => p.isHost)
                  .map(participant => renderParticipant(participant, false))
              )}

              {/* Other participants */}
              {acceptedParticipants
                .filter(p => !p.isHost)
                .map(participant => renderParticipant(participant, preparty.isHost))}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            {!preparty.isHost && (
              <TouchableOpacity style={styles.leaveButton}>
                <Text style={styles.leaveButtonText}>Forlad Preparty</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={styles.messageAllButton}
              onPress={() => Alert.alert('Gruppe besked', 'Besked funktionalitet kommer snart')}
            >
              <MessageCircle size={20} color="#fff" />
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
                <TouchableOpacity onPress={() => setShowInviteModal(false)}>
                  <Text style={styles.modalSaveText}>Færdig</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.modalContent}>
                <Text style={styles.modalDescription}>
                  Vælg venner du vil invitere til preparty'en
                </Text>
                {/* Friend list would go here */}
                <View style={styles.emptyInviteState}>
                  <UserPlus size={48} color="#666" />
                  <Text style={styles.emptyInviteTitle}>Inviter funktionalitet</Text>
                  <Text style={styles.emptyInviteText}>
                    Her kan du invitere dine venner til preparty'en
                  </Text>
                </View>
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
  prepartyHeader: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#1a1a1a',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
  },
  prepartyTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  prepartyTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    flex: 1,
  },
  editButton: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 8,
  },
  prepartyDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ccc',
    lineHeight: 24,
    marginBottom: 20,
  },
  prepartyMeta: {
    gap: 12,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#fff',
  },
  addressContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 12,
  },
  addressLabel: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#999',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
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
  progressSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  progressPercentage: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#007AFF',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#2a2a2a',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
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
  requestsList: {
    gap: 12,
  },
  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
  },
  requestInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  requestDetails: {
    marginLeft: 12,
    flex: 1,
  },
  requestName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 4,
  },
  requestDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
  requestActions: {
    flexDirection: 'row',
    gap: 8,
  },
  acceptButton: {
    backgroundColor: '#4ade80',
    borderRadius: 6,
    padding: 8,
  },
  declineButton: {
    backgroundColor: '#ff3b30',
    borderRadius: 6,
    padding: 8,
  },
  participantsHeader: {
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
  participantsList: {
    gap: 12,
  },
  participantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
  },
  participantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  participantDetails: {
    marginLeft: 12,
    flex: 1,
  },
  participantNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  participantName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginRight: 8,
  },
  hostBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 4,
  },
  hostBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFD700',
  },
  participantJoined: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
  participantActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#2a2a2a',
    borderRadius: 6,
    padding: 8,
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
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modalDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#999',
    marginBottom: 24,
  },
  emptyInviteState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyInviteTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyInviteText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#999',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    textAlign: 'center',
    marginTop: 100,
  },
});