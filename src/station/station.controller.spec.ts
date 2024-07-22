import { Test, TestingModule } from '@nestjs/testing';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import { StationController } from './station.controller';
import { StationService } from './station.service';
/* eslint-disable @typescript-eslint/no-unused-vars */
describe('StationController', () => {
  let controller: StationController;
  let service: StationService;

  const mockStation = {
    name: 'Charging Station Test',
    latitude: 64.08,
    longitude: 26.13,
    company_id: '6699719eee1af6da9aa6dc44',
    address: 'Bulevardi 31, 00120 Helsinki',
    _id: '6699719eee1af6da9aa6dc50',
  };

  const mockNearbyStationListItem = {
    stations: [mockStation],
    count: 1,
  };

  const mockStationService = {
    create: jest.fn((dto: CreateStationDto) => ({
      _id: '6699719eee1af6da9aa6dc50',
      ...dto,
    })),
    findAll: jest.fn(() => [mockStation]),
    findOne: jest.fn((id: string) => ({
      _id: id,
      ...mockStation,
    })),
    update: jest.fn((id: string, dto: UpdateStationDto) => ({
      _id: id,
      ...dto,
    })),
    remove: jest.fn((id: string) => ({
      _id: id,
      ...mockStation,
    })),
    findNear: jest.fn(
      (
        _latitude: number,
        _longitude: number,
        _radius: number,
        _companyId: string,
      ) => {
        return [mockNearbyStationListItem];
      },
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StationController],
      providers: [
        {
          provide: StationService,
          useValue: mockStationService,
        },
      ],
    }).compile();

    controller = module.get<StationController>(StationController);
    service = module.get<StationService>(StationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a station', async () => {
      const createStationDto: CreateStationDto = {
        name: 'Charging Station Test',
        latitude: 64.08,
        longitude: 26.13,
        company_id: '6699719eee1af6da9aa6dc44',
        address: 'Bulevardi 31, 00120 Helsinki',
      };
      expect(await controller.create(createStationDto)).toEqual({
        _id: '6699719eee1af6da9aa6dc50',
        ...createStationDto,
      });
      expect(service.create).toHaveBeenCalledWith(createStationDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of stations', async () => {
      expect(await controller.findAll()).toEqual([mockStation]);
    });
  });

  describe('findOne', () => {
    it('should return a single station', async () => {
      expect(await controller.findOne('6699719eee1af6da9aa6dc50')).toEqual({
        _id: '6699719eee1af6da9aa6dc50',
        ...mockStation,
      });
    });
  });

  describe('update', () => {
    it('should update a station', async () => {
      const updateStationDto: UpdateStationDto = {
        name: 'Updated Station',
        latitude: 64.08,
        longitude: 26.13,
        company_id: '6699719eee1af6da9aa6dc44',
        address: 'Updated Address',
      };
      expect(
        await controller.update('6699719eee1af6da9aa6dc50', updateStationDto),
      ).toEqual({
        _id: '6699719eee1af6da9aa6dc50',
        ...updateStationDto,
      });
    });
  });

  describe('remove', () => {
    it('should remove a station', async () => {
      expect(await controller.remove('6699719eee1af6da9aa6dc50')).toEqual({
        _id: '6699719eee1af6da9aa6dc50',
        ...mockStation,
      });
    });
  });

  describe('findNear', () => {
    it('should return nearby stations', async () => {
      const latitude = 64.08;
      const longitude = 26.13;
      const radius = 5;
      const companyId = '6699719eee1af6da9aa6dc44';
      expect(
        await controller.findNear(latitude, longitude, radius, companyId),
      ).toEqual([mockNearbyStationListItem]);
    });
  });
});
