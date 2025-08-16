import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, MapPin, Clock, Users, Calendar, Plus, X } from 'lucide-react-native';
import { router } from 'expo-router';

const mockFriends = [
  { id: '1', name: 'Anna', isSelected: false },
  { id: '2', name: 'Lars', isSelected: false },
  { id: '3', name: 'Maria', isSelected: false },
  { id: '4', name: 'Peter', isSelected: false },
];

const mockGroups = [
  { id: '1', name: 'Weekend Crew', members: 8, isSelected: false },
  { id: '2', name: 'Electronic Lovers', members: 23, isSelected: false },
];

export default function CreatePrepartyScreen() {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [maxAttendees, setMaxAttendees] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFriends, setSelectedFriends] = useState(mockFriends);
  const [selectedGroups, setSelectedGroups] = useState(mockGroups);

  const handleCreatePreparty = () => {
    if (!title || !location || !date || !time) {
      Alert.alert('Fejl', 'Udfyld venligst alle påkrævede felter');
      return;
    }

    const invitedFriends = selectedFriends.filter(f => f.isSelected);
    const invitedGroups = selectedGroups.filter(g => g.isSelected);

    Alert.alert(
      'Preparty oprettet!',
      `"${title}" er oprettet og invitationer er sendt til ${invitedFriends.length} venner og ${invitedGroups.length} grupper.`,
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const toggleFriendSelection = (friendId: string) => {
    setSelectedFriends(prev =>
      prev.map(friend =>
        friend.id === friendId
          ? { ...friend, isSelected: !friend.isSelected }
          : friend
      )
    );
  };

  const toggleGroupSelection = (groupId: string) => {
    setSelectedGroups(prev =>
      prev.map(group =>
        group.id === groupId
          ? { ...group, isSelected: !group.isSelected }
          : group
      )
    );
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
          <Text style={styles.headerTitle}>Opret Preparty</Text>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={handleCreatePreparty}
          >
            <Text style={styles.createButtonText}>Opret</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Basic Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Grundlæggende info</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Titel *</Text>
              <TextInput
                style={styles.textInput}
                value={title}
                onChangeText={setTitle}
                placeholder="F.eks. Weekend Preparty"
                placeholderTextColor="#666"
                maxLength={50}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Lokation *</Text>
              <View style={styles.inputWithIcon}>
                <MapPin size={20} color="#666" />
                <TextInput
                  style={styles.textInputWithIcon}
                  value={location}
                  onChangeText={setLocation}
                  placeholder="Adresse eller område"
                  placeholderTextColor="#666"
                />
              </View>
            </View>

            <View style={styles.rowContainer}>
              <View style={styles.halfInput}>
                <Text style={styles.inputLabel}>Dato *</Text>
                <View style={styles.inputWithIcon}>
                  <Calendar size={20} color="#666" />
                  <TextInput
                    style={styles.textInputWithIcon}
                    value={date}
                    onChangeText={setDate}
                    placeholder="DD/MM/YYYY"
                    placeholderTextColor="#666"
                  />
                </View>
              </View>

              <View style={styles.halfInput}>
                <Text style={styles.inputLabel}>Tid *</Text>
                <View style={styles.inputWithIcon}>
                  <Clock size={20} color="#666" />
                  <TextInput
                    style={styles.textInputWithIcon}
                    value={time}
                    onChangeText={setTime}
                    placeholder="HH:MM"
                    placeholderTextColor="#666"
                  />
                </View>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Max deltagere</Text>
              <View style={styles.inputWithIcon}>
                <Users size={20} color="#666" />
                <TextInput
                  style={styles.textInputWithIcon}
                  value={maxAttendees}
                  onChangeText={setMaxAttendees}
                  placeholder="F.eks. 10"
                  placeholderTextColor="#666"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Beskrivelse</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Fortæl lidt om preparty'en..."
                placeholderTextColor="#666"
                multiline
                numberOfLines={3}
                maxLength={200}
              />
            </View>
          </View>

          {/* Invite Friends */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Inviter venner</Text>
            <View style={styles.inviteList}>
              {selectedFriends.map((friend) => (
                <TouchableOpacity
                  key={friend.id}
                  style={[
                    styles.inviteItem,
                    friend.isSelected && styles.inviteItemSelected
                  ]}
                  onPress={() => toggleFriendSelection(friend.id)}
                >
                  <View style={styles.inviteItemContent}>
                    <View style={styles.friendAvatar}>
                      <Text style={styles.friendInitial}>
                        {friend.name.charAt(0)}
                      </Text>
                    </View>
                    <Text style={styles.inviteItemName}>{friend.name}</Text>
                  </View>
                  {friend.isSelected ? (
                    <View style={styles.selectedIcon}>
                      <Text style={styles.checkmark}>✓</Text>
                    </View>
                  ) : (
                    <View style={styles.unselectedIcon} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Invite Groups */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Inviter grupper</Text>
            <View style={styles.inviteList}>
              {selectedGroups.map((group) => (
                <TouchableOpacity
                  key={group.id}
                  style={[
                    styles.inviteItem,
                    group.isSelected && styles.inviteItemSelected
                  ]}
                  onPress={() => toggleGroupSelection(group.id)}
                >
                  <View style={styles.inviteItemContent}>
                    <View style={styles.groupAvatar}>
                      <Users size={20} color="#fff" />
                    </View>
                    <View style={styles.groupInfo}>
                      <Text style={styles.inviteItemName}>{group.name}</Text>
                      <Text style={styles.groupMembers}>{group.members} medlemmer</Text>
                    </View>
                  </View>
                  {group.isSelected ? (
                    <View style={styles.selectedIcon}>
                      <Text style={styles.checkmark}>✓</Text>
                    </View>
                  ) : (
                    <View style={styles.unselectedIcon} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Summary */}
          <View style={styles.section}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Oversigt</Text>
              <Text style={styles.summaryText}>
                Du inviterer {selectedFriends.filter(f => f.isSelected).length} venner og {selectedGroups.filter(g => g.isSelected).length} grupper til din preparty.
              </Text>
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
  createButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  createButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
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
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#fff',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#fff',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  textInputWithIcon: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    marginLeft: 12,
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inviteList: {
    gap: 8,
  },
  inviteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
  },
  inviteItemSelected: {
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  inviteItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  friendAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  friendInitial: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  groupAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  groupInfo: {
    flex: 1,
  },
  inviteItemName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  groupMembers: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999',
    marginTop: 2,
  },
  selectedIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unselectedIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#666',
  },
  checkmark: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  summaryCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
    lineHeight: 20,
  },
});