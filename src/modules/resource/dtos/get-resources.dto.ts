import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsMongoId,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { FromToConstraint } from 'src/common/decorators/from-to-constraint.decorator';

export class GetResourcesDto {
  @IsMongoId()
  @IsOptional()
  mdaId?: string;

  @IsMongoId()
  @IsOptional()
  main_type_tag?: string;

  @IsMongoId()
  @IsOptional()
  sub_type_tag?: string;

  @IsMongoId()
  @IsOptional()
  main_topic_tag?: string;

  @IsMongoId()
  @IsOptional()
  all_topic_tag?: string;
  
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

  @IsString()
  @IsOptional()
  createdAt?: string;


}
