import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { supabase, testConnection, isUsingRealSupabase } from '@/lib/supabase';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
}

export default function DatabaseTest() {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const updateTest = (name: string, status: 'pending' | 'success' | 'error', message: string) => {
    setTests(prev => {
      const existing = prev.find(t => t.name === name);
      if (existing) {
        existing.status = status;
        existing.message = message;
        return [...prev];
      } else {
        return [...prev, { name, status, message }];
      }
    });
  };

  const runTests = async () => {
    setIsRunning(true);
    setTests([]);

    // Test 1: Environment Variables
    updateTest('Environment Variables', 'pending', 'Checking...');
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
    const devMode = process.env.EXPO_PUBLIC_DEV_MODE;

    if (!supabaseUrl || !supabaseKey) {
      updateTest('Environment Variables', 'error', 'Missing SUPABASE_URL or SUPABASE_ANON_KEY');
    } else {
      updateTest('Environment Variables', 'success', `URL: ${supabaseUrl.substring(0, 30)}..., Key: ${supabaseKey.substring(0, 20)}..., Dev Mode: ${devMode}`);
    }

    // Test 2: Client Type
    updateTest('Client Type', 'pending', 'Checking...');
    const usingReal = isUsingRealSupabase();
    updateTest('Client Type', usingReal ? 'success' : 'error', usingReal ? 'Using real Supabase client' : 'Using mock client');

    // Test 3: Connection Test
    updateTest('Connection Test', 'pending', 'Testing connection...');
    try {
      const connectionResult = await testConnection();
      updateTest('Connection Test', connectionResult.success ? 'success' : 'error', connectionResult.message);
    } catch (error) {
      updateTest('Connection Test', 'error', `Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Test 4: Auth Session
    updateTest('Auth Session', 'pending', 'Getting session...');
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        updateTest('Auth Session', 'error', `Session error: ${error.message}`);
      } else {
        updateTest('Auth Session', 'success', data.session ? `Logged in as: ${data.session.user?.email}` : 'No active session');
      }
    } catch (error) {
      updateTest('Auth Session', 'error', `Session check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Test 5: Database Query (only if using real Supabase)
    if (usingReal) {
      updateTest('Database Query', 'pending', 'Testing database access...');
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('count')
          .limit(1);
        
        if (error) {
          updateTest('Database Query', 'error', `Database error: ${error.message}`);
        } else {
          updateTest('Database Query', 'success', 'Database accessible');
        }
      } catch (error) {
        updateTest('Database Query', 'error', `Database query failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } else {
      updateTest('Database Query', 'error', 'Skipped (using mock client)');
    }

    setIsRunning(false);
  };

  const getStatusColor = (status: 'pending' | 'success' | 'error') => {
    switch (status) {
      case 'pending': return '#FFA500';
      case 'success': return '#4CAF50';
      case 'error': return '#F44336';
    }
  };

  const getStatusIcon = (status: 'pending' | 'success' | 'error') => {
    switch (status) {
      case 'pending': return '⏳';
      case 'success': return '✅';
      case 'error': return '❌';
    }
  };

  const showDiagnostics = () => {
    const diagnostics = `
Environment Variables:
- SUPABASE_URL: ${process.env.EXPO_PUBLIC_SUPABASE_URL || 'Not set'}
- SUPABASE_KEY: ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'}
- DEV_MODE: ${process.env.EXPO_PUBLIC_DEV_MODE || 'Not set'}

Client Info:
- Using Real Supabase: ${isUsingRealSupabase()}
- User Agent: ${navigator.userAgent}

Network Info:
- Online: ${navigator.onLine}
- Connection: ${(navigator as any).connection?.effectiveType || 'Unknown'}
    `;

    Alert.alert('Diagnostics', diagnostics);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Database Connection Test</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, isRunning && styles.buttonDisabled]} 
          onPress={runTests}
          disabled={isRunning}
        >
          <Text style={styles.buttonText}>
            {isRunning ? 'Running Tests...' : 'Run Tests'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.diagnosticsButton]} 
          onPress={showDiagnostics}
        >
          <Text style={styles.buttonText}>Show Diagnostics</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.testsContainer}>
        {tests.map((test, index) => (
          <View key={index} style={styles.testItem}>
            <View style={styles.testHeader}>
              <Text style={styles.testIcon}>{getStatusIcon(test.status)}</Text>
              <Text style={styles.testName}>{test.name}</Text>
            </View>
            <Text style={[styles.testMessage, { color: getStatusColor(test.status) }]}>
              {test.message}
            </Text>
          </View>
        ))}
      </View>

      {tests.length > 0 && (
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Summary</Text>
          <Text style={styles.summaryText}>
            ✅ Passed: {tests.filter(t => t.status === 'success').length}
          </Text>
          <Text style={styles.summaryText}>
            ❌ Failed: {tests.filter(t => t.status === 'error').length}
          </Text>
          <Text style={styles.summaryText}>
            ⏳ Pending: {tests.filter(t => t.status === 'pending').length}
          </Text>
        </View>
      )}

      <View style={styles.helpContainer}>
        <Text style={styles.helpTitle}>Troubleshooting</Text>
        <Text style={styles.helpText}>
          • If environment variables are missing, check your .env file
        </Text>
        <Text style={styles.helpText}>
          • If using mock client, set EXPO_PUBLIC_DEV_MODE=false
        </Text>
        <Text style={styles.helpText}>
          • If connection fails, check your Supabase project status
        </Text>
        <Text style={styles.helpText}>
          • If database query fails, run the migration SQL in Supabase
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  diagnosticsButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  testsContainer: {
    marginBottom: 20,
  },
  testItem: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  testHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  testIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  testName: {
    fontSize: 16,
    fontWeight: '600',
  },
  testMessage: {
    fontSize: 14,
    marginLeft: 30,
  },
  summaryContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 14,
    marginBottom: 5,
  },
  helpContainer: {
    backgroundColor: '#fff3cd',
    padding: 15,
    borderRadius: 8,
    borderColor: '#ffeaa7',
    borderWidth: 1,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#856404',
  },
  helpText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#856404',
  },
});

export { DatabaseTest }