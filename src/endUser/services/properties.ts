/**
 * Properties Service — Connects Firebase Firestore with InzuHub Property UI
 * 
 * Provides live querying, category filtering, search, and Apify dataset sync.
 */

import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { PropertyDetailData, RowCardProps, UpdateProps, LocationProps } from '../types/property';
import { 
  SAMPLE_REAL_ESTATE_LISTINGS, 
  fetchApifyDatasetItems, 
  fetchGooglePlacesDatasetItems,
} from './apify';

const PROPERTIES_COLLECTION = 'properties';
const FIRESTORE_READ_TIMEOUT_MS = 5000;
const BOOKING_WRITE_TIMEOUT_MS = 10000;
let propertiesCache: PropertyDetailData[] | null = null;

function filterProperties(
  properties: PropertyDetailData[],
  category?: string,
  searchQuery?: string,
): PropertyDetailData[] {
  let filtered = properties;

  if (category && category !== 'All') {
    const lowerCat = category.toLowerCase();
    filtered = filtered.filter((item) =>
      item.title.toLowerCase().includes(lowerCat) ||
      (item.description && item.description.toLowerCase().includes(lowerCat)) ||
      (item.facilities && item.facilities.some((f) => f.toLowerCase().includes(lowerCat)))
    );
  }

  if (searchQuery && searchQuery.trim().length > 0) {
    const qLower = searchQuery.trim().toLowerCase();
    filtered = filtered.filter((item) =>
      item.title.toLowerCase().includes(qLower) ||
      (item.location && item.location.toLowerCase().includes(qLower)) ||
      (item.subLocation && item.subLocation.toLowerCase().includes(qLower))
    );
  }

  return filtered;
}

/**
 * Converts a PropertyDetailData into a RowCardProps item for horizontal lists
 */
export function propertyToRowCard(prop: PropertyDetailData, index: number = 0): RowCardProps {
  // Extract number from price (e.g. "$1,200" -> 1200)
  const numericPrice = parseInt(prop.price.replace(/[^0-9]/g, ''), 10) || 1200;

  return {
    idName: prop.id || `prop-${index}`,
    propertyName: prop.title,
    locationName: prop.subLocation || prop.location || 'Kigali, Rwanda',
    price: numericPrice,
    howLong: `${(index % 4) + 1} days ago`,
    propertystatus: 'available',
    imageSource: prop.heroImage || { uri: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80' },
  };
}

/**
 * Converts a PropertyDetailData into an UpdateProps item for vertical lists
 */
export function propertyToUpdateItem(prop: PropertyDetailData, index: number = 0): UpdateProps {
  return {
    updateId: prop.id || `upd-${index}`,
    title: prop.title,
    price: prop.price,
    period: prop.period || '/ per month',
    updateLocation: prop.subLocation || prop.location || 'Kigali, Rwanda',
    updateImage: prop.heroImage || { uri: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80' },
    propertystatus: prop.status || 'Available',
    appliedCount: prop.appliedCount || '2 Applied',
    viewsCount: prop.viewsCount || '45 Views',
  };
}

/**
 * Featured locations data
 */
export const FEATURED_LOCATIONS: LocationProps[] = [
  {
    locationId: 'loc-1',
    locationName: 'Kiyovu',
    locationImage: { uri: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80' },
    houseAvailable: '18 Houses',
  },
  {
    locationId: 'loc-2',
    locationName: 'Nyarutarama',
    locationImage: { uri: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&auto=format&fit=crop&q=80' },
    houseAvailable: '24 Houses',
  },
  {
    locationId: 'loc-3',
    locationName: 'Kimihurura',
    locationImage: { uri: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80' },
    houseAvailable: '15 Houses',
  },
  {
    locationId: 'loc-4',
    locationName: 'Gacuriro',
    locationImage: { uri: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop&q=80' },
    houseAvailable: '32 Houses',
  },
];

/**
 * Fetch all properties from Firestore or fallback to sample real estate listings
 */
export async function getProperties(
  category?: string,
  searchQuery?: string
): Promise<PropertyDetailData[]> {
  if (propertiesCache) {
    return filterProperties(propertiesCache, category, searchQuery);
  }

  try {
    const propertiesRef = collection(db, PROPERTIES_COLLECTION);
    const snapshot = await Promise.race([
      getDocs(propertiesRef),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Firestore properties request timed out')), FIRESTORE_READ_TIMEOUT_MS);
      }),
    ]);

    let list: PropertyDetailData[] = [];

    if (!snapshot.empty) {
      snapshot.forEach((d: any) => {
        const data = d.data();
        list.push({
          id: d.id,
          title: data.title || 'InzuHub Property',
          price: data.price || '$1,000',
          period: data.period || '/ per month',
          location: data.location || 'Kigali, Rwanda',
          distanceFrom: data.distanceFrom || '1 km from Center',
          subLocation: data.subLocation || data.location,
          status: data.status || 'Available',
          ownedBy: data.ownedBy || 'InzuHub Partner',
          appliedCount: data.appliedCount || '1 Applied',
          viewsCount: data.viewsCount || '20 Views',
          ownerName: data.ownerName || 'Property Owner',
          ownerPhone: data.ownerPhone || data.phone,
          ownerRole: data.ownerRole || 'Host',
          ownerAvatar: data.ownerAvatarUrl ? { uri: data.ownerAvatarUrl } : undefined,
          heroImage: data.heroImageUrl ? { uri: data.heroImageUrl } : undefined,
          galleryImages: Array.isArray(data.galleryImageUrls)
            ? data.galleryImageUrls.map((u: string) => ({ uri: u }))
            : undefined,
          extraPhotosCount: data.extraPhotosCount || 4,
          description: data.description || '',
          facilities: Array.isArray(data.facilities) ? data.facilities : [],
        });
      });
    }

    // If Firestore is empty, use the configured Apify dataset before local fallback.
    if (list.length === 0) {
      try {
        list = await Promise.race([
          fetchGooglePlacesDatasetItems(),
          new Promise<PropertyDetailData[]>((resolve) => {
            setTimeout(() => resolve(SAMPLE_REAL_ESTATE_LISTINGS), FIRESTORE_READ_TIMEOUT_MS);
          }),
        ]);
      } catch {
        list = SAMPLE_REAL_ESTATE_LISTINGS;
      }
      // Auto seed to Firestore in background
      seedFirestoreWithSampleProperties().catch(() => {});
    }

    propertiesCache = list;
    return filterProperties(list, category, searchQuery);
  } catch (error) {
    if (!(error instanceof Error && error.message === 'Firestore properties request timed out')) {
      console.warn('Firestore getProperties error, using sample listings:', error);
    }
    propertiesCache = SAMPLE_REAL_ESTATE_LISTINGS;
    return filterProperties(propertiesCache, category, searchQuery);
  }
}

export async function markPropertyAsBooked(propertyId: string): Promise<void> {
  if (!propertyId) {
    throw new Error('This property has no valid ID for booking.');
  }

  await Promise.race([
    setDoc(doc(db, PROPERTIES_COLLECTION, propertyId), {
      status: 'Booked',
      bookedAt: serverTimestamp(),
    }, { merge: true }),
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Booking request timed out. Please check your connection and try again.')), BOOKING_WRITE_TIMEOUT_MS);
    }),
  ]);

  if (propertiesCache) {
    propertiesCache = propertiesCache.map((property) =>
      property.id === propertyId ? { ...property, status: 'Booked' } : property
    );
  }
}

/**
 * Seeds Firestore with rich sample real-estate properties
 */
export async function seedFirestoreWithSampleProperties(): Promise<number> {
  try {
    let count = 0;
    for (const prop of SAMPLE_REAL_ESTATE_LISTINGS) {
      const propDocRef = doc(db, PROPERTIES_COLLECTION, prop.id || `prop-${Date.now()}-${count}`);
      
      const heroUrl = typeof prop.heroImage === 'object' && 'uri' in prop.heroImage
        ? prop.heroImage.uri
        : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80';

      const galleryUrls = prop.galleryImages?.map((g) =>
        typeof g === 'object' && 'uri' in g ? g.uri : ''
      ).filter(Boolean) || [];

      const avatarUrl = prop.ownerAvatar && typeof prop.ownerAvatar === 'object' && 'uri' in prop.ownerAvatar
        ? prop.ownerAvatar.uri
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80';

      await setDoc(propDocRef, {
        title: prop.title,
        price: prop.price,
        period: prop.period,
        location: prop.location,
        distanceFrom: prop.distanceFrom,
        subLocation: prop.subLocation,
        status: prop.status,
        ownedBy: prop.ownedBy,
        appliedCount: prop.appliedCount,
        viewsCount: prop.viewsCount,
        ownerName: prop.ownerName,
        ownerPhone: prop.ownerPhone,
        ownerRole: prop.ownerRole,
        ownerAvatarUrl: avatarUrl,
        heroImageUrl: heroUrl,
        galleryImageUrls: galleryUrls,
        extraPhotosCount: prop.extraPhotosCount,
        description: prop.description,
        facilities: prop.facilities,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      count++;
    }
    return count;
  } catch (error) {
    console.warn('Error seeding Firestore properties:', error);
    return 0;
  }
}

/**
 * Syncs Apify dataset items directly into Firebase Firestore
 */
export async function syncApifyDatasetToFirestore(
  datasetId: string,
  apiToken?: string
): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    const scrapedListings = await fetchApifyDatasetItems(datasetId, apiToken);
    let count = 0;

    for (const prop of scrapedListings) {
      const propDocRef = doc(db, PROPERTIES_COLLECTION, prop.id || `prop-${Date.now()}-${count}`);

      const heroUrl = typeof prop.heroImage === 'object' && 'uri' in prop.heroImage
        ? prop.heroImage.uri
        : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80';

      const galleryUrls = prop.galleryImages?.map((g) =>
        typeof g === 'object' && 'uri' in g ? g.uri : ''
      ).filter(Boolean) || [];

      const avatarUrl = prop.ownerAvatar && typeof prop.ownerAvatar === 'object' && 'uri' in prop.ownerAvatar
        ? prop.ownerAvatar.uri
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80';

      await setDoc(propDocRef, {
        title: prop.title,
        price: prop.price,
        period: prop.period,
        location: prop.location,
        distanceFrom: prop.distanceFrom,
        subLocation: prop.subLocation,
        status: prop.status,
        ownedBy: prop.ownedBy,
        appliedCount: prop.appliedCount,
        viewsCount: prop.viewsCount,
        ownerName: prop.ownerName,
        ownerPhone: prop.ownerPhone,
        ownerRole: prop.ownerRole,
        ownerAvatarUrl: avatarUrl,
        heroImageUrl: heroUrl,
        galleryImageUrls: galleryUrls,
        extraPhotosCount: prop.extraPhotosCount,
        description: prop.description,
        facilities: prop.facilities,
        syncedFrom: 'apify',
        updatedAt: serverTimestamp(),
      }, { merge: true });

      count++;
    }

    return { success: true, count };
  } catch (error: any) {
    return { success: false, count: 0, error: error?.message || 'Failed to sync Apify dataset' };
  }
}
