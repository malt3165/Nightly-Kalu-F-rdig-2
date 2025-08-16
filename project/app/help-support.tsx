import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CircleHelp as HelpCircle, MessageCircle, Mail, Phone, Search, ChevronRight, Send, Book, Shield, Bug, Star } from 'lucide-react-native';
import { router } from 'expo-router';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface SupportOption {
  id: string;
  title: string;
  description: string;
  icon: any;
  action: () => void;
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'Hvordan opretter jeg en konto?',
    answer: 'Du kan oprette en konto ved at trykke på "Opret konto" på login siden og udfylde dine oplysninger. Du skal være mindst 18 år for at oprette en konto.',
    category: 'Konto',
  },
  {
    id: '2',
    question: 'Hvordan finder jeg venner på NIGHTLY?',
    answer: 'Gå til Social fanen og tryk på "+" ikonet. Du kan søge efter venner via email eller se foreslåede venner baseret på fælles forbindelser.',
    category: 'Venner',
  },
  {
    id: '3',
    question: 'Hvordan tjekker jeg ind på et sted?',
    answer: 'Find stedet på kortet eller i listen, tryk på det og tryk derefter på "Tjek ind her" knappen. Du skal være fysisk til stede for at tjekke ind.',
    category: 'Check-in',
  },
  {
    id: '4',
    question: 'Kan jeg ændre mine privatlivsindstillinger?',
    answer: 'Ja! Gå til Menu > Personlige oplysninger > Data og privatliv for at administrere dine privatlivsindstillinger og kontrollere hvem der kan se dine data.',
    category: 'Privatliv',
  },
  {
    id: '5',
    question: 'Hvordan opretter jeg en preparty?',
    answer: 'Gå til Preparty fanen og tryk på "Opret Preparty". Udfyld detaljerne og inviter dine venner eller grupper.',
    category: 'Preparty',
  },
  {
    id: '6',
    question: 'Hvad er leaderboard?',
    answer: 'Leaderboard viser hvem der bruger mest på natteliv. Det er baseret på check-ins og aktivitet på platformen.',
    category: 'Leaderboard',
  },
];

const categories = ['Alle', 'Konto', 'Venner', 'Check-in', 'Privatliv', 'Preparty', 'Leaderboard'];

export default function HelpSupportScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Alle');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  const filteredFAQ = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Alle' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const supportOptions: SupportOption[] = [
    {
      id: 'contact',
      title: 'Kontakt support',
      description: 'Send os en besked og få hjælp inden for 24 timer',
      icon: MessageCircle,
      action: () => setShowContactModal(true),
    },
    {
      id: 'email',
      title: 'Send email',
      description: 'support@nightly.dk',
      icon: Mail,
      action: () => Alert.alert('Email', 'Åbner din email app...'),
    },
    {
      id: 'phone',
      title: 'Ring til os',
      description: '+45 70 20 30 40 (hverdage 9-17)',
      icon: Phone,
      action: () => Alert.alert('Telefon', 'Ringer til support...'),
    },
    {
      id: 'bug',
      title: 'Rapporter fejl',
      description: 'Hjælp os med at forbedre NIGHTLY',
      icon: Bug,
      action: () => Alert.alert('Fejlrapport', 'Fejlrapport funktionalitet kommer snart'),
    },
  ];

  const handleSendMessage = () => {
    if (!contactMessage.trim() || !contactEmail.trim()) {
      Alert.alert('Fejl', 'Udfyld venligst alle felter');
      return;
    }

    Alert.alert(
      'Besked sendt!',
      'Tak for din henvendelse. Vi vender tilbage til dig inden for 24 timer.',
      [
        {
          text: 'OK',
          onPress: () => {
            setShowContactModal(false);
            setContactMessage('');
            setContactEmail('');
          }
        }
      ]
    );
  };

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
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
            <ArrowLeft size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hjælp og Support</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Support Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Få hjælp</Text>
            <View style={styles.supportGrid}>
              {supportOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <TouchableOpacity
                    key={option.id}
                    style={styles.supportCard}
                    onPress={option.action}
                  >
                    <View style={styles.supportIcon}>
                      <IconComponent size={24} color="#007AFF" />
                    </View>
                    <Text style={styles.supportTitle}>{option.title}</Text>
                    <Text style={styles.supportDescription}>{option.description}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Search */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ofte stillede spørgsmål</Text>
            <View style={styles.searchContainer}>
              <Search size={20} color="#666" />
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Søg i FAQ..."
                placeholderTextColor="#666"
              />
            </View>
          </View>

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

          {/* FAQ List */}
          <View style={styles.section}>
            {filteredFAQ.length === 0 ? (
              <View style={styles.emptyState}>
                <HelpCircle size={48} color="#666" />
                <Text style={styles.emptyStateTitle}>Ingen resultater</Text>
                <Text style={styles.emptyStateText}>
                  Prøv at ændre din søgning eller vælg en anden kategori
                </Text>
              </View>
            ) : (
              <View style={styles.faqList}>
                {filteredFAQ.map((item) => (
                  <View key={item.id} style={styles.faqCard}>
                    <TouchableOpacity
                      style={styles.faqHeader}
                      onPress={() => toggleFAQ(item.id)}
                    >
                      <View style={styles.faqQuestion}>
                        <Text style={styles.faqQuestionText}>{item.question}</Text>
                        <View style={styles.faqCategory}>
                          <Text style={styles.faqCategoryText}>{item.category}</Text>
                        </View>
                      </View>
                      <ChevronRight 
                        size={20} 
                        color="#666" 
                        style={[
                          styles.chevron,
                          expandedFAQ === item.id && styles.chevronExpanded
                        ]}
                      />
                    </TouchableOpacity>
                    
                    {expandedFAQ === item.id && (
                      <View style={styles.faqAnswer}>
                        <Text style={styles.faqAnswerText}>{item.answer}</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Quick Links */}
          {/* App Info */}
          <View style={styles.appInfoSection}>
            <Text style={styles.appInfoTitle}>NIGHTLY</Text>
            <Text style={styles.appInfoVersion}>Version 1.0.0</Text>
            <Text style={styles.appInfoText}>
              Opdag nattelivet sammen med dine venner
            </Text>
          </View>
        </ScrollView>

        {/* Contact Modal */}
        <Modal
          visible={showContactModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowContactModal(false)}
        >
          <View style={styles.modalContainer}>
            <SafeAreaView style={styles.modalSafeArea}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setShowContactModal(false)}>
                  <Text style={styles.modalCancelText}>Annuller</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Kontakt Support</Text>
                <TouchableOpacity 
                  onPress={handleSendMessage}
                  disabled={!contactMessage.trim() || !contactEmail.trim()}
                >
                  <Text style={[
                    styles.modalSendText,
                    (!contactMessage.trim() || !contactEmail.trim()) && styles.modalSendTextDisabled
                  ]}>
                    Send
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.modalContent}>
                <View style={styles.inputSection}>
                  <Text style={styles.inputLabel}>Din email</Text>
                  <TextInput
                    style={styles.textInput}
                    value={contactEmail}
                    onChangeText={setContactEmail}
                    placeholder="din@email.com"
                    placeholderTextColor="#666"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputSection}>
                  <Text style={styles.inputLabel}>Besked</Text>
                  <TextInput
                    style={[styles.textInput, styles.textArea]}
                    value={contactMessage}
                    onChangeText={setContactMessage}
                    placeholder="Beskriv dit problem eller spørgsmål..."
                    placeholderTextColor="#666"
                    multiline
                    numberOfLines={6}
                    maxLength={500}
                    textAlignVertical="top"
                  />
                  <Text style={styles.characterCount}>
                    {contactMessage.length}/500 tegn
                  </Text>
                </View>

                <View style={styles.responseInfo}>
                  <Text style={styles.responseInfoText}>
                    Vi svarer normalt inden for 24 timer på hverdage.
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
  supportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  supportCard: {
    width: '47%',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  supportIcon: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  supportTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 4,
    textAlign: 'center',
  },
  supportDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999',
    textAlign: 'center',
    lineHeight: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    marginLeft: 12,
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
    textAlign: 'center',
  },
  faqList: {
    gap: 8,
  },
  faqCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  faqQuestion: {
    flex: 1,
    marginRight: 12,
  },
  faqQuestionText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 4,
  },
  faqCategory: {
    backgroundColor: '#007AFF',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  faqCategoryText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  chevron: {
    transform: [{ rotate: '0deg' }],
  },
  chevronExpanded: {
    transform: [{ rotate: '90deg' }],
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
  },
  faqAnswerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ccc',
    lineHeight: 20,
    paddingTop: 16,
  },
  quickLinks: {
    gap: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    overflow: 'hidden',
  },
  quickLinkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#1a1a1a',
  },
  quickLinkText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    marginLeft: 12,
  },
  appInfoTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    letterSpacing: 1,
    marginBottom: 8,
  },
  appInfoVersion: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
    marginBottom: 8,
  },
  appInfoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
    textAlign: 'center',
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
    paddingTop: 20,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    borderWidth: 1,
    borderColor: '#333',
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'right',
    marginTop: 8,
  },
  responseInfo: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  responseInfoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
    textAlign: 'center',
  },
});