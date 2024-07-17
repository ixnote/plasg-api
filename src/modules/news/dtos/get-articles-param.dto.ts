import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
} from 'class-validator';

export class GetArticlesMdaDto {
  @ApiProperty()
  @IsMongoId()
  mdaId: string
}
