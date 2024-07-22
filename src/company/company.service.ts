import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { Model, Types } from 'mongoose';
import { RedisService } from 'nestjs-redis';

import {
  COMPANY_MODEL,
  ONE_HOUR_IN_SECONDS,
} from 'src/constants/application.constants';
import { Company } from './interfaces/company.interface';

@Injectable()
export class CompanyService {
  private readonly redisClient: Redis;

  constructor(
    @Inject(COMPANY_MODEL)
    private companyModel: Model<Company>,
    private readonly redisService: RedisService,
  ) {
    this.redisClient = this.redisService.getClient();
  }

  async getAllChildCompanyIds(parentCompanyId: string): Promise<string[]> {
    const cacheKey = `company:children:${parentCompanyId}`;
    const cachedData = await this.redisClient.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const result = await this.companyModel
      .aggregate([
        {
          $match: { _id: new Types.ObjectId(parentCompanyId) },
        },
        {
          $graphLookup: {
            from: 'companies',
            startWith: '$_id',
            connectFromField: '_id',
            connectToField: 'parent_company_id',
            as: 'allChildren',
          },
        },
        {
          $project: {
            allChildren: {
              $map: {
                input: '$allChildren',
                as: 'child',
                in: { $toString: '$$child._id' },
              },
            },
          },
        },
      ])
      .exec();

    if (result.length > 0) {
      const childCompanyIds = result[0].allChildren.map(
        (id: string) => new Types.ObjectId(id),
      );
      await this.redisClient.set(
        cacheKey,
        JSON.stringify(childCompanyIds),
        'EX',
        ONE_HOUR_IN_SECONDS,
      );
      return childCompanyIds;
    } else {
      return [];
    }
  }
}
