import { Module } from '@nestjs/common';
import { CompanyModule } from 'src/company/company.module';
import { DatabaseModule } from 'src/database/database.module';
import { LocalRedisModule } from 'src/redis/redis.module';
import { StationController } from './station.controller';
import { stationProviders } from './station.providers';
import { StationService } from './station.service';

@Module({
  imports: [DatabaseModule, CompanyModule, LocalRedisModule],
  controllers: [StationController],
  providers: [StationService, ...stationProviders],
})
export class StationModule {}
