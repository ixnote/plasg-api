import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsBoolean,
    IsDateString,
    IsEmail,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator'; 
import { AddBiographyDto } from './add-biography.dto';
import { AddCabinetDto } from './add-cabinet.dto';

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
  governor: string

  @ApiProperty()
  @IsOptional()
  biography: AddBiographyDto;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  members: AddCabinetDto[];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  executives: AddCabinetDto[];
}
