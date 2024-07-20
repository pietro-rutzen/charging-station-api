import { ConfigService } from '@nestjs/config';
import { RedisModuleOptions } from 'nestjs-redis';
import { getRedisConfig } from 'src/config/redis.config';
import { REDIS_CONNECTION } from 'src/constants';

export const redisProviders = [
  {
    provide: REDIS_CONNECTION,
    inject: [ConfigService],
    useFactory: (configService: ConfigService): RedisModuleOptions =>
      getRedisConfig(configService),
  },
];
