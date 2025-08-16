import { Tabs } from 'expo-router';
import { Map, Users, Calendar, Menu } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000',
          borderTopColor: '#1a1a1a',
          borderTopWidth: 1,
          height: 90,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#666',
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Inter-Medium',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Kort',
          tabBarIcon: ({ size, color }) => (
            <Map size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="social"
        options={{
          title: 'Venner',
          tabBarIcon: ({ size, color }) => (
            <Users size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="preparty"
        options={{
          title: 'Preparty',
          tabBarIcon: ({ size, color }) => (
            <Calendar size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Profil',
          tabBarIcon: ({ size, color }) => (
            <Menu size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}