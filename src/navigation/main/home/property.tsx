import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  SafeAreaView 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ItemData, PropertyDetailData } from '../../../types/property';
import { RowCard, propertyData } from './rowcard';
import { Location, locationData } from './location';
import { Update, updateData } from './update';
import { Navbar } from '../../navbar/Navbar';
import { Footer } from '../../footer/footer';
import type { RootStackParamList } from '../../login/Login';

const CATEGORIES: ItemData[] = [
  { id: '1', title: 'All' },
  { id: '2', title: 'Flat' },
  { id: '3', title: 'Rooms' },
  { id: '4', title: 'Hall' },
  { id: '5', title: 'Rents' },
  { id: '6', title: 'Houses' },
  { id: '7', title: 'Small Houses' },
];

interface PropertyProps {
  onSelectProperty?: (property: PropertyDetailData) => void;
}

export function Property({ onSelectProperty }: PropertyProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>('1');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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

        {/* Section 1: Recently Added Properties */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recently Added Properties</Text>
            <TouchableOpacity 
              onPress={() => Alert.alert('View All', 'Showing all available properties')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {/* Property Cards List */}
          <View style={styles.propertyList}>
            {propertyData.map((item) => (
              <RowCard
                key={item.idName}
                property={item}
                onPress={() => {
                  handleSelectProperty({
                    id: item.idName,
                    title: item.propertyName,
                    price: `$${item.price.toLocaleString()}`,
                    period: '/ per month',
                    distanceFrom: '1.2 km from City Center',
                    subLocation: item.locationName,
                    status: item.propertystatus === 'available' ? 'Available' : item.propertystatus,
                    ownedBy: 'InzuHub Host',
                    appliedCount: '2 Applied',
                    viewsCount: '15 Views',
                    heroImage: item.imageSource,
                  });
                }}
              />
            ))}
          </View>
        </View>

        {/* Section 2: Locations 2-Column Grid */}
        <View style={styles.locationsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Locations</Text>
            <TouchableOpacity 
              onPress={() => Alert.alert('View All', 'Showing all locations')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.locationsGrid}>
            {locationData.map((item) => (
              <Location 
                key={item.locationId}
                location={item}
                onPress={() => {
                  handleSelectProperty({
                    id: item.locationId,
                    title: `${item.locationName} Residence`,
                    price: 'Rs. 8000',
                    period: '/ per month',
                    distanceFrom: `Located at ${item.locationName}`,
                    subLocation: item.locationName,
                    status: 'Available',
                    ownedBy: 'KIA Partner',
                    appliedCount: '5 Applied',
                    viewsCount: '48 Views',
                    heroImage: item.locationImage,
                  });
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
              onPress={() => Alert.alert('See All', 'Showing all recent updates')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.updatesList}>
            {updateData.map((item) => (
              <Update 
                key={item.updateId}
                update={item}
                onPress={() => {
                  handleSelectProperty({
                    id: item.updateId,
                    title: item.title,
                    price: item.price,
                    period: item.period || '/ per month',
                    distanceFrom: '1.2 km from Hospital',
                    subLocation: item.updateLocation,
                    status: item.propertystatus,
                    ownedBy: 'KIA',
                    appliedCount: item.appliedCount || '0 Applied',
                    viewsCount: item.viewsCount || '19 Views',
                    heroImage: item.updateImage,
                  });
                }}
              />
            ))}
          </View>
        </View>
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