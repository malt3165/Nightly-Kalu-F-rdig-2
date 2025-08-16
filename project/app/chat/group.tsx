import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Send, Users, MoveHorizontal as MoreHorizontal, Smile, Paperclip, Camera, Crown } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ProfileAvatar } from '@/components/ProfileAvatar';

const { width } = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  senderId: string;
  senderName: string;
  isFromMe: boolean;
  status: 'sending' | 'sent' | 'delivered' | 'read';
}

interface GroupMember {
  id: string;
  name: string;
  isOwner: boolean;
  isOnline: boolean;
}

const mockGroupMembers: GroupMember[] = [
  { id: '1', name: 'Anna', isOwner: true, isOnline: true },
  { id: '2', name: 'Lars', isOwner: false, isOnline: true },
  { id: '3', name: 'Maria', isOwner: false, isOnline: false },
  { id: '4', name: 'Peter', isOwner: false, isOnline: true },
  { id: '5', name: 'Sofia', isOwner: false, isOnline: false },
];

const mockMessages: Message[] = [
  {
    id: '1',
    text: 'Hej alle! Skal vi mødes i aften?',
    timestamp: new Date(Date.now() - 7200000), // 2 hours ago
    senderId: '1',
    senderName: 'Anna',
    isFromMe: false,
    status: 'read',
  },
  {
    id: '2',
    text: 'Ja det lyder godt! Hvor vil I mødes?',
    timestamp: new Date(Date.now() - 7000000),
    senderId: 'me',
    senderName: 'Dig',
    isFromMe: true,
    status: 'read',
  },
  {
    id: '3',
    text: 'Hvad med Rust omkring kl. 22?',
    timestamp: new Date(Date.now() - 6800000),
    senderId: '2',
    senderName: 'Lars',
    isFromMe: false,
    status: 'read',
  },
  {
    id: '4',
    text: 'Perfekt! Jeg glæder mig 🎉',
    timestamp: new Date(Date.now() - 6600000),
    senderId: '4',
    senderName: 'Peter',
    isFromMe: false,
    status: 'read',
  },
  {
    id: '5',
    text: 'Jeg kan desværre ikke i aften 😔',
    timestamp: new Date(Date.now() - 6400000),
    senderId: '3',
    senderName: 'Maria',
    isFromMe: false,
    status: 'read',
  },
  {
    id: '6',
    text: 'Okay, så ses vi andre der! 👍',
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    senderId: 'me',
    senderName: 'Dig',
    isFromMe: true,
    status: 'read',
  },
];

export default function GroupChatScreen() {
  const { groupId, groupName } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [typingMembers, setTypingMembers] = useState<string[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  useEffect(() => {
    // Simulate members typing
    const typingInterval = setInterval(() => {
      if (Math.random() > 0.97) { // 3% chance every second
        const randomMember = mockGroupMembers[Math.floor(Math.random() * mockGroupMembers.length)];
        setTypingMembers([randomMember.name]);
        setTimeout(() => setTypingMembers([]), 3000);
      }
    }, 1000);

    return () => clearInterval(typingInterval);
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      timestamp: new Date(),
      senderId: 'me',
      senderName: 'Dig',
      isFromMe: true,
      status: 'sending',
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate message status updates
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id ? { ...msg, status: 'sent' } : msg
        )
      );
    }, 500);

    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id ? { ...msg, status: 'delivered' } : msg
        )
      );
    }, 1000);

    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id ? { ...msg, status: 'read' } : msg
        )
      );
    }, 2000);

    // Simulate group member response (sometimes)
    if (Math.random() > 0.6) {
      setTimeout(() => {
        const responses = [
          'Lyder godt! 👍',
          'Jeg er med!',
          'Perfekt timing!',
          'Det bliver fedt! 🎉',
          'Kan ikke vente!',
          'Ses der!',
        ];
        
        const randomMember = mockGroupMembers[Math.floor(Math.random() * mockGroupMembers.length)];
        const memberMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date(),
          senderId: randomMember.id,
          senderName: randomMember.name,
          isFromMe: false,
          status: 'read',
        };

        setMessages(prev => [...prev, memberMessage]);
      }, 2000 + Math.random() * 4000);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('da-DK', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'I dag';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'I går';
    } else {
      return date.toLocaleDateString('da-DK', { 
        day: 'numeric', 
        month: 'short' 
      });
    }
  };

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sending': return '⏳';
      case 'sent': return '✓';
      case 'delivered': return '✓✓';
      case 'read': return '👁';
      default: return '';
    }
  };

  const getSenderColor = (senderId: string) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    const index = senderId.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const onlineCount = mockGroupMembers.filter(m => m.isOnline).length + 1; // +1 for current user

  const renderMessage = (message: Message, index: number) => {
    const prevMessage = index > 0 ? messages[index - 1] : null;
    const showDate = !prevMessage || 
      formatDate(message.timestamp) !== formatDate(prevMessage.timestamp);
    const showSender = !message.isFromMe && (!prevMessage || 
      prevMessage.senderId !== message.senderId ||
      message.timestamp.getTime() - prevMessage.timestamp.getTime() > 300000); // 5 minutes

    return (
      <View key={message.id}>
        {showDate && (
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{formatDate(message.timestamp)}</Text>
          </View>
        )}
        
        <View style={[
          styles.messageContainer,
          message.isFromMe ? styles.myMessageContainer : styles.friendMessageContainer
        ]}>
          {showSender && !message.isFromMe && (
            <Text style={[
              styles.senderName,
              { color: getSenderColor(message.senderId) }
            ]}>
              {message.senderName}
              {mockGroupMembers.find(m => m.id === message.senderId)?.isOwner && (
                <Text style={styles.ownerIndicator}> 👑</Text>
              )}
            </Text>
          )}
          
          <View style={[
            styles.messageBubble,
            message.isFromMe ? styles.myMessage : styles.friendMessage
          ]}>
            <Text style={[
              styles.messageText,
              message.isFromMe ? styles.myMessageText : styles.friendMessageText
            ]}>
              {message.text}
            </Text>
          </View>
          
          <View style={styles.messageInfo}>
            <Text style={styles.messageTime}>{formatTime(message.timestamp)}</Text>
            {message.isFromMe && (
              <Text style={styles.messageStatus}>{getStatusIcon(message.status)}</Text>
            )}
          </View>
        </View>
      </View>
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
          
          <View style={styles.headerCenter}>
            <View style={styles.groupAvatar}>
              <Users size={20} color="#fff" />
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.headerName}>{groupName}</Text>
              <Text style={styles.headerStatus}>
                {typingMembers.length > 0 
                  ? `${typingMembers.join(', ')} skriver...`
                  : `${onlineCount} online`
                }
              </Text>
            </View>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => router.push(`/groups/${groupId}`)}
            >
              <Users size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <MoreHorizontal size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Messages */}
        <KeyboardAvoidingView 
          style={styles.chatContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((message, index) => renderMessage(message, index))}
            
            {typingMembers.length > 0 && (
              <View style={styles.typingContainer}>
                <View style={styles.typingBubble}>
                  <Text style={styles.typingText}>
                    {typingMembers.join(', ')} skriver
                  </Text>
                  <View style={styles.typingDots}>
                    <View style={[styles.typingDot, styles.typingDot1]} />
                    <View style={[styles.typingDot, styles.typingDot2]} />
                    <View style={[styles.typingDot, styles.typingDot3]} />
                  </View>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Input Area */}
          <View style={styles.inputContainer}>
            <View style={styles.inputRow}>
              <TouchableOpacity style={styles.attachButton}>
                <Paperclip size={20} color="#666" />
              </TouchableOpacity>
              
              <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.textInput}
                  value={newMessage}
                  onChangeText={setNewMessage}
                  placeholder="Skriv til gruppen..."
                  placeholderTextColor="#666"
                  multiline
                  maxLength={500}
                />
                <TouchableOpacity style={styles.emojiButton}>
                  <Smile size={20} color="#666" />
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity style={styles.cameraButton}>
                <Camera size={20} color="#666" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.sendButton,
                  newMessage.trim() && styles.sendButtonActive
                ]}
                onPress={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                <Send size={20} color={newMessage.trim() ? "#fff" : "#666"} />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  headerStatus: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#4ade80',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 8,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  dateContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#666',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  messageContainer: {
    marginBottom: 8,
  },
  myMessageContainer: {
    alignItems: 'flex-end',
  },
  friendMessageContainer: {
    alignItems: 'flex-start',
  },
  senderName: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
    marginLeft: 4,
  },
  ownerIndicator: {
    fontSize: 10,
  },
  messageBubble: {
    maxWidth: width * 0.75,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
  },
  myMessage: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  friendMessage: {
    backgroundColor: '#1a1a1a',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
  },
  myMessageText: {
    color: '#fff',
  },
  friendMessageText: {
    color: '#fff',
  },
  messageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  messageTime: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  messageStatus: {
    fontSize: 11,
    color: '#666',
  },
  typingContainer: {
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    gap: 8,
  },
  typingText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
  typingDots: {
    flexDirection: 'row',
    gap: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#666',
  },
  typingDot1: {
    opacity: 0.4,
  },
  typingDot2: {
    opacity: 0.7,
  },
  typingDot3: {
    opacity: 1,
  },
  inputContainer: {
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  attachButton: {
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    padding: 8,
  },
  textInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 40,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    maxHeight: 100,
    paddingVertical: 4,
  },
  emojiButton: {
    padding: 4,
    marginLeft: 8,
  },
  cameraButton: {
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    padding: 8,
  },
  sendButton: {
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    padding: 8,
  },
  sendButtonActive: {
    backgroundColor: '#007AFF',
  },
});