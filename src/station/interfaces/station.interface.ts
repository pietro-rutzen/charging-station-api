import { Document } from 'mongoose';

export interface Station extends Document {
  name: string;
  latitude: number;
  longitude: number;
  company_id: number;
  address: string;
}
