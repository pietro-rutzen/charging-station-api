import { ConfigService } from '@nestjs/config';

export const getRedisConfig = (configService: ConfigService) => {
  const url = `redis://${configService.get<string>('REDIS_HOST')}:${configService.get<string>('REDIS_PORT')}`;

  return {
    url,
  };
};
