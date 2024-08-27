import { ApiProperty } from '@nestjs/swagger';
import {
    IsEnum,
    IsOptional,
  IsString,
} from 'class-validator';
import { ProjectStatus } from 'src/common/constants/enum';

export class UpdatedProjectDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  location: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  image: string;

  @ApiProperty()
  @IsEnum(ProjectStatus)
  @IsOptional()
  status: string;
}
