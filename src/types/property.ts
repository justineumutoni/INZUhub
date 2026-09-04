import type { ImageSourcePropType } from 'react-native';

export interface ItemData {
  id: string;
  title: string;
}

// Property details for card rows
export interface RowCardProps {
  idName: string;
  propertyName: string;
  locationName: string;
  price: number;
  howLong: string;
  imageSource: ImageSourcePropType;
  onPress?: () => void;
  propertystatus: 'available' | 'sold' | 'pending';
}

// Location card
export interface LocationProps {
  locationId: string;
  locationName: string;
  locationImage: ImageSourcePropType;
  houseAvailable: string;
  onPress?: () => void;
}

// Updates card
export interface UpdateProps {
  updateId: string;
  title: string;
  price: string;
  period?: string;
  updateLocation: string;
  updateImage: ImageSourcePropType;
  propertystatus: 'Available' | 'Sold' | 'Pending' | string;
  appliedCount?: string | number;
  viewsCount?: string | number;
  onPress?: () => void;
}

// Property Detail Data
export interface PropertyDetailData {
  id?: string;
  title: string;
  price: string;
  period?: string;
  location?: string;
  distanceFrom?: string;
  subLocation?: string;
  status?: string;
  ownedBy?: string;
  appliedCount?: string | number;
  viewsCount?: string | number;
  ownerName?: string;
  ownerRole?: string;
  ownerAvatar?: ImageSourcePropType | { uri: string };
  heroImage?: ImageSourcePropType;
  galleryImages?: ImageSourcePropType[];
  extraPhotosCount?: number;
  description?: string;
  facilities?: string[];
}


// handle confrimation data 

export type ConfirmBookingData = {
  propertyId: string;
  title: string;
  subLocation: string;
  heroImage: any;
  rent: number;
  serviceFee: number;
  total?: number; // optional — only needed if you want to override the auto-calculated total
};