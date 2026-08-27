import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { ItemData } from '../../types/property';
import { RowCard, propertyData } from './rowcard';

const CATEGORIES: ItemData[] = [
  { id: '1', title: 'All' },
  { id: '2', title: 'Flat' },
  { id: '3', title: 'Rooms' },
  { id: '4', title: 'Hall' },
  { id: '5', title: 'Rents' },
  { id: '6', title: 'Houses' },
  { id: '7', title: 'Small Houses' },
];

export function Property() {
  const [activeCategoryId, setActiveCategoryId] = useState<string>('1');

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
    <View style={styles.container}>
      {/* Fixed Header Section: Categories & Section Title */}
      <View style={styles.fixedHeader}>
        {/* Category Filter Chips */}
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

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recently Added Properties</Text>
          <TouchableOpacity 
            onPress={() => Alert.alert('View All', 'Showing all available properties')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Property Cards List */}
      <FlatList
        data={propertyData}
        keyExtractor={(item) => item.idName}
        renderItem={({ item }) => (
          <RowCard
            property={item}
            onPress={() => Alert.alert(item.propertyName, `${item.locationName}\n$${item.price.toLocaleString()} • ${item.propertystatus}`)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.propertyListContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  fixedHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    zIndex: 10,
  },
  categoriesContainer: {
    marginVertical: 4,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 6,
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
  propertyListContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
});