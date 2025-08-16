import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, MapPin, Calendar, Users, Clock, Search } from 'lucide-react-native';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const mockMyPreparties = [
  {
    id: '1',
    title: 'Weekend Preparty',
    location: 'Nørrebro',
    time: '20:00',
    date: '2025-01-25',
    attendees: 8,
    maxAttendees: 12,
    isHost: true,
    status: 'active',
  },
  {
    id: '2',
    title: 'Før Vega',
    location: 'Vesterbro',
    time: '19:30',
    date: '2025-01-26',
    attendees: 5,
    maxAttendees: 8,
    isHost: false,
    status: 'pending',
  },
];

export default function PrepartyScreen() {
  const [activeTab, setActiveTab] = useState('mine');

  const renderMyPreparties = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Mine Preparties</Text>

      {mockMyPreparties.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyStateIcon}>
            <Calendar size={48} color="#666" />
          </View>
          <Text style={styles.emptyStateTitle}>Ingen preparties endnu</Text>
          <Text style={styles.emptyStateText}>
            Opret din første preparty og inviter dine venner
          </Text>
          <TouchableOpacity 
            style={styles.emptyStateButton}
            onPress={() => router.push('/preparty/create')}
          >
            <Text style={styles.emptyStateButtonText}>Opret Preparty</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.prepartyList}>
          {mockMyPreparties.map((preparty) => (
            <TouchableOpacity 
              key={preparty.id} 
              style={styles.prepartyCard}
              onPress={() => router.push(`/preparty/${preparty.id}`)}
            >
              <View style={styles.prepartyHeader}>
                <View style={styles.prepartyTitleContainer}>
                  <Text style={styles.prepartyTitle}>{preparty.title}</Text>
                  <View style={[
                    styles.statusBadge,
                    preparty.status === 'active' ? styles.activeBadge : styles.pendingBadge
                  ]}>
                    <Text style={styles.statusText}>
                      {preparty.isHost ? 'Host' : preparty.status === 'pending' ? 'Venter' : 'Deltager'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.prepartyDate}>
                  {new Date(preparty.date).toLocaleDateString('da-DK', { 
                    weekday: 'short', 
                    day: 'numeric', 
                    month: 'short' 
                  })}
                </Text>
              </View>

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
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Preparty</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => router.push('/preparty/create')}
          >
            <View style={styles.quickActionIcon}>
              <Plus size={20} color="#fff" />
            </View>
            <Text style={styles.quickActionText}>Opret Preparty</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => router.push('/preparty/find')}
          >
            <View style={styles.quickActionIcon}>
              <MapPin size={20} color="#fff" />
            </View>
            <Text style={styles.quickActionText}>Find Preparty</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {renderMyPreparties()}
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
  searchButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 8,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
  },
  quickActionIcon: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  createButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
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
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  emptyStateButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  prepartyList: {
    gap: 12,
  },
  prepartyCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
  },
  prepartyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  prepartyTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  prepartyTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 4,
  },
  statusBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  activeBadge: {
    backgroundColor: '#007AFF',
  },
  pendingBadge: {
    backgroundColor: '#FF9500',
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  prepartyDate: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#007AFF',
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
  },
  attendeesProgress: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
});