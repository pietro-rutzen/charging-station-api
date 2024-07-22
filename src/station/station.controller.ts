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
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import {
  COMPANY_ID_QUERY,
  CREATE_CHARGING_STATION_RESPONSE_DOCS,
  DELETE_CHARGING_STATION_RESPONSE_DOCS,
  GET_ALL_CHARGING_STATIONS_DOCS,
  GET_NEAR_CHARGING_STATIONS_RESPONSE_DOCS,
  GET_ONE_CHARGING_STATION_RESPONSE_DOCS,
  LAT_QUERY,
  LNG_QUERY,
  RADIUS_QUERY,
  STATION_ID_QUERY,
  UPDATE_CHARGING_STATION_RESPONSE_DOCS,
} from 'src/constants/swagger.constants';

import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import { StationService } from './station.service';

@Controller('station')
export class StationController {
  constructor(private readonly stationService: StationService) {}

  @Post()
  @ApiOperation({ summary: 'Creates one charging station' })
  @ApiResponse(CREATE_CHARGING_STATION_RESPONSE_DOCS)
  create(@Body() createStationDto: CreateStationDto) {
    return this.stationService.create(createStationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Gets all charging stations' })
  @ApiResponse(GET_ALL_CHARGING_STATIONS_DOCS)
  findAll() {
    return this.stationService.findAll();
  }

  @Get('near')
  @ApiOperation({ summary: 'Gets all charging stations near a location' })
  @ApiResponse(GET_NEAR_CHARGING_STATIONS_RESPONSE_DOCS)
  @ApiQuery(LAT_QUERY)
  @ApiQuery(LNG_QUERY)
  @ApiQuery(RADIUS_QUERY)
  @ApiQuery(COMPANY_ID_QUERY)
  findNear(
    @Query('lat', ParseFloatPipe) lat: number,
    @Query('lng', ParseFloatPipe) lng: number,
    @Query('radius', ParseIntPipe) radius: number,
    @Query('company_id') companyId: string,
  ) {
    return this.stationService.findNear(lat, lng, radius, companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Gets one charging station' })
  @ApiResponse(GET_ONE_CHARGING_STATION_RESPONSE_DOCS)
  @ApiQuery(STATION_ID_QUERY)
  findOne(@Param('id') id: string) {
    return this.stationService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Updates one charging station' })
  @ApiResponse(UPDATE_CHARGING_STATION_RESPONSE_DOCS)
  @ApiQuery(STATION_ID_QUERY)
  update(@Param('id') id: string, @Body() updateStationDto: UpdateStationDto) {
    return this.stationService.update(id, updateStationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletes one charging station' })
  @ApiResponse(DELETE_CHARGING_STATION_RESPONSE_DOCS)
  @ApiQuery(STATION_ID_QUERY)
  remove(@Param('id') id: string) {
    return this.stationService.remove(id);
  }
}
