import React from 'react';
import { RowCardProps } from '../../types/property';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const propertyData: RowCardProps[] = [
  {
    idName: '1',
    propertyName: 'Luxury Villa',
    locationName: 'Beverly Hills, CA',
    price: 2500000,
    howLong: '2 days ago',
    propertystatus: 'available',
    imageSource: require('../../../assets/propertyImage.jpg'),
  },
  {
    idName: '2',
    propertyName: 'Modern Apartment',
    locationName: 'Downtown, NY',
    price: 1200000,
    howLong: '5 days ago',
    propertystatus: 'available',
    imageSource: require('../../../assets/Property.png'),
  },
  {
    idName: '3',
    propertyName: 'Cozy Family House',
    locationName: 'Austin, TX',
    price: 850000,
    howLong: '1 week ago',
    propertystatus: 'pending',
    imageSource: require('../../../assets/propertyImage.jpg'),
  },
  {
    idName: '4',
    propertyName: 'Cozy Family House',
    locationName: 'Austin, TX',
    price: 850000,
    howLong: '1 week ago',
    propertystatus: 'pending',
    imageSource: require('../../../assets/propertyImage.jpg'),
  },
  {
    idName: '5',
    propertyName: 'Cozy Family House',
    locationName: 'Austin, TX',
    price: 850000,
    howLong: '1 week ago',
    propertystatus: 'pending',
    imageSource: require('../../../assets/propertyImage.jpg'),
  },
];

interface RowCardComponentProps {
  property?: RowCardProps;
  onPress?: () => void;
}

export function RowCard({ property, onPress }: RowCardComponentProps) {
  const item = property || propertyData[0];
  const handlePress = onPress || item.onPress;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return { bg: '#E8F5E9', text: '#2E7D32' };
      case 'pending':
        return { bg: '#FFF3E0', text: '#E65100' };
      case 'sold':
        return { bg: '#FFEBEE', text: '#C62828' };
      default:
        return { bg: '#E8F5E9', text: '#2E7D32' };
    }
  };

  const statusStyle = getStatusColor(item.propertystatus);

  return (
    <TouchableOpacity 
      style={styles.cardContainer} 
      onPress={handlePress} 
      activeOpacity={0.8}
    >
      {/* Left side: Image */}
      <Image 
        source={item.imageSource} 
        style={styles.cardImage} 
        resizeMode="cover" 
      />

      {/* Right side: Content */}
      <View style={styles.textContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.titleText} numberOfLines={1}>
            {item.propertyName}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>
              {item.propertystatus}
            </Text>
          </View>
        </View>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color="#777777" />
          <Text style={styles.locationText} numberOfLines={1}>
            {item.locationName}
          </Text>
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.priceText}>
            ${item.price.toLocaleString()}
          </Text>
          <Text style={styles.timeText}>{item.howLong}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginVertical: 6,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardImage: {
    width: 85,
    height: 85,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  textContainer: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: 'space-between',
    height: 85,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1a1a1a',
    flex: 1,
    marginRight: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#777777',
    flex: 1,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2C56C0',
  },
  timeText: {
    fontSize: 11,
    color: '#999999',
  },
});
