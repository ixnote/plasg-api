import { ApiProperty } from '@nestjs/swagger';
import {
    IsDateString,
  IsMongoId,
  IsNumberString,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { FromToConstraint } from 'src/common/decorators/from-to-constraint.decorator';

export class GetDestinationsDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  from?: number;

  @ApiProperty()
  @IsDateString()
  @Validate(FromToConstraint)
  @IsOptional()
  to?: number;

  @IsNumberString()
  @IsOptional()
  page?: number;

  @IsNumberString()
  @IsOptional()
  pageSize?: number;
}
