import { Inject, Injectable } from '@nestjs/common';
import { Model, ObjectId } from 'mongoose';
import { COMPANY_MODEL } from 'src/constants';
import { Company } from './interfaces/company.interface';

@Injectable()
export class CompanyService {
  constructor(
    @Inject(COMPANY_MODEL)
    private companyModel: Model<Company>,
  ) {}

  async getAllChildCompanyIds(parentCompanyId: string): Promise<string[]> {
    const companyIds = new Set<string>();

    const fetchChildCompanies = async (companyId: string) => {
      const childCompanies = (
        await this.companyModel
          .find({ parent_company_id: companyId })
          .distinct('_id')
          .exec()
      ).map((_id: ObjectId) => String(_id));

      for (const childCompanyId of childCompanies) {
        if (!companyIds.has(childCompanyId)) {
          companyIds.add(childCompanyId);
          await fetchChildCompanies(childCompanyId);
        }
      }
    };

    await fetchChildCompanies(parentCompanyId);

    return Array.from(companyIds);
  }
}
