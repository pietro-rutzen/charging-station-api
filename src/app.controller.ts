import { Controller } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisService } from 'nestjs-redis';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly redisClient: Redis;

  constructor(
    private readonly redisService: RedisService,
    private readonly appService: AppService,
  ) {
    this.redisClient = this.redisService.getClient();
  }
}
