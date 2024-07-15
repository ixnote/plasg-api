import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class AddTeamMembersDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  @IsOptional()
  image: string;

  @IsString()
  @IsOptional()
  public_id: string;

  @ApiProperty()
  @IsString()
  role: string;
}
