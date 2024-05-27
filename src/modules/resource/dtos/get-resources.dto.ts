import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { FromToConstraint } from 'src/common/decorators/from-to-constraint.decorator';

export class GetResourcesDto {
  @ApiProperty()
  @IsDateString()
  @IsOptional()
  from?: number;

  @ApiProperty()
  @IsDateString()
  @Validate(FromToConstraint)
  @IsOptional()
  to?: number;

  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  pageSize?: number;

  @IsString()
  @IsOptional()
  createdAt?: string;
}
