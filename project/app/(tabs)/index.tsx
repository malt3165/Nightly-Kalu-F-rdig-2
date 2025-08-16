import React, { useState, useEffect, useRef, Suspense } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Platform, ScrollView, Dimensions, Alert, TextInput, Modal, Animated, RefreshControl, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, PanGestureHandler, State } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Navigation, Search, ChevronRight, Users, Star, X, Filter, SlidersHorizontal, Target, Sparkles, ChevronUp, ChevronDown, Car, Phone, Globe, ThumbsUp, Clock, ArrowLeft } from 'lucide-react-native';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { danishClubs, Club } from '@/data/clubs';
import { useLiveData } from '@/contexts/LiveDataContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { ProfileAvatar } from '@/components/ProfileAvatar';
import { GestureHandlerRootView, PanGestureHandler as RNGHPanGestureHandler } from 'react-native-gesture-handler';
import RNAnimated, { 
  useSharedValue, 
  useAnimatedStyle, 
  useAnimatedGestureHandler, 
  runOnJS,
  withSpring,
  interpolate,
  Extrapolate,
  useDerivedValue,
  withTiming
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// Define snap points
const SNAP_POINTS = {
  FULL_MAP: height - 180, // Bottom sheet næsten helt nede, kun søgebar synlig
  HALF: height * 0.5,
  FULL_LIST: 100, // Bottom sheet næsten helt oppe, kun lille kort synligt
};

// City coordinates for search navigation
const danishCities = {
  'københavn': { latitude: 55.6761, longitude: 12.5683, latitudeDelta: 0.05, longitudeDelta: 0.05 },
  'copenhagen': { latitude: 55.6761, longitude: 12.5683, latitudeDelta: 0.05, longitudeDelta: 0.05 },
  'kbh': { latitude: 55.6761, longitude: 12.5683, latitudeDelta: 0.05, longitudeDelta: 0.05 },
  'aarhus': { latitude: 56.1572, longitude: 10.2107, latitudeDelta: 0.05, longitudeDelta: 0.05 },
  'århus': { latitude: 56.1572, longitude: 10.2107, latitudeDelta: 0.05, longitudeDelta: 0.05 },
  'odense': { latitude: 55.4038, longitude: 10.4024, latitudeDelta: 0.05, longitudeDelta: 0.05 },
  'aalborg': { latitude: 57.0488, longitude: 9.9217, latitudeDelta: 0.05, longitudeDelta: 0.05 },
};

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [nearbyClubs, setNearbyClubs] = useState<Club[]>([]);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Club[]>([]);
  const [ageRequirement, setAgeRequirement] = useState(''); // '', '18+', '21+'
  const [venueType, setVenueType] = useState(''); // '', 'bar', 'klub'
  const [radiusFilter, setRadiusFilter] = useState(''); // '' = no filter, '1', '5', '10', '25'
  const [refreshing, setRefreshing] = useState(false);
  const [mapLoading, setMapLoading] = useState(true);
  const [filters, setFilters] = useState({
    minRating: 0,
    maxRating: 5,
    cities: [] as string[],
    minVisitors: 0,
    ageRestriction: 'all', // 'all', '18+', '21+'
  });
  const [mapComponents, setMapComponents] = useState<{
    MapView: any;
    Marker: any;
    PROVIDER_GOOGLE: any;
  } | null>(null);
  const [region, setRegion] = useState({
    latitude: 55.6761,
    longitude: 12.5683,
    latitudeDelta: 2.0,
    longitudeDelta: 2.0,
  });
  const [nearbyClubsForMap, setNearbyClubsForMap] = useState<Club[]>([]);
  const { liveClubData, refreshData, isRefreshing: liveRefreshing } = useLiveData();
  const { addNotification } = useNotifications();
  const [selectedClubForDetails, setSelectedClubForDetails] = useState<Club | null>(null);
  const [showClubDetails, setShowClubDetails] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [showFullHours, setShowFullHours] = useState(false);

  // Animated values for bottom sheet
  const translateY = useSharedValue(SNAP_POINTS.HALF);
  const scrollViewRef = useRef<ScrollView>(null);
  const mapRef = useRef<any>(null);

  // Derived values for better performance
  const mapHeight = useDerivedValue(() => {
    return interpolate(
      translateY.value,
      [SNAP_POINTS.FULL_LIST, SNAP_POINTS.HALF, SNAP_POINTS.FULL_MAP],
      [100, height * 0.5, height - 180],
      Extrapolate.CLAMP
    );
  });

  // Animated styles
  const bottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const mapStyle = useAnimatedStyle(() => {
    return {
      height: mapHeight.value,
    };
  });

  // Optimized gesture handler for bottom sheet
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startY = translateY.value;
    },
    onActive: (event, context) => {
      const newValue = context.startY + event.translationY;
      translateY.value = Math.max(
        SNAP_POINTS.FULL_LIST, 
        Math.min(SNAP_POINTS.FULL_MAP, newValue)
      );
    },
    onEnd: (event) => {
      const { velocityY } = event;
      const currentY = translateY.value;
      
      let targetY = SNAP_POINTS.HALF;
      
      // Optimized velocity thresholds
      if (velocityY > 500) {
        if (currentY < SNAP_POINTS.HALF) {
          targetY = SNAP_POINTS.HALF;
        } else {
          targetY = SNAP_POINTS.FULL_MAP;
        }
      } else if (velocityY < -500) {
        if (currentY > SNAP_POINTS.HALF) {
          targetY = SNAP_POINTS.HALF;
        } else {
          targetY = SNAP_POINTS.FULL_LIST;
        }
      } else {
        const distanceToFullMap = Math.abs(currentY - SNAP_POINTS.FULL_MAP);
        const distanceToHalf = Math.abs(currentY - SNAP_POINTS.HALF);
        const distanceToFullList = Math.abs(currentY - SNAP_POINTS.FULL_LIST);
        
        if (distanceToFullMap < distanceToHalf && distanceToFullMap < distanceToFullList) {
          targetY = SNAP_POINTS.FULL_MAP;
        } else if (distanceToFullList < distanceToHalf) {
          targetY = SNAP_POINTS.FULL_LIST;
        } else {
          targetY = SNAP_POINTS.HALF;
        }
      }
      
      // Ultra smooth spring animation
      translateY.value = withSpring(targetY, {
        damping: 20,
        stiffness: 300,
        mass: 0.5,
        overshootClamping: true,
        restDisplacementThreshold: 0.1,
        restSpeedThreshold: 0.1,
      });
    },
  });

  const radiusOptions = ['Alle', '1 km', '5 km', '10 km', '25 km'];
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    
    // Simulate map loading
    setTimeout(() => setMapLoading(false), 1500);
  }, []);

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'web') {
        // Default to Copenhagen for web
        const defaultLocation = {
          coords: {
            latitude: 55.6761,
            longitude: 12.5683,
            altitude: null,
            accuracy: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
          },
          timestamp: Date.now(),
        };
        setLocation(defaultLocation);
        calculateNearbyClubs(defaultLocation.coords.latitude, defaultLocation.coords.longitude);
        return;
      }

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        // Fallback to Copenhagen
        const fallbackLocation = {
          coords: {
            latitude: 55.6761,
            longitude: 12.5683,
            altitude: null,
            accuracy: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
          },
          timestamp: Date.now(),
        };
        setLocation(fallbackLocation);
        calculateNearbyClubs(fallbackLocation.coords.latitude, fallbackLocation.coords.longitude);
        return;
      }

      try {
        let userLocation = await Location.getCurrentPositionAsync({});
        setLocation(userLocation);
        calculateNearbyClubs(userLocation.coords.latitude, userLocation.coords.longitude);
      } catch (error) {
        // Fallback to Copenhagen if location fails
        const fallbackLocation = {
          coords: {
            latitude: 55.6761,
            longitude: 12.5683,
            altitude: null,
            accuracy: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
          },
          timestamp: Date.now(),
        };
        setLocation(fallbackLocation);
        calculateNearbyClubs(fallbackLocation.coords.latitude, fallbackLocation.coords.longitude);
      }
    })();
  }, []);

  // Handle search input changes with debounce for city navigation
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        checkAndNavigateToCity(searchQuery.trim());
      }
    }, 800);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    // Search for clubs by name, type, city, or address
    let filtered = danishClubs.filter(club =>
      (club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       club.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
       club.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
       club.address.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Apply filters
    filtered = filtered.filter(club => {
      // Rating filter
      if (club.trustpilotRating < filters.minRating || club.trustpilotRating > filters.maxRating) {
        return false;
      }

      // City filter
      if (filters.cities.length > 0 && !filters.cities.includes(club.city)) {
        return false;
      }

      // Visitors filter
      if (club.checkedIn < filters.minVisitors) {
        return false;
      }

      // Age restriction filter (mock implementation)
      if (filters.ageRestriction === '21+') {
        // Assume some clubs are 21+ (for demo purposes, let's say clubs with rating > 4.5)
        if (club.trustpilotRating <= 4.5) return false;
      }

      return true;
    });

    setSearchResults(filtered);
    
    // If there's exactly one search result, auto-navigate to it
    if (filtered.length === 1 && searchQuery.trim().length >= 3) {
      const club = filtered[0];
      setTimeout(() => {
        navigateToClub(club);
      }, 500);
    }
  }, [searchQuery, filters]);

  const availableCities = [...new Set(danishClubs.map(club => club.city))].sort();

  const checkAndNavigateToCity = (searchTerm: string) => {
    const normalizedSearch = searchTerm.toLowerCase().trim();
    
    // First check if search matches a specific club
    const matchingClub = danishClubs.find(club =>
      club.name.toLowerCase().includes(normalizedSearch) ||
      club.address.toLowerCase().includes(normalizedSearch)
    );
    
    if (matchingClub) {
      navigateToClub(matchingClub);
      return;
    }
    
    // Check if search matches a city
    const cityCoords = danishCities[normalizedSearch];
    
    if (cityCoords) {
      // Animate to full map view
      translateY.value = withSpring(SNAP_POINTS.FULL_MAP, {
        damping: 20,
        stiffness: 300,
        mass: 0.5,
      });
      
      // Update map region for web
      if (Platform.OS === 'web') {
        setRegion(cityCoords);
      }
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    
    try {
      await refreshData();
      
      // Simulate finding new venues or updates
      if (Math.random() > 0.7) {
        addNotification({
          type: 'check_in',
          title: 'Nye check-ins! 🔥',
          body: 'Der er nye check-ins i nærheden af dig',
        });
      }
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };

  const calculateNearbyClubs = (userLat: number, userLon: number) => {
    const clubsWithDistance = danishClubs.map(club => ({
      ...club,
      distance: `${calculateDistance(userLat, userLon, club.latitude, club.longitude).toFixed(1)} km`
    })).sort((a, b) => 
      parseFloat(a.distance) - parseFloat(b.distance)
    );
    
    const nearest = clubsWithDistance.slice(0, 15);
    setNearbyClubs(nearest); // Show top 15 nearest clubs for list
    
    // For map: only show clubs within 25km
    const nearbyForMap = clubsWithDistance.filter(club => 
      parseFloat(club.distance) <= 25
    );
    setNearbyClubsForMap(nearbyForMap);
    
    // Auto-zoom to show nearby clubs
    if (nearbyForMap.length > 0) {
      // Calculate bounds for nearby clubs
      const lats = nearbyForMap.map(club => club.latitude);
      const lngs = nearbyForMap.map(club => club.longitude);
      
      const minLat = Math.min(...lats, userLat);
      const maxLat = Math.max(...lats, userLat);
      const minLng = Math.min(...lngs, userLon);
      const maxLng = Math.max(...lngs, userLon);
      
      const centerLat = (minLat + maxLat) / 2;
      const centerLng = (minLng + maxLng) / 2;
      const latDelta = Math.max((maxLat - minLat) * 1.5, 0.05);
      const lngDelta = Math.max((maxLng - minLng) * 1.5, 0.05);
      
      const newRegion = {
        latitude: centerLat,
        longitude: centerLng,
        latitudeDelta: latDelta,
        longitudeDelta: lngDelta,
      };
      
      setRegion(newRegion);
    }
  };

  const handleClubPress = (clubId: string) => {
    setShowSearchModal(false);
    // Find the club in our data
    const club = danishClubs.find(c => c.id === clubId);
    if (club && mapRef.current) {
      // Instead of navigating, show club details in bottom sheet
      setSelectedClubForDetails(club);
      setShowClubDetails(true);
      navigateToClub(club);
    }
  };

  const navigateToClub = (club: Club) => {
    if (club) {
      // Set the selected club first
      setSelectedClub(club);
      
      // Animate to half view to show both map and details
      translateY.value = withSpring(SNAP_POINTS.HALF, {
        damping: 20,
        stiffness: 300,
        mass: 0.5,
      });
      
      // Then zoom to the club location
      setTimeout(() => {
        if (Platform.OS !== 'web' && mapRef.current) {
          mapRef.current.animateToRegion({
            latitude: club.latitude,
            longitude: club.longitude,
            latitudeDelta: 0.01, // Street level zoom
            longitudeDelta: 0.01,
          }, 1000);
        } else {
          // For web, update region state
          setRegion({
            latitude: club.latitude,
            longitude: club.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      }, 300);
    }
  };

  const handleMarkerPress = (club: Club) => {
    // When marker is pressed, show club details in bottom sheet
    setSelectedClubForDetails(club);
    setShowClubDetails(true);
    navigateToClub(club);
  };

  const centerOnUserLocation = async () => {
    try {
      if (Platform.OS === 'web') {
        // For web, center on Copenhagen
        const copenhagenRegion = {
          latitude: 55.6761,
          longitude: 12.5683,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };
        setRegion(copenhagenRegion);
        
        // Show map
        translateY.value = withSpring(SNAP_POINTS.FULL_MAP, {
          damping: 15,
          stiffness: 400,
          mass: 0.8,
        });
        
        Alert.alert('Lokation', 'Centreret på København');
      } else {
        // For mobile, get actual user location
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Tilladelse påkrævet', 'Du skal give tilladelse til lokation');
          return;
        }
        
        let userLocation = await Location.getCurrentPositionAsync({});
        setLocation(userLocation);
        calculateNearbyClubs(userLocation.coords.latitude, userLocation.coords.longitude);
        
        const newRegion = {
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };
        setRegion(newRegion);
        
        if (mapRef.current) {
          mapRef.current.animateToRegion(newRegion, 1000);
        }
        
        // Show map
        translateY.value = withSpring(SNAP_POINTS.FULL_MAP, {
          damping: 15,
          stiffness: 400,
          mass: 0.8,
        });
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Fejl', 'Kunne ikke hente din lokation. Prøv igen.');
    }
  };

  const handleBackToVenues = () => {
    setShowClubDetails(false);
    setSelectedClubForDetails(null);
    setIsCheckedIn(false);
    setShowFullHours(false);
  };

  const handleCheckIn = () => {
    setIsCheckedIn(!isCheckedIn);
  };

  const getRandomDistance = () => {
    return `${Math.floor(Math.random() * 50) + 1} t. ${Math.floor(Math.random() * 60)} m.`;
  };

  const getRandomRating = () => {
    return Math.floor(Math.random() * 20) + 80; // 80-100%
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

  // Calculate distance between two points (Haversine formula)
  const calculateDistanceKm = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Add distance to venues and apply radius filter
  const venuesWithDistance = danishClubs.map(venue => {
    let distance = null;
    if (location) {
      distance = calculateDistanceKm(
        location.coords.latitude,
        location.coords.longitude,
        venue.latitude,
        venue.longitude
      );
    }
    
    // Get live data for this venue
    const liveData = liveClubData.get(venue.id);
    const currentCheckedIn = liveData?.checkedIn ?? venue.checkedIn;
    
    return { 
      ...venue, 
      distance,
      checkedIn: currentCheckedIn,
      isLive: !!liveData,
    };
  });

  // Filter to only show Copenhagen clubs
  const allClubs = nearbyClubsForMap.length > 0 ? nearbyClubsForMap : danishClubs;
  
  const filteredBars = allClubs.filter((bar) => {
    // Add distance calculation for filtering
    let distance = null;
    if (location) {
      distance = calculateDistanceKm(
        location.coords.latitude,
        location.coords.longitude,
        bar.latitude,
        bar.longitude
      );
    }

    const matchSearch = bar.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       bar.city.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Age requirement filter (mock implementation based on venue type and rating)
    const matchAge = ageRequirement === '' || 
      (ageRequirement === '18+') || // All venues are 18+
      (ageRequirement === '21+' && (bar.trustpilotRating >= 4.3 || bar.type.includes('Natklub')));
    
    // Venue type filter
    const matchVenueType = venueType === '' ||
      (venueType === 'bar' && (bar.type.includes('Bar') || bar.type.includes('bar'))) ||
      (venueType === 'klub' && (bar.type.includes('Klub') || bar.type.includes('Natklub') || bar.type.includes('klub')));
    
    // Radius filter
    const matchRadius = radiusFilter === '' || !location || !distance || 
                       distance <= parseFloat(radiusFilter);
    
    return matchSearch && matchAge && matchVenueType && matchRadius;
  });

  // Sort venues by distance if user location is available  
  const sortedFilteredBars = filteredBars.map(bar => {
    let distance = null;
    if (location) {
      distance = calculateDistanceKm(
        location.coords.latitude,
        location.coords.longitude,
        bar.latitude,
        bar.longitude
      );
    }
    return { ...bar, distance };
  }).sort((a, b) => {
    if (!location || a.distance === null || b.distance === null) return 0;
    return a.distance - b.distance;
  });

  const renderClubDetails = () => {
    if (!selectedClubForDetails) return null;

    return (
      <View style={styles.clubDetailsContainer}>
        {/* Club Header */}
        <View style={styles.clubDetailsHeader}>
          <TouchableOpacity 
            style={styles.backToVenuesButton}
            onPress={handleBackToVenues}
          >
            <ArrowLeft size={20} color="#007AFF" />
          </TouchableOpacity>
          <View style={styles.clubHeaderInfo}>
            <Text style={styles.clubDetailsName}>{selectedClubForDetails.name}</Text>
            <Text style={styles.clubDetailsType}>{selectedClubForDetails.type}</Text>
          </View>
          <TouchableOpacity style={styles.clubHeaderButton}>
            <X size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.clubActionButtons}>
          <TouchableOpacity style={styles.clubActionButton}>
            <View style={styles.clubActionIcon}>
              <Car size={20} color="#fff" />
            </View>
            <Text style={styles.clubActionText}>{getRandomDistance()}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.clubActionButton}>
            <View style={styles.clubActionIcon}>
              <Phone size={20} color="#fff" />
            </View>
            <Text style={styles.clubActionText}>Ring op</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.clubActionButton}>
            <View style={styles.clubActionIcon}>
              <Globe size={20} color="#fff" />
            </View>
            <Text style={styles.clubActionText}>Websted</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.clubStatsGrid}>
          <View style={styles.clubStatItem}>
            <Text style={styles.clubStatLabel}>CHECK INS I AFTEN</Text>
            <Text style={styles.clubStatValue}>{Math.floor(Math.random() * 50) + 10}</Text>
          </View>

          <View style={styles.clubStatItem}>
            <Text style={styles.clubStatLabel}>ÅBNINGSTIDER</Text>
            <Text style={styles.clubStatValue}>Lukket</Text>
          </View>

          <View style={styles.clubStatItem}>
            <Text style={styles.clubStatLabel}>VURDERING</Text>
            <View style={styles.clubRatingContainer}>
              <ThumbsUp size={16} color="#007AFF" />
              <Text style={styles.clubStatValue}>{getRandomRating()} %</Text>
            </View>
          </View>

          <View style={styles.clubStatItem}>
            <Text style={styles.clubStatLabel}>FOLK KOMMER OFTEST</Text>
            <Text style={styles.clubStatValue}>22:30 - 01:00</Text>
          </View>
        </View>

        {/* Friends Checked In Section */}
        {mockCheckedInFriends.length > 0 && (
          <View style={styles.clubFriendsSection}>
            <TouchableOpacity 
              style={styles.clubFriendsSummaryCard}
              onPress={() => {
                // Navigate to friends page but pass club data
                router.push({
                  pathname: '/club/friends',
                  params: { clubId: selectedClubForDetails.id, clubName: selectedClubForDetails.name }
                });
              }}
            >
              <View style={styles.clubFriendsSummaryContent}>
                <View style={styles.clubFriendsSummaryLeft}>
                  <Text style={styles.clubFriendsSummaryTitle}>Venner her</Text>
                  <Text style={styles.clubFriendsSummaryCount}>
                    {mockCheckedInFriends.length} {mockCheckedInFriends.length === 1 ? 'ven' : 'venner'} checked ind
                  </Text>
                </View>
                <View style={styles.clubFriendsAvatarStack}>
                  {mockCheckedInFriends.slice(0, 3).map((friend, index) => (
                    <View 
                      key={friend.id} 
                      style={[
                        styles.clubStackedAvatar,
                        { marginLeft: index * -8 }
                      ]}
                    >
                      <ProfileAvatar size={32} />
                    </View>
                  ))}
                  {mockCheckedInFriends.length > 3 && (
                    <View style={[styles.clubStackedAvatar, styles.clubMoreAvatars, { marginLeft: -8 }]}>
                      <Text style={styles.clubMoreAvatarsText}>+{mockCheckedInFriends.length - 3}</Text>
                    </View>
                  )}
                </View>
              </View>
              <ChevronRight size={20} color="#666" />
            </TouchableOpacity>
          </View>
        )}

        {/* Check In Button */}
        <TouchableOpacity 
          style={[
            styles.clubCheckInButton,
            isCheckedIn && styles.clubCheckedInButton
          ]}
          onPress={handleCheckIn}
        >
          <View style={styles.clubCheckInIcon}>
            <Text style={styles.clubCheckInEmoji}>
              {isCheckedIn ? '✅' : '📍'}
            </Text>
          </View>
          <Text style={[
            styles.clubCheckInText,
            isCheckedIn && styles.clubCheckedInText
          ]}>
            {isCheckedIn ? 'Du er checked ind' : 'Check ind her'}
          </Text>
        </TouchableOpacity>

        {/* Good to Know Section */}
        <View style={styles.clubGoodToKnowSection}>
          <Text style={styles.clubSectionTitle}>Godt at vide</Text>
          <View style={styles.clubInfoCard}>
            <Text style={styles.clubInfoText}>📱 Accepterer Kontaktfri betalinger</Text>
            <View style={styles.clubPaymentIcons}>
              <View style={styles.clubPaymentIcon}>
                <Text style={styles.clubPaymentIconText}>📱</Text>
              </View>
              <View style={styles.clubPaymentIcon}>
                <Text style={styles.clubPaymentIconText}>💳</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Opening Hours Section */}
        <View style={styles.clubHoursSection}>
          <View style={styles.clubHoursHeader}>
            <Text style={styles.clubSectionTitle}>Oplysninger</Text>
            <TouchableOpacity onPress={() => setShowFullHours(!showFullHours)}>
              <Text style={styles.clubEditText}>Rediger</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.clubHoursCard}>
            <View style={styles.clubHoursRow}>
              <Text style={styles.clubHoursLabel}>Åbningstider</Text>
              <TouchableOpacity 
                style={styles.clubHoursToggle}
                onPress={() => setShowFullHours(!showFullHours)}
              >
                {showFullHours ? (
                  <ChevronUp size={20} color="#666" />
                ) : (
                  <ChevronDown size={20} color="#666" />
                )}
              </TouchableOpacity>
            </View>
            
            <View style={[styles.clubCurrentHours, { marginBottom: showFullHours ? 16 : 0 }]}>
              <Text style={styles.clubHoursTime}>22.00 – 05.00</Text>
              <Text style={styles.clubHoursStatus}>Lukket</Text>
            </View>

            {showFullHours && (
              <View style={styles.clubFullHours}>
                <View style={styles.clubHourRow}>
                  <Text style={styles.clubDayText}>Mandag</Text>
                  <Text style={styles.clubTimeText}>Lukket</Text>
                </View>
                <View style={styles.clubHourRow}>
                  <Text style={styles.clubDayText}>Tirsdag</Text>
                  <Text style={styles.clubTimeText}>Lukket</Text>
                </View>
                <View style={styles.clubHourRow}>
                  <Text style={styles.clubDayText}>Onsdag</Text>
                  <Text style={styles.clubTimeText}>22.00 – 05.00</Text>
                </View>
                <View style={styles.clubHourRow}>
                  <Text style={styles.clubDayText}>Torsdag</Text>
                  <Text style={styles.clubTimeText}>22.00 – 05.00</Text>
                </View>
                <View style={styles.clubHourRow}>
                  <Text style={styles.clubDayText}>Fredag</Text>
                  <Text style={styles.clubTimeText}>22.00 – 06.00</Text>
                </View>
                <View style={styles.clubHourRow}>
                  <Text style={styles.clubDayText}>Lørdag</Text>
                  <Text style={styles.clubTimeText}>22.00 – 06.00</Text>
                </View>
                <View style={styles.clubHourRow}>
                  <Text style={styles.clubDayText}>Søndag</Text>
                  <Text style={styles.clubTimeText}>Lukket</Text>
                </View>
              </View>
            )}

            {/* Address Section */}
            <View style={styles.clubAddressSection}>
              <Text style={styles.clubAddressLabel}>Adresse</Text>
              <Text style={styles.clubAddressText}>{selectedClubForDetails.address}</Text>
            </View>
          </View>
        </View>

        {/* Bottom Spacer */}
        <View style={styles.clubBottomSpacer} />
      </View>
    );
  };

  const renderVenueCard = (item: Club & { distance?: number | null }) => (
    <TouchableOpacity
      style={styles.venueCard}
      onPress={() => handleClubPress(item.id)}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.venueName}>{item.name}</Text>
        {item.distance !== null && item.distance !== undefined && (
          <View style={styles.distanceBadge}>
            <Text style={styles.distanceText}>{item.distance.toFixed(1)} km</Text>
          </View>
        )}
      </View>
      
      <View style={styles.venueDetails}>
        <View style={styles.detailRow}>
          <MapPin size={14} color="#8E8E93" />
          <Text style={styles.addressText}>{item.address}</Text>
        </View>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Star size={12} color="#FF9500" />
            <Text style={styles.statText}>{item.trustpilotRating}</Text>
          </View>
          <View style={styles.statItem}>
            <Users size={12} color="#007AFF" />
            <Text style={styles.statText}>{item.checkedIn}</Text>
          </View>
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>{item.type}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.cardFooter}>
        <Text style={styles.tapHint}>Tryk for detaljer</Text>
        <ChevronRight size={16} color="#C7C7CC" />
      </View>
    </TouchableOpacity>
  );

  if (!location) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Indlæser kort...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        {/* Map Container */}
        <RNAnimated.View style={[styles.mapContainer, mapStyle]}>
          {mapLoading && (
            <View style={styles.mapLoadingOverlay}>
              <Text style={styles.mapLoadingText}>Indlæser kort...</Text>
            </View>
          )}
          
          {Platform.OS === 'web' ? (
            // Enhanced fallback for web with Denmark map styling
            <View style={styles.mapPlaceholder}>
              <View style={styles.mapOverlay}>
                {/* Map background with Denmark-like styling */}
                <View style={styles.mapBackground}>
                  {/* Simulate Denmark map with colored regions */}
                  <View style={styles.mapRegion} />
                  <View style={[styles.mapRegion, styles.mapRegion2]} />
                  <View style={[styles.mapRegion, styles.mapRegion3]} />
                </View>
                
                {/* Show club pins */}
                {selectedClub && (
                  <TouchableOpacity
                    key={selectedClub.id}
                    style={[styles.locationPin, { 
                      top: '50%', 
                      left: '50%',
                      transform: [{ translateX: -16 }, { translateY: -16 }]
                    }]}
                    onPress={() => router.push(`/club/${selectedClub.id}`)}
                  >
                    <Text style={styles.markerEmoji}>📍</Text>
                    <View style={styles.clubNameBubble}>
                      <Text style={styles.clubNameText}>{selectedClub.name}</Text>
                    </View>
                  </TouchableOpacity>
                )}

                {/* Location markers for major cities */}
                <View style={[styles.cityMarker, { top: '45%', left: '60%' }]}>
                  <View style={styles.cityMarkerGreen} />
                  <Text style={styles.cityName}>København</Text>
                </View>
                
                <View style={[styles.cityMarker, { top: '35%', left: '25%' }]}>
                  <View style={styles.cityMarkerOrange} />
                  <Text style={styles.cityName}>Aarhus</Text>
                </View>
              </View>
            </View>
          ) : (
            // Real map for native platforms
            mapComponents && mapComponents.MapView && (
              <mapComponents.MapView
                ref={mapRef}
                style={styles.map}
                provider={mapComponents.PROVIDER_GOOGLE}
                initialRegion={region}
                region={region}
                showsUserLocation={true}
                showsMyLocationButton={false}
                mapType="standard"
                showsCompass={true}
                showsScale={true}
                showsBuildings={true}
                showsTraffic={false}
                showsIndoors={true}
              >
                {selectedClub && (
                  <mapComponents.Marker
                    key={selectedClub.id}
                    coordinate={{
                      latitude: selectedClub.latitude,
                      longitude: selectedClub.longitude,
                    }}
                    title={selectedClub.name}
                    description={selectedClub.address}
                    onPress={() => handleMarkerPress(selectedClub)}
                  >
                    <View style={styles.selectedMarker}>
                      <Text style={styles.markerText}>📍</Text>
                    </View>
                  </mapComponents.Marker>
                )}
              </mapComponents.MapView>
            )
          )}
          
          {/* Map controls */}
          <View style={styles.mapControls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={centerOnUserLocation}
              activeOpacity={0.8}
            >
              <Navigation size={18} color="#007AFF" />
            </TouchableOpacity>
          </View>

        </RNAnimated.View>

        {/* Bottom Sheet */}
        <RNGHPanGestureHandler onGestureEvent={gestureHandler}>
          <RNAnimated.View style={[styles.bottomSheet, bottomSheetStyle]}>
            {/* Handle */}
            <View style={styles.bottomSheetHandle} />
            
            {/* Header */}
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.headerTitle}>NIGHTLY</Text>
            </View>

            {/* Search Card */}
            <View style={styles.searchCard}>
              <Search size={16} color="#8E8E93" />
              <TextInput
                style={styles.searchInput}
                placeholder="Søg i kort"
                placeholderTextColor="#8E8E93"
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
                onSubmitEditing={() => {
                  if (searchQuery.trim()) {
                    checkAndNavigateToCity(searchQuery.trim());
                  }
                }}
              />
            </View>

            {/* Quick Filters */}
            <View style={styles.filtersCard}>
              <Text style={styles.filtersTitle}>Filtre</Text>
              <View style={styles.filterChips}>
                {['Alle', 'Bar', 'Klub', '18+', '21+'].map((filter) => (
                  <TouchableOpacity
                    key={filter}
                    style={[
                      styles.filterChip,
                      (filter === 'Alle' && venueType === '' && ageRequirement === '') && styles.activeFilterChip,
                      (filter === 'Bar' && venueType === 'bar') && styles.activeFilterChip,
                      (filter === 'Klub' && venueType === 'klub') && styles.activeFilterChip,
                      (filter === '18+' && ageRequirement === '18+') && styles.activeFilterChip,
                      (filter === '21+' && ageRequirement === '21+') && styles.activeFilterChip,
                    ]}
                    onPress={() => {
                      if (filter === 'Alle') {
                        setVenueType('');
                        setAgeRequirement('');
                      } else if (filter === 'Bar') {
                        setVenueType(venueType === 'bar' ? '' : 'bar');
                      } else if (filter === 'Klub') {
                        setVenueType(venueType === 'klub' ? '' : 'klub');
                      } else if (filter === '18+') {
                        setAgeRequirement(ageRequirement === '18+' ? '' : '18+');
                      } else if (filter === '21+') {
                        setAgeRequirement(ageRequirement === '21+' ? '' : '21+');
                      }
                    }}
                  >
                    <Text style={[
                      styles.filterChipText,
                      (filter === 'Alle' && venueType === '' && ageRequirement === '') && styles.activeFilterChipText,
                      (filter === 'Bar' && venueType === 'bar') && styles.activeFilterChipText,
                      (filter === 'Klub' && venueType === 'klub') && styles.activeFilterChipText,
                      (filter === '18+' && ageRequirement === '18+') && styles.activeFilterChipText,
                      (filter === '21+' && ageRequirement === '21+') && styles.activeFilterChipText,
                    ]}>
                      {filter}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Venues List */}
            <ScrollView
              ref={scrollViewRef}
              style={styles.venuesScrollView}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing || liveRefreshing}
                  onRefresh={onRefresh}
                  tintColor="#007AFF"
                  colors={['#007AFF']}
                />
              }
            >
              {showClubDetails ? (
                renderClubDetails()
              ) : (
                <View style={styles.venuesSection}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                      {nearbyClubsForMap.length > 0 ? 'I nærheden' : 'Populære steder'}
                    </Text>
                    <Text style={styles.venueCount}>{sortedFilteredBars.length} steder</Text>
                  </View>

                  <View style={styles.venuesList}>
                    {sortedFilteredBars.map((item) => (
                      <View key={item.id}>
                        {renderVenueCard(item)}
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Bottom Spacer */}
              <View style={styles.bottomSpacer} />
            </ScrollView>
          </RNAnimated.View>
        </RNGHPanGestureHandler>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  mapContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000',
  },
  map: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#1a1a1a',
  },
  mapOverlay: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#1a1a1a',
  },
  mapBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#4A90E2',
  },
  mapRegion: {
    position: 'absolute',
    backgroundColor: '#7CB342',
    borderRadius: 8,
    top: '20%',
    left: '30%',
    width: '40%',
    height: '60%',
  },
  mapRegion2: {
    backgroundColor: '#8BC34A',
    top: '15%',
    left: '20%',
    width: '25%',
    height: '30%',
  },
  mapRegion3: {
    backgroundColor: '#9CCC65',
    top: '50%',
    left: '45%',
    width: '30%',
    height: '35%',
  },
  locationPin: {
    position: 'absolute',
    alignItems: 'center',
  },
  markerEmoji: {
    fontSize: 32,
    textAlign: 'center',
  },
  clubNameBubble: {
    position: 'absolute',
    top: -40,
    left: -50,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 100,
    alignItems: 'center',
  },
  clubNameText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  cityMarker: {
    position: 'absolute',
    alignItems: 'center',
  },
  cityMarkerGreen: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00FF7F',
    borderWidth: 2,
    borderColor: '#fff',
    marginBottom: 4,
  },
  cityMarkerOrange: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF6B35',
    borderWidth: 2,
    borderColor: '#fff',
    marginBottom: 4,
  },
  cityName: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
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
  mapControls: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  controlButton: {
    backgroundColor: 'rgba(42, 42, 42, 0.9)',
    borderRadius: 12,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  mapLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  mapLoadingText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 12,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: height,
    backgroundColor: '#000',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  bottomSheetHandle: {
    width: 36,
    height: 4,
    backgroundColor: '#C7C7CC',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  bottomSheetHeader: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    fontWeight: '700',
  },
  searchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    marginLeft: 12,
  },
  filtersCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  filtersTitle: {
    fontSize: 17,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 12,
    fontWeight: '600',
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeFilterChip: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterChipText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#999',
    fontWeight: '500',
  },
  activeFilterChipText: {
    color: '#FFFFFF',
  },
  venuesScrollView: {
    flex: 1,
  },
  venuesSection: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    fontWeight: '700',
  },
  venueCount: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
  venuesList: {
    gap: 12,
  },
  venueCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  venueName: {
    fontSize: 17,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    fontWeight: '600',
    flex: 1,
  },
  distanceBadge: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  distanceText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#007AFF',
    fontWeight: '500',
  },
  venueDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressText: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#999',
    marginLeft: 6,
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#999',
    fontWeight: '500',
  },
  typeBadge: {
    backgroundColor: '#2a2a2a',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 'auto',
  },
  typeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#999',
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 0.5,
    borderTopColor: '#333',
  },
  tapHint: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#007AFF',
  },
  bottomSpacer: {
    height: 100,
  },
  // Club Details Styles
  clubDetailsContainer: {
    paddingTop: 8,
  },
  clubDetailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    marginBottom: 20,
  },
  backToVenuesButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
  },
  clubHeaderInfo: {
    flex: 1,
  },
  clubDetailsName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginBottom: 4,
  },
  clubDetailsType: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
  clubHeaderButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 8,
  },
  clubActionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  clubActionButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  clubActionIcon: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  clubActionText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#fff',
    textAlign: 'center',
  },
  clubStatsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    flexWrap: 'wrap',
    gap: 16,
  },
  clubStatItem: {
    minWidth: '45%',
    flex: 1,
  },
  clubStatLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#666',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  clubStatValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  clubRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  clubFriendsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  clubFriendsSummaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
  },
  clubFriendsSummaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  clubFriendsSummaryLeft: {
    flex: 1,
  },
  clubFriendsSummaryTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 4,
  },
  clubFriendsSummaryCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
  clubFriendsAvatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  clubStackedAvatar: {
    borderWidth: 2,
    borderColor: '#1a1a1a',
    borderRadius: 16,
  },
  clubMoreAvatars: {
    backgroundColor: '#666',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clubMoreAvatarsText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  clubCheckInButton: {
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
  clubCheckedInButton: {
    backgroundColor: '#4ade80',
  },
  clubCheckInIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 8,
  },
  clubCheckInText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  clubCheckedInText: {
    color: '#fff',
  },
  clubCheckInEmoji: {
    fontSize: 20,
  },
  rateSection: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  rateSectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 16,
  ratingModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingModalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginHorizontal: 20,
    minWidth: 300,
  },
  ratingModalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  ratingModalSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#999',
    marginBottom: 24,
    textAlign: 'center',
  },
  ratingStars: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 32,
  },
  ratingActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  ratingCancelButton: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  ratingCancelText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#999',
  },
  ratingSubmitButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  ratingSubmitDisabled: {
    backgroundColor: '#333',
  },
  ratingSubmitText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  },
  ratingStars: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  starButton: {
    padding: 4,
  },
  rateHint: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
  clubGoodToKnowSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  clubSectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginBottom: 16,
  },
  clubInfoCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  clubInfoText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    flex: 1,
  },
  clubPaymentIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  clubPaymentIcon: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 8,
  },
  clubPaymentIconText: {
    fontSize: 16,
  },
  clubHoursSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  clubHoursHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  clubEditText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#007AFF',
  },
  clubHoursCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
  },
  clubHoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  clubHoursLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#fff',
  },
  clubHoursToggle: {
    padding: 4,
  },
  clubCurrentHours: {
  },
  clubHoursTime: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 4,
  },
  clubHoursStatus: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ff3b30',
  },
  clubFullHours: {
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
    paddingTop: 16,
    gap: 8,
  },
  clubHourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clubDayText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ccc',
  },
  clubTimeText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ccc',
  },
  clubAddressSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
  },
  clubAddressLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
    marginBottom: 8,
  },
  clubAddressText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    lineHeight: 22,
  },
  clubBottomSpacer: {
    height: 100,
  },
});