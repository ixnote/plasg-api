import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
} from 'class-validator';

export class GetProjectDto {
  @ApiProperty()
  @IsString()
  projectId: string;
}
