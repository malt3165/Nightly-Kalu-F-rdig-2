import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Smartphone, Users, MapPin, Calendar, Star, Heart } from 'lucide-react-native';
import { router } from 'expo-router';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Om NIGHTLY</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* App Logo/Icon */}
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>NIGHTLY</Text>
            </View>
          </View>

          {/* Main Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionText}>
              Nightly er din ven i nattelivet – den hjælper dig og dine venner med at finde de bedste steder i byen, fra private forfester til klubber og barer, her og nu. Se hvor der sker noget, tjek ind, følg venner og grupper, og find nye mennesker at tage i byen med.
            </Text>
          </View>

          {/* Features */}
          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>Hvad kan NIGHTLY?</Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <MapPin size={24} color="#007AFF" />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Find de bedste steder</Text>
                  <Text style={styles.featureDescription}>
                    Opdag klubber og barer i nærheden med realtids information
                  </Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Users size={24} color="#007AFF" />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Forbind med venner</Text>
                  <Text style={styles.featureDescription}>
                    Se hvor dine venner er og planlæg fester sammen
                  </Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Calendar size={24} color="#007AFF" />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Opret preparties</Text>
                  <Text style={styles.featureDescription}>
                    Organiser private forfester før I tager i byen
                  </Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Star size={24} color="#007AFF" />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Tjek ind og del</Text>
                  <Text style={styles.featureDescription}>
                    Lad venner vide hvor du er og se hvor der er mest liv
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Mission */}
          <View style={styles.missionSection}>
            <Text style={styles.sectionTitle}>Vores mission</Text>
            <View style={styles.missionCard}>
              <View style={styles.missionIcon}>
                <Heart size={32} color="#FF6B6B" />
              </View>
              <Text style={styles.missionText}>
                At gøre nattelivet mere socialt og sjovt ved at forbinde mennesker og hjælpe dem med at opdage de bedste oplevelser i deres by.
              </Text>
            </View>
          </View>

          {/* App Info */}
          <View style={styles.appInfoSection}>
            <Text style={styles.appInfoTitle}>NIGHTLY</Text>
            <Text style={styles.appInfoVersion}>Version 1.0.0</Text>
            <Text style={styles.appInfoText}>
              Opdag nattelivet sammen med dine venner
            </Text>
            <Text style={styles.appInfoCopyright}>
              © 2025 NIGHTLY. Alle rettigheder forbeholdes.
            </Text>
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
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  headerRight: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  logoSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  logoContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  logoText: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#007AFF',
    letterSpacing: 2,
  },
  descriptionSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  descriptionText: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    lineHeight: 28,
    textAlign: 'center',
  },
  featuresSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  featuresList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
  },
  featureIcon: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 8,
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
    lineHeight: 20,
  },
  missionSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  missionCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  missionIcon: {
    marginBottom: 16,
  },
  missionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 24,
  },
  appInfoSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
    borderTopWidth: 1,
    borderTopColor: '#1a1a1a',
  },
  appInfoTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    letterSpacing: 2,
    marginBottom: 8,
  },
  appInfoVersion: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#666',
    marginBottom: 8,
  },
  appInfoText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#999',
    textAlign: 'center',
    marginBottom: 16,
  },
  appInfoCopyright: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
  },
});