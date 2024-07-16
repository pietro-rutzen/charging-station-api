import { EntitySchema } from 'typeorm';
import { Station } from '../entities/station.entity';

export const StationSchema = new EntitySchema<Station>({
  name: 'Station',
  target: Station,
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    name: {
      type: String,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    company_id: {
      type: Number,
    },
    address: {
      type: String,
    },
  },
});
