import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { useAuth } from '../../context/AuthContext';

type SignupScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Signup'>;

const SignupScreen = () => {
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'user' | 'companion'>('user');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signup({ name, email, password, role });
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message || 'Error creating account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Create Account</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <View style={styles.roleContainer}>
          <Text style={styles.roleLabel}>I want to:</Text>
          <TouchableOpacity
            style={[styles.roleButton, role === 'user' && styles.roleButtonActive]}
            onPress={() => setRole('user')}
          >
            <Text style={[styles.roleButtonText, role === 'user' && styles.roleButtonTextActive]}>
              Find Companions
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleButton, role === 'companion' && styles.roleButtonActive]}
            onPress={() => setRole('companion')}
          >
            <Text style={[styles.roleButtonText, role === 'companion' && styles.roleButtonTextActive]}>
              Be a Companion
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSignup}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Creating account...' : 'Sign Up'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.linkText}>
            Already have an account? <Text style={styles.linkTextBold}>Login</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#007AFF',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
  },
  roleContainer: {
    marginBottom: 20,
  },
  roleLabel: {
    fontSize: 16,
    marginBottom: 10,
    color: '#000',
  },
  roleButton: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#F9F9F9',
  },
  roleButtonActive: {
    borderColor: '#007AFF',
    backgroundColor: '#E3F2FD',
  },
  roleButtonText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
  roleButtonTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#8E8E93',
    fontSize: 14,
  },
  linkTextBold: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default SignupScreen;
