import { ConfigService } from '@nestjs/config';
import { RedisModuleOptions } from 'nestjs-redis';

export const getRedisConfig = (
  configService: ConfigService,
): RedisModuleOptions => ({
  url: configService.get<string>('REDIS_URL'),
});
