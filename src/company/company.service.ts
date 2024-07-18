import { Inject, Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { COMPANY_MODEL } from 'src/constants';
import { Company } from './interfaces/company.interface';

@Injectable()
export class CompanyService {
  constructor(
    @Inject(COMPANY_MODEL)
    private companyModel: Model<Company>,
  ) {}

  async getAllChildCompanyIds(parentCompanyId: string): Promise<string[]> {
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
      return result[0].allChildren.map((id: string) => new Types.ObjectId(id));
    } else {
      return [];
    }
  }
}
