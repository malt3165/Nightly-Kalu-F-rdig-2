import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DatabaseTest from '@/components/DatabaseTest';

export default function DatabaseTestScreen() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView}>
          <DatabaseTest />
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
  scrollView: {
    flex: 1,
  },
});