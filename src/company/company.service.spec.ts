import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Connection, Types } from 'mongoose';
import { RedisService } from 'nestjs-redis';
import { COMPANY_MODEL } from '../constants/application.constants';
import { CompanyService } from './company.service';

const childCompanyIds = [
  '6699719eee1af6da9aa6dc45',
  '6699719eee1af6da9aa6dc46',
];

const mockCompanyModel = {
  find: jest.fn().mockResolvedValue([]),
  findOne: jest.fn().mockResolvedValue(null),
  create: jest.fn().mockResolvedValue({}),
  updateOne: jest.fn().mockResolvedValue({}),
  deleteOne: jest.fn().mockResolvedValue({}),
  aggregate: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue([
      {
        allChildren: childCompanyIds.map((id) => new Types.ObjectId(id)),
      },
    ]),
  }),
};

const mockRedisService = {
  getClient: jest.fn().mockReturnValue({
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  }),
};

const mockConnection = {
  model: jest.fn().mockReturnValue(mockCompanyModel),
};

const dbResultMock = childCompanyIds.map((id) => new Types.ObjectId(id));

describe('CompanyService', () => {
  let companyService: CompanyService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: getModelToken(COMPANY_MODEL),
          useValue: mockCompanyModel,
        },
        {
          provide: COMPANY_MODEL,
          useValue: mockCompanyModel,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
        {
          provide: Connection,
          useValue: mockConnection,
        },
      ],
    }).compile();

    companyService = moduleRef.get<CompanyService>(CompanyService);
  });

  it('should query database if cached data is not available and cache the result', async () => {
    const parentCompanyId = '6699719eee1af6da9aa6dc44';

    const result = await companyService.getAllChildCompanyIds(parentCompanyId);

    expect(result).toMatchObject(dbResultMock);
  });
});
