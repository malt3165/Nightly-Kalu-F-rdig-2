import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Plus, Users, Trash2, CreditCard as Edit3, UserPlus, X } from 'lucide-react-native';
import { router } from 'expo-router';

interface Group {
  id: string;
  name: string;
  members: number;
  avatar: string;
  description: string;
  isOwner: boolean;
}

const initialGroups: Group[] = [
  { 
    id: '1', 
    name: 'Weekend Crew', 
    members: 8, 
    avatar: '👥', 
    description: 'Vores faste weekend gruppe',
    isOwner: true 
  },
  { 
    id: '2', 
    name: 'Electronic Lovers', 
    members: 23, 
    avatar: '🎵', 
    description: 'For dem der elsker elektronisk musik',
    isOwner: false 
  },
];

export default function GroupsScreen() {
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) {
      Alert.alert('Fejl', 'Indtast venligst et gruppenavn');
      return;
    }

    const newGroup: Group = {
      id: Date.now().toString(),
      name: newGroupName.trim(),
      members: 1,
      avatar: '👥',
      description: newGroupDescription.trim() || 'Ny gruppe',
      isOwner: true,
    };

    setGroups([...groups, newGroup]);
    setNewGroupName('');
    setNewGroupDescription('');
    setShowCreateModal(false);
    Alert.alert('Succes', 'Gruppe oprettet!');
  };

  const handleEditGroup = (group: Group) => {
    if (!group.isOwner) {
      Alert.alert('Fejl', 'Du kan kun redigere grupper du ejer');
      return;
    }
    setEditingGroup(group);
    setNewGroupName(group.name);
    setNewGroupDescription(group.description);
    setShowCreateModal(true);
  };

  const handleUpdateGroup = () => {
    if (!newGroupName.trim() || !editingGroup) {
      Alert.alert('Fejl', 'Indtast venligst et gruppenavn');
      return;
    }

    setGroups(groups.map(group => 
      group.id === editingGroup.id 
        ? { ...group, name: newGroupName.trim(), description: newGroupDescription.trim() }
        : group
    ));

    setNewGroupName('');
    setNewGroupDescription('');
    setEditingGroup(null);
    setShowCreateModal(false);
    Alert.alert('Succes', 'Gruppe opdateret!');
  };

  const handleDeleteGroup = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    
    if (!group?.isOwner) {
      Alert.alert('Fejl', 'Du kan kun slette grupper du ejer');
      return;
    }

    Alert.alert(
      'Slet gruppe',
      `Er du sikker på at du vil slette "${group.name}"?`,
      [
        { text: 'Annuller', style: 'cancel' },
        {
          text: 'Slet',
          style: 'destructive',
          onPress: () => {
            setGroups(groups.filter(g => g.id !== groupId));
            Alert.alert('Succes', 'Gruppe slettet');
          },
        },
      ]
    );
  };

  const handleLeaveGroup = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    
    Alert.alert(
      'Forlad gruppe',
      `Er du sikker på at du vil forlade "${group?.name}"?`,
      [
        { text: 'Annuller', style: 'cancel' },
        {
          text: 'Forlad',
          style: 'destructive',
          onPress: () => {
            setGroups(groups.filter(g => g.id !== groupId));
            Alert.alert('Succes', 'Du har forladt gruppen');
          },
        },
      ]
    );
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingGroup(null);
    setNewGroupName('');
    setNewGroupDescription('');
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
          <Text style={styles.headerTitle}>Grupper</Text>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => setShowCreateModal(true)}
          >
            <Plus size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* Groups List */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mine grupper ({groups.length})</Text>
            
            {groups.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateEmoji}>👥</Text>
                <Text style={styles.emptyStateTitle}>Ingen grupper endnu</Text>
                <Text style={styles.emptyStateText}>
                  Opret din første gruppe for at komme i gang
                </Text>
                <TouchableOpacity 
                  style={styles.emptyStateButton}
                  onPress={() => setShowCreateModal(true)}
                >
                  <Text style={styles.emptyStateButtonText}>Opret gruppe</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.groupsList}>
                {groups.map((group) => (
                  <TouchableOpacity 
                    key={group.id} 
                    style={styles.groupCard}
                    onPress={() => router.push(`/groups/${group.id}`)}
                  >
                    <View style={styles.groupMainContent}>
                      <Text style={styles.groupAvatar}>{group.avatar}</Text>
                      <View style={styles.groupInfo}>
                        <View style={styles.groupHeader}>
                          <Text style={styles.groupName}>{group.name}</Text>
                          {group.isOwner && (
                            <View style={styles.ownerBadge}>
                              <Text style={styles.ownerBadgeText}>Ejer</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.groupDescription}>{group.description}</Text>
                        <Text style={styles.groupMembers}>{group.members} medlemmer</Text>
                      </View>
                    </View>
                    
                    <View style={styles.groupActions}>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => {/* Add invite functionality */}}
                      >
                        <UserPlus size={18} color="#007AFF" />
                      </TouchableOpacity>
                      
                      {group.isOwner ? (
                        <>
                          <TouchableOpacity 
                            style={styles.actionButton}
                            onPress={() => handleEditGroup(group)}
                          >
                            <Edit3 size={18} color="#007AFF" />
                          </TouchableOpacity>
                          <TouchableOpacity 
                            style={[styles.actionButton, styles.deleteButton]}
                            onPress={() => handleDeleteGroup(group.id)}
                          >
                            <Trash2 size={18} color="#ff3b30" />
                          </TouchableOpacity>
                        </>
                      ) : (
                        <TouchableOpacity 
                          style={[styles.actionButton, styles.leaveButton]}
                          onPress={() => handleLeaveGroup(group.id)}
                        >
                          <Text style={styles.leaveButtonText}>Forlad</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        {/* Create/Edit Group Modal */}
        <Modal
          visible={showCreateModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <SafeAreaView style={styles.modalSafeArea}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={closeModal}>
                  <Text style={styles.modalCancelText}>Annuller</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>
                  {editingGroup ? 'Rediger gruppe' : 'Opret gruppe'}
                </Text>
                <TouchableOpacity 
                  onPress={editingGroup ? handleUpdateGroup : handleCreateGroup}
                >
                  <Text style={styles.modalSaveText}>
                    {editingGroup ? 'Gem' : 'Opret'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Modal Content */}
              <ScrollView style={styles.modalContent}>
                <View style={styles.inputSection}>
                  <Text style={styles.inputLabel}>Gruppenavn</Text>
                  <TextInput
                    style={styles.textInput}
                    value={newGroupName}
                    onChangeText={setNewGroupName}
                    placeholder="Indtast gruppenavn"
                    placeholderTextColor="#666"
                    maxLength={30}
                  />
                </View>

                <View style={styles.inputSection}>
                  <Text style={styles.inputLabel}>Beskrivelse</Text>
                  <TextInput
                    style={[styles.textInput, styles.textArea]}
                    value={newGroupDescription}
                    onChangeText={setNewGroupDescription}
                    placeholder="Beskriv hvad gruppen handler om..."
                    placeholderTextColor="#666"
                    multiline
                    numberOfLines={4}
                    maxLength={100}
                  />
                </View>

                <View style={styles.infoSection}>
                  <Text style={styles.infoTitle}>Om grupper</Text>
                  <Text style={styles.infoText}>
                    • Du kan invitere venner til dine grupper{'\n'}
                    • Kun ejeren kan redigere og slette gruppen{'\n'}
                    • Medlemmer kan forlade gruppen når som helst
                  </Text>
                </View>
              </ScrollView>
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
  },
  backButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  createButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
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
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  groupsList: {
    gap: 12,
  },
  groupCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  groupMainContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  groupAvatar: {
    fontSize: 32,
    marginRight: 16,
  },
  groupInfo: {
    flex: 1,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  groupName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginRight: 8,
  },
  ownerBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  ownerBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  groupDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ccc',
    marginBottom: 4,
  },
  groupMembers: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
  groupActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#333',
    borderRadius: 6,
    padding: 8,
  },
  deleteButton: {
    backgroundColor: '#2a1a1a',
  },
  leaveButton: {
    backgroundColor: '#2a1a1a',
    paddingHorizontal: 12,
  },
  leaveButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#ff3b30',
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
    minHeight: 100,
    textAlignVertical: 'top',
  },
  infoSection: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
    lineHeight: 20,
  },
});