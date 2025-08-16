import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Save, User } from 'lucide-react-native';
import { router } from 'expo-router';
import { useProfile as useSupabaseProfile } from '@/hooks/useProfile';

export default function AboutMeScreen() {
  const { profile, updateProfile } = useSupabaseProfile();
  const [aboutText, setAboutText] = useState(profile?.bio || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const { error } = await updateProfile({
        bio: aboutText.trim(),
      });
      
      if (error) {
        Alert.alert('Fejl', 'Kunne ikke gemme ændringer. Prøv igen.');
        return;
      }

      Alert.alert('Succes', 'Om mig er opdateret!');
      router.back();
    } catch (error) {
      Alert.alert('Fejl', 'Der opstod en uventet fejl. Prøv igen.');
    } finally {
      setIsSaving(false);
    }
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
          <Text style={styles.headerTitle}>Om mig</Text>
          <TouchableOpacity 
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isSaving}
          >
            <Save size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Info Section */}
          <View style={styles.infoSection}>
            <View style={styles.infoIcon}>
              <User size={32} color="#007AFF" />
            </View>
            <Text style={styles.infoTitle}>Fortæl om dig selv</Text>
            <Text style={styles.infoText}>
              Skriv lidt om dig selv så andre kan lære dig at kende. 
              Del dine interesser, hobbyer eller hvad der gør dig glad.
            </Text>
          </View>

          {/* Text Input */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Om mig</Text>
            <TextInput
              style={styles.textInput}
              value={aboutText}
              onChangeText={setAboutText}
              placeholder="F.eks. Elsker at danse til techno musik, rejser gerne til nye byer og er altid klar på en god fest med vennerne..."
              placeholderTextColor="#666"
              multiline
              numberOfLines={8}
              maxLength={500}
              textAlignVertical="top"
            />
            <View style={styles.characterCount}>
              <Text style={styles.characterCountText}>
                {aboutText.length}/500 tegn
              </Text>
            </View>
          </View>

          {/* Tips */}
          <View style={styles.tipsSection}>
            <Text style={styles.tipsTitle}>💡 Tips til en god beskrivelse</Text>
            <View style={styles.tipsList}>
              <Text style={styles.tipText}>• Skriv om dine hobbyer og interesser</Text>
              <Text style={styles.tipText}>• Nævn din musiksmag</Text>
              <Text style={styles.tipText}>• Fortæl hvad du laver i fritiden</Text>
              <Text style={styles.tipText}>• Del hvad der gør dig glad</Text>
              <Text style={styles.tipText}>• Vær autentisk og positiv</Text>
            </View>
          </View>

          {/* Preview */}
          {aboutText.trim() && (
            <View style={styles.previewSection}>
              <Text style={styles.previewTitle}>Sådan ser det ud:</Text>
              <View style={styles.previewCard}>
                <Text style={styles.previewText}>{aboutText}</Text>
              </View>
            </View>
          )}
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
    padding: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  scrollView: {
    flex: 1,
  },
  infoSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  infoIcon: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
  },
  inputSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    minHeight: 150,
    borderWidth: 1,
    borderColor: '#333',
  },
  characterCount: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  characterCountText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  previewSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  previewTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 12,
  },
  previewCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  previewText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ccc',
    lineHeight: 24,
  },
  tipsSection: {
    marginHorizontal: 20,
    marginBottom: 40,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
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