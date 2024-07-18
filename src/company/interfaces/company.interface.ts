import { Document } from 'mongoose';

export interface Company extends Document {
  id: string;
  parent_company_id?: string;
  name: string;
}
