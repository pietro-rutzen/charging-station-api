import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { CompanyService } from 'src/company/company.service';
import { STATION_MODEL } from '../constants';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import { Station } from './interfaces/station.interface';

@Injectable()
export class StationService {
  constructor(
    @Inject(STATION_MODEL)
    private stationModel: Model<Station>,
    private companyService: CompanyService,
  ) {}
  async create(createStationDto: CreateStationDto): Promise<Station> {
    const createdStation = new this.stationModel(createStationDto);
    try {
      return await createdStation.save();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to create station');
    }
  }

  findAll(): Promise<Station[]> {
    try {
      return this.stationModel.find().exec();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(`Failed to find stations`, {
        cause: error.message,
      });
    }
  }

  async findOne(id: string): Promise<Station> {
    try {
      const station = await this.stationModel.findById(id).exec();
      if (!station) {
        throw new NotFoundException(`Station with ID ${id} not found`);
      }
      return station;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to find station`, {
        cause: error.message,
      });
    }
  }

  async update(id: string, updateStationDto: UpdateStationDto) {
    try {
      const updatedStation = await this.stationModel
        .findByIdAndUpdate(id, updateStationDto, { new: true })
        .exec();
      if (!updatedStation) {
        throw new NotFoundException(`Station with ID ${id} not found`);
      }
      return updatedStation;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to update station`, {
        cause: error.message,
      });
    }
  }

  async remove(id: string) {
    try {
      const deletedStation = await this.stationModel
        .findByIdAndDelete(id)
        .exec();
      if (!deletedStation) {
        throw new NotFoundException(`Station with ID ${id} not found`);
      }
      return deletedStation;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to delete station`, {
        cause: error.message,
      });
    }
  }

  async findNear(latitude: number, longitude: number, radius: number) {
    // const childCompanyIds = await this.companyService.getAllChildCompanyIds();

    const maxDistance = radius * 1000;

    const stations = await this.stationModel
      .aggregate([
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
            distanceField: 'distance',
            maxDistance: maxDistance,
            spherical: true,
          },
        },
        {
          $group: {
            _id: '$location.coordinates',
            stations: {
              $push: {
                _id: '$_id',
                name: '$name',
                company_id: '$company_id',
                address: '$address',
                distance: '$distance',
              },
            },
            location: { $first: '$location' },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            location: 1,
            stations: 1,
            count: 1,
          },
        },
      ])
      .exec();

    return stations;
  }
}
