import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { IsSortValue } from 'src/common/decorators/sorted.decorator';

export class GlobalSearchPaginationDto {
  @ApiProperty()
  @IsString()
  name: string;

  @IsNumberString()
  @IsOptional()
  page?: number;

  @IsNumberString()
  @IsOptional()
  pageSize?: number;

  @IsSortValue()
  @IsOptional()
  sort?: number;

}
