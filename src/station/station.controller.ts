import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFloatPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
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

  @Get('near')
  findNear(
    @Query('lat', ParseFloatPipe) lat: number,
    @Query('lng', ParseFloatPipe) lng: number,
    @Query('radius', ParseIntPipe) radius: number,
    @Query('company_id') companyId: string,
  ) {
    return this.stationService.findNear(lat, lng, radius, companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stationService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStationDto: UpdateStationDto) {
    return this.stationService.update(id, updateStationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stationService.remove(id);
  }
}
