import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
} from 'class-validator';

export class CreateMdaDto {
  @ApiProperty()
  @IsString()
  name: string;
}
