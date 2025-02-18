import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { LocalRedisModule } from '../redis/redis.module';
import { companyProviders } from './company.providers';
import { CompanyService } from './company.service';

@Module({
  imports: [DatabaseModule, LocalRedisModule],
  providers: [CompanyService, ...companyProviders],
  exports: [CompanyService],
})
export class CompanyModule {}
