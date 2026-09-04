import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Footer } from '../../../footer/footer';

// Matches the screen params used by this screen and avoids depending on a global
// RootStackParamList type that may not exist in this file's scope.
type RootStackParamList = {
  SearchDetails: {
    initialQuery?: string;
  } | undefined;
};

// ---- Types -----------------------------------------------------------

type FilterTabId = 'available' | 'booked';

export type PropertyResult = {
  id: string;
  price: string;
  bhkType: string;
  city: string;
  subLocation: string;
  isAvailable: boolean;
  thumbnail: any;
};

type SearchDetailsProps = Partial<
  NativeStackScreenProps<RootStackParamList, 'SearchDetails'>
> & {
  initialQuery?: string;
  onBack?: () => void;
  onSelectProperty?: (property: PropertyResult) => void;
};

// ---- Static data -------------------------------------------------------

const FILTER_TABS: { id: FilterTabId; label: string; count: number }[] = [
  { id: 'available', label: 'All Available', count: 14 },
  { id: 'booked', label: 'Booked', count: 0 },
];

const SAMPLE_RESULTS: PropertyResult[] = [
  {
    id: '1',
    price: 'Rp.1000k',
    bhkType: '1 BHK at Jakarta',
    city: 'Jakarta',
    subLocation: 'Jaksel, Jln Samiri',
    isAvailable: true,
    thumbnail: require('../../../../../assets/propertyImage.jpg'),
  },
  {
    id: '2',
    price: 'Rp.1000k',
    bhkType: '1 BHK at Jakarta',
    city: 'Jakarta',
    subLocation: 'Jaksel, Jln Samiri',
    isAvailable: true,
    thumbnail: require('../../../../../assets/propertyImage.jpg'),
  },
  {
    id: '3',
    price: 'Rp.1000k',
    bhkType: '1 BHK at Jakarta',
    city: 'Jakarta',
    subLocation: 'Jaksel, Jln Samiri',
    isAvailable: true,
    thumbnail: require('../../../../../assets/propertyImage.jpg'),
  },
  {
    id: '4',
    price: 'Rp.1000k',
    bhkType: '1 BHK at Jakarta',
    city: 'Jakarta',
    subLocation: 'Jaksel, Jln Samiri',
    isAvailable: true,
    thumbnail: require('../../../../../assets/propertyImage.jpg'),
  },
];

// ---- Component -----------------------------------------------------------

export function SearchDetails({
  initialQuery,
  onBack,
  onSelectProperty,
  route,
  navigation,
}: SearchDetailsProps) {
  const startingQuery = initialQuery ?? route?.params?.initialQuery ?? 'Sudirm';

  const [query, setQuery] = useState(startingQuery);
  const [activeTab, setActiveTab] = useState<FilterTabId>('available');
  const [results] = useState<PropertyResult[]>(SAMPLE_RESULTS);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack()) {
      navigation.goBack();
    }
  };

  const renderItem = ({ item }: { item: PropertyResult }) => (
    <TouchableOpacity
      style={styles.resultCard}
      activeOpacity={0.8}
      onPress={() => onSelectProperty?.(item)}
    >
      <Image source={item.thumbnail} style={styles.resultImage} resizeMode="cover" />

      <View style={styles.resultInfo}>
        <View style={styles.resultTopRow}>
          <Text style={styles.resultPrice}>{item.price}</Text>
          <View style={styles.availabilityWrap}>
            <View
              style={[
                styles.availabilityDot,
                { backgroundColor: item.isAvailable ? '#22C55E' : '#EF4444' },
              ]}
            />
            <Text style={styles.availabilityText}>
              {item.isAvailable ? 'Available' : 'Booked'}
            </Text>
          </View>
        </View>

        <Text style={styles.resultSubtitle}>{item.bhkType}</Text>

        <View style={styles.locationRow}>
          <Ionicons name="location-sharp" size={12} color="#9CA3AF" style={styles.locationIcon} />
          <Text style={styles.locationText}>{item.subLocation}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#2C56C0" />

      {/* Header */}
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

      {/* Body */}
      <View style={styles.body}>
        <View style={styles.resultsHeaderRow}>
          <Text style={styles.resultsHeading}>Showing Results</Text>
          <Text style={styles.resultsCount}>{results.length} Results</Text>
        </View>

        <View style={styles.tabsRow}>
          {FILTER_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tabPill, isActive && styles.tabPillActive]}
                onPress={() => setActiveTab(tab.id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabPillText, isActive && styles.tabPillTextActive]}>
                  {tab.label}
                  {tab.id === 'available' ? ` (${tab.count})` : ''}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>

      {/* Bottom Tab Bar */}
     <Footer activeTab="Search"/>
    </View>
  );
}

// ---- Styles ----------------------------------------------------------

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerSafeArea: {
    backgroundColor: '#2C56C0',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingTop: Platform.OS === 'android' ? 12 : 4,
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
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  resultsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultsHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  resultsCount: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  tabPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  tabPillActive: {
    backgroundColor: '#1E293B',
  },
  tabPillText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  tabPillTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingBottom: 12,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 14,
    padding: 10,
    marginBottom: 12,
  },
  resultImage: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
  },
  resultInfo: {
    flex: 1,
    gap: 3,
  },
  resultTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultPrice: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#1E293B',
  },
  availabilityWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  availabilityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  availabilityText: {
    fontSize: 11,
    color: '#6B7280',
  },
  resultSubtitle: {
    fontSize: 12.5,
    color: '#6B7280',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    marginRight: 3,
  },
  locationText: {
    fontSize: 11.5,
    color: '#9CA3AF',
  },
  tabBarSafeArea: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  tabBarItem: {
    alignItems: 'center',
    gap: 3,
  },
  tabBarLabel: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  tabBarLabelActive: {
    color: '#2C56C0',
    fontWeight: '600',
  },
});