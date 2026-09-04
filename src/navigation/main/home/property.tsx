import React, { useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ItemData, PropertyDetailData } from '../../../types/property';
import { RowCard } from './rowcard';
import { Location } from './location';
import { Update } from './update';
import { 
  getProperties, 
  FEATURED_LOCATIONS, 
  propertyToRowCard, 
  propertyToUpdateItem 
} from '../../../services/properties';
import { Navbar } from '../../navbar/Navbar';
import { Footer } from '../../footer/footer';
import type { RootStackParamList } from '../../Login/Login';

const CATEGORIES: ItemData[] = [
  { id: '1', title: 'All' },
  { id: '2', title: 'Villa' },
  { id: '3', title: 'Flat' },
  { id: '4', title: 'Studio' },
  { id: '5', title: 'Penthouse' },
  { id: '6', title: 'House' },
  { id: '7', title: 'Rooms' },
];

interface PropertyProps {
  onSelectProperty?: (property: PropertyDetailData) => void;
}

export function Property({ onSelectProperty }: PropertyProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>('1');
  const [properties, setProperties] = useState<PropertyDetailData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const isFocused = useIsFocused();

  const selectedCategory = CATEGORIES.find((c) => c.id === activeCategoryId)?.title || 'All';

  // Load properties from service/Firestore
  const loadProperties = useCallback(async (isPullRefresh: boolean = false) => {
    if (isPullRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const data = await getProperties(selectedCategory);
      setProperties(data);
    } catch (err) {
      console.warn('Error loading properties:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    loadProperties();
  }, [loadProperties, isFocused]);

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
        <Navbar />

        {/* Categories Section */}
        <View style={styles.categoriesContainer}>
          <FlatList
            data={CATEGORIES}
            renderItem={renderCategoryItem}
            keyExtractor={(item: ItemData) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryListContent}
          />
        </View>

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
                <Text style={styles.sectionTitle}>Recently Added Properties</Text>
                <TouchableOpacity 
                  onPress={() => Alert.alert('All Properties', `Displaying ${properties.length} verified listings.`)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.viewAllText}>View All ({properties.length})</Text>
                </TouchableOpacity>
              </View>

              {/* Property Cards List */}
              <View style={styles.propertyList}>
                {properties.slice(0, 5).map((prop, idx) => {
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

            {/* Section 2: Locations 2-Column Grid */}
            <View style={styles.locationsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Featured Locations</Text>
                <TouchableOpacity 
                  onPress={() => Alert.alert('Locations', 'Explore top neighborhoods in Kigali and beyond.')}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.locationsGrid}>
                {FEATURED_LOCATIONS.map((loc) => (
                  <Location 
                    key={loc.locationId}
                    location={loc}
                    onPress={() => {
                      const matched = properties.find((p) =>
                        p.location?.toLowerCase().includes(loc.locationName.toLowerCase()) ||
                        p.subLocation?.toLowerCase().includes(loc.locationName.toLowerCase())
                      ) || properties[0];
                      if (matched) handleSelectProperty(matched);
                    }}
                  />
                ))}
              </View>
            </View>

            {/* Section 3: Recent Updates Vertical List */}
            <View style={styles.updatesSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Updates</Text>
                <TouchableOpacity 
                  onPress={() => Alert.alert('Updates', 'All recent rental and property updates.')}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.updatesList}>
                {properties.map((prop, idx) => {
                  const updateItem = propertyToUpdateItem(prop, idx);
                  return (
                    <Update 
                      key={`update-${prop.id || idx}`}
                      update={updateItem}
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
      <Footer activeTab="Home" />
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
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2C56C0',
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#9CA3AF',
    textDecorationLine: 'underline',
  },
  propertyList: {
    gap: 2,
  },
  locationsSection: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  locationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  updatesSection: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  updatesList: {
    gap: 4,
  },
});