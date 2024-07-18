import { ConfigService } from '@nestjs/config';
import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    inject: [ConfigService],
    useFactory: (configService: ConfigService): Promise<typeof mongoose> =>
      mongoose.connect(configService.get<string>('MONGODB_CONNECTION_STRING'), {
        dbName: configService.get<string>('MONGODB_DATABASE'),
      }),
  },
];
