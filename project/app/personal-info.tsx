import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ChevronRight, Mail, Phone, MapPin, Chrome as Home, Briefcase, User, Shield, Globe, Calendar, Check } from 'lucide-react-native';
import { router } from 'expo-router';
import { useProfile as useSupabaseProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';

interface PersonalInfoItem {
  id: string;
  title: string;
  value?: string;
  type: 'navigation' | 'display';
  icon?: any;
  onPress?: () => void;
  editable?: boolean;
}

export default function PersonalInfoScreen() {
  const { user } = useAuth();
  const { profile, updateProfile } = useSupabaseProfile();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedGender, setSelectedGender] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [tempDay, setTempDay] = useState('');
  const [tempMonth, setTempMonth] = useState('');
  const [tempYear, setTempYear] = useState('');

  const genderOptions = [
    { id: 'male', label: 'Mand' },
    { id: 'female', label: 'Kvinde' },
    { id: 'prefer_not_to_say', label: 'Vil ikke oplyse' },
  ];

  const handleEdit = (field: string, currentValue: string) => {
    if (field === 'gender') {
      setShowGenderModal(true);
    } else if (field === 'birthdate') {
      setShowDateModal(true);
   } else if (field === 'home') {
     setEditingField('home');
     setEditValue(currentValue);
    } else {
      setEditingField(field);
      setEditValue(currentValue);
    }
  };

  const handleSave = async (field: string) => {
    try {
      const updates: any = {};
      
     if (field === 'home' || field === 'location') {
       updates['location'] = editValue.trim();
        
        const { error } = await updateProfile(updates);
        
        if (error) {
          Alert.alert('Fejl', 'Kunne ikke gemme ændringer. Prøv igen.');
          return;
        }
        
        Alert.alert('Succes', 'Adresse opdateret!');
      } else if (field === 'phone') {
        Alert.alert('Succes', 'Telefonnummer opdateret!');
      } else {
        updates[field] = editValue.trim();
        
        const { error } = await updateProfile(updates);
        
        if (error) {
          Alert.alert('Fejl', 'Kunne ikke gemme ændringer. Prøv igen.');
          return;
        }
        
        Alert.alert('Succes', 'Oplysninger opdateret!');
      }
      
      setEditingField(null);
      setEditValue('');
    } catch (error) {
      Alert.alert('Fejl', 'Der opstod en uventet fejl. Prøv igen.');
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValue('');
  };

  const handleGenderSave = async () => {
    try {
      const { error } = await updateProfile({
        gender: selectedGender,
      });
      
      if (error) {
        Alert.alert('Fejl', 'Kunne ikke gemme køn. Prøv igen.');
        return;
      }
      
      Alert.alert('Succes', 'Køn opdateret!');
      setShowGenderModal(false);
    } catch (error) {
      Alert.alert('Fejl', 'Der opstod en uventet fejl. Prøv igen.');
    }
  };

  const handleDateSave = async () => {
    if (!tempDay || !tempMonth || !tempYear) {
      Alert.alert('Fejl', 'Udfyld venligst alle felter');
      return;
    }

    const day = parseInt(tempDay);
    const month = parseInt(tempMonth);
    const year = parseInt(tempYear);

    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > new Date().getFullYear()) {
      Alert.alert('Fejl', 'Indtast en gyldig dato');
      return;
    }

    const dateString = `${tempDay.padStart(2, '0')}/${tempMonth.padStart(2, '0')}/${tempYear}`;
    
    try {
      const { error } = await updateProfile({
        birthdate: dateString,
      });
      
      if (error) {
        Alert.alert('Fejl', 'Kunne ikke gemme fødselsdato. Prøv igen.');
        return;
      }
      
      setBirthDate(dateString);
      Alert.alert('Succes', 'Fødselsdato opdateret!');
      setShowDateModal(false);
      setTempDay('');
      setTempMonth('');
      setTempYear('');
    } catch (error) {
      Alert.alert('Fejl', 'Der opstod en uventet fejl. Prøv igen.');
    }
  };

  const personalInfoItems: PersonalInfoItem[] = [
    {
      id: 'email',
      title: 'E-mail',
      value: profile?.email || user?.email || 'kaluvin31@gmail.com',
      type: 'navigation',
      onPress: () => handleEdit('email', profile?.email || user?.email || ''),
    },
    {
      id: 'phone',
      title: 'Telefonnummer',
      type: 'navigation',
      onPress: () => handleEdit('phone', ''),
    },
    {
      id: 'blocked_users',
      title: 'Blokerede brugere',
      type: 'navigation',
      onPress: () => router.push('/blocked-users'),
    },
  ];

  const addressItems: PersonalInfoItem[] = [
    {
      id: 'home',
      title: 'Hjem',
      type: 'navigation',
     onPress: () => handleEdit('home', profile?.location || ''),
      value: profile?.location || undefined,
    },
  ];

  const aboutItems: PersonalInfoItem[] = [
    {
      id: 'gender',
      title: 'Køn',
      type: 'navigation',
      onPress: () => handleEdit('gender', ''),
      value: (profile as any)?.gender ? genderOptions.find(g => g.id === (profile as any)?.gender)?.label : undefined,
    },
    {
      id: 'birthdate',
      title: 'Fødselsdato',
      type: 'navigation',
      onPress: () => handleEdit('birthdate', ''),
      value: (profile as any)?.birthdate || birthDate || undefined,
    },
  ];


  const renderItem = (item: PersonalInfoItem) => {
    const isEditing = editingField === item.id;

    if (isEditing) {
      return (
        <View key={item.id} style={styles.editingItem}>
          <View style={styles.editingHeader}>
            <Text style={styles.editingTitle}>{item.title}</Text>
            <View style={styles.editingActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Annuller</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={() => handleSave(item.id)}
              >
                <Text style={styles.saveButtonText}>Gem</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TextInput
            style={styles.editInput}
            value={editValue}
            onChangeText={setEditValue}
            placeholder={`Indtast ${item.title.toLowerCase()}`}
            placeholderTextColor="#666"
            autoFocus
          />
        </View>
      );
    }

    return (
      <TouchableOpacity
        key={item.id}
        style={styles.infoItem}
        onPress={item.onPress}
      >
        <View style={styles.itemContent}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          {item.value && (
            <Text style={styles.itemValue}>{item.value}</Text>
          )}
        </View>
        <ChevronRight size={20} color="#666" />
      </TouchableOpacity>
    );
  };

  const renderSection = (title: string, items: PersonalInfoItem[]) => (
    <View style={styles.section}>
      {title ? <Text style={styles.sectionTitle}>{title}</Text> : null}
      <View style={styles.sectionContent}>
        {items.map((item, index) => (
          <View key={item.id}>
            {renderItem(item)}
            {index < items.length - 1 && <View style={styles.itemDivider} />}
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Personlige oplysninger</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {renderSection('', personalInfoItems)}
          {renderSection('Adresse', addressItems)}
          {renderSection('Om mig', aboutItems)}

        </ScrollView>

        {/* Gender Selection Modal */}
        <Modal
          visible={showGenderModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowGenderModal(false)}
        >
          <View style={styles.modalContainer}>
            <SafeAreaView style={styles.modalSafeArea}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setShowGenderModal(false)}>
                  <Text style={styles.modalCancelText}>Annuller</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Vælg køn</Text>
                <TouchableOpacity onPress={handleGenderSave}>
                  <Text style={styles.modalSaveText}>Gem</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.modalContent}>
                {genderOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.genderOption,
                      selectedGender === option.id && styles.selectedGenderOption
                    ]}
                    onPress={() => setSelectedGender(option.id)}
                  >
                    <Text style={[
                      styles.genderOptionText,
                      selectedGender === option.id && styles.selectedGenderOptionText
                    ]}>
                      {option.label}
                    </Text>
                    {selectedGender === option.id && (
                      <Check size={20} color="#007AFF" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </SafeAreaView>
          </View>
        </Modal>

        {/* Date Selection Modal */}
        <Modal
          visible={showDateModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowDateModal(false)}
        >
          <View style={styles.modalContainer}>
            <SafeAreaView style={styles.modalSafeArea}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setShowDateModal(false)}>
                  <Text style={styles.modalCancelText}>Annuller</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Fødselsdato</Text>
                <TouchableOpacity onPress={handleDateSave}>
                  <Text style={styles.modalSaveText}>Gem</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.modalContent}>
                <Text style={styles.dateInstructions}>Indtast din fødselsdato</Text>
                
                <View style={styles.dateInputContainer}>
                  <View style={styles.dateInputGroup}>
                    <Text style={styles.dateInputLabel}>Dag</Text>
                    <TextInput
                      style={styles.dateInput}
                      value={tempDay}
                      onChangeText={setTempDay}
                      placeholder="DD"
                      placeholderTextColor="#666"
                      keyboardType="numeric"
                      maxLength={2}
                    />
                  </View>
                  
                  <View style={styles.dateInputGroup}>
                    <Text style={styles.dateInputLabel}>Måned</Text>
                    <TextInput
                      style={styles.dateInput}
                      value={tempMonth}
                      onChangeText={setTempMonth}
                      placeholder="MM"
                      placeholderTextColor="#666"
                      keyboardType="numeric"
                      maxLength={2}
                    />
                  </View>
                  
                  <View style={styles.dateInputGroup}>
                    <Text style={styles.dateInputLabel}>År</Text>
                    <TextInput
                      style={styles.dateInput}
                      value={tempYear}
                      onChangeText={setTempYear}
                      placeholder="YYYY"
                      placeholderTextColor="#666"
                      keyboardType="numeric"
                      maxLength={4}
                    />
                  </View>
                </View>
                
                <Text style={styles.dateExample}>Eksempel: 15/03/1995</Text>
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
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 16,
    marginHorizontal: 20,
  },
  sectionContent: {
    backgroundColor: '#1a1a1a',
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    minHeight: 56,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    marginBottom: 2,
  },
  itemValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  itemDivider: {
    height: 1,
    backgroundColor: '#2a2a2a',
    marginLeft: 20,
  },
  editingItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#2a2a2a',
  },
  editingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  editingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  editingActions: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelButton: {
    backgroundColor: '#333',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  cancelButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#999',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  saveButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  editInput: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  footerSection: {
    paddingHorizontal: 20,
    paddingVertical: 32,
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
  modalSaveText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#007AFF',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  genderOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  selectedGenderOption: {
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  genderOptionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#fff',
  },
  selectedGenderOptionText: {
    color: '#007AFF',
    fontFamily: 'Inter-SemiBold',
  },
  dateInstructions: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
  },
  dateInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  dateInputGroup: {
    flex: 1,
    alignItems: 'center',
  },
  dateInputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 8,
  },
  dateInput: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#333',
    width: '100%',
  },
  dateExample: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
  },
});