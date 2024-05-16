import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsString,
} from 'class-validator';

export class AssignMdaDto {
  @ApiProperty()
  @IsString()
  @IsMongoId()
  admin: string;

  @ApiProperty()
  @IsString()
  @IsMongoId()
  mda: string;

}
