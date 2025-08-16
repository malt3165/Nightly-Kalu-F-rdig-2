import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Bell, Users, Calendar, MapPin, Heart, MessageCircle, UserPlus, Check, X, Trash2 } from 'lucide-react-native';
import { router } from 'expo-router';
import { useNotifications } from '@/contexts/NotificationContext';

const { width } = Dimensions.get('window');

interface Notification {
  id: string;
  type: 'friend_request' | 'group_invite' | 'event_invite' | 'check_in' | 'like' | 'message' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionable?: boolean;
  fromUser?: string;
  avatar?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'friend_request',
    title: 'Ny venneanmodning',
    message: 'Anna vil være venner med dig',
    timestamp: '2025-01-25T10:30:00Z',
    read: false,
    actionable: true,
    fromUser: 'Anna',
    avatar: '👩',
  },
  {
    id: '2',
    type: 'group_invite',
    title: 'Gruppe invitation',
    message: 'Du er blevet inviteret til "Weekend Crew"',
    timestamp: '2025-01-25T09:15:00Z',
    read: false,
    actionable: true,
    fromUser: 'Lars',
    avatar: '👨',
  },
  {
    id: '3',
    type: 'check_in',
    title: 'Ven checked in',
    message: 'Maria er nu på Rust',
    timestamp: '2025-01-25T08:45:00Z',
    read: true,
    fromUser: 'Maria',
    avatar: '👧',
  },
  {
    id: '4',
    type: 'event_invite',
    title: 'Event invitation',
    message: 'Du er inviteret til "Elektronisk Nat" på Kulturhuset',
    timestamp: '2025-01-24T20:30:00Z',
    read: true,
    actionable: true,
  },
  {
    id: '5',
    type: 'like',
    title: 'Nyt like',
    message: 'Peter kan lide dit check-in på Vega',
    timestamp: '2025-01-24T19:20:00Z',
    read: true,
    fromUser: 'Peter',
    avatar: '👦',
  },
  {
    id: '6',
    type: 'message',
    title: 'Ny besked',
    message: 'Sofia: "Skal vi mødes før vi tager i byen?"',
    timestamp: '2025-01-24T18:15:00Z',
    read: true,
    fromUser: 'Sofia',
    avatar: '👩',
  },
  {
    id: '7',
    type: 'system',
    title: 'Velkommen til NIGHTLY!',
    message: 'Tak fordi du bruger NIGHTLY. Opdag nattelivet sammen med dine venner.',
    timestamp: '2025-01-24T12:00:00Z',
    read: true,
  },
];

export default function NotificationsScreen() {
  const { 
    notifications: liveNotifications, 
    markAsRead, 
    markAllAsRead, 
    clearNotifications,
    unreadCount 
  } = useNotifications();
  
  // Combine live notifications with mock notifications for demo
  const [localNotifications, setLocalNotifications] = useState<Notification[]>(mockNotifications);
  const allNotifications = [...liveNotifications.map(n => ({
    id: n.id,
    type: n.type as any,
    title: n.title,
    message: n.body,
    timestamp: new Date(n.timestamp).toISOString(),
    read: n.read,
    actionable: n.type === 'friend_request' || n.type === 'group_invite',
    fromUser: n.data?.friendName,
    avatar: '👤',
  })), ...localNotifications];
  
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const totalUnreadCount = allNotifications.filter(n => !n.read).length;
  const filteredNotifications = filter === 'unread' 
    ? allNotifications.filter(n => !n.read)
    : allNotifications;

  const handleMarkAsRead = (id: string) => {
    // Check if it's a live notification
    const isLiveNotification = liveNotifications.some(n => n.id === id);
    
    if (isLiveNotification) {
      markAsRead(id);
    } else {
      // Handle local notifications
      setLocalNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read: true }
            : notification
        )
      );
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    setLocalNotifications(prev => 
      prev.map(notification => 
        ({ ...notification, read: true })
      )
    );
  };

  const handleDeleteNotification = (id: string) => {
    const isLiveNotification = liveNotifications.some(n => n.id === id);
    
    if (!isLiveNotification) {
      setLocalNotifications(prev => prev.filter(n => n.id !== id));
    }
  };

  const handleAcceptFriendRequest = (notificationId: string) => {
    // Handle friend request acceptance
    handleDeleteNotification(notificationId);
    // Show success message or navigate
  };

  const handleDeclineFriendRequest = (notificationId: string) => {
    // Handle friend request decline
    handleDeleteNotification(notificationId);
  };

  const handleAcceptGroupInvite = (notificationId: string) => {
    // Handle group invite acceptance
    handleDeleteNotification(notificationId);
  };

  const handleDeclineGroupInvite = (notificationId: string) => {
    // Handle group invite decline
    handleDeleteNotification(notificationId);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'friend_request':
        return <UserPlus size={20} color="#007AFF" />;
      case 'group_invite':
        return <Users size={20} color="#007AFF" />;
      case 'event_invite':
        return <Calendar size={20} color="#007AFF" />;
      case 'check_in':
        return <MapPin size={20} color="#4ade80" />;
      case 'like':
        return <Heart size={20} color="#ff3b30" />;
      case 'message':
        return <MessageCircle size={20} color="#007AFF" />;
      case 'system':
        return <Bell size={20} color="#666" />;
      default:
        return <Bell size={20} color="#666" />;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Lige nu';
    if (diffInMinutes < 60) return `${diffInMinutes} min siden`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} timer siden`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} dage siden`;
  };

  const renderNotification = (notification: Notification) => (
    <TouchableOpacity
      key={notification.id}
      style={[
        styles.notificationCard,
        !notification.read && styles.unreadNotification
      ]}
      onPress={() => handleMarkAsRead(notification.id)}
    >
      <View style={styles.notificationHeader}>
        <View style={styles.notificationLeft}>
          <View style={styles.notificationIconContainer}>
            {getNotificationIcon(notification.type)}
          </View>
          
          {notification.avatar && (
            <View style={styles.avatarContainer}>
              <Text style={styles.avatar}>{notification.avatar}</Text>
            </View>
          )}
          
          <View style={styles.notificationContent}>
            <Text style={[
              styles.notificationTitle,
              !notification.read && styles.unreadTitle
            ]}>
              {notification.title}
            </Text>
            <Text style={styles.notificationMessage}>
              {notification.message}
            </Text>
            <Text style={styles.notificationTime}>
              {formatTimeAgo(notification.timestamp)}
            </Text>
          </View>
        </View>

        <View style={styles.notificationActions}>
          {!notification.read && (
            <View style={styles.unreadDot} />
          )}
          
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => handleDeleteNotification(notification.id)}
          >
            <Trash2 size={16} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Action buttons for actionable notifications */}
      {notification.actionable && !notification.read && (
        <View style={styles.actionButtons}>
          {notification.type === 'friend_request' && (
            <>
              <TouchableOpacity 
                style={styles.acceptButton}
                onPress={() => handleAcceptFriendRequest(notification.id)}
              >
                <Check size={16} color="#fff" />
                <Text style={styles.acceptButtonText}>Accepter</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.declineButton}
                onPress={() => handleDeclineFriendRequest(notification.id)}
              >
                <X size={16} color="#fff" />
                <Text style={styles.declineButtonText}>Afvis</Text>
              </TouchableOpacity>
            </>
          )}
          
          {notification.type === 'group_invite' && (
            <>
              <TouchableOpacity 
                style={styles.acceptButton}
                onPress={() => handleAcceptGroupInvite(notification.id)}
              >
                <Check size={16} color="#fff" />
                <Text style={styles.acceptButtonText}>Deltag</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.declineButton}
                onPress={() => handleDeclineGroupInvite(notification.id)}
              >
                <X size={16} color="#fff" />
                <Text style={styles.declineButtonText}>Afvis</Text>
              </TouchableOpacity>
            </>
          )}
          
          {notification.type === 'event_invite' && (
            <>
              <TouchableOpacity 
                style={styles.acceptButton}
                onPress={() => deleteNotification(notification.id)}
              >
                <Check size={16} color="#fff" />
                <Text style={styles.acceptButtonText}>Deltag</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.declineButton}
                onPress={() => deleteNotification(notification.id)}
              >
                <X size={16} color="#fff" />
                <Text style={styles.declineButtonText}>Afvis</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </TouchableOpacity>
  );

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
          <Text style={styles.headerTitle}>Notifikationer</Text>
          {totalUnreadCount > 0 && (
            <TouchableOpacity 
              style={styles.markAllButton}
              onPress={handleMarkAllAsRead}
            >
              <Text style={styles.markAllButtonText}>Marker alle</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'all' && styles.activeFilterTab]}
            onPress={() => setFilter('all')}
          >
            <Text style={[
              styles.filterTabText,
              filter === 'all' && styles.activeFilterTabText
            ]}>
              Alle ({allNotifications.length})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.filterTab, filter === 'unread' && styles.activeFilterTab]}
            onPress={() => setFilter('unread')}
          >
            <Text style={[
              styles.filterTabText,
              filter === 'unread' && styles.activeFilterTabText
            ]}>
              Ulæste ({totalUnreadCount})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Notifications List */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {filteredNotifications.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyStateIcon}>
                <Bell size={48} color="#666" />
              </View>
              <Text style={styles.emptyStateTitle}>
                {filter === 'unread' ? 'Ingen ulæste notifikationer' : 'Ingen notifikationer'}
              </Text>
              <Text style={styles.emptyStateText}>
                {filter === 'unread' 
                  ? 'Du har læst alle dine notifikationer'
                  : 'Du vil modtage notifikationer her når der sker noget nyt'
                }
              </Text>
            </View>
          ) : (
            <View style={styles.notificationsList}>
              {filteredNotifications.map(renderNotification)}
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
  markAllButton: {
    backgroundColor: '#007AFF',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  markAllButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
  },
  activeFilterTab: {
    backgroundColor: '#007AFF',
  },
  filterTabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#999',
  },
  activeFilterTabText: {
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  notificationsList: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 8,
  },
  notificationCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  unreadNotification: {
    borderColor: '#007AFF',
    backgroundColor: '#1a1a2a',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  notificationIconContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
  },
  avatarContainer: {
    marginRight: 12,
    marginTop: 4,
  },
  avatar: {
    fontSize: 24,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 4,
  },
  unreadTitle: {
    color: '#007AFF',
  },
  notificationMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ccc',
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  notificationActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
  },
  deleteButton: {
    backgroundColor: '#2a2a2a',
    borderRadius: 6,
    padding: 6,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 8,
  },
  acceptButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4ade80',
    borderRadius: 8,
    paddingVertical: 10,
    gap: 6,
  },
  acceptButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  declineButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff3b30',
    borderRadius: 8,
    paddingVertical: 10,
    gap: 6,
  },
  declineButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyStateIcon: {
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
  },
});