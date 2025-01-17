import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';
import { AddBiographyDto } from './add-biography.dto';
import { Types } from 'mongoose';

export class UpdateGovernmentOfficialDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  image: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  role?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  start: string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  end: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  active: boolean;

  @ApiProperty()
  @IsMongoId()
  @IsOptional()
  governor: string;

  @ApiProperty()
  @IsOptional()
  biography: AddBiographyDto;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true })
  members: Types.ObjectId[]; 

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true })
  executives: Types.ObjectId[]; 
}
