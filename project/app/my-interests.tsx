import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Music, Camera, Plane, Coffee, Book, Gamepad2, Dumbbell, Palette, Heart, Plus } from 'lucide-react-native';
import { router } from 'expo-router';

interface Interest {
  id: string;
  name: string;
  icon: any;
  color: string;
  selected: boolean;
}

const availableInterests: Interest[] = [
  { id: '1', name: 'Musik', icon: Music, color: '#FF6B6B', selected: true },
  { id: '2', name: 'Fotografering', icon: Camera, color: '#4ECDC4', selected: false },
  { id: '3', name: 'Rejser', icon: Plane, color: '#45B7D1', selected: true },
  { id: '4', name: 'Kaffe', icon: Coffee, color: '#96CEB4', selected: true },
  { id: '5', name: 'Læsning', icon: Book, color: '#FFEAA7', selected: false },
  { id: '6', name: 'Gaming', icon: Gamepad2, color: '#DDA0DD', selected: false },
  { id: '7', name: 'Fitness', icon: Dumbbell, color: '#98D8C8', selected: false },
  { id: '8', name: 'Kunst', icon: Palette, color: '#F7DC6F', selected: false },
];

export default function MyInterestsScreen() {
  const [interests, setInterests] = useState<Interest[]>(availableInterests);

  const toggleInterest = (interestId: string) => {
    setInterests(prev =>
      prev.map(interest =>
        interest.id === interestId
          ? { ...interest, selected: !interest.selected }
          : interest
      )
    );
  };

  const selectedCount = interests.filter(i => i.selected).length;

  const handleSave = () => {
    Alert.alert('Succes', 'Dine interesser er gemt!');
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
          <Text style={styles.headerTitle}>Mine interesser</Text>
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Gem</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Info */}
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Vælg dine interesser</Text>
            <Text style={styles.infoText}>
              Hjælp andre med at lære dig at kende ved at vælge dine interesser. 
              Du har valgt {selectedCount} interesser.
            </Text>
          </View>

          {/* Interests Grid */}
          <View style={styles.interestsSection}>
            <View style={styles.interestsGrid}>
              {interests.map((interest) => {
                const IconComponent = interest.icon;
                return (
                  <TouchableOpacity
                    key={interest.id}
                    style={[
                      styles.interestCard,
                      interest.selected && styles.selectedInterest
                    ]}
                    onPress={() => toggleInterest(interest.id)}
                  >
                    <View style={[
                      styles.interestIcon,
                      { backgroundColor: interest.selected ? interest.color : '#2a2a2a' }
                    ]}>
                      <IconComponent 
                        size={24} 
                        color={interest.selected ? "#fff" : interest.color} 
                      />
                    </View>
                    <Text style={[
                      styles.interestName,
                      interest.selected && styles.selectedInterestName
                    ]}>
                      {interest.name}
                    </Text>
                    {interest.selected && (
                      <View style={styles.selectedIndicator}>
                        <Heart size={12} color="#fff" fill="#fff" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Selected Interests Summary */}
          {selectedCount > 0 && (
            <View style={styles.summarySection}>
              <Text style={styles.summaryTitle}>Dine valgte interesser</Text>
              <View style={styles.selectedList}>
                {interests
                  .filter(i => i.selected)
                  .map((interest) => {
                    const IconComponent = interest.icon;
                    return (
                      <View key={interest.id} style={styles.selectedItem}>
                        <IconComponent size={16} color={interest.color} />
                        <Text style={styles.selectedItemText}>{interest.name}</Text>
                      </View>
                    );
                  })}
              </View>
            </View>
          )}

          {/* Tips */}
          <View style={styles.tipsSection}>
            <Text style={styles.tipsTitle}>💡 Tips</Text>
            <View style={styles.tipsList}>
              <Text style={styles.tipText}>• Vælg 3-6 interesser for bedst resultat</Text>
              <Text style={styles.tipText}>• Dine interesser hjælper med at finde fælles interesser</Text>
              <Text style={styles.tipText}>• Du kan altid ændre dine interesser senere</Text>
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
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  saveButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  infoSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
  },
  interestsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  interestCard: {
    width: '47%',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    position: 'relative',
  },
  selectedInterest: {
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  interestIcon: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  interestName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#999',
    textAlign: 'center',
  },
  selectedInterestName: {
    color: '#fff',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 4,
  },
  summarySection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 12,
  },
  selectedList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  selectedItemText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  tipsSection: {
    marginHorizontal: 20,
    marginBottom: 40,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
  },
  tipsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginBottom: 12,
  },
  tipsList: {
    gap: 8,
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ccc',
    lineHeight: 20,
  },
});