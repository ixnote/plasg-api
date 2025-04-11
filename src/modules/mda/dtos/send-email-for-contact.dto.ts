import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';

export class SendEmailForContact {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsMongoId()
  mdaId: string;

  @ApiProperty()
  @IsString()
  subject: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  phone: string;

  @ApiProperty()
  @IsString()
  message: string;
}
