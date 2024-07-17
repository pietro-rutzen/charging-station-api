import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { STATION_MODEL } from '../constants';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import { Station } from './interfaces/station.interface';

@Injectable()
export class StationService {
  constructor(
    @Inject(STATION_MODEL)
    private stationModel: Model<Station>,
  ) {}
  create(createStationDto: CreateStationDto): Promise<Station> {
    const createdStation = new this.stationModel(createStationDto);
    return createdStation.save();
  }

  findAll(): Promise<Station[]> {
    return this.stationModel.find().exec();
  }

  findOne(id: string): Promise<Station> {
    return this.stationModel.findById(id).exec();
  }

  update(id: string, updateStationDto: UpdateStationDto) {
    return this.stationModel
      .findByIdAndUpdate(id, updateStationDto, { new: true })
      .exec();
  }

  remove(id: string) {
    return this.stationModel.findByIdAndDelete(id).exec();
  }
}
