import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { companionService } from '../services/companion.service';
import { CompanionFilters } from '../services/companion.service';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [companions, setCompanions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<CompanionFilters>({});

  useEffect(() => {
    loadCompanions();
  }, [filters]);

  const loadCompanions = async () => {
    setLoading(true);
    try {
      const response = await companionService.getCompanions({
        ...filters,
        search: searchQuery || undefined,
      });
      if (response.success) {
        setCompanions(response.data.companions);
      }
    } catch (error) {
      console.error('Error loading companions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadCompanions();
  };

  const renderCompanion = ({ item }: { item: any }) => {
    const user = item.userId;
    return (
      <TouchableOpacity
        style={styles.companionCard}
        onPress={() => navigation.navigate('CompanionDetail' as never, { companionId: item._id } as never)}
      >
        <Image
          source={{ uri: user?.profilePhoto || 'https://via.placeholder.com/100' }}
          style={styles.avatar}
        />
        <View style={styles.companionInfo}>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.rating}>
            ⭐ {item.rating?.average?.toFixed(1) || '0.0'} ({item.rating?.count || 0})
          </Text>
          <Text style={styles.location}>{user?.location?.city || 'Location not set'}</Text>
          <Text style={styles.price}>${item.pricing?.hourly}/hour</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Find Your Companion</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search companions..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={loadCompanions}
        />
      </View>

      <FlatList
        data={companions}
        renderItem={renderCompanion}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#F9F9F9',
  },
  list: {
    padding: 15,
  },
  companionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  companionInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
    color: '#000',
  },
  rating: {
    fontSize: 14,
    color: '#FF9500',
    marginBottom: 5,
  },
  location: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
});

export default HomeScreen;
