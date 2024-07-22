import { ApiProperty } from '@nestjs/swagger';
import { Location } from '../interfaces/station.interface';

export class CreateStationDto {
  @ApiProperty({ example: 'Charging Station 1' })
  readonly name: string;

  @ApiProperty({ example: 63.97759111657331 })
  readonly latitude: number;

  @ApiProperty({ example: 26.01770757329613 })
  readonly longitude: number;

  @ApiProperty({ example: '6699719eee1af6da9aa6dc44' })
  readonly company_id: string;

  @ApiProperty({ example: 'Kauppakartanonkatu 18, 00930 Helsinki' })
  readonly address: string;

  @ApiProperty({
    type: 'object',
    properties: {
      type: { type: 'string', example: 'Point' },
      coordinates: {
        type: 'array',
        items: { type: 'number' },
        example: [26.01770757329613, 63.97759111657331],
      },
    },
  })
  readonly location: Location;
}
