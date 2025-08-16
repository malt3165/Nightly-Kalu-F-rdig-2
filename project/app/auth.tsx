import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform, ScrollView, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Apple, Mail, Eye, EyeOff, Smartphone, Shield, Users, MapPin, Calendar, User, Wifi, WifiOff, UserPlus, LogIn, Info } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { DEMO_CREDENTIALS } from '@/lib/supabase';

const { width, height } = Dimensions.get('window');

export default function AuthScreen() {
  const { signIn, signUp, loading, connectionStatus } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email er påkrævet';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Indtast en gyldig email adresse';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Adgangskode er påkrævet';
    } else if (password.length < 6) {
      newErrors.password = 'Adgangskoden skal være mindst 6 tegn';
    }

    if (!isLogin) {
      // Registration specific validation
      if (!firstName.trim()) {
        newErrors.firstName = 'Fornavn er påkrævet';
      }
      
      if (!lastName.trim()) {
        newErrors.lastName = 'Efternavn er påkrævet';
      }
      
      if (!age.trim()) {
        newErrors.age = 'Alder er påkrævet';
      } else {
        const ageNum = parseInt(age);
        if (isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
          newErrors.age = 'Du skal være mellem 18 og 100 år';
        }
      }
      
      if (!address.trim()) {
        newErrors.address = 'Adresse er påkrævet';
      }
      
      if (!postalCode.trim()) {
        newErrors.postalCode = 'Postnummer er påkrævet';
      } else if (!/^\d{4}$/.test(postalCode)) {
        newErrors.postalCode = 'Postnummer skal være 4 cifre';
      }
      
      if (!city.trim()) {
        newErrors.city = 'By er påkrævet';
      }
      
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Bekræft adgangskode er påkrævet';
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Adgangskoderne matcher ikke';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailAuth = async () => {
    // Clear previous errors
    setErrors({});

    if (!validateForm()) {
      return;
    }

    if (!isLogin) {
      // Sign up
      const { error } = await signUp(email.trim(), password, {
        email: email.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        age: age.trim(),
        address: address.trim(),
        postalCode: postalCode.trim(),
        city: city.trim(),
      });

      if (error) {
        Alert.alert('Fejl ved oprettelse', error.message || 'Der opstod en fejl ved oprettelse af konto');
        return;
      }

      Alert.alert(
        'Konto oprettet!', 
        'Din konto er nu oprettet. Du kan logge ind med dine nye oplysninger.',
        [
          { 
            text: 'Log ind nu', 
            onPress: () => {
              setIsLogin(true);
              // Keep email and password for easy login
              setConfirmPassword('');
              setFirstName('');
              setLastName('');
              setAge('');
              setAddress('');
              setPostalCode('');
              setCity('');
              setErrors({});
            }
          }
        ]
      );
    } else {
      // Sign in
      const { error } = await signIn(email.trim(), password);

      if (error) {
        if (error.message.includes('Forkert email eller adgangskode')) {
          Alert.alert(
            'Login fejl',
            'Email eller adgangskode er forkert.\n\nHar du ikke en konto endnu?',
            [
              { text: 'Prøv igen', style: 'cancel' },
              { 
                text: 'Opret konto', 
                onPress: () => {
                  setIsLogin(false);
                  setErrors({});
                }
              }
            ]
          );
        } else {
          Alert.alert('Fejl ved login', error.message || 'Der opstod en fejl ved login');
        }
        return;
      }

      router.replace('/(tabs)');
    }
  };

  const getConnectionStatusColor = () => {
    return '#ffa500'; // Always orange for mock mode
  };

  const getConnectionStatusText = () => {
    return 'Demo tilstand - Database deaktiveret';
  };

  const getConnectionIcon = () => {
    return <Smartphone size={16} color="#ffa500" />;
  };

  const features = [
    { icon: Smartphone, text: 'Find de bedste steder i nærheden' },
    { icon: Users, text: 'Forbind med venner og opret grupper' },
    { icon: Shield, text: 'Sikker og privat platform' },
  ];

  const renderError = (field: string) => {
    if (errors[field]) {
      return <Text style={styles.errorText}>{errors[field]}</Text>;
    }
    return null;
  };

  const fillDemoData = () => {
    if (!isLogin) {
      setFirstName('Test');
      setLastName('Bruger');
      setAge('25');
      setAddress('Testgade 123');
      setPostalCode('2100');
      setCity('København');
    }
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    if (!isLogin) {
      setConfirmPassword(DEMO_CREDENTIALS.password);
    }
  };

  const showLoginHelp = () => {
    Alert.alert(
      'Demo tilstand aktiv',
      `Databasen er midlertidigt deaktiveret så du kan se appen.\n\nDemo login:\n• Email: ${DEMO_CREDENTIALS.email}\n• Adgangskode: ${DEMO_CREDENTIALS.password}\n\nDu kan også oprette nye konti - de gemmes kun lokalt i denne session.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Connection Status */}
        <View style={styles.connectionStatus}>
          <View style={styles.connectionIndicator}>
            {getConnectionIcon()}
            <Text style={[styles.connectionText, { color: getConnectionStatusColor() }]}>
              {getConnectionStatusText()}
            </Text>
          </View>
          <View style={styles.connectionActions}>
            <TouchableOpacity 
              style={styles.helpButton}
              onPress={showLoginHelp}
            >
              <Info size={16} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header Section */}
            <View style={styles.headerSection}>
              <View style={styles.brandContainer}>
                <Text style={styles.brandName}>NIGHTLY</Text>
              </View>
              
              <Text style={styles.welcomeTitle}>
                {isLogin ? 'Velkommen tilbage' : 'Kom med i fællesskabet'}
              </Text>
              <Text style={styles.subtitle}>
                {isLogin 
                  ? 'Log ind på din konto' 
                  : 'Opret en konto og opdag nattelivet'
                }
              </Text>
            </View>

            {/* Demo Warning */}
            <View style={styles.demoWarning}>
              <Smartphone size={20} color="#ffa500" />
              <Text style={styles.demoWarningText}>
                Demo tilstand aktiv. Database er deaktiveret så du kan se appen.
              </Text>
            </View>

            {/* Quick Action Buttons */}
            <View style={styles.quickActions}>
              <TouchableOpacity 
                style={[styles.quickActionButton, isLogin && styles.activeQuickAction]}
                onPress={() => {
                  setIsLogin(true);
                  setErrors({});
                }}
              >
                <LogIn size={20} color={isLogin ? "#fff" : "#007AFF"} />
                <Text style={[styles.quickActionText, isLogin && styles.activeQuickActionText]}>
                  Log ind
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.quickActionButton, !isLogin && styles.activeQuickAction]}
                onPress={() => {
                  setIsLogin(false);
                  setErrors({});
                }}
              >
                <UserPlus size={20} color={!isLogin ? "#fff" : "#007AFF"} />
                <Text style={[styles.quickActionText, !isLogin && styles.activeQuickActionText]}>
                  Opret konto
                </Text>
              </TouchableOpacity>
            </View>

            {/* Demo Data Button */}
            <View style={styles.demoSection}>
              <TouchableOpacity 
                style={styles.demoButton}
                onPress={fillDemoData}
              >
                <Text style={styles.demoButtonText}>
                  {isLogin ? 'Brug demo login' : 'Udfyld demo data'}
                </Text>
              </TouchableOpacity>
              <Text style={styles.demoHint}>
                {isLogin 
                  ? `Email: ${DEMO_CREDENTIALS.email}, Adgangskode: ${DEMO_CREDENTIALS.password}`
                  : 'Fylder automatisk alle felter med test data'
                }
              </Text>
            </View>

            {/* Form Section */}
            <View style={styles.formSection}>
              {/* Personal Information - Only for registration */}
              {!isLogin && (
                <>
                  <View style={styles.rowContainer}>
                    <View style={styles.halfInput}>
                      <Text style={styles.inputLabel}>Fornavn *</Text>
                      <View style={styles.inputWithIcon}>
                        <User size={20} color="#666" />
                        <TextInput
                          style={[styles.textInputWithIcon, errors.firstName && styles.inputError]}
                          value={firstName}
                          onChangeText={setFirstName}
                          placeholder="Dit fornavn"
                          placeholderTextColor="#666"
                          autoCapitalize="words"
                        />
                      </View>
                      {renderError('firstName')}
                    </View>

                    <View style={styles.halfInput}>
                      <Text style={styles.inputLabel}>Efternavn *</Text>
                      <View style={styles.inputWithIcon}>
                        <User size={20} color="#666" />
                        <TextInput
                          style={[styles.textInputWithIcon, errors.lastName && styles.inputError]}
                          value={lastName}
                          onChangeText={setLastName}
                          placeholder="Dit efternavn"
                          placeholderTextColor="#666"
                          autoCapitalize="words"
                        />
                      </View>
                      {renderError('lastName')}
                    </View>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Alder *</Text>
                    <View style={styles.inputWithIcon}>
                      <Calendar size={20} color="#666" />
                      <TextInput
                        style={[styles.textInputWithIcon, errors.age && styles.inputError]}
                        value={age}
                        onChangeText={setAge}
                        placeholder="Din alder"
                        placeholderTextColor="#666"
                        keyboardType="numeric"
                        maxLength={2}
                      />
                    </View>
                    {renderError('age')}
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Adresse *</Text>
                    <View style={styles.inputWithIcon}>
                      <MapPin size={20} color="#666" />
                      <TextInput
                        style={[styles.textInputWithIcon, errors.address && styles.inputError]}
                        value={address}
                        onChangeText={setAddress}
                        placeholder="Din adresse"
                        placeholderTextColor="#666"
                        autoCapitalize="words"
                      />
                    </View>
                    {renderError('address')}
                  </View>

                  <View style={styles.rowContainer}>
                    <View style={styles.halfInput}>
                      <Text style={styles.inputLabel}>Postnummer *</Text>
                      <TextInput
                        style={[styles.textInput, errors.postalCode && styles.inputError]}
                        value={postalCode}
                        onChangeText={setPostalCode}
                        placeholder="0000"
                        placeholderTextColor="#666"
                        keyboardType="numeric"
                        maxLength={4}
                      />
                      {renderError('postalCode')}
                    </View>

                    <View style={styles.halfInput}>
                      <Text style={styles.inputLabel}>By *</Text>
                      <TextInput
                        style={[styles.textInput, errors.city && styles.inputError]}
                        value={city}
                        onChangeText={setCity}
                        placeholder="Din by"
                        placeholderTextColor="#666"
                        autoCapitalize="words"
                      />
                      {renderError('city')}
                    </View>
                  </View>
                </>
              )}

              {/* Email and Password */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email *</Text>
                <View style={styles.inputWithIcon}>
                  <Mail size={20} color="#666" />
                  <TextInput
                    style={[styles.textInputWithIcon, errors.email && styles.inputError]}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="din@email.com"
                    placeholderTextColor="#666"
                  />
                </View>
                {renderError('email')}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Adgangskode *</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.passwordInput, errors.password && styles.inputError]}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    placeholder="Indtast adgangskode"
                    placeholderTextColor="#666"
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="#666" />
                    ) : (
                      <Eye size={20} color="#666" />
                    )}
                  </TouchableOpacity>
                </View>
                {renderError('password')}
              </View>

              {!isLogin && (
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Bekræft adgangskode *</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={[styles.passwordInput, errors.confirmPassword && styles.inputError]}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showConfirmPassword}
                      placeholder="Bekræft adgangskode"
                      placeholderTextColor="#666"
                    />
                    <TouchableOpacity
                      style={styles.eyeButton}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} color="#666" />
                      ) : (
                        <Eye size={20} color="#666" />
                      )}
                    </TouchableOpacity>
                  </View>
                  {renderError('confirmPassword')}
                </View>
              )}

              {/* Age Requirement Notice */}
              {!isLogin && (
                <View style={styles.ageNotice}>
                  <Text style={styles.ageNoticeText}>
                    Du skal være mindst 18 år for at oprette en konto på NIGHTLY
                  </Text>
                </View>
              )}

              <TouchableOpacity 
                style={[styles.primaryButton, loading && styles.disabledButton]} 
                onPress={handleEmailAuth}
                disabled={loading}
              >
                <Text style={styles.primaryButtonText}>
                  {loading ? 'Vent...' : (isLogin ? 'Log ind' : 'Opret konto')}
                </Text>
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>eller</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity style={styles.appleButton} onPress={() => Alert.alert('Info', 'Apple login kommer snart')}>
                <Apple size={20} color="#fff" style={styles.appleIcon} />
                <Text style={styles.appleButtonText}>
                  {isLogin ? 'Log ind med Apple' : 'Opret konto med Apple'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Terms and Privacy */}
            {!isLogin && (
              <View style={styles.termsSection}>
                <Text style={styles.termsText}>
                  Ved at oprette en konto accepterer du vores{' '}
                  <Text style={styles.termsLink}>Servicevilkår</Text> og{' '}
                  <Text style={styles.termsLink}>Privatlivspolitik</Text>
                </Text>
              </View>
            )}
          </ScrollView>
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
  connectionStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#1a1a1a',
  },
  connectionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  connectionText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  connectionActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  helpButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 4,
    padding: 4,
    borderWidth: 1,
    borderColor: '#333',
  },
  demoWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 165, 0, 0.1)',
    borderColor: '#ffa500',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  demoWarningText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ffa500',
    lineHeight: 20,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  brandContainer: {
    marginBottom: 30,
  },
  brandName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    letterSpacing: 2,
  },
  welcomeTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#999',
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 4,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  activeQuickAction: {
    backgroundColor: '#007AFF',
  },
  quickActionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#007AFF',
  },
  activeQuickActionText: {
    color: '#fff',
  },
  demoSection: {
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  demoButton: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderColor: '#007AFF',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
  },
  demoButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#007AFF',
  },
  demoHint: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
  },
  formSection: {
    flex: 1,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#fff',
    marginBottom: 8,
  },
  inputWrapper: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    paddingHorizontal: 16,
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
    borderColor: 'transparent',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  textInputWithIcon: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    marginLeft: 12,
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#ff3b30',
    marginTop: 4,
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  halfInput: {
    flex: 1,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#fff',
  },
  eyeButton: {
    padding: 16,
  },
  ageNotice: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  ageNoticeText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ccc',
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 24,
  },
  disabledButton: {
    opacity: 0.6,
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    textAlign: 'center',
    paddingVertical: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#333',
  },
  dividerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginHorizontal: 16,
  },
  appleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    paddingVertical: 16,
  },
  appleIcon: {
    marginRight: 8,
  },
  appleButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#fff',
  },
  termsSection: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  termsText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
});