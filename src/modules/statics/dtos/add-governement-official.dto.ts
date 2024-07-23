import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
} from 'class-validator'; 

export class AddGovernmentOfficialDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  role: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  image: string
}
