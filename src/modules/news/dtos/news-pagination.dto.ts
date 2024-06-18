import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsMongoId, IsNumber, IsNumberString, IsOptional, IsString, Validate } from "class-validator";
import { FromToConstraint } from "src/common/decorators/from-to-constraint.decorator";

export class NewsPaginationDto{
    @IsNumberString()
    @IsOptional()
    page?: number;
  
    @IsNumberString()
    @IsOptional()
    pageSize?: number;

    @ApiProperty()
    @IsDateString()
    @IsOptional()
    start?: number;
  
    @ApiProperty()
    @IsDateString()
    @Validate(FromToConstraint)
    @IsOptional()
    end?: number;
    
    @ApiProperty()
    @IsString()
    @IsOptional()
    header?: string;

    @ApiProperty()
    @IsString()
    @IsMongoId()
    @IsOptional()
    tag?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    is_posted?: string;
}