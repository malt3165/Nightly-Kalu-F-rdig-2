import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useAuth } from './AuthContext';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

interface NotificationData {
  id: string;
  type: 'check_in' | 'friend_request' | 'group_invite' | 'message' | 'preparty_invite';
  title: string;
  body: string;
  data?: any;
  timestamp: number;
  read: boolean;
}

interface NotificationContextType {
  notifications: NotificationData[];
  unreadCount: number;
  addNotification: (notification: Omit<NotificationData, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  requestPermissions: () => Promise<boolean>;
  sendLocalNotification: (title: string, body: string, data?: any) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    requestPermissions();
    setupNotificationListeners();
  }, []);

  useEffect(() => {
    if (user) {
      startLiveUpdates();
    }
  }, [user]);

  const requestPermissions = async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'web') {
        // Web notifications
        if ('Notification' in window) {
          const permission = await Notification.requestPermission();
          const granted = permission === 'granted';
          setPermissionGranted(granted);
          return granted;
        }
        return false;
      } else {
        // Mobile notifications
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        
        const granted = finalStatus === 'granted';
        setPermissionGranted(granted);
        
        if (granted && Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'NIGHTLY Notifications',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#007AFF',
          });
        }
        
        return granted;
      }
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  };

  const setupNotificationListeners = () => {
    if (Platform.OS !== 'web') {
      // Listen for notifications when app is in foreground
      const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
        console.log('Notification received in foreground:', notification);
        addNotification({
          type: notification.request.content.data?.type || 'message',
          title: notification.request.content.title || 'NIGHTLY',
          body: notification.request.content.body || '',
          data: notification.request.content.data,
        });
      });

      // Listen for notification taps
      const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
        console.log('Notification tapped:', response);
        const data = response.notification.request.content.data;
        // Handle navigation based on notification type
        handleNotificationTap(data);
      });

      return () => {
        foregroundSubscription.remove();
        responseSubscription.remove();
      };
    }
  };

  const handleNotificationTap = (data: any) => {
    // This would typically navigate to relevant screens
    console.log('Handle notification tap:', data);
  };

  const sendLocalNotification = async (title: string, body: string, data?: any) => {
    if (!permissionGranted) {
      console.log('Notification permission not granted');
      return;
    }

    try {
      if (Platform.OS === 'web') {
        // Web notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(title, {
            body,
            icon: '/assets/images/icon.png',
            badge: '/assets/images/icon.png',
            data,
          });
        }
      } else {
        // Mobile notification
        await Notifications.scheduleNotificationAsync({
          content: {
            title,
            body,
            data,
            sound: true,
          },
          trigger: null, // Show immediately
        });
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const addNotification = (notification: Omit<NotificationData, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: NotificationData = {
      ...notification,
      id: Date.now().toString(),
      timestamp: Date.now(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Send local notification if app is in background
    sendLocalNotification(notification.title, notification.body, notification.data);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const startLiveUpdates = () => {
    // Simulate live check-in notifications
    const checkInInterval = setInterval(() => {
      if (Math.random() > 0.85) { // 15% chance every 30 seconds
        const friends = ['Anna', 'Lars', 'Maria', 'Peter', 'Sofia', 'Oliver', 'Emma'];
        const clubs = ['Rust', 'Vega', 'Culture Box', 'Train', 'Jolene'];
        
        const friend = friends[Math.floor(Math.random() * friends.length)];
        const club = clubs[Math.floor(Math.random() * clubs.length)];
        
        addNotification({
          type: 'check_in',
          title: 'Ven checked ind! 📍',
          body: `${friend} er nu på ${club}`,
          data: { friendName: friend, clubName: club },
        });
      }
    }, 30000); // Every 30 seconds

    // Simulate message notifications
    const messageInterval = setInterval(() => {
      if (Math.random() > 0.9) { // 10% chance every 45 seconds
        const friends = ['Anna', 'Lars', 'Maria', 'Peter'];
        const messages = [
          'Skal vi mødes i aften?',
          'Er du klar til at feste?',
          'Kom til preparty!',
          'Hvor er du?',
        ];
        
        const friend = friends[Math.floor(Math.random() * friends.length)];
        const message = messages[Math.floor(Math.random() * messages.length)];
        
        addNotification({
          type: 'message',
          title: `Ny besked fra ${friend} 💬`,
          body: message,
          data: { friendName: friend, message },
        });
      }
    }, 45000); // Every 45 seconds

    // Cleanup intervals when component unmounts
    return () => {
      clearInterval(checkInInterval);
      clearInterval(messageInterval);
    };
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearNotifications,
      requestPermissions,
      sendLocalNotification,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}