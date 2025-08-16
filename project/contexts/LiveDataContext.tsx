import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';
import { danishClubs, Club } from '@/data/clubs';

interface CheckIn {
  id: string;
  userId: string;
  userName: string;
  clubId: string;
  clubName: string;
  timestamp: number;
}

interface LiveDataContextType {
  recentCheckIns: CheckIn[];
  liveClubData: Map<string, { checkedIn: number; lastUpdate: number }>;
  refreshData: () => Promise<void>;
  isRefreshing: boolean;
  lastUpdate: number;
}

const LiveDataContext = createContext<LiveDataContextType | undefined>(undefined);

export function LiveDataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [recentCheckIns, setRecentCheckIns] = useState<CheckIn[]>([]);
  const [liveClubData, setLiveClubData] = useState<Map<string, { checkedIn: number; lastUpdate: number }>>(new Map());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    if (user) {
      startLiveDataUpdates();
      initializeClubData();
    }
  }, [user]);

  const initializeClubData = () => {
    const initialData = new Map();
    danishClubs.forEach(club => {
      initialData.set(club.id, {
        checkedIn: club.checkedIn + Math.floor(Math.random() * 10), // Add some variance
        lastUpdate: Date.now(),
      });
    });
    setLiveClubData(initialData);
  };

  const refreshData = async (): Promise<void> => {
    setIsRefreshing(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update club check-in numbers
      const updatedData = new Map(liveClubData);
      danishClubs.forEach(club => {
        const currentData = updatedData.get(club.id);
        if (currentData) {
          // Simulate realistic changes in check-ins
          const change = Math.floor(Math.random() * 6) - 2; // -2 to +3 change
          const newCount = Math.max(0, currentData.checkedIn + change);
          updatedData.set(club.id, {
            checkedIn: newCount,
            lastUpdate: Date.now(),
          });
        }
      });
      
      setLiveClubData(updatedData);
      setLastUpdate(Date.now());
      
      // Simulate new check-ins
      simulateNewCheckIns();
      
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const simulateNewCheckIns = () => {
    const friends = ['Anna', 'Lars', 'Maria', 'Peter', 'Sofia', 'Oliver', 'Emma', 'Mikkel', 'Caroline'];
    const clubs = danishClubs.slice(0, 5); // Use first 5 clubs
    
    // Generate 1-3 new check-ins
    const numCheckIns = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < numCheckIns; i++) {
      const friend = friends[Math.floor(Math.random() * friends.length)];
      const club = clubs[Math.floor(Math.random() * clubs.length)];
      
      const checkIn: CheckIn = {
        id: `${Date.now()}-${i}`,
        userId: `user-${friend.toLowerCase()}`,
        userName: friend,
        clubId: club.id,
        clubName: club.name,
        timestamp: Date.now() - (Math.random() * 300000), // Within last 5 minutes
      };
      
      setRecentCheckIns(prev => [checkIn, ...prev.slice(0, 19)]); // Keep last 20
      
      // Send notification for friend check-ins
      if (Math.random() > 0.7) { // 30% chance to notify
        addNotification({
          type: 'check_in',
          title: 'Ven checked ind! 📍',
          body: `${friend} er nu på ${club.name}`,
          data: { 
            friendName: friend, 
            clubName: club.name, 
            clubId: club.id,
            checkInId: checkIn.id 
          },
        });
      }
    }
  };

  const startLiveDataUpdates = () => {
    // Auto-refresh every 2 minutes
    const refreshInterval = setInterval(() => {
      refreshData();
    }, 120000); // 2 minutes

    // Simulate random check-ins every 30-60 seconds
    const checkInInterval = setInterval(() => {
      if (Math.random() > 0.6) { // 40% chance
        simulateNewCheckIns();
      }
    }, Math.random() * 30000 + 30000); // 30-60 seconds

    // Update club numbers slightly every minute
    const clubUpdateInterval = setInterval(() => {
      const updatedData = new Map(liveClubData);
      
      // Update 2-3 random clubs
      const clubIds = Array.from(updatedData.keys());
      const numUpdates = Math.floor(Math.random() * 2) + 2;
      
      for (let i = 0; i < numUpdates; i++) {
        const randomClubId = clubIds[Math.floor(Math.random() * clubIds.length)];
        const currentData = updatedData.get(randomClubId);
        
        if (currentData) {
          const change = Math.floor(Math.random() * 4) - 1; // -1 to +2
          const newCount = Math.max(0, currentData.checkedIn + change);
          updatedData.set(randomClubId, {
            checkedIn: newCount,
            lastUpdate: Date.now(),
          });
        }
      }
      
      setLiveClubData(updatedData);
      setLastUpdate(Date.now());
    }, 60000); // Every minute

    return () => {
      clearInterval(refreshInterval);
      clearInterval(checkInInterval);
      clearInterval(clubUpdateInterval);
    };
  };

  return (
    <LiveDataContext.Provider value={{
      recentCheckIns,
      liveClubData,
      refreshData,
      isRefreshing,
      lastUpdate,
    }}>
      {children}
    </LiveDataContext.Provider>
  );
}

export function useLiveData() {
  const context = useContext(LiveDataContext);
  if (context === undefined) {
    throw new Error('useLiveData must be used within a LiveDataProvider');
  }
  return context;
}