import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  Alert,
  ImageBackground,
  Platform,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PropertyDetailData } from '../../../../types/property';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../login/Login';

type PropertyDetailProps = Partial<NativeStackScreenProps<RootStackParamList, 'PropertyDetail'>> & {
  property?: PropertyDetailData;
  onBack?: () => void;
};

const DEFAULT_PROPERTY: PropertyDetailData = {
  title: '1 Big Hall at Lalitpur',
  price: 'Rs. 8000',
  period: '/ per month',
  distanceFrom: '1.2 km from Hospital',
  subLocation: 'Jln. Samiri',
  status: 'Available',
  ownedBy: 'KIA',
  appliedCount: '0 Applied',
  viewsCount: '19 Views',
  ownerName: 'Courtney Henry',
  ownerRole: 'Landlord',
  ownerAvatar: { uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' },
  heroImage: require('../../../../../assets/propertyImage.jpg'),
  galleryImages: [
    require('../../../../../assets/propertyImage.jpg'),
    require('../../../../../assets/Property.png'),
    require('../../../../../assets/propertyImage.jpg'),
    require('../../../../../assets/Property.png'),
  ],
  extraPhotosCount: 5,
  description: '1 big hall room for rent at lalitpur, ktm with the facilities of bike parking and tap water . It offers 1 bedroom,and a 1 common bathroom for whole flat . It is suitable for student only. Price is negotiable for student only.',
  facilities: [
    '1 Big Hall',
    'Shared Toilet',
    'Bikes and Car Parking',
    '24/7 Water facility',
  ],
};

export function PropertyDetail({ property, onBack, route, navigation }: PropertyDetailProps) {
  const activeProperty = property || route?.params?.property;
  const data = { ...DEFAULT_PROPERTY, ...activeProperty };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleCall = () => {
    Alert.alert('Contact Landlord', `Calling ${data.ownerName}...`);
  };

  const handleMessage = () => {
    Alert.alert('Message Landlord', `Opening chat with ${data.ownerName}...`);
  };

  const handleGoogleMaps = () => {
    Alert.alert('Google Maps', `Opening map location for ${data.subLocation || data.title}...`);
  };

  const handleBookNow = () => {
    Alert.alert(
      'Booking Request',
      `Would you like to send a booking request for ${data.title}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => Alert.alert('Success', 'Your booking request has been sent!') }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 1. Hero Image with Overlay */}
        <View style={styles.heroContainer}>
          <ImageBackground
            source={data.heroImage || require('../../../../../assets/propertyImage.jpg')}
            style={styles.heroImage}
            imageStyle={styles.heroImageStyle}
            resizeMode="cover"
          >
            {/* Top Back Button */}
            <SafeAreaView style={styles.safeHeaderArea}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={handleBack}
                activeOpacity={0.7}
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              >
                <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
              </TouchableOpacity>
            </SafeAreaView>

            {/* Bottom Hero Gradient & Details */}
            <LinearGradient
              colors={['transparent', 'rgba(0, 0, 0, 0.4)', 'rgba(0, 0, 0, 0.85)']}
              style={styles.heroGradient}
            >
              <Text style={styles.heroTitle} numberOfLines={2}>
                {data.title}
              </Text>
              <Text style={styles.heroPriceContainer}>
                <Text style={styles.heroPrice}>{data.price}</Text>
                <Text style={styles.heroPeriod}> {data.period || '/ per month'}</Text>
              </Text>
            </LinearGradient>
          </ImageBackground>
        </View>

        {/* Main Body Content */}
        <View style={styles.bodyContent}>
          {/* 2. Landlord Profile Section */}
          <View style={styles.landlordRow}>
            <View style={styles.landlordInfo}>
              <Image 
                source={data.ownerAvatar || { uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' }} 
                style={styles.avatar} 
              />
              <View style={styles.landlordText}>
                <Text style={styles.landlordName}>{data.ownerName}</Text>
                <Text style={styles.landlordRole}>{data.ownerRole}</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsGroup}>
              <TouchableOpacity 
                style={styles.actionIconButton} 
                onPress={handleCall}
                activeOpacity={0.8}
              >
                <Ionicons name="call" size={16} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionIconButton} 
                onPress={handleMessage}
                activeOpacity={0.8}
              >
                <Ionicons name="chatbubble-ellipses" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* 3. Property Overview Key Info (2 Columns) */}
          <View style={styles.overviewGrid}>
            {/* Left Column */}
            <View style={styles.overviewColumn}>
              <View style={styles.metaRow}>
                <Ionicons name="location-sharp" size={14} color="#EF4444" style={styles.metaIcon} />
                <Text style={styles.landmarkText} numberOfLines={1}>
                  {data.distanceFrom || '1.2 km from Hospital'}
                </Text>
              </View>
              <Text style={styles.subLocationText}>
                {data.subLocation || 'Jln. Samiri'}
              </Text>
              <Text style={styles.statsText}>
                {data.appliedCount || '0 Applied'}  |  {data.viewsCount || '19 Views'}
              </Text>
            </View>

            {/* Right Column */}
            <View style={styles.overviewColumn}>
              <View style={styles.metaRow}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>
                  {data.status || 'Available'}
                </Text>
              </View>
              <Text style={styles.ownerText}>
                Property Owned By: {data.ownedBy || 'KIA'}
              </Text>
              <TouchableOpacity onPress={handleGoogleMaps} activeOpacity={0.7}>
                <Text style={styles.mapLinkText}>
                  View on Google Maps
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 4. Photo Gallery Thumbnails */}
          <View style={styles.galleryRow}>
            {(data.galleryImages || DEFAULT_PROPERTY.galleryImages || []).slice(0, 4).map((img, index) => {
              const isLast = index === 3;
              return (
                <View key={index} style={styles.thumbnailContainer}>
                  <Image source={img} style={styles.thumbnailImage} resizeMode="cover" />
                  {isLast && (
                    <View style={styles.extraPhotosOverlay}>
                      <Text style={styles.extraPhotosText}>+{data.extraPhotosCount || 5}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          {/* 5. Description Section */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeading}>Description</Text>
            <Text style={styles.descriptionParagraph}>
              {data.description}
            </Text>
          </View>

          {/* 6. Facilities Section */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeading}>Facilities</Text>
            <View style={styles.facilitiesGrid}>
              <View style={styles.facilityColumn}>
                <View style={styles.facilityItem}>
                  <Ionicons name="checkmark" size={16} color="#2C56C0" style={styles.checkIcon} />
                  <Text style={styles.facilityText}>1 Big Hall</Text>
                </View>
                <View style={styles.facilityItem}>
                  <Ionicons name="checkmark" size={16} color="#2C56C0" style={styles.checkIcon} />
                  <Text style={styles.facilityText}>Bikes and Car Parking</Text>
                </View>
              </View>

              <View style={styles.facilityColumn}>
                <View style={styles.facilityItem}>
                  <Ionicons name="checkmark" size={16} color="#2C56C0" style={styles.checkIcon} />
                  <Text style={styles.facilityText}>Shared Toilet</Text>
                </View>
                <View style={styles.facilityItem}>
                  <Ionicons name="checkmark" size={16} color="#2C56C0" style={styles.checkIcon} />
                  <Text style={styles.facilityText}>24/7 Water facility</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 7. Book Now Button */}
          <TouchableOpacity 
            style={styles.bookNowButton} 
            onPress={handleBookNow}
            activeOpacity={0.85}
          >
            <Text style={styles.bookNowText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  heroContainer: {
    width: '100%',
    height: 310,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#1E293B',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
  },
  heroImageStyle: {
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  safeHeaderArea: {
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroGradient: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 30,
    gap: 4,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: 'bold',
    letterSpacing: 0.2,
  },
  heroPriceContainer: {
    marginTop: 2,
  },
  heroPrice: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  heroPeriod: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 13,
    fontWeight: '400',
  },
  bodyContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  landlordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  landlordInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E5E7EB',
  },
  landlordText: {
    gap: 2,
  },
  landlordName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  landlordRole: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  actionsGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  actionIconButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#2C56C0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overviewGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingBottom: 16,
  },
  overviewColumn: {
    flex: 1,
    gap: 5,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    marginRight: 4,
    marginLeft: -1,
  },
  landmarkText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  subLocationText: {
    fontSize: 11,
    color: '#6B7280',
    marginLeft: 17,
  },
  statsText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginLeft: 17,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4B5563',
  },
  ownerText: {
    fontSize: 11,
    color: '#6B7280',
    marginLeft: 14,
  },
  mapLinkText: {
    fontSize: 11,
    color: '#4B5563',
    textDecorationLine: 'underline',
    marginLeft: 14,
  },
  galleryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
    gap: 8,
  },
  thumbnailContainer: {
    flex: 1,
    height: 64,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
    position: 'relative',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  extraPhotosOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  extraPhotosText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  sectionBlock: {
    marginTop: 16,
    gap: 8,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  descriptionParagraph: {
    fontSize: 12.5,
    lineHeight: 19,
    color: '#6B7280',
    fontWeight: '400',
  },
  facilitiesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  facilityColumn: {
    flex: 1,
    gap: 8,
  },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIcon: {
    marginRight: 6,
  },
  facilityText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '500',
  },
  bookNowButton: {
    backgroundColor: '#2C56C0',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    shadowColor: '#2C56C0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  bookNowText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
