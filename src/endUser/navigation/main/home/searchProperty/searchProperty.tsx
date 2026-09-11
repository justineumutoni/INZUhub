import React, { useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  ScrollView, 
  RefreshControl,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ItemData, PropertyDetailData } from '../../../../types/property';
import { RowCard } from '../rowcard';
import { 
  getProperties, 
  propertyToRowCard, 
} from '../../../../services/properties';
import { Footer } from '../../../footer/footer';
import type { RootStackParamList } from '../../../Login/Login';


interface PropertyProps {
  onSelectProperty?: (property: PropertyDetailData) => void;
}

type AvailabilityFilter = 'allAvailable' | 'booked';

export function SearchDetails({ onSelectProperty }: PropertyProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>('All');
  const [availabilityFilter, setAvailabilityFilter] = useState<AvailabilityFilter>('allAvailable');
  const [query, setQuery] = useState<string>('');
  const [properties, setProperties] = useState<PropertyDetailData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const isFocused = useIsFocused();


  // Load properties from service/Firestore
  const loadProperties = useCallback(async (isPullRefresh: boolean = false) => {
    if (isPullRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const data = await getProperties(activeCategoryId, query);
      setProperties(data);
    } catch (err) {
      console.warn('Error loading properties:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeCategoryId, query]);

  useEffect(() => {
    loadProperties();
  }, [loadProperties, isFocused]);

  const visibleProperties = properties.filter((property) => {
    if (availabilityFilter === 'allAvailable') {
      return property.status?.toLowerCase() === 'available';
    }

    return property.status?.toLowerCase() === 'booked';
  });
  const availableCount = properties.filter((property) => property.status?.toLowerCase() === 'available').length;
  const bookedCount = properties.filter((property) => property.status?.toLowerCase() === 'booked').length;

  const handleSelectProperty = (property: PropertyDetailData) => {
    if (onSelectProperty) {
      onSelectProperty(property);
    } else {
      navigation.navigate('PropertyDetail', { property });
    }
  };

  const renderCategoryItem = ({ item }: { item: ItemData }) => {
    const isActive = item.id === activeCategoryId;

    return (
      <TouchableOpacity
        style={[
          styles.categoryChip,
          isActive && styles.activeCategoryChip,
        ]}
        onPress={() => setActiveCategoryId(item.id)}
        activeOpacity={0.7}
      >
        <Text style={[styles.categoryText, isActive ? styles.activeCategoryText : styles.inactiveCategoryText]}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Main Scrollable Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadProperties(true)}
            colors={['#2C56C0']}
            tintColor="#2C56C0"
          />
        }
      >
        {/* Top Navbar */}
        <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Search Details</Text>
        </View>

        <Text style={styles.headerSubtitle}>Search for Properties</Text>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Search for Properties"
            placeholderTextColor="#9CA3AF"
            returnKeyType="search"
          />
        </View>
      </SafeAreaView>


        {loading ? (
          <View style={{ paddingVertical: 40, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color="#2C56C0" />
            <Text style={{ marginTop: 10, fontSize: 13, color: '#6B7280', fontWeight: '500' }}>
              Loading listings...
            </Text>
          </View>
        ) : (
          <>
            {/* Section 1: Recently Added Properties */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Showing Results</Text>
              <Text style={styles.viewAllText}>{visibleProperties.length} Results</Text>
            </View>

              <View style={styles.availabilityLinks}>
                {(['allAvailable', 'booked'] as AvailabilityFilter[]).map((filter) => (
                  <TouchableOpacity
                    key={filter}
                    onPress={() => setAvailabilityFilter(filter)}
                    activeOpacity={0.7}
                    style={[
                      styles.availabilityLink,
                      availabilityFilter === filter && styles.activeAvailabilityLink,
                    ]}
                  >
                    <Text
                      style={[
                        styles.availabilityLinkText,
                        availabilityFilter === filter && styles.activeAvailabilityLinkText,
                      ]}
                    >
                      {filter === 'allAvailable'
                        ? `All Available (${availableCount})`
                        : `Booked (${bookedCount})`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Property Cards List */}
              <View style={styles.propertyList}>
                {visibleProperties.map((prop, idx) => {
                  const cardItem = propertyToRowCard(prop, idx);
                  return (
                    <RowCard
                      key={prop.id || `prop-${idx}`}
                      property={cardItem}
                      onPress={() => handleSelectProperty(prop)}
                    />
                  );
                })}
              </View>
            </View>

          </>
        )}
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <Footer activeTab="Search" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  categoriesContainer: {
    marginTop: 4,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  categoryListContent: {
    paddingRight: 8,
    gap: 8,
  },
  categoryChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeCategoryChip: {
    backgroundColor: '#2C56C0',
    borderColor: '#2C56C0',
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
  },
  activeCategoryText: {
    color: '#FFFFFF',
  },
  inactiveCategoryText: {
    color: '#6B7280',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  sectionContainer: {
    marginTop: 8,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#111827',
  },
  availabilityLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  availabilityLink: {
    paddingVertical: 4,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeAvailabilityLink: {
    borderBottomColor: '#2C56C0',
  },
  availabilityLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  activeAvailabilityLinkText: {
    color: '#2C56C0',
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2C56C0',
  },
  propertyList: {
    gap: 2,
  },
   root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerSafeArea: {
    backgroundColor: '#2C56C0',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 30,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingBottom: 8,
  },
  backButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonSpacer: {
    width: 34,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    paddingVertical: 15,
  },
  headerSubtitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 14,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
    padding: 0,
  },
});