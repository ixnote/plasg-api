import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class SetProfileDto {
  @ApiProperty()
  @IsString()
  @IsUrl()
  profile_image: string;

  @ApiProperty()
  @IsString()
  phone_number: string;

  @ApiProperty()
  @IsString()
  address: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  address_coordinates: [number, number];
}
