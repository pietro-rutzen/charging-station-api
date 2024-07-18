import { Document } from 'mongoose';

export interface Company extends Document {
  parent_company_id?: string;
  name: string;
}
