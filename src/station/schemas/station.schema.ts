import * as mongoose from 'mongoose';

export const StationSchema = new mongoose.Schema({
  name: String,
  latitude: Number,
  longitude: Number,
  company_id: Number,
  address: String,
});
