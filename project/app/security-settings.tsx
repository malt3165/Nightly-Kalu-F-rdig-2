import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Lock, Smartphone, Shield, Eye, Fingerprint, ChevronRight, Check, X } from 'lucide-react-native';
import { router } from 'expo-router';

export default function SecuritySettingsScreen() {
  const [useFaceID, setUseFaceID] = useState(true);
  const [usePasscode, setUsePasscode] = useState(true);
  const [autoLock, setAutoLock] = useState(true);
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [passcodeStep, setPasscodeStep] = useState<'current' | 'new' | 'confirm'>('current');
  const [currentPasscode, setCurrentPasscode] = useState('');
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [hasExistingPasscode, setHasExistingPasscode] = useState(false);

  const handleChangePasscode = () => {
    setShowPasscodeModal(true);
    setPasscodeStep(hasExistingPasscode ? 'current' : 'new');
    setCurrentPasscode('');
    setNewPasscode('');
    setConfirmPasscode('');
  };

  const handleToggleFaceID = (value: boolean) => {
    if (!value) {
      Alert.alert(
        'Slå Face ID fra',
        'Er du sikker på at du vil slå Face ID fra? Du skal bruge din kode i stedet.',
        [
          { text: 'Annuller', style: 'cancel' },
          { text: 'Slå fra', onPress: () => setUseFaceID(false) }
        ]
      );
    } else {
      setUseFaceID(true);
    }
  };

  const handlePasscodeInput = (digit: string) => {
    if (passcodeStep === 'current') {
      if (currentPasscode.length < 4) {
        setCurrentPasscode(prev => prev + digit);
      }
    } else if (passcodeStep === 'new') {
      if (newPasscode.length < 4) {
        setNewPasscode(prev => prev + digit);
      }
    } else if (passcodeStep === 'confirm') {
      if (confirmPasscode.length < 4) {
        setConfirmPasscode(prev => prev + digit);
      }
    }
  };

  const handlePasscodeDelete = () => {
    if (passcodeStep === 'current') {
      setCurrentPasscode(prev => prev.slice(0, -1));
    } else if (passcodeStep === 'new') {
      setNewPasscode(prev => prev.slice(0, -1));
    } else if (passcodeStep === 'confirm') {
      setConfirmPasscode(prev => prev.slice(0, -1));
    }
  };

  const handlePasscodeComplete = () => {
    if (passcodeStep === 'current') {
      if (currentPasscode.length === 4) {
        // Simulate checking current passcode
        if (currentPasscode === '1234') { // Mock existing passcode
          setPasscodeStep('new');
          setCurrentPasscode('');
        } else {
          Alert.alert('Forkert kode', 'Den indtastede kode er forkert. Prøv igen.');
          setCurrentPasscode('');
        }
      }
    } else if (passcodeStep === 'new') {
      if (newPasscode.length === 4) {
        setPasscodeStep('confirm');
      }
    } else if (passcodeStep === 'confirm') {
      if (confirmPasscode.length === 4) {
        if (newPasscode === confirmPasscode) {
          Alert.alert('Succes', 'Din nye kode er oprettet!');
          setHasExistingPasscode(true);
          setShowPasscodeModal(false);
          setCurrentPasscode('');
          setNewPasscode('');
          setConfirmPasscode('');
        } else {
          Alert.alert('Koderne matcher ikke', 'De to koder er ikke ens. Prøv igen.');
          setConfirmPasscode('');
        }
      }
    }
  };

  const getPasscodeTitle = () => {
    switch (passcodeStep) {
      case 'current': return 'Indtast nuværende kode';
      case 'new': return 'Indtast ny kode';
      case 'confirm': return 'Bekræft ny kode';
    }
  };

  const getCurrentPasscode = () => {
    switch (passcodeStep) {
      case 'current': return currentPasscode;
      case 'new': return newPasscode;
      case 'confirm': return confirmPasscode;
    }
  };

  const renderPasscodeDots = () => {
    const passcode = getCurrentPasscode();
    return (
      <View style={styles.passcodeDots}>
        {[0, 1, 2, 3].map((index) => (
          <View
            key={index}
            style={[
              styles.passcodeDot,
              index < passcode.length && styles.passcodeDotFilled
            ]}
          />
        ))}
      </View>
    );
  };

  const renderNumberPad = () => {
    const numbers = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['', '0', 'delete']
    ];

    return (
      <View style={styles.numberPad}>
        {numbers.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.numberRow}>
            {row.map((number, colIndex) => (
              <TouchableOpacity
                key={colIndex}
                style={[
                  styles.numberButton,
                  number === '' && styles.numberButtonEmpty
                ]}
                onPress={() => {
                  if (number === 'delete') {
                    handlePasscodeDelete();
                  } else if (number !== '') {
                    handlePasscodeInput(number);
                  }
                }}
                disabled={number === ''}
              >
                {number === 'delete' ? (
                  <X size={24} color="#fff" />
                ) : (
                  <Text style={styles.numberButtonText}>{number}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    );
  };

  // Auto-proceed when passcode is complete
  React.useEffect(() => {
    if (getCurrentPasscode().length === 4) {
      setTimeout(() => {
        handlePasscodeComplete();
      }, 200);
    }
  }, [currentPasscode, newPasscode, confirmPasscode]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Kode og Face ID</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Settings List */}
          <View style={styles.settingsContainer}>
            {/* Passcode Section */}
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={handleChangePasscode}
            >
              <View style={styles.settingLeft}>
                <Text style={styles.settingTitle}>Vælg personlig kode</Text>
              </View>
              <ChevronRight size={20} color="#C7C7CC" />
            </TouchableOpacity>

            {/* Face ID Section */}
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingTitle}>Brug Face ID</Text>
              </View>
              <Switch
                value={useFaceID}
                onValueChange={handleToggleFaceID}
                trackColor={{ false: '#E5E5EA', true: '#34C759' }}
                thumbColor="#fff"
                ios_backgroundColor="#E5E5EA"
              />
            </View>
          </View>

          {/* Security Info */}
          <View style={styles.infoSection}>
            <Text style={styles.infoText}>
              Din kode og Face ID beskytter din konto og personlige oplysninger. 
              Vi anbefaler at bruge både kode og Face ID for maksimal sikkerhed.
            </Text>
          </View>
        </ScrollView>

        {/* Passcode Modal */}
        <Modal
          visible={showPasscodeModal}
          animationType="slide"
          presentationStyle="fullScreen"
          onRequestClose={() => setShowPasscodeModal(false)}
        >
          <View style={styles.modalContainer}>
            <SafeAreaView style={styles.modalSafeArea}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <TouchableOpacity 
                  style={styles.modalBackButton}
                  onPress={() => setShowPasscodeModal(false)}
                >
                  <ArrowLeft size={24} color="#007AFF" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Kode</Text>
                <View style={styles.modalHeaderRight} />
              </View>

              {/* Passcode Content */}
              <View style={styles.passcodeContent}>
                <Text style={styles.passcodeTitle}>{getPasscodeTitle()}</Text>
                
                {renderPasscodeDots()}
                
                {renderNumberPad()}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#000',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    fontWeight: '600',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  settingsContainer: {
    backgroundColor: '#1a1a1a',
    marginTop: 35,
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  settingLeft: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 17,
    fontFamily: 'Inter-Regular',
    color: '#fff',
  },
  infoSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  infoText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#999',
    lineHeight: 18,
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
    borderBottomColor: '#1a1a1a',
  },
  modalBackButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  modalHeaderRight: {
    width: 32,
  },
  passcodeContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  passcodeTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
  },
  passcodeDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 60,
    gap: 20,
  },
  passcodeDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#333',
    borderWidth: 2,
    borderColor: '#666',
  },
  passcodeDotFilled: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  numberPad: {
    gap: 20,
  },
  numberRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
  },
  numberButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  numberButtonEmpty: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  numberButtonText: {
    fontSize: 32,
    fontFamily: 'Inter-Regular',
    color: '#fff',
  },
});