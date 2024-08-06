import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
} from 'class-validator';

export class AddProjectDto {
  @ApiProperty()
  @IsString()
  name: string;
}
