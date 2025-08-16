import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Car, Phone, Globe, MoveHorizontal as MoreHorizontal, ThumbsUp, ThumbsDown, Camera, ChevronDown, ChevronUp, ChevronRight } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { danishClubs } from '@/data/clubs';
import { ProfileAvatar } from '@/components/ProfileAvatar';

const { width, height } = Dimensions.get('window');

export default function ClubScreen() {
  const { id } = useLocalSearchParams();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [showFullHours, setShowFullHours] = useState(false);
  
  const club = danishClubs.find(c => c.id === id);

  if (!club) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <Text style={styles.errorText}>Klub ikke fundet</Text>
        </SafeAreaView>

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>FOLK KOMMER OFTEST</Text>
          <Text style={styles.statValue}>22:30 - 01:00</Text>
        </View>
      </View>
    );
  }

  const handleCheckIn = () => {
    setIsCheckedIn(!isCheckedIn);
  };

  const getRandomDistance = () => {
    return `${Math.floor(Math.random() * 50) + 1} t. ${Math.floor(Math.random() * 60)} m.`;
  };

  const getRandomRating = () => {
    return Math.floor(Math.random() * 20) + 80; // 80-100%
  };

  const getRandomKmDistance = () => {
    return Math.floor(Math.random() * 500) + 50; // 50-550 km
  };

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
  ];

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
      {/* Header with close button */}
      <SafeAreaView style={styles.headerContainer}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.clubName}>{club.name}</Text>
            <Text style={styles.clubType}>{club.type}</Text>
          </View>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            <X size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <Car size={20} color="#fff" />
            </View>
            <Text style={styles.actionText}>{getRandomDistance()}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <Phone size={20} color="#fff" />
            </View>
            <Text style={styles.actionText}>Ring op</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <Globe size={20} color="#fff" />
            </View>
            <Text style={styles.actionText}>Websted</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>CHECK INS I AFTEN</Text>
            <Text style={styles.statValue}>{Math.floor(Math.random() * 50) + 10}</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>ÅBNINGSTIDER</Text>
            <Text style={styles.statValue}>Lukket</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>VURDERING</Text>
            <View style={styles.ratingContainer}>
              <ThumbsUp size={16} color="#007AFF" />
              <Text style={styles.statValue}>{getRandomRating()} %</Text>
            </View>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>FOLK KOMMER OFTEST</Text>
            <Text style={styles.statValue}>22:30 - 01:00</Text>
          </View>
        </View>

        {/* Friends Checked In Section */}
        {mockCheckedInFriends.length > 0 && (
          <View style={styles.friendsSection}>
            <TouchableOpacity 
              style={styles.friendsSummaryCard}
              onPress={() => router.push({
                pathname: '/club/friends',
                params: { clubId: club.id, clubName: club.name }
              })}
            >
              <View style={styles.friendsSummaryContent}>
                <View style={styles.friendsSummaryLeft}>
                  <Text style={styles.friendsSummaryTitle}>Venner her</Text>
                  <Text style={styles.friendsSummaryCount}>
                    {mockCheckedInFriends.length} {mockCheckedInFriends.length === 1 ? 'ven' : 'venner'} checked ind
                  </Text>
                </View>
                <View style={styles.friendsAvatarStack}>
                  {mockCheckedInFriends.slice(0, 3).map((friend, index) => (
                    <View 
                      key={friend.id} 
                      style={[
                        styles.stackedAvatar,
                        { marginLeft: index * -8 }
                      ]}
                    >
                      <ProfileAvatar size={32} />
                    </View>
                  ))}
                  {mockCheckedInFriends.length > 3 && (
                    <View style={[styles.stackedAvatar, styles.moreAvatars, { marginLeft: -8 }]}>
                      <Text style={styles.moreAvatarsText}>+{mockCheckedInFriends.length - 3}</Text>
                    </View>
                  )}
                </View>
              </View>
              <ChevronRight size={20} color="#666" />
            </TouchableOpacity>
          </View>
        )}

        {/* Add Photos Section */}
        <TouchableOpacity 
          style={[
            styles.checkInButton,
            isCheckedIn && styles.checkedInButton
          ]}
          onPress={handleCheckIn}
        >
          <View style={styles.checkInIcon}>
            <Text style={styles.checkInEmoji}>
              {isCheckedIn ? '✅' : '📍'}
            </Text>
          </View>
          <Text style={[
            styles.checkInText,
            isCheckedIn && styles.checkedInText
          ]}>
            {isCheckedIn ? 'Du er checked ind' : 'Check ind her'}
          </Text>
        </TouchableOpacity>

        {/* Good to Know Section */}
        <View style={styles.goodToKnowSection}>
          <Text style={styles.sectionTitle}>Godt at vide</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>📱 Accepterer Kontaktfri betalinger</Text>
            <View style={styles.paymentIcons}>
              <View style={styles.paymentIcon}>
                <Text style={styles.paymentIconText}>📱</Text>
              </View>
              <View style={styles.paymentIcon}>
                <Text style={styles.paymentIconText}>💳</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Opening Hours Section */}
        <View style={styles.hoursSection}>
          <View style={styles.hoursHeader}>
            <Text style={styles.sectionTitle}>Oplysninger</Text>
            <TouchableOpacity onPress={() => setShowFullHours(!showFullHours)}>
              <Text style={styles.editText}>Rediger</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.hoursCard}>
            <View style={styles.hoursRow}>
              <Text style={styles.hoursLabel}>Åbningstider</Text>
              <TouchableOpacity 
                style={styles.hoursToggle}
                onPress={() => setShowFullHours(!showFullHours)}
              >
                {showFullHours ? (
                  <ChevronUp size={20} color="#666" />
                ) : (
                  <ChevronDown size={20} color="#666" />
                )}
              </TouchableOpacity>
            </View>
            
            <View style={[styles.currentHours, { marginBottom: showFullHours ? 16 : 0 }]}>
              <Text style={styles.hoursTime}>22.00 – 05.00</Text>
              <Text style={styles.hoursStatus}>Lukket</Text>
            </View>

            {showFullHours && (
              <View style={styles.fullHours}>
                <View style={styles.hourRow}>
                  <Text style={styles.dayText}>Mandag</Text>
                  <Text style={styles.timeText}>Lukket</Text>
                </View>
                <View style={styles.hourRow}>
                  <Text style={styles.dayText}>Tirsdag</Text>
                  <Text style={styles.timeText}>Lukket</Text>
                </View>
                <View style={styles.hourRow}>
                  <Text style={styles.dayText}>Onsdag</Text>
                  <Text style={styles.timeText}>22.00 – 05.00</Text>
                </View>
                <View style={styles.hourRow}>
                  <Text style={styles.dayText}>Torsdag</Text>
                  <Text style={styles.timeText}>22.00 – 05.00</Text>
                </View>
                <View style={styles.hourRow}>
                  <Text style={styles.dayText}>Fredag</Text>
                  <Text style={styles.timeText}>22.00 – 06.00</Text>
                </View>
                <View style={styles.hourRow}>
                  <Text style={styles.dayText}>Lørdag</Text>
                  <Text style={styles.timeText}>22.00 – 06.00</Text>
                </View>
                <View style={styles.hourRow}>
                  <Text style={styles.dayText}>Søndag</Text>
                  <Text style={styles.timeText}>Lukket</Text>
                </View>
              </View>
            )}

            {/* Address Section */}
            <View style={styles.addressSection}>
              <Text style={styles.addressLabel}>Adresse</Text>
              <Text style={styles.addressText}>{club.address}</Text>
            </View>
          </View>
        </View>

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  clubName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginBottom: 4,
  },
  clubType: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ccc',
  },
  closeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 8,
    marginTop: 4,
  },
  content: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    marginTop: 180,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 48,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 40,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  actionIcon: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#fff',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginTop: 8,
    marginBottom: 32,
    flexWrap: 'wrap',
    gap: 16,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginTop: 8,
    marginBottom: 32,
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    minWidth: '45%',
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#666',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  friendsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  friendsSummaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
  },
  friendsSummaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  friendsSummaryLeft: {
    flex: 1,
  },
  friendsSummaryTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 4,
  },
  friendsSummaryCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
  friendsAvatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  stackedAvatar: {
    borderWidth: 2,
    borderColor: '#2a2a2a',
    borderRadius: 16,
  },
  moreAvatars: {
    backgroundColor: '#666',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreAvatarsText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  addPhotosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    marginHorizontal: 20,
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 24,
    gap: 8,
  },
  checkInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    marginHorizontal: 20,
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 24,
    gap: 12,
  },
  checkedInButton: {
    backgroundColor: '#4ade80',
  },
  checkInIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 8,
  },
  checkInText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  checkedInText: {
    color: '#fff',
  },
  checkInEmoji: {
    fontSize: 20,
  },
  goodToKnowSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    flex: 1,
  },
  paymentIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  paymentIcon: {
    backgroundColor: '#3a3a3a',
    borderRadius: 8,
    padding: 8,
  },
  paymentIconText: {
    fontSize: 16,
  },
  hoursSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  hoursHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  editText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#007AFF',
  },
  hoursCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  hoursLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#fff',
  },
  hoursToggle: {
    padding: 4,
  },
  currentHours: {
  },
  hoursTime: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 4,
  },
  hoursStatus: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ff3b30',
  },
  fullHours: {
    borderTopWidth: 1,
    borderTopColor: '#3a3a3a',
    paddingTop: 16,
    gap: 8,
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ccc',
  },
  timeText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ccc',
  },
  addressSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#3a3a3a',
  },
  addressLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
    marginBottom: 8,
  },
  addressText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    lineHeight: 22,
  },
  bottomSpacer: {
    height: 100,
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    textAlign: 'center',
    marginTop: 100,
  },
});