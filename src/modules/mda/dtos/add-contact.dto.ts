import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';

export class AddContactDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  location: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  phone_number_1: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  phone_number_2: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email: string;
}
