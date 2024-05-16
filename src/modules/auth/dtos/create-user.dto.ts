import { UserRoles } from 'src/common/constants/enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  full_name: string;

  @ApiProperty()
  @IsString()
  @Matches(/^\+[0-9]+$/, { message: 'Phone number must be in the format "+2349012342345"' })
  phone: string;
  
  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsEnum(UserRoles)
  role: string;
  
  @ApiProperty()
  @IsString()
  @MinLength(8, { message: 'password must be at least 8 characters' })
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message:
      'password must have at least one upper case, at least one lower case English letter, at least one digit, at least one special character',
  })
  password: string;
}
