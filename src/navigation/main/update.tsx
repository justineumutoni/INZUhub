import React from 'react';
import { UpdateProps } from '../../types/property';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const updateData: UpdateProps[] = [
  {
    updateId: '1',
    title: '4 Room Available',
    price: 'Rp.2000k',
    period: '/per month',
    updateLocation: 'Jln. Samiri',
    propertystatus: 'Available',
    appliedCount: '9 Applied',
    viewsCount: '19 Views',
    updateImage: require('../../../assets/propertyImage.jpg'),
  },
  {
    updateId: '2',
    title: '1 Room Available',
    price: 'Rp.1000k',
    period: '/per month',
    updateLocation: 'Jln. Samiri',
    propertystatus: 'Available',
    appliedCount: '9 Applied',
    viewsCount: '19 Views',
    updateImage: require('../../../assets/Property.png'),
  },
  {
    updateId: '3',
    title: '2 Room Available',
    price: 'Rp.1500k',
    period: '/per month',
    updateLocation: 'Jln. Samiri',
    propertystatus: 'Available',
    appliedCount: '14 Applied',
    viewsCount: '32 Views',
    updateImage: require('../../../assets/propertyImage.jpg'),
  },
];

interface UpdateComponentProps {
  update?: UpdateProps;
  onPress?: () => void;
}

export function Update({ update, onPress }: UpdateComponentProps) {
  const item = update || updateData[0];
  const handlePress = onPress || item.onPress;

  const getStatusDotColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'sold':
        return '#EF4444';
      default:
        return '#10B981';
    }
  };

  const statusDotColor = getStatusDotColor(item.propertystatus);

  return (
    <TouchableOpacity 
      style={styles.cardContainer} 
      onPress={handlePress} 
      activeOpacity={0.9}
    >
      {/* Top: Image */}
      <Image 
        source={item.updateImage} 
        style={styles.cardImage} 
        resizeMode="cover" 
      />

      {/* Bottom: Content Info */}
      <View style={styles.contentContainer}>
        {/* Top Line: Title & Price */}
        <View style={styles.topRow}>
          <Text style={styles.titleText} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.priceContainer}>
            <Text style={styles.priceHighlight}>{item.price}</Text>
            <Text style={styles.periodText}>{item.period ? ` ${item.period}` : ' /per month'}</Text>
          </Text>
        </View>

        {/* Bottom Area: Location/Status on left, Stats on right */}
        <View style={styles.bottomRow}>
          {/* Left Info: Location & Status */}
          <View style={styles.leftInfo}>
            <View style={styles.metaRow}>
              <Ionicons name="location-sharp" size={13} color="#EF4444" style={styles.locationIcon} />
              <Text style={styles.locationText} numberOfLines={1}>
                {item.updateLocation}
              </Text>
            </View>
            <View style={styles.metaRow}>
              <View style={[styles.statusDot, { backgroundColor: statusDotColor }]} />
              <Text style={styles.statusText}>
                {item.propertystatus}
              </Text>
            </View>
          </View>

          {/* Right Info: Applied & Views */}
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              {item.appliedCount || '0 Applied'}
              <Text style={styles.statsDivider}>  |  </Text>
              {item.viewsCount || '0 Views'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 145,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
  },
  contentContainer: {
    paddingTop: 12,
    paddingHorizontal: 2,
    gap: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
    marginRight: 8,
  },
  priceContainer: {
    textAlign: 'right',
  },
  priceHighlight: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2C56C0',
  },
  periodText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#6B7280',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  leftInfo: {
    gap: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    marginRight: 4,
    marginLeft: -1,
  },
  locationText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '400',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
    marginLeft: 2,
  },
  statusText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '400',
  },
  statsContainer: {
    paddingBottom: 1,
  },
  statsText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '400',
  },
  statsDivider: {
    color: '#D1D5DB',
  },
});
