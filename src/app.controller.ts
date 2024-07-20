import { Controller, Get, Param } from '@nestjs/common';
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

  @Get('redis/set/:key/:value')
  async setKey(
    @Param('key') key: string,
    @Param('value') value: string,
  ): Promise<string> {
    await this.redisClient.set(key, value);
    return `Redis key ${key} was set with this value: ${value}`;
  }

  @Get('redis/get/:key')
  async getKey(@Param('key') key: string): Promise<string> {
    const value = await this.redisClient.get(key);
    return value
      ? `Value for Redis key ${key} is ${value}`
      : `Key ${key} not found`;
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
