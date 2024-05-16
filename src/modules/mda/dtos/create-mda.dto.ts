import { UserRoles } from 'src/common/constants/enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateMdaDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
//   @Matches(/^\+[0-9]+$/, { message: 'Phone number must be in the format "+2349012342345"' })
  contact: string;
  
  @ApiProperty()
  @IsString()
  logo: string;

}
