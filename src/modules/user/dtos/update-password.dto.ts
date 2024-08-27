import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class UpdatePassword {
  @ApiProperty()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&+-])[A-Za-z\d@$!%*?&+-]{8,}$/, {
    message:
      'Password must contain at least 1 uppercase letter, 1 number, and 1 special character (+, -, @, $, !, %, *, ?, &)',
  })
  password: string;
}
