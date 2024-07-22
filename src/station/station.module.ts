import { Module } from '@nestjs/common';
import { CompanyModule } from '../company/company.module';
import { DatabaseModule } from '../database/database.module';
import { LocalRedisModule } from '../redis/redis.module';
import { StationController } from './station.controller';
import { stationProviders } from './station.providers';
import { StationService } from './station.service';

@Module({
  imports: [DatabaseModule, CompanyModule, LocalRedisModule],
  controllers: [StationController],
  providers: [StationService, ...stationProviders],
  exports: [StationService],
})
export class StationModule {}
