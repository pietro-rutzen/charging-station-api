import { Schema } from 'mongoose';

export const CompanySchema = new Schema({
  parent_company_id: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
  },
  name: { type: String, required: true },
});
