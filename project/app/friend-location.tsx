import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, MapPin, Clock, Users, Share2, Eye, EyeOff, Navigation, Shield } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ProfileAvatar } from '@/components/ProfileAvatar';
import * as Location from 'expo-location';

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  timestamp: number;
}

interface Friend {
  id: string;
  name: string;
  status: string;
  hasProfilePicture: boolean;
  isOnline: boolean;
  isLocationShared: boolean;
  lastLocation?: LocationData;
}

const mockFriend: Friend = {
  id: '1',
  name: 'Anna',
  status: 'online',
  hasProfilePicture: true,
  isOnline: true,
  isLocationShared: false,
  lastLocation: {
    latitude: 55.6761,
    longitude: 12.5683,
    address: 'Nørrebro, København',
    timestamp: Date.now() - 300000, // 5 minutes ago
  }
};

export default function FriendLocationScreen() {
  const { friendId, friendName } = useLocalSearchParams();
  const [friend, setFriend] = useState<Friend>(mockFriend);
  const [isSharing, setIsSharing] = useState(false);
  const [myLocation, setMyLocation] = useState<LocationData | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setLocationPermission(status === 'granted');
  };

  const getCurrentLocation = async () => {
    if (!locationPermission) {
      Alert.alert('Tilladelse påkrævet', 'Du skal give tilladelse til lokation for at dele din position.');
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const locationData: LocationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: address[0] ? `${address[0].district || address[0].city}, ${address[0].city}` : 'Ukendt lokation',
        timestamp: Date.now(),
      };

      setMyLocation(locationData);
      return locationData;
    } catch (error) {
      Alert.alert('Fejl', 'Kunne ikke hente din lokation. Prøv igen.');
      return null;
    }
  };

  const handleShareLocation = async () => {
    if (!isSharing) {
      const location = await getCurrentLocation();
      if (location) {
        setIsSharing(true);
        Alert.alert(
          'Lokation delt!',
          `Din lokation er nu delt med ${friend.name}. De kan se din position i realtid.`,
          [{ text: 'OK' }]
        );
      }
    } else {
      setIsSharing(false);
      Alert.alert(
        'Lokationsdeling stoppet',
        `Du deler ikke længere din lokation med ${friend.name}.`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleRequestLocation = () => {
    Alert.alert(
      'Anmod om lokation',
      `Vil du anmode ${friend.name} om at dele deres lokation med dig?`,
      [
        { text: 'Annuller', style: 'cancel' },
        {
          text: 'Send anmodning',
          onPress: () => {
            Alert.alert('Anmodning sendt!', `${friend.name} vil modtage en notifikation om din anmodning.`);
          }
        }
      ]
    );
  };

  const toggleFriendLocationSharing = () => {
    setFriend(prev => ({
      ...prev,
      isLocationShared: !prev.isLocationShared
    }));
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Lige nu';
    if (minutes < 60) return `${minutes} min siden`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} timer siden`;
    
    const days = Math.floor(hours / 24);
    return `${days} dage siden`;
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
          <Text style={styles.headerTitle}>Lokationsdeling</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Friend Info */}
          <View style={styles.friendSection}>
            <View style={styles.friendHeader}>
              <ProfileAvatar 
                size={60} 
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
            </View>
          </View>

          {/* My Location Sharing */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Min lokationsdeling</Text>
            <View style={styles.locationCard}>
              <View style={styles.locationHeader}>
                <View style={styles.locationIcon}>
                  <Share2 size={20} color="#007AFF" />
                </View>
                <View style={styles.locationContent}>
                  <Text style={styles.locationTitle}>Del din lokation</Text>
                  <Text style={styles.locationDescription}>
                    {isSharing 
                      ? `Du deler din lokation med ${friend.name}`
                      : `Del din realtids lokation med ${friend.name}`
                    }
                  </Text>
                </View>
                <Switch
                  value={isSharing}
                  onValueChange={handleShareLocation}
                  trackColor={{ false: '#333', true: '#007AFF' }}
                  thumbColor={isSharing ? '#fff' : '#f4f3f4'}
                />
              </View>

              {isSharing && myLocation && (
                <View style={styles.currentLocationInfo}>
                  <View style={styles.currentLocationHeader}>
                    <MapPin size={16} color="#4ade80" />
                    <Text style={styles.currentLocationText}>Din nuværende lokation:</Text>
                  </View>
                  <Text style={styles.currentLocationAddress}>{myLocation.address}</Text>
                  <Text style={styles.currentLocationTime}>
                    Opdateret {formatTimeAgo(myLocation.timestamp)}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Friend's Location */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{friend.name}s lokation</Text>
            
            {friend.isLocationShared ? (
              <View style={styles.locationCard}>
                <View style={styles.locationHeader}>
                  <View style={[styles.locationIcon, styles.receivedLocationIcon]}>
                    <MapPin size={20} color="#4ade80" />
                  </View>
                  <View style={styles.locationContent}>
                    <Text style={styles.locationTitle}>Lokation modtaget</Text>
                    <Text style={styles.locationDescription}>
                      {friend.name} deler deres lokation med dig
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.viewLocationButton}
                    onPress={() => Alert.alert('Åbn kort', 'Kort funktionalitet kommer snart')}
                  >
                    <Eye size={16} color="#007AFF" />
                  </TouchableOpacity>
                </View>

                {friend.lastLocation && (
                  <View style={styles.friendLocationInfo}>
                    <View style={styles.friendLocationHeader}>
                      <Navigation size={16} color="#007AFF" />
                      <Text style={styles.friendLocationText}>Sidst set lokation:</Text>
                    </View>
                    <Text style={styles.friendLocationAddress}>{friend.lastLocation.address}</Text>
                    <Text style={styles.friendLocationTime}>
                      {formatTimeAgo(friend.lastLocation.timestamp)}
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.locationCard}>
                <View style={styles.noLocationContent}>
                  <View style={styles.noLocationIcon}>
                    <EyeOff size={32} color="#666" />
                  </View>
                  <Text style={styles.noLocationTitle}>Ingen lokation delt</Text>
                  <Text style={styles.noLocationDescription}>
                    {friend.name} deler ikke deres lokation med dig endnu
                  </Text>
                  <TouchableOpacity 
                    style={styles.requestLocationButton}
                    onPress={handleRequestLocation}
                  >
                    <Text style={styles.requestLocationButtonText}>Anmod om lokation</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Privacy Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Privatlivsindstillinger</Text>
            <View style={styles.privacyCard}>
              <View style={styles.privacyItem}>
                <View style={styles.privacyIcon}>
                  <Shield size={20} color="#4ade80" />
                </View>
                <View style={styles.privacyContent}>
                  <Text style={styles.privacyTitle}>Sikker deling</Text>
                  <Text style={styles.privacyDescription}>
                    Din lokation er kun synlig for denne ven og bliver ikke gemt permanent
                  </Text>
                </View>
              </View>

              <View style={styles.privacyItem}>
                <View style={styles.privacyIcon}>
                  <Clock size={20} color="#007AFF" />
                </View>
                <View style={styles.privacyContent}>
                  <Text style={styles.privacyTitle}>Automatisk stop</Text>
                  <Text style={styles.privacyDescription}>
                    Lokationsdeling stopper automatisk efter 24 timer
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hurtige handlinger</Text>
            <View style={styles.quickActions}>
              <TouchableOpacity 
                style={styles.quickActionButton}
                onPress={() => Alert.alert('Besked', 'Besked funktionalitet kommer snart')}
              >
                <Text style={styles.quickActionText}>Send besked</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.quickActionButton}
                onPress={() => router.push('/friends')}
              >
                <Text style={styles.quickActionText}>Se alle venner</Text>
              </TouchableOpacity>
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
  friendSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  friendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  friendInfo: {
    flex: 1,
    marginLeft: 16,
  },
  friendName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
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
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginBottom: 16,
  },
  locationCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
  },
  receivedLocationIcon: {
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
  },
  locationContent: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 4,
  },
  locationDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
  viewLocationButton: {
    backgroundColor: '#2a2a2a',
    borderRadius: 6,
    padding: 8,
  },
  currentLocationInfo: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
  },
  currentLocationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  currentLocationText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#4ade80',
    marginLeft: 6,
  },
  currentLocationAddress: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    marginBottom: 4,
  },
  currentLocationTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  friendLocationInfo: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
  },
  friendLocationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  friendLocationText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#007AFF',
    marginLeft: 6,
  },
  friendLocationAddress: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    marginBottom: 4,
  },
  friendLocationTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  noLocationContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  noLocationIcon: {
    marginBottom: 16,
  },
  noLocationTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 8,
  },
  noLocationDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
  },
  requestLocationButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  requestLocationButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  privacyCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  privacyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  privacyIcon: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
  },
  privacyContent: {
    flex: 1,
  },
  privacyTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 4,
  },
  privacyDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
    lineHeight: 20,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  quickActionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#007AFF',
  },
});