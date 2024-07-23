import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsEmail,
  IsEnum,
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
  @IsOptional()
  biography: AddBiographyDto;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  cabinet: AddCabinetDto[];
}
