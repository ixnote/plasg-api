import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
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
  @IsOptional()
  governor: AddCabinetDto;

  @ApiProperty()
  @IsOptional()
  biography: AddBiographyDto;

  @ApiProperty()
  @IsOptional()
  stateSecretary: {
    biography: AddBiographyDto;
    details: AddCabinetDto;
  };

  @ApiProperty()
  @IsOptional()
  deputyGovernor: {
    biography: AddBiographyDto;
    details: AddCabinetDto;
  };

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsOptional()
  members: AddCabinetDto[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsOptional()
  executives: AddCabinetDto[];
}
