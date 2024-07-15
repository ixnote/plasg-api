import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
  IsString,
} from 'class-validator';

export class AddContactDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  location: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsEmail()
  email: string;
}
