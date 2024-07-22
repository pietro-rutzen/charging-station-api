import { Document } from 'mongoose';

export interface Station extends Document {
  name: string;
  latitude: number;
  longitude: number;
  company_id: number;
  address: string;
  location?: Location;
}

export interface NearbyStationListItem {
  stations: Station[];
  count: number;
}

export interface Location {
  type: 'Point';
  coordinates: [number, number];
}
