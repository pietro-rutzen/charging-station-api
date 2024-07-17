import { PartialType } from '@nestjs/mapped-types';
import { CreateStationDto } from './create-station.dto';

export class UpdateStationDto extends PartialType(CreateStationDto) {
  readonly name: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly company_id: number;
  readonly address: string;
}
