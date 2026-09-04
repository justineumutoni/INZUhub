/**
 * Apify API Integration Service for InzuHub
 * 
 * Configured with Apify Actor: compass/crawler-google-places (Google Maps / Places)
 * and Airbnb / Booking.com scrapers.
 */

import { PropertyDetailData } from '../types/property';

// Apify credentials & Actor configurations
// Do NOT place the raw token string here as a fallback!
const APIFY_ENV = (import.meta as ImportMeta & {
  env?: Record<string, string | undefined>;
}).env;
const APIFY_DEFAULT_TOKEN = APIFY_ENV?.VITE_APIFY_DEFAULT_TOKEN || '';
const APIFY_DEFAULT_DATASET_ID = APIFY_ENV?.VITE_APIFY_DEFAULT_DATASET_ID || 'ybMDncXCZz6wLf2f5';

export const APIFY_GOOGLE_PLACES_ACTOR = 'compass~crawler-google-places';


/**
 * Normalizes a Google Places item from compass/crawler-google-places into PropertyDetailData
 */
export function formatGooglePlacesListing(raw: any, index: number = 1): PropertyDetailData {
  const id = raw.placeId ? `prop-gplace-${raw.placeId}` : `prop-gplace-${Date.now()}-${index}`;
  const title = raw.title || `Kigali Property #${index}`;

  // Price calculation / extraction
  let priceStr = '$150';
  if (raw.price && typeof raw.price === 'string' && raw.price.startsWith('$')) {
    priceStr = raw.price;
  } else if (raw.price && typeof raw.price === 'number') {
    priceStr = `$${raw.price}`;
  } else {
    const cat = (raw.categoryName || '').toLowerCase();
    if (cat.includes('villa')) priceStr = '$250';
    else if (cat.includes('apartment') || cat.includes('condominium')) priceStr = '$120';
    else if (cat.includes('hotel')) priceStr = '$90';
    else priceStr = '$180';
  }

  // Location / Address
  const location = raw.address || raw.city || 'Kigali, Rwanda';
  const subLocation = raw.neighborhood || raw.street || (raw.address ? raw.address.split(',')[0] : 'Kigali Center');

  // Hero & Gallery Images
  const heroUrl = raw.imageUrl || 
    raw.image || 
    raw.featuredImage || 
    raw.imageCategories?.[0] || 
    (Array.isArray(raw.images) && raw.images[0]) || 
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80';

  const gallery = (Array.isArray(raw.images) && raw.images.length > 0)
    ? raw.images.slice(0, 6).map((img: string) => ({ uri: img }))
    : [
        { uri: heroUrl },
        { uri: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80' },
        { uri: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80' },
      ];

  // Ratings & Stats
  const reviewsCount = raw.reviewsCount ? `${raw.reviewsCount} Reviews` : `${Math.floor(Math.random() * 40) + 10} Reviews`;
  const appliedCount = `${Math.floor(Math.random() * 9) + 2} Applied`;

  // Categories & Amenities
  const facilities = (Array.isArray(raw.categories) && raw.categories.length > 0)
    ? raw.categories.slice(0, 4)
    : [
        'Furnished Interior',
        'High-Speed WiFi',
        'Secure Parking',
        '24/7 Security Guard',
        'City Views',
      ];

  return {
    id,
    title,
    price: priceStr,
    period: '/ per month',
    location,
    distanceFrom: `${(Math.random() * 2 + 0.5).toFixed(1)} km from Center`,
    subLocation,
    status: 'Available',
    ownedBy: raw.website ? raw.title : 'InzuHub Verified Host',
    appliedCount,
    viewsCount: reviewsCount,
    ownerName: raw.title.split(' ')[0] + ' Host',
    ownerRole: raw.categoryName || 'Property Host',
    ownerAvatar: { uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' },
    heroImage: { uri: heroUrl },
    galleryImages: gallery,
    extraPhotosCount: gallery.length,
    description: raw.description || raw.ownerDescription || `${title} is a verified ${raw.categoryName || 'property'} situated at ${location}. Features modern facilities, prime accessibility, and verified host management.`,
    facilities,
  };
}

// Pre-packaged high-resolution real estate dataset for instant use & offline fallback
export const SAMPLE_REAL_ESTATE_LISTINGS: PropertyDetailData[] = [
  {
    id: 'prop-apify-101',
    title: 'Modern Sunset Glass Villa',
    price: '$2,450',
    period: '/ per month',
    location: 'Kigali, Rwanda',
    distanceFrom: '1.5 km from City Center',
    subLocation: 'Kiyovu Hills',
    status: 'Available',
    ownedBy: 'InzuHub Luxury',
    appliedCount: '8 Applied',
    viewsCount: '142 Views',
    ownerName: 'Eric Manzi',
    ownerRole: 'Superhost & Architect',
    ownerAvatar: { uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' },
    heroImage: { uri: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000&auto=format&fit=crop&q=80' },
    galleryImages: [
      { uri: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80' },
      { uri: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80' },
      { uri: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&auto=format&fit=crop&q=80' },
      { uri: 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800&auto=format&fit=crop&q=80' },
    ],
    extraPhotosCount: 6,
    description: 'Breathtaking 3-bedroom luxury villa with panoramic city views, infinity pool, solar power backup, and modern smart home automation.',
    facilities: [
      '3 King Bedrooms',
      'Infinity Pool & Sun Deck',
      'High-speed Fiber WiFi',
      '24/7 Security & CCTV',
      'Private 2-Car Garage',
    ],
  },
  {
    id: 'prop-apify-102',
    title: 'Urban Heights 2BR Flat',
    price: '$1,100',
    period: '/ per month',
    location: 'Nyarutarama, Kigali',
    distanceFrom: '0.8 km from Golf Club',
    subLocation: 'KG 9 Ave',
    status: 'Available',
    ownedBy: 'Horizon Properties',
    appliedCount: '4 Applied',
    viewsCount: '98 Views',
    ownerName: 'Diane Uwase',
    ownerRole: 'Verified Host',
    ownerAvatar: { uri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80' },
    heroImage: { uri: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&auto=format&fit=crop&q=80' },
    galleryImages: [
      { uri: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80' },
      { uri: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80' },
      { uri: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80' },
    ],
    extraPhotosCount: 4,
    description: 'Fully furnished, executive 2-bedroom apartment with balcony overlooking the golf course. Features backup generator, elevator, and gym.',
    facilities: [
      '2 En-suite Bedrooms',
      'Fully Equipped Kitchen',
      'Gym & Fitness Center',
      'Air Conditioning',
      'Dedicated Workspace',
    ],
  },
  {
    id: 'prop-apify-103',
    title: 'Cozy Studio Suite with Garden',
    price: '$650',
    period: '/ per month',
    location: 'Kimihurura, Kigali',
    distanceFrom: '2.0 km from Convention Centre',
    subLocation: 'Rugando',
    status: 'Available',
    ownedBy: 'InzuHub Cozy',
    appliedCount: '12 Applied',
    viewsCount: '210 Views',
    ownerName: 'Patrick Mugabe',
    ownerRole: 'Host',
    ownerAvatar: { uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80' },
    heroImage: { uri: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&auto=format&fit=crop&q=80' },
    galleryImages: [
      { uri: 'https://images.unsplash.com/photo-1502005229762-ee152da915d6?w=800&auto=format&fit=crop&q=80' },
      { uri: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&auto=format&fit=crop&q=80' },
    ],
    extraPhotosCount: 3,
    description: 'Charming, quiet garden studio ideal for young professionals or remote workers. Walking distance to popular cafes, restaurants, and embassies.',
    facilities: [
      'Private Patio Garden',
      'Fast WiFi 100Mbps',
      'Water & Power Included',
      'Kitchenette',
      'Laundry Service Available',
    ],
  },
  {
    id: 'prop-apify-104',
    title: 'Hilltop 4BR Family Residence',
    price: '$1,800',
    period: '/ per month',
    location: 'Gacuriro, Kigali',
    distanceFrom: '3.5 km from Airport',
    subLocation: 'Vision City Gate',
    status: 'Available',
    ownedBy: 'Crown Realty',
    appliedCount: '3 Applied',
    viewsCount: '84 Views',
    ownerName: 'Clarisse Mukamana',
    ownerRole: 'Property Manager',
    ownerAvatar: { uri: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80' },
    heroImage: { uri: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1000&auto=format&fit=crop&q=80' },
    galleryImages: [
      { uri: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80' },
      { uri: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop&q=80' },
    ],
    extraPhotosCount: 5,
    description: 'Spacious 4-bedroom family house in a secure gated estate with a large landscaped lawn, children play area, and domestic staff quarters.',
    facilities: [
      '4 Bedrooms & 3 Baths',
      'Large Garden Lawn',
      'Staff Quarters (Annex)',
      'Solar Water Heating',
      'Gated Community Guard',
    ],
  },
  {
    id: 'prop-apify-105',
    title: 'Executive Penthouse Suite',
    price: '$3,200',
    period: '/ per month',
    location: 'Kacyiru, Kigali',
    distanceFrom: '0.5 km from Embassies',
    subLocation: 'KG 7 Ave',
    status: 'Available',
    ownedBy: 'Summit Prime',
    appliedCount: '6 Applied',
    viewsCount: '310 Views',
    ownerName: 'Jean Claude',
    ownerRole: 'Executive Agent',
    ownerAvatar: { uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80' },
    heroImage: { uri: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=1000&auto=format&fit=crop&q=80' },
    galleryImages: [
      { uri: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80' },
      { uri: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&auto=format&fit=crop&q=80' },
    ],
    extraPhotosCount: 8,
    description: 'Top-floor designer penthouse featuring floor-to-ceiling windows, private rooftop terrace with jacuzzi, custom Italian kitchen, and smart concierge.',
    facilities: [
      'Rooftop Jacuzzi',
      'Wrap-around Terrace',
      'Smart Lighting & Sound',
      'Underground Parking',
      '24hr Concierge',
    ],
  },
];

/**
 * Normalizes raw Apify Airbnb / Booking.com scrape item into InzuHub's PropertyDetailData
 */
export function formatApifyListing(raw: any, index: number = 1): PropertyDetailData {
  const id = raw.id ? `prop-${raw.id}` : `prop-apify-${Date.now()}-${index}`;
  const title = raw.name || raw.title || raw.heading || `Luxury Residence #${index}`;
  
  // Price formatting
  let priceStr = '$1,200';
  if (raw.price?.rate) {
    priceStr = `$${raw.price.rate.amount || raw.price.rate}`;
  } else if (raw.price?.amount) {
    priceStr = `$${raw.price.amount}`;
  } else if (typeof raw.price === 'number') {
    priceStr = `$${raw.price.toLocaleString()}`;
  } else if (typeof raw.price === 'string') {
    priceStr = raw.price.startsWith('$') ? raw.price : `$${raw.price}`;
  }

  // Location formatting
  const location = raw.location || raw.address || raw.city || raw.neighborhood || 'Kigali, Rwanda';
  const subLocation = raw.neighborhood || raw.street || location;

  // Images
  const heroUrl = raw.pictureUrl || raw.thumbnail || raw.heroImage || raw.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80';
  const gallery = (Array.isArray(raw.images) && raw.images.length > 0)
    ? raw.images.slice(0, 6).map((img: string) => ({ uri: img }))
    : [
        { uri: heroUrl },
        { uri: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80' },
      ];

  // Host
  const ownerName = raw.host?.name || raw.ownerName || 'Verified InzuHub Host';
  const ownerAvatar = raw.host?.pictureUrl
    ? { uri: raw.host.pictureUrl }
    : { uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' };

  // Amenities / Facilities
  const facilities = Array.isArray(raw.amenities) && raw.amenities.length > 0
    ? raw.amenities.slice(0, 5)
    : [
        'High-Speed WiFi',
        'Hot Water & Shower',
        'Secure Parking',
        'Equipped Kitchen',
        '24/7 Security',
      ];

  return {
    id,
    title,
    price: priceStr,
    period: '/ per month',
    location,
    distanceFrom: raw.distance || '1.2 km from Center',
    subLocation,
    status: 'Available',
    ownedBy: raw.brand || 'InzuHub Partner',
    appliedCount: `${Math.floor(Math.random() * 8) + 1} Applied`,
    viewsCount: `${Math.floor(Math.random() * 150) + 20} Views`,
    ownerName,
    ownerRole: raw.host?.isSuperhost ? 'Superhost' : 'Property Manager',
    ownerAvatar,
    heroImage: { uri: heroUrl },
    galleryImages: gallery,
    extraPhotosCount: gallery.length,
    description: raw.description || raw.summary || 'Beautiful modern property located in a prime neighborhood with close access to shopping, dining, and transportation.',
    facilities,
  };
}

/**
 * Fetch items from an existing Apify Dataset ID
 */
export async function fetchApifyDatasetItems(
  datasetId: string,
  apiToken: string = APIFY_DEFAULT_TOKEN || ''
): Promise<PropertyDetailData[]> {
  try {
    const url = `https://api.apify.com/v2/datasets/${datasetId}/items${apiToken ? `?token=${apiToken}` : ''}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Apify Dataset API returned HTTP ${response.status}`);
    }
    const rawItems: any[] = await response.json();
    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      return SAMPLE_REAL_ESTATE_LISTINGS;
    }
    return rawItems.map((item, idx) => formatApifyListing(item, idx + 1));
  } catch (error) {
    console.warn('Apify dataset fetch error, returning sample dataset:', error);
    return SAMPLE_REAL_ESTATE_LISTINGS;
  }
}

/**
 * Trigger an Apify Actor live run to scrape rental listings for a location
 */
export async function runApifyAirbnbScraper(
  location: string = 'Kigali, Rwanda',
  maxItems: number = 10,
  apiToken: string = APIFY_DEFAULT_TOKEN || ''
): Promise<PropertyDetailData[]> {
  if (!apiToken) {
    return SAMPLE_REAL_ESTATE_LISTINGS;
  }

  try {
    const actorId = 'dtrungtin~airbnb-scraper';
    const endpoint = `https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items?token=${apiToken}`;

    const inputPayload = {
      location,
      maxListings: maxItems,
      currency: 'USD',
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inputPayload),
    });

    if (!response.ok) {
      throw new Error(`Apify Actor Run failed with HTTP ${response.status}`);
    }

    const rawItems: any[] = await response.json();
    if (Array.isArray(rawItems) && rawItems.length > 0) {
      return rawItems.map((item, idx) => formatApifyListing(item, idx + 1));
    }

    return SAMPLE_REAL_ESTATE_LISTINGS;
  } catch (error) {
    console.warn('Apify live actor run error, falling back to cached dataset:', error);
    return SAMPLE_REAL_ESTATE_LISTINGS;
  }
}

/**
 * Fetch and format items from a Google Places dataset (compass/crawler-google-places)
 */
export async function fetchGooglePlacesDatasetItems(
  datasetId: string = APIFY_DEFAULT_DATASET_ID,
  apiToken: string = APIFY_DEFAULT_TOKEN
): Promise<PropertyDetailData[]> {
  try {
    const url = `https://api.apify.com/v2/datasets/${datasetId}/items?token=${apiToken}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Google Places Dataset API returned HTTP ${response.status}`);
    }
    const rawItems: any[] = await response.json();
    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      return SAMPLE_REAL_ESTATE_LISTINGS;
    }
    return rawItems.map((item, idx) => formatGooglePlacesListing(item, idx + 1));
  } catch (error) {
    console.warn('Error fetching Google Places dataset, returning fallback:', error);
    return SAMPLE_REAL_ESTATE_LISTINGS;
  }
}

/**
 * Trigger live Google Places crawl on Apify (compass/crawler-google-places)
 */
export async function runGooglePlacesScraper(
  searchTerms: string[] = ['apartments in Kigali', 'villas in Kigali'],
  maxPlacesPerSearch: number = 5,
  apiToken: string = APIFY_DEFAULT_TOKEN
): Promise<PropertyDetailData[]> {
  try {
    const endpoint = `https://api.apify.com/v2/acts/${APIFY_GOOGLE_PLACES_ACTOR}/run-sync-get-dataset-items?token=${apiToken}`;
    const payload = {
      searchStringsArray: searchTerms,
      maxCrawledPlacesPerSearch: maxPlacesPerSearch,
      language: 'en',
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Apify Google Places run failed with HTTP ${response.status}`);
    }

    const rawItems: any[] = await response.json();
    if (Array.isArray(rawItems) && rawItems.length > 0) {
      return rawItems.map((item, idx) => formatGooglePlacesListing(item, idx + 1));
    }

    return SAMPLE_REAL_ESTATE_LISTINGS;
  } catch (error) {
    console.warn('Error running live Google Places scraper:', error);
    return fetchGooglePlacesDatasetItems(APIFY_DEFAULT_DATASET_ID, apiToken);
  }
}
