import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Star, Filter } from 'lucide-react-native';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const mockEvents = [
  {
    id: '1',
    title: 'Elektronisk Nat',
    club: 'Kulturhuset',
    date: '2025-01-25',
    time: '22:00',
    price: '150 kr',
    attendees: 234,
    rating: 4.8,
    image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Elektronisk',
  },
  {
    id: '2',
    title: 'Rock Koncert',
    club: 'Vega',
    date: '2025-01-26',
    time: '20:00',
    price: '200 kr',
    attendees: 156,
    rating: 4.6,
    image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Rock',
  },
  {
    id: '3',
    title: 'Hip Hop Night',
    club: 'Rust',
    date: '2025-01-27',
    time: '23:00',
    price: '120 kr',
    attendees: 89,
    rating: 4.4,
    image: 'https://images.pexels.com/photos/274192/pexels-photo-274192.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Hip Hop',
  },
];

const categories = ['Alle', 'Elektronisk', 'Rock', 'Hip Hop', 'Jazz', 'Pop'];

export default function EventsScreen() {
  const [selectedCategory, setSelectedCategory] = useState('Alle');

  const filteredEvents = selectedCategory === 'Alle' 
    ? mockEvents 
    : mockEvents.filter(event => event.category === selectedCategory);

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
          <Text style={styles.headerTitle}>Events</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Category Filter */}
          <View style={styles.categorySection}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}
              contentContainerStyle={styles.categoryContainer}
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category && styles.categoryButtonActive
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={[
                    styles.categoryButtonText,
                    selectedCategory === category && styles.categoryButtonTextActive
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Events List */}
          <View style={styles.eventsSection}>
            <View style={styles.eventsList}>
              {filteredEvents.map((event) => (
                <TouchableOpacity key={event.id} style={styles.eventCard}>
                  <View style={styles.eventHeader}>
                    <View style={styles.eventDate}>
                      <Text style={styles.eventDay}>
                        {new Date(event.date).getDate()}
                      </Text>
                      <Text style={styles.eventMonth}>
                        {new Date(event.date).toLocaleDateString('da-DK', { month: 'short' })}
                      </Text>
                    </View>
                    
                    <View style={styles.eventInfo}>
                      <Text style={styles.eventTitle}>{event.title}</Text>
                      <Text style={styles.eventClub}>{event.club}</Text>
                      
                      <View style={styles.eventMeta}>
                        <View style={styles.eventDetail}>
                          <Clock size={12} color="#007AFF" />
                          <Text style={styles.eventDetailText}>{event.time}</Text>
                        </View>
                        <View style={styles.eventDetail}>
                          <Users size={12} color="#007AFF" />
                          <Text style={styles.eventDetailText}>{event.attendees}</Text>
                        </View>
                      </View>
                    </View>
                    
                    <View style={styles.eventPrice}>
                      <Text style={styles.priceText}>{event.price}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
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
  filterButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  categorySection: {
    paddingVertical: 16,
  },
  categoryScroll: {
    paddingLeft: 20,
  },
  categoryContainer: {
    paddingRight: 20,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
  },
  categoryButtonActive: {
    backgroundColor: '#007AFF',
  },
  categoryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#999',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  eventsSection: {
    paddingBottom: 32,
  },
  eventsList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  eventCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventDate: {
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 8,
    minWidth: 40,
  },
  eventDay: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  eventMonth: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#fff',
    textTransform: 'uppercase',
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 4,
  },
  eventClub: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
    marginBottom: 8,
  },
  eventMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  eventDetailText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#ccc',
  },
  eventPrice: {
    backgroundColor: '#007AFF',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  priceText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
});