import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import { StationService } from './station.service';

@Controller('station')
export class StationController {
  constructor(private readonly stationService: StationService) {}

  @Post()
  create(@Body() createStationDto: CreateStationDto) {
    return this.stationService.create(createStationDto);
  }

  @Get()
  findAll() {
    return this.stationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stationService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStationDto: UpdateStationDto) {
    return this.stationService
      .update(id, updateStationDto)
      .then((updatedStation) => {
        return this.stationService.findOne(updatedStation.id);
      });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stationService.remove(id);
  }
}
