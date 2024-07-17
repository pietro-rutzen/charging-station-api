import { ConfigService } from '@nestjs/config';
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export const getMongooseConfig = (
  configService: ConfigService,
): MongooseModuleFactoryOptions => {
  const uri = configService.get<string>('MONGODB_CONNECTION_STRING');
  const dbName = configService.get<string>('MONGODB_DATABASE');

  mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
  });

  mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from MongoDB');
  });

  return {
    uri,
    dbName,
  };
};
