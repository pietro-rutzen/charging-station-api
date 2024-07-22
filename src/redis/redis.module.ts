import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisModule, RedisModuleOptions } from 'nestjs-redis';
import { getRedisConfig } from '../config/redis.config';

@Module({
  imports: [
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): RedisModuleOptions =>
        getRedisConfig(configService),
    }),
  ],
})
export class LocalRedisModule {}
