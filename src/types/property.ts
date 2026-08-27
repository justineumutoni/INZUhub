import type { ImageSourcePropType } from 'react-native';
export interface ItemData {
  id: string;
  title: string;
}

// property details
export interface RowCardProps {
    idName: string;
    propertyName: string;
    locationName: string;
    price: number;
    howLong: string;
    imageSource: ImageSourcePropType; // Correct type for local or remote React Native images
    onPress?: () => void;
    propertystatus: 'available' | 'sold' | 'pending';

}
