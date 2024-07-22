import { Schema } from 'mongoose';

export const StationSchema = new Schema(
  {
    name: { type: String, required: true },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    company_id: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    address: { type: String, required: true },
  },
  {
    versionKey: false,
  },
);
