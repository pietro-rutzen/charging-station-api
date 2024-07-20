import { Provider } from '@nestjs/common';
import { Connection } from 'mongoose';
import { COMPANY_MODEL, DATABASE_CONNECTION } from 'src/constants';
import { CompanySchema } from './schemas/company.schema';

export const companyProviders: Provider[] = [
  {
    provide: COMPANY_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Company', CompanySchema),
    inject: [DATABASE_CONNECTION],
  },
];
