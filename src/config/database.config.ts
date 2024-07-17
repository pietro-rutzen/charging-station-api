import { ConfigService } from '@nestjs/config';
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';

export const getMongooseConfig = (
  configService: ConfigService,
): MongooseModuleFactoryOptions => ({
  uri: configService.get<string>('MONGODB_CONNECTION_STRING'),
  dbName: configService.get<string>('MONGODB_DATABASE'),
});
