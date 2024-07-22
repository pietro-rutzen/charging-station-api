import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { encodeBase32 } from 'geohashing';
import { Redis } from 'ioredis';
import { Model, Types } from 'mongoose';
import { RedisService } from 'nestjs-redis';
import { CompanyService } from '../company/company.service';

import {
  ONE_HOUR_IN_SECONDS,
  STATION_MODEL,
} from '../constants/application.constants';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import { NearbyStationListItem, Station } from './interfaces/station.interface';

const constructLocation = (latitude?: number, longitude?: number) => {
  return !!latitude && !!longitude
    ? {
        type: 'Point',
        coordinates: [longitude, latitude],
      }
    : undefined;
};

const toPlainObject = (station: any): Record<string, any> => {
  if (station && typeof station.toObject === 'function') {
    return station.toObject();
  }
  return { ...station };
};

const transformLocation = (station: Station): Station => {
  const plainStation = toPlainObject(station);
  if (plainStation.location && plainStation.location.coordinates) {
    const [longitude, latitude] = plainStation.location.coordinates;
    delete plainStation.location;
    return {
      ...plainStation,
      latitude,
      longitude,
    } as Station;
  }
  return plainStation as Station;
};

@Injectable()
export class StationService {
  private readonly redisClient: Redis;

  constructor(
    @Inject(STATION_MODEL)
    private stationModel: Model<Station>,
    private companyService: CompanyService,
    private readonly redisService: RedisService,
  ) {
    this.redisClient = this.redisService.getClient();
  }

  async create(createStationDto: CreateStationDto): Promise<Station> {
    const createdStation = new this.stationModel(
      Object.assign(createStationDto, {
        location: constructLocation(
          createStationDto.latitude,
          createStationDto.longitude,
        ),
      }),
    );
    try {
      const savedStation = await createdStation.save();
      return transformLocation(savedStation);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to create station');
    }
  }

  async findAll(): Promise<Station[]> {
    try {
      const cacheKey = 'stations:all';
      const cachedData = await this.redisClient.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData).map((station: Station) =>
          transformLocation(station),
        );
      }

      const stations = await this.stationModel.find().exec();
      await this.redisClient.set(
        cacheKey,
        JSON.stringify(stations),
        'EX',
        ONE_HOUR_IN_SECONDS,
      );
      return stations.map((station) => transformLocation(station));
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(`Failed to find stations`, {
        cause: error.message,
      });
    }
  }

  async findOne(id: string): Promise<Station> {
    try {
      const cacheKey = `station:${id}`;
      const cachedData = await this.redisClient.get(cacheKey);
      if (cachedData) {
        return transformLocation(JSON.parse(cachedData) as Station);
      }

      const station = await this.stationModel.findById(id).exec();
      if (!station) {
        throw new NotFoundException(`Station with ID ${id} not found`);
      }

      await this.redisClient.set(
        cacheKey,
        JSON.stringify(station),
        'EX',
        ONE_HOUR_IN_SECONDS,
      );
      return transformLocation(station);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async update(
    id: string,
    updateStationDto: UpdateStationDto,
  ): Promise<Station> {
    try {
      const updatedStation = await this.stationModel
        .findByIdAndUpdate(id, updateStationDto, { new: true })
        .exec();
      if (!updatedStation) {
        throw new NotFoundException(`Station with ID ${id} not found`);
      }

      const cacheKey = `station:${id}`;
      await this.redisClient.set(
        cacheKey,
        JSON.stringify(updatedStation),
        'EX',
        ONE_HOUR_IN_SECONDS,
      );

      return transformLocation(updatedStation);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async remove(id: string): Promise<Station> {
    try {
      const deletedStation = await this.stationModel
        .findByIdAndDelete(id)
        .exec();
      if (!deletedStation) {
        throw new NotFoundException(`Station with ID ${id} not found`);
      }

      const cacheKey = `station:${id}`;
      await this.redisClient.del(cacheKey);

      return transformLocation(deletedStation);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findNear(
    latitude: number,
    longitude: number,
    radius: number,
    companyId: string,
  ): Promise<NearbyStationListItem[]> {
    try {
      const precision = 6;
      // Precision of a Geohash Base32 string is defined by the string length, which must be between 1 and 9.
      // https://github.com/arseny034/geohashing?tab=readme-ov-file#support-of-two-geohash-formats
      const geohashKey = encodeBase32(latitude, longitude, precision);
      const cacheKey = `stations:near:${geohashKey}:${radius}:${companyId}`;
      const cachedData = await this.redisClient.get(cacheKey);
      // Basically supposed to turn lat/long into a string that we can use as key in Redis
      // In the perfect world this would be a prefix that we can use to find all stations near a certain location
      if (cachedData) {
        return JSON.parse(cachedData).map((item) => ({
          stations: item.stations.map((station) =>
            transformLocation({ ...station, location: item.location }),
          ),
          count: item.count,
        }));
      }

      const childCompanyIds =
        await this.companyService.getAllChildCompanyIds(companyId);

      const parentAndChildCompanyIds = [
        new Types.ObjectId(companyId),
        ...childCompanyIds,
      ];

      const maxDistance = radius * 1000;

      const results = await this.stationModel
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
            $match: {
              company_id: { $in: parentAndChildCompanyIds },
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
          {
            $sort: {
              'stations.distance': 1,
            },
          },
        ])
        .exec();

      await this.redisClient.set(
        cacheKey,
        JSON.stringify(results),
        'EX',
        ONE_HOUR_IN_SECONDS,
      );

      return results.map(
        (item) =>
          ({
            stations: item.stations.map((station) =>
              transformLocation({ ...station, location: item.location }),
            ),
            count: item.count,
          }) as NearbyStationListItem,
      );
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to find stations near', {
        cause: error.message,
      });
    }
  }
}
