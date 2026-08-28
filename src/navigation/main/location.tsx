import React from 'react';
import { LocationProps } from '../../types/property';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ImageBackground 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export const locationData: LocationProps[] = [
  {
    locationId: '1',
    locationName: 'Side Streets XR',
    locationImage: require('../../../assets/propertyImage.jpg'),
    houseAvailable: '10 Found',
  },
  {
    locationId: '2',
    locationName: 'Texa',
    locationImage: require('../../../assets/Property.png'),
    houseAvailable: '5 Found',
  },
  {
    locationId: '3',
    locationName: 'China Town',
    locationImage: require('../../../assets/propertyImage.jpg'),
    houseAvailable: '15 Found',
  },
  {
    locationId: '4',
    locationName: 'Candi',
    locationImage: require('../../../assets/Property.png'),
    houseAvailable: '18 Found',
  },
];

interface LocationComponentProps {
  location?: LocationProps;
  onPress?: () => void;
}

export function Location({ location, onPress }: LocationComponentProps) {
  const item = location || locationData[0];
  const handlePress = onPress || item.onPress;

  return (
    <TouchableOpacity 
      style={styles.cardContainer} 
      onPress={handlePress} 
      activeOpacity={0.85}
    >
      <ImageBackground 
        source={item.locationImage} 
        style={styles.imageBackground}
        imageStyle={styles.image}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.45)', 'rgba(0, 0, 0, 0.85)']}
          style={styles.gradientOverlay}
        >
          <View style={styles.infoContainer}>
            <View style={styles.titleRow}>
              <Ionicons name="location-sharp" size={15} color="#EF4444" style={styles.icon} />
              <Text style={styles.locationTitle} numberOfLines={1}>
                {item.locationName}
              </Text>
            </View>
            <Text style={styles.foundText}>{item.houseAvailable}</Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: '48%',
    height: 155,
    marginVertical: 6,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  image: {
    borderRadius: 14,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    padding: 10,
    borderRadius: 14,
  },
  infoContainer: {
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 4,
  },
  locationTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  foundText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    marginLeft: 19,
  },
});
