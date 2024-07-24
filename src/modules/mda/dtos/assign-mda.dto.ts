import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';

export class AssignMdaDto {
  @ApiProperty()
  @IsString()
  @IsMongoId()
  @IsOptional()
  admin: string;

  @ApiProperty()
  @IsString()
  @IsMongoId()
  mda: string;

}
