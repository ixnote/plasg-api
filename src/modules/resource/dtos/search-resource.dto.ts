import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumberString,
  IsOptional,
} from 'class-validator';

export class SearchResourcesDto {

  @ApiProperty()
  @IsNumberString()
  @IsOptional()
  page?: number;

  @ApiProperty()
  @IsNumberString()
  @IsOptional()
  pageSize?: number;
}
