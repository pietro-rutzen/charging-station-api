import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { StationController } from './station.controller';
import { stationProviders } from './station.providers';
import { StationService } from './station.service';

@Module({
  imports: [DatabaseModule],
  controllers: [StationController],
  providers: [StationService, ...stationProviders],
})
export class StationModule {}
