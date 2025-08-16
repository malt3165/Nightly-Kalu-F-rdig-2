import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Crown, Check, Star, Zap, Shield } from 'lucide-react-native';
import { router } from 'expo-router';

const plans = [
  {
    id: 'monthly',
    name: 'Månedlig',
    price: '19 kr',
    period: '/måned',
    description: 'Perfekt til at prøve NIGHTLY Premium',
    popular: false,
  },
  {
    id: 'yearly',
    name: 'Årlig',
    price: '190 kr',
    period: '/år',
    description: 'Spar 38 kr med årlig betaling',
    popular: true,
    savings: 'Spar 38 kr',
  },
];

const features = [
  {
    icon: Zap,
    title: 'Ingen reklamer',
    description: 'Nyd NIGHTLY uden forstyrrende reklamer',
  },
  {
    icon: Crown,
    title: 'Eksklusiv adgang',
    description: 'Få adgang til premium events og steder',
  },
  {
    icon: Star,
    title: 'Prioritet support',
    description: 'Få hurtigere hjælp når du har brug for det',
  },
  {
    icon: Shield,
    title: 'Avanceret privatliv',
    description: 'Ekstra kontrol over dine data og synlighed',
  },
];

export default function SubscriptionScreen() {
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    setIsLoading(true);
    
    // Simulate subscription process
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Tak for dit køb!',
        'Du har nu adgang til NIGHTLY Premium. Nyd alle de ekstra features!',
        [
          {
            text: 'Fantastisk!',
            onPress: () => router.back(),
          },
        ]
      );
    }, 2000);
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
          <Text style={styles.headerTitle}>NIGHTLY Premium</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.premiumIcon}>
              <Crown size={48} color="#FFD700" />
            </View>
            <Text style={styles.heroTitle}>Opgrader til Premium</Text>
            <Text style={styles.heroSubtitle}>
              Få den ultimative NIGHTLY oplevelse med eksklusiv adgang og ingen reklamer
            </Text>
          </View>

          {/* Features */}
          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>Hvad får du?</Text>
            <View style={styles.featuresList}>
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <View key={index} style={styles.featureCard}>
                    <View style={styles.featureIcon}>
                      <IconComponent size={24} color="#007AFF" />
                    </View>
                    <View style={styles.featureContent}>
                      <Text style={styles.featureTitle}>{feature.title}</Text>
                      <Text style={styles.featureDescription}>{feature.description}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Plans */}
          <View style={styles.plansSection}>
            <Text style={styles.sectionTitle}>Vælg din plan</Text>
            <View style={styles.plansList}>
              {plans.map((plan) => (
                <TouchableOpacity
                  key={plan.id}
                  style={[
                    styles.planCard,
                    selectedPlan === plan.id && styles.selectedPlan,
                    plan.popular && styles.popularPlan
                  ]}
                  onPress={() => setSelectedPlan(plan.id)}
                >
                  {plan.popular && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularBadgeText}>MEST POPULÆR</Text>
                    </View>
                  )}
                  
                  <View style={styles.planHeader}>
                    <View style={styles.planInfo}>
                      <Text style={styles.planName}>{plan.name}</Text>
                      <Text style={styles.planDescription}>{plan.description}</Text>
                    </View>
                    
                    <View style={styles.planPricing}>
                      <Text style={styles.planPrice}>{plan.price}</Text>
                      <Text style={styles.planPeriod}>{plan.period}</Text>
                    </View>
                  </View>

                  {plan.savings && (
                    <View style={styles.savingsContainer}>
                      <Text style={styles.savingsText}>{plan.savings}</Text>
                    </View>
                  )}

                  <View style={styles.planSelector}>
                    <View style={[
                      styles.radioButton,
                      selectedPlan === plan.id && styles.radioButtonSelected
                    ]}>
                      {selectedPlan === plan.id && (
                        <Check size={16} color="#fff" />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Subscribe Button */}
          <View style={styles.subscribeSection}>
            <TouchableOpacity 
              style={[styles.subscribeButton, isLoading && styles.subscribeButtonLoading]}
              onPress={handleSubscribe}
              disabled={isLoading}
            >
              <Text style={styles.subscribeButtonText}>
                {isLoading ? 'Behandler...' : 'Start Premium'}
              </Text>
            </TouchableOpacity>
            
            <Text style={styles.subscribeNote}>
              Du kan opsige når som helst. Ingen binding.
            </Text>
          </View>

          {/* Terms */}
          <View style={styles.termsSection}>
            <Text style={styles.termsText}>
              Ved at fortsætte accepterer du vores{' '}
              <Text style={styles.termsLink}>Servicevilkår</Text> og{' '}
              <Text style={styles.termsLink}>Privatlivspolitik</Text>
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
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  premiumIcon: {
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
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
  },
  featuresList: {
    gap: 16,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  plansSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  plansList: {
    gap: 12,
  },
  planCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  selectedPlan: {
    borderColor: '#007AFF',
  },
  popularPlan: {
    borderColor: '#FFD700',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    left: 16,
    backgroundColor: '#FFD700',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  popularBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#000',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginBottom: 4,
  },
  planDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
  planPricing: {
    alignItems: 'flex-end',
  },
  planPrice: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  planPeriod: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
  savingsContainer: {
    marginBottom: 12,
  },
  savingsText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#4ade80',
  },
  planSelector: {
    alignItems: 'flex-end',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  subscribeSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  subscribeButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  subscribeButtonLoading: {
    opacity: 0.7,
  },
  subscribeButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  subscribeNote: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
    textAlign: 'center',
  },
  termsSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  termsText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
});