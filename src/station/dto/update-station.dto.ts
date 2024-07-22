import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateStationDto {
  @ApiPropertyOptional({ example: 'Charging Station updated!' })
  readonly name?: string;

  @ApiPropertyOptional({ example: 26.00332590433497 })
  readonly latitude?: number;

  @ApiPropertyOptional({ example: 63.996803569472085 })
  readonly longitude?: number;

  @ApiPropertyOptional({ example: '6699719eee1af6da9aa6dc44' })
  readonly company_id?: string;

  @ApiPropertyOptional({ example: 'Kauppakartanonkatu 18, 00930 Helsinki' })
  readonly address?: string;
}
