import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

export default function Index() {
  const { session, loading } = useAuth();

  useEffect(() => {
    console.log('Index render - loading:', loading, 'session:', !!session);
  }, [loading, session]);

  useEffect(() => {
    if (!loading) {
      console.log('Index: Auth loading complete, session:', !!session);
      if (session) {
        console.log('User is authenticated, redirecting to tabs');
        router.replace('/(tabs)');
      } else {
        console.log('User is not authenticated, redirecting to auth');
        router.replace('/auth');
      }
    }
  }, [session, loading]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Indlæser NIGHTLY...</Text>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
});