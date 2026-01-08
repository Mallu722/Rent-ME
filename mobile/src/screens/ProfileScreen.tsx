import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/user.service';
import { paymentService } from '../services/payment.service';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user, logout, updateUser } = useAuth();
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadWallet();
  }, []);

  const loadWallet = async () => {
    try {
      const response = await paymentService.getWallet();
      if (response.success) {
        setWallet(response.data.wallet);
      }
    } catch (error) {
      console.error('Error loading wallet:', error);
    }
  };

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission needed', 'Please grant camera roll permissions');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setLoading(true);
      try {
        const response = await userService.uploadProfilePhoto(result.assets[0].uri);
        if (response.success) {
          updateUser(response.data.user);
          Alert.alert('Success', 'Profile photo updated');
        }
      } catch (error: any) {
        Alert.alert('Error', error.message || 'Failed to upload photo');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleImagePicker} disabled={loading}>
          <Image
            source={{ uri: user?.profilePhoto || 'https://via.placeholder.com/100' }}
            style={styles.avatar}
          />
        </TouchableOpacity>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        {user?.role === 'companion' && (
          <TouchableOpacity
            style={styles.companionButton}
            onPress={() => navigation.navigate('CompanionProfile' as never)}
          >
            <Text style={styles.companionButtonText}>Manage Companion Profile</Text>
          </TouchableOpacity>
        )}
        {user?.role === 'admin' && (
          <TouchableOpacity
            style={styles.adminButton}
            onPress={() => navigation.navigate('AdminDashboard' as never)}
          >
            <Text style={styles.adminButtonText}>Admin Dashboard</Text>
          </TouchableOpacity>
        )}
      </View>

      {wallet && (
        <View style={styles.walletCard}>
          <Text style={styles.walletLabel}>Wallet Balance</Text>
          <Text style={styles.walletAmount}>
            ${wallet.balance?.toFixed(2) || '0.00'}
          </Text>
          <TouchableOpacity
            style={styles.topUpButton}
            onPress={() => {
              // Navigate to top-up screen
            }}
          >
            <Text style={styles.topUpButtonText}>Top Up</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Payment History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Help & Support</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
          <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  email: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 20,
  },
  companionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  companionButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  adminButton: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  adminButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  walletCard: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  walletLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 5,
  },
  walletAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 15,
  },
  topUpButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 8,
  },
  topUpButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  menu: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  menuText: {
    fontSize: 16,
    color: '#000',
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#FF3B30',
  },
});

export default ProfileScreen;
