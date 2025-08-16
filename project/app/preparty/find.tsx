import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Platform, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, MapPin, Clock, Users, Navigation, Filter, MessageCircle, Send, Check, UserPlus } from 'lucide-react-native';
import { router } from 'expo-router';
import { ProfileAvatar } from '@/components/ProfileAvatar';

const { width } = Dimensions.get('window');

const mockNearbyPreparties = [
  {
    id: '1',
    title: 'Før Lola',
    host: 'Anna & venner',
    location: 'Nørrebro',
    distance: '0.3 km',
    time: '20:00',
    attendees: 6,
    maxAttendees: 10,
    isHot: true,
    latitude: 55.6889,
    longitude: 12.5531,
  },
  {
    id: '2',
    title: 'Weekend Crew Preparty',
    host: 'Weekend Crew',
    location: 'Vesterbro',
    distance: '0.8 km',
    time: '19:30',
    attendees: 8,
    maxAttendees: 12,
    isHot: false,
    latitude: 55.6634,
    longitude: 12.5342,
  },
  {
    id: '3',
    title: 'Elektronisk Preparty',
    host: 'Electronic Lovers',
    location: 'Østerbro',
    distance: '1.2 km',
    time: '21:00',
    attendees: 4,
    maxAttendees: 8,
    isHot: false,
    latitude: 55.6823,
    longitude: 12.5721,
  },
];

const mockFriends = [
  { id: '1', name: 'Anna', hasProfilePicture: true, isOnline: true },
  { id: '2', name: 'Lars', hasProfilePicture: false, isOnline: false },
  { id: '3', name: 'Maria', hasProfilePicture: true, isOnline: true },
  { id: '4', name: 'Peter', hasProfilePicture: false, isOnline: true },
];

const mockGroups = [
  { id: '1', name: 'Weekend Crew', members: 8 },
  { id: '2', name: 'Electronic Lovers', members: 23 },
];

export default function FindPrepartyScreen() {
  const [selectedPreparty, setSelectedPreparty] = useState<string | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedPrepartyForMessage, setSelectedPrepartyForMessage] = useState<any>(null);
  const [joinMessage, setJoinMessage] = useState('');
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [mapComponents, setMapComponents] = useState<{
    MapView: any;
    Marker: any;
    PROVIDER_GOOGLE: any;
  } | null>(null);

  useEffect(() => {
    // Dynamically import react-native-maps only for native platforms
    if (Platform.OS !== 'web') {
      import('react-native-maps').then((MapModule) => {
        setMapComponents({
          MapView: MapModule.default,
          Marker: MapModule.Marker,
          PROVIDER_GOOGLE: MapModule.PROVIDER_GOOGLE,
        });
      }).catch((error) => {
        console.warn('Failed to load react-native-maps:', error);
      });
    }
  }, []);

  const handleRequestJoin = (preparty: any) => {
    setSelectedPrepartyForMessage(preparty);
    setShowMessageModal(true);
  };

  const handleSendJoinRequest = () => {
    if (!joinMessage.trim()) {
      Alert.alert('Fejl', 'Skriv venligst en kort besked til værten');
      return;
    }

    const friendNames = mockFriends
      .filter(f => selectedFriends.includes(f.id))
      .map(f => f.name);
    
    const groupNames = mockGroups
      .filter(g => selectedGroups.includes(g.id))
      .map(g => g.name);

    let message = `Anmodning sendt til "${selectedPrepartyForMessage?.title}"`;
    
    if (friendNames.length > 0 || groupNames.length > 0) {
      message += '\n\nInviteret med dig:';
      if (friendNames.length > 0) {
        message += `\n• Venner: ${friendNames.join(', ')}`;
      }
      if (groupNames.length > 0) {
        message += `\n• Grupper: ${groupNames.join(', ')}`;
      }
    }

    Alert.alert(
      'Anmodning sendt!',
      message,
      [
        {
          text: 'OK',
          onPress: () => {
            setShowMessageModal(false);
            setJoinMessage('');
            setSelectedFriends([]);
            setSelectedGroups([]);
            setSelectedPrepartyForMessage(null);
          }
        }
      ]
    );
  };

  const handleMarkerPress = (preparty: any) => {
    setSelectedPreparty(preparty.id);
  };

  const toggleFriendSelection = (friendId: string) => {
    setSelectedFriends(prev => 
      prev.includes(friendId) 
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const toggleGroupSelection = (groupId: string) => {
    setSelectedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
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
          <Text style={styles.headerTitle}>Find Preparty</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Map Container */}
        <View style={styles.mapContainer}>
          {Platform.OS === 'web' ? (
            // Fallback for web
            <View style={styles.mapPlaceholder}>
              <View style={styles.mapOverlay}>
                <View style={styles.mapGrid} />
                
                {/* Preparty pins */}
                {mockNearbyPreparties.map((preparty, index) => (
                  <TouchableOpacity
                    key={preparty.id}
                    style={[
                      styles.prepartyPin,
                      {
                        top: `${25 + index * 20}%`,
                        left: `${40 + index * 15}%`,
                      }
                    ]}
                    onPress={() => setSelectedPreparty(preparty.id)}
                  >
                    <View style={[
                      styles.pinCircle,
                      preparty.isHot && styles.hotPin,
                      selectedPreparty === preparty.id && styles.selectedPin
                    ]}>
                      <Text style={styles.pinNumber}>{preparty.attendees}</Text>
                    </View>
                    <View style={styles.pinPointer} />
                  </TouchableOpacity>
                ))}
              </View>

              {/* Current Location Button */}
              <TouchableOpacity style={styles.locationButton}>
                <View style={styles.locationButtonContent}>
                  <Navigation size={16} color="#fff" />
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            // Real map for native platforms
            mapComponents && mapComponents.MapView && (
              <mapComponents.MapView
                style={styles.map}
                provider={mapComponents.PROVIDER_GOOGLE}
                initialRegion={{
                  latitude: 55.6761,
                  longitude: 12.5683,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                showsUserLocation={true}
                showsMyLocationButton={false}
              >
                {mockNearbyPreparties.map((preparty) => (
                  <mapComponents.Marker
                    key={preparty.id}
                    coordinate={{
                      latitude: preparty.latitude,
                      longitude: preparty.longitude,
                    }}
                    onPress={() => handleMarkerPress(preparty)}
                  >
                    <View style={[
                      styles.customMarker,
                      preparty.isHot && styles.hotMarker,
                      selectedPreparty === preparty.id && styles.selectedMarker
                    ]}>
                      <Text style={styles.markerText}>{preparty.attendees}</Text>
                    </View>
                  </mapComponents.Marker>
                ))}
              </mapComponents.MapView>
            )
          )}
        </View>

        {/* Preparties List */}
        <View style={styles.prepartySection}>
          <View style={styles.prepartyHeader}>
            <Text style={styles.prepartyTitle}>Preparties i nærheden</Text>
            <Text style={styles.prepartyCount}>{mockNearbyPreparties.length} fundet</Text>
          </View>

          <ScrollView style={styles.prepartyList} showsVerticalScrollIndicator={false}>
            {mockNearbyPreparties.map((preparty) => (
              <TouchableOpacity
                key={preparty.id}
                style={[
                  styles.prepartyCard,
                  selectedPreparty === preparty.id && styles.selectedCard
                ]}
                onPress={() => setSelectedPreparty(preparty.id)}
              >
                <View style={styles.prepartyCardHeader}>
                  <View style={styles.prepartyTitleContainer}>
                    <Text style={styles.prepartyCardTitle}>{preparty.title}</Text>
                    {preparty.isHot && (
                      <View style={styles.hotBadge}>
                        <Text style={styles.hotBadgeText}>🔥 HOT</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.prepartyDistance}>{preparty.distance}</Text>
                </View>

                <Text style={styles.prepartyHost}>Host: {preparty.host}</Text>

                <View style={styles.prepartyDetails}>
                  <View style={styles.prepartyDetail}>
                    <MapPin size={14} color="#007AFF" />
                    <Text style={styles.prepartyDetailText}>{preparty.location}</Text>
                  </View>
                  <View style={styles.prepartyDetail}>
                    <Clock size={14} color="#007AFF" />
                    <Text style={styles.prepartyDetailText}>{preparty.time}</Text>
                  </View>
                  <View style={styles.prepartyDetail}>
                    <Users size={14} color="#007AFF" />
                    <Text style={styles.prepartyDetailText}>
                      {preparty.attendees}/{preparty.maxAttendees} deltagere
                    </Text>
                  </View>
                </View>

                <View style={styles.attendeesBar}>
                  <View style={[
                    styles.attendeesProgress,
                    { width: `${(preparty.attendees / preparty.maxAttendees) * 100}%` }
                  ]} />
                </View>

                <TouchableOpacity 
                  style={styles.joinButton}
                  onPress={() => handleRequestJoin(preparty)}
                >
                  <Text style={styles.joinButtonText}>Anmod om at deltage</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Join Request Modal */}
        <Modal
          visible={showMessageModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowMessageModal(false)}
        >
          <View style={styles.modalContainer}>
            <SafeAreaView style={styles.modalSafeArea}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setShowMessageModal(false)}>
                  <Text style={styles.modalCancelText}>Annuller</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Anmod om at deltage</Text>
                <TouchableOpacity 
                  onPress={handleSendJoinRequest}
                  disabled={!joinMessage.trim()}
                >
                  <Text style={[
                    styles.modalSendText,
                    !joinMessage.trim() && styles.modalSendTextDisabled
                  ]}>
                    Send
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Modal Content */}
              <View style={styles.modalContent}>
                {/* Besked til værten */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Besked til værten</Text>
                  <TextInput
                    style={styles.messageInput}
                    value={joinMessage}
                    onChangeText={setJoinMessage}
                    placeholder="Skriv en kort besked..."
                    placeholderTextColor="#666"
                    multiline
                    numberOfLines={2}
                    maxLength={100}
                  />
                </View>

                {/* Inviter venner */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Inviter venner</Text>
                  <View style={styles.selectionList}>
                    {mockFriends.map((friend) => (
                      <TouchableOpacity
                        key={friend.id}
                        style={[
                          styles.selectionItem,
                          selectedFriends.includes(friend.id) && styles.selectionItemSelected
                        ]}
                        onPress={() => toggleFriendSelection(friend.id)}
                      >
                        <ProfileAvatar size={32} />
                        <Text style={styles.selectionName}>{friend.name}</Text>
                        <View style={[
                          styles.checkbox,
                          selectedFriends.includes(friend.id) && styles.checkboxSelected
                        ]}>
                          {selectedFriends.includes(friend.id) && (
                            <Check size={12} color="#fff" />
                          )}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Inviter grupper */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Inviter grupper</Text>
                  <View style={styles.selectionList}>
                    {mockGroups.map((group) => (
                      <TouchableOpacity
                        key={group.id}
                        style={[
                          styles.selectionItem,
                          selectedGroups.includes(group.id) && styles.selectionItemSelected
                        ]}
                        onPress={() => toggleGroupSelection(group.id)}
                      >
                        <View style={styles.groupIcon}>
                          <Users size={16} color="#fff" />
                        </View>
                        <View style={styles.groupInfo}>
                          <Text style={styles.selectionName}>{group.name}</Text>
                          <Text style={styles.groupMembers}>{group.members} medlemmer</Text>
                        </View>
                        <View style={[
                          styles.checkbox,
                          selectedGroups.includes(group.id) && styles.checkboxSelected
                        ]}>
                          {selectedGroups.includes(group.id) && (
                            <Check size={12} color="#fff" />
                          )}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
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
  filterButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 8,
  },
  mapContainer: {
    height: 200,
    margin: 20,
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
    position: 'relative',
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    position: 'relative',
  },
  mapOverlay: {
    flex: 1,
    position: 'relative',
  },
  mapGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1a1a1a',
    opacity: 0.9,
  },
  prepartyPin: {
    position: 'absolute',
    alignItems: 'center',
  },
  pinCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  hotPin: {
    backgroundColor: '#FF6B6B',
  },
  selectedPin: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  pinNumber: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  pinPointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#007AFF',
    marginTop: -1,
  },
  customMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  hotMarker: {
    backgroundColor: '#FF6B6B',
  },
  selectedMarker: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  markerText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  locationButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  locationButtonContent: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 8,
  },
  prepartySection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  prepartyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  prepartyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  prepartyCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
  prepartyList: {
    flex: 1,
  },
  prepartyCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  selectedCard: {
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  prepartyCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  prepartyTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  prepartyCardTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginRight: 8,
  },
  hotBadge: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  hotBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FF6B6B',
  },
  prepartyDistance: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#007AFF',
  },
  prepartyHost: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
    marginBottom: 12,
  },
  prepartyDetails: {
    gap: 8,
    marginBottom: 12,
  },
  prepartyDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  prepartyDetailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ccc',
  },
  attendeesBar: {
    height: 4,
    backgroundColor: '#2a2a2a',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 12,
  },
  attendeesProgress: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  joinButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  joinButtonText: {
    fontSize: 14,
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
  modalSendText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#007AFF',
  },
  modalSendTextDisabled: {
    color: '#666',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginBottom: 12,
  },
  messageInput: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  selectionList: {
    gap: 8,
  },
  selectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
  },
  selectionItemSelected: {
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  selectionName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    flex: 1,
    marginLeft: 12,
  },
  groupIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupInfo: {
    flex: 1,
    marginLeft: 12,
  },
  groupMembers: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999',
    marginTop: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
});