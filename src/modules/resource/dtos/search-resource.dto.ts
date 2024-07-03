import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class SearchResourcesDto {
  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  pageSize?: number;
  
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;
}
