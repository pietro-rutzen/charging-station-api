import { Schema } from 'mongoose';

export const CompanySchema = new Schema({
  id: { type: String, required: true, unique: true },
  parent_company_id: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
  },
  name: { type: String, required: true },
});
