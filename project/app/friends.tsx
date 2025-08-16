import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Plus, UserPlus, UserMinus, Search, MessageCircle, User } from 'lucide-react-native';
import { router } from 'expo-router';

interface Friend {
  id: string;
  name: string;
  status: string;
  hasProfilePicture: boolean;
  isOnline: boolean;
}

const initialFriends: Friend[] = [
  { id: '1', name: 'Anna', status: 'online', hasProfilePicture: true, isOnline: true },
  { id: '2', name: 'Lars', status: 'at Vega', hasProfilePicture: false, isOnline: true },
  { id: '3', name: 'Maria', status: 'offline', hasProfilePicture: true, isOnline: false },
  { id: '4', name: 'Peter', status: 'online', hasProfilePicture: false, isOnline: true },
];

const mockSuggestions = [
  { id: '5', name: 'Emma', hasProfilePicture: true, mutualFriends: 3 },
  { id: '6', name: 'Mikkel', hasProfilePicture: false, mutualFriends: 1 },
  { id: '7', name: 'Sofia', hasProfilePicture: true, mutualFriends: 5 },
];

export default function FriendsScreen() {
  const [friends, setFriends] = useState<Friend[]>(initialFriends);
  const [suggestions, setSuggestions] = useState(mockSuggestions);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addFriendEmail, setAddFriendEmail] = useState('');

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemoveFriend = (friendId: string) => {
    const friend = friends.find(f => f.id === friendId);
    
    Alert.alert(
      'Fjern ven',
      `Er du sikker på at du vil fjerne ${friend?.name} som ven?`,
      [
        { text: 'Annuller', style: 'cancel' },
        {
          text: 'Fjern',
          style: 'destructive',
          onPress: () => {
            setFriends(friends.filter(f => f.id !== friendId));
            Alert.alert('Succes', `${friend?.name} er fjernet fra dine venner`);
          },
        },
      ]
    );
  };

  const handleAddFriend = (suggestion: any) => {
    const newFriend: Friend = {
      id: suggestion.id,
      name: suggestion.name,
      status: 'offline',
      hasProfilePicture: suggestion.hasProfilePicture,
      isOnline: false,
    };

    setFriends([...friends, newFriend]);
    setSuggestions(suggestions.filter(s => s.id !== suggestion.id));
    Alert.alert('Succes', `${suggestion.name} er tilføjet som ven!`);
  };

  const handleSendFriendRequest = () => {
    if (!addFriendEmail.trim()) {
      Alert.alert('Fejl', 'Indtast venligst en email adresse');
      return;
    }

    // Simulate sending friend request
    Alert.alert('Succes', `Venneanmodning sendt til ${addFriendEmail}`);
    setAddFriendEmail('');
    setShowAddModal(false);
  };

  const renderProfilePicture = (hasProfilePicture: boolean, name: string) => {
    if (hasProfilePicture) {
      return (
        <View style={styles.profilePicture}>
          <Text style={styles.profileInitial}>{name.charAt(0).toUpperCase()}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.defaultProfilePicture}>
          <User size={20} color="#666" />
        </View>
      );
    }
  };

  const renderLoginPrompt = (friend: Friend) => {
    if (!friend.hasProfilePicture) {
      return (
        <TouchableOpacity style={styles.loginPrompt}>
          <Text style={styles.loginPromptText}>Log ind</Text>
        </TouchableOpacity>
      );
    }
    return null;
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
          <Text style={styles.headerTitle}>Venner</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Plus size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Søg efter venner..."
              placeholderTextColor="#666"
            />
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Friends List */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mine venner ({friends.length})</Text>
            
            {filteredFriends.length === 0 ? (
              <View style={styles.emptyState}>
                <View style={styles.emptyStateIcon}>
                  <User size={48} color="#666" />
                </View>
                <Text style={styles.emptyStateTitle}>
                  {searchQuery ? 'Ingen venner fundet' : 'Ingen venner endnu'}
                </Text>
                <Text style={styles.emptyStateText}>
                  {searchQuery 
                    ? 'Prøv at søge efter noget andet'
                    : 'Tilføj dine første venner for at komme i gang'
                  }
                </Text>
              </View>
            ) : (
              <View style={styles.friendsList}>
                {filteredFriends.map((friend) => (
                  <View key={friend.id} style={styles.friendCard}>
                    <View style={styles.friendMainContent}>
                      {renderProfilePicture(friend.hasProfilePicture, friend.name)}
                      <View style={styles.friendInfo}>
                        <Text style={styles.friendName}>{friend.name}</Text>
                        <Text style={[
                          styles.friendStatus,
                          friend.isOnline && styles.onlineStatus
                        ]}>
                          {friend.status}
                        </Text>
                        {renderLoginPrompt(friend)}
                      </View>
                      <View style={[
                        styles.statusDot,
                        friend.isOnline && styles.onlineDot
                      ]} />
                    </View>
                    
                    <View style={styles.friendActions}>
                      <TouchableOpacity 
                        style={styles.chatButton}
                        onPress={() => router.push({
                          pathname: '/chat/friend',
                          params: { friendId: friend.id, friendName: friend.name }
                        })}
                      >
                        <MessageCircle size={20} color="#fff" />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.actionButton, styles.removeButton]}
                        onPress={() => handleRemoveFriend(friend.id)}
                      >
                        <UserMinus size={18} color="#ff3b30" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Friend Suggestions */}
          {suggestions.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Foreslåede venner</Text>
              <View style={styles.suggestionsList}>
                {suggestions.map((suggestion) => (
                  <View key={suggestion.id} style={styles.suggestionCard}>
                    {renderProfilePicture(suggestion.hasProfilePicture, suggestion.name)}
                    <View style={styles.suggestionInfo}>
                      <Text style={styles.suggestionName}>{suggestion.name}</Text>
                      <Text style={styles.mutualFriends}>
                        {suggestion.mutualFriends} fælles venner
                      </Text>
                      {!suggestion.hasProfilePicture && (
                        <TouchableOpacity style={styles.loginPromptSmall}>
                          <Text style={styles.loginPromptTextSmall}>Log ind</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    <TouchableOpacity 
                      style={styles.addFriendButton}
                      onPress={() => handleAddFriend(suggestion)}
                    >
                      <UserPlus size={18} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Add Friend Modal */}
        <Modal
          visible={showAddModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowAddModal(false)}
        >
          <View style={styles.modalContainer}>
            <SafeAreaView style={styles.modalSafeArea}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setShowAddModal(false)}>
                  <Text style={styles.modalCancelText}>Annuller</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Tilføj ven</Text>
                <TouchableOpacity onPress={handleSendFriendRequest}>
                  <Text style={styles.modalSaveText}>Send</Text>
                </TouchableOpacity>
              </View>

              {/* Modal Content */}
              <View style={styles.modalContent}>
                <View style={styles.inputSection}>
                  <Text style={styles.inputLabel}>Email adresse</Text>
                  <TextInput
                    style={styles.textInput}
                    value={addFriendEmail}
                    onChangeText={setAddFriendEmail}
                    placeholder="Indtast venns email adresse"
                    placeholderTextColor="#666"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.infoSection}>
                  <Text style={styles.infoTitle}>Sådan fungerer det</Text>
                  <Text style={styles.infoText}>
                    • Indtast email adressen på den person du vil tilføje{'\n'}
                    • Vi sender en venneanmodning til dem{'\n'}
                    • Når de accepterer, bliver I venner på NIGHTLY
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
  addButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 16,
    paddingLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
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
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateIcon: {
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
  },
  friendsList: {
    gap: 12,
  },
  friendCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  friendMainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  profilePicture: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInitial: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  defaultProfilePicture: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 4,
  },
  friendStatus: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
    marginBottom: 4,
  },
  onlineStatus: {
    color: '#4ade80',
  },
  loginPrompt: {
    backgroundColor: '#007AFF',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  loginPromptText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  loginPromptSmall: {
    backgroundColor: '#007AFF',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  loginPromptTextSmall: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#666',
  },
  onlineDot: {
    backgroundColor: '#4ade80',
  },
  friendActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#333',
    borderRadius: 6,
    padding: 8,
  },
  chatButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  removeButton: {
    backgroundColor: '#2a1a1a',
  },
  suggestionsList: {
    gap: 12,
  },
  suggestionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  suggestionInfo: {
    flex: 1,
    marginLeft: 16,
  },
  suggestionName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 4,
  },
  mutualFriends: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
  addFriendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 6,
    padding: 8,
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