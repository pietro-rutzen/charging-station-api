import { Provider } from '@nestjs/common';
import { Connection } from 'mongoose';

import {
  DATABASE_CONNECTION,
  STATION_MODEL,
} from 'src/constants/application.constants';
import { StationSchema } from './schemas/station.schema';

export const stationProviders: Provider[] = [
  {
    provide: STATION_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Station', StationSchema),
    inject: [DATABASE_CONNECTION] as never,
  },
];
